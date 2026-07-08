import { Request, Response } from "express";
import { db } from "../db";
import { createCommentSchema } from "../schemas";
import { User } from "../types";

function getUserById(id: number): User | null {
  const user = db.prepare("SELECT id, name, email FROM users WHERE id = ?").get(id) as User | undefined;
  return user || null;
}

export function listComments(req: Request, res: Response) {
  const ticketId = Number(req.params.id);
  if (!Number.isInteger(ticketId)) {
    return res.status(400).json({ error: "invalid ticket id" });
  }
  const ticket = db.prepare("SELECT id FROM tickets WHERE id = ?").get(ticketId);
  if (!ticket) {
    return res.status(404).json({ error: "ticket not found" });
  }
  const rows = db
    .prepare("SELECT * FROM comments WHERE ticket_id = ? ORDER BY created_at ASC")
    .all(ticketId) as any[];

  res.json(rows.map((row) => ({ ...row, author: getUserById(row.author_id) })));
}

export function createComment(req: Request, res: Response) {
  const ticketId = Number(req.params.id);
  if (!Number.isInteger(ticketId)) {
    return res.status(400).json({ error: "invalid ticket id" });
  }
  const ticket = db.prepare("SELECT id FROM tickets WHERE id = ?").get(ticketId);
  if (!ticket) {
    return res.status(404).json({ error: "ticket not found" });
  }

  const parsed = createCommentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || "invalid comment data" });
  }
  const { author_id, content } = parsed.data;

  if (!getUserById(author_id)) {
    return res.status(400).json({ error: "author_id does not match an existing user" });
  }

  const now = new Date().toISOString().slice(0, 19).replace("T", " ");
  const result = db
    .prepare("INSERT INTO comments (ticket_id, author_id, content, created_at) VALUES (?, ?, ?, ?)")
    .run(ticketId, author_id, content, now);

  db.prepare("UPDATE tickets SET updated_at = ? WHERE id = ?").run(now, ticketId);

  const row = db.prepare("SELECT * FROM comments WHERE id = ?").get(result.lastInsertRowid) as any;
  res.status(201).json({ ...row, author: getUserById(row.author_id) });
}
