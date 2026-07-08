import { Request, Response } from "express";
import { db } from "../db";
import {
  createTicketSchema,
  updateTicketSchema,
  ticketFiltersSchema,
} from "../schemas";
import { TicketWithRelations, User } from "../types";

function getUserById(id: number | null): User | null {
  if (id === null) return null;
  const user = db.prepare("SELECT id, name, email FROM users WHERE id = ?").get(id) as User | undefined;
  return user || null;
}

function hydrateTicket(row: any): TicketWithRelations {
  return {
    ...row,
    author: getUserById(row.author_id),
    assignee: getUserById(row.assignee_id),
  };
}

const SORTABLE_COLUMNS = new Set(["created_at", "updated_at", "priority", "status"]);
const PRIORITY_ORDER: Record<string, number> = { low: 0, medium: 1, high: 2, critical: 3 };

export function listTickets(req: Request, res: Response) {
  const parsed = ticketFiltersSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || "invalid parameters" });
  }
  const { status, priority, category, search, sort, order } = parsed.data;

  const clauses: string[] = [];
  const params: Record<string, unknown> = {};

  if (status) {
    clauses.push("status = @status");
    params.status = status;
  }
  if (priority) {
    clauses.push("priority = @priority");
    params.priority = priority;
  }
  if (category) {
    clauses.push("category = @category");
    params.category = category;
  }
  if (search) {
    clauses.push("title LIKE @search");
    params.search = `%${search}%`;
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const sortCol = sort && SORTABLE_COLUMNS.has(sort) ? sort : "created_at";
  const sortDir = order === "asc" ? "ASC" : "DESC";

  const rows = db
    .prepare(`SELECT * FROM tickets ${where} ORDER BY ${sortCol} ${sortDir}`)
    .all(params) as any[];

  if (sort === "priority") {
    rows.sort((a, b) => {
      const diff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      return sortDir === "ASC" ? diff : -diff;
    });
  }

  res.json(rows.map(hydrateTicket));
}

export function getTicket(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "invalid ticket id" });
  }
  const row = db.prepare("SELECT * FROM tickets WHERE id = ?").get(id);
  if (!row) {
    return res.status(404).json({ error: "ticket not found" });
  }
  res.json(hydrateTicket(row));
}

export function createTicket(req: Request, res: Response) {
  const parsed = createTicketSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || "invalid ticket data" });
  }
  const data = parsed.data;

  const author = getUserById(data.author_id);
  if (!author) {
    return res.status(400).json({ error: "author_id does not match an existing user" });
  }
  if (data.assignee_id != null && !getUserById(data.assignee_id)) {
    return res.status(400).json({ error: "assignee_id does not match an existing user" });
  }

  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const result = db
    .prepare(
      `INSERT INTO tickets (title, description, status, priority, category, author_id, assignee_id, created_at, updated_at)
       VALUES (@title, @description, 'open', @priority, @category, @author_id, @assignee_id, @now, @now)`
    )
    .run({ ...data, assignee_id: data.assignee_id ?? null, now });

  const row = db.prepare("SELECT * FROM tickets WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(hydrateTicket(row));
}

export function updateTicket(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "invalid ticket id" });
  }
  const existing = db.prepare("SELECT * FROM tickets WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ error: "ticket not found" });
  }

  const parsed = updateTicketSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || "invalid ticket data" });
  }
  const data = parsed.data;

  if (data.assignee_id != null && !getUserById(data.assignee_id)) {
    return res.status(400).json({ error: "assignee_id does not match an existing user" });
  }

  const fields = Object.keys(data);
  const setClause = fields.map((f) => `${f} = @${f}`).join(", ");
  const now = new Date().toISOString().slice(0, 19).replace("T", " ");

  db.prepare(`UPDATE tickets SET ${setClause}, updated_at = @updated_at WHERE id = @id`).run({
    ...data,
    updated_at: now,
    id,
  });

  const row = db.prepare("SELECT * FROM tickets WHERE id = ?").get(id);
  res.json(hydrateTicket(row));
}

export function deleteTicket(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "invalid ticket id" });
  }
  const existing = db.prepare("SELECT id FROM tickets WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ error: "ticket not found" });
  }
  db.prepare("DELETE FROM tickets WHERE id = ?").run(id);
  res.status(204).send();
}
