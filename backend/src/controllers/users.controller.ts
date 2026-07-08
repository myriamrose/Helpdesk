import { Request, Response } from "express";
import { db } from "../db";

export function listUsers(_req: Request, res: Response) {
  const rows = db.prepare("SELECT id, name, email FROM users ORDER BY name ASC").all();
  res.json(rows);
}
