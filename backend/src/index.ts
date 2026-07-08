import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import "./db";
import ticketsRouter from "./routes/tickets.routes";
import usersRouter from "./routes/users.routes";

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/tickets", ticketsRouter);
app.use("/api/users", usersRouter);


app.use("/api", (_req, res) => {
  res.status(404).json({ error: "route not found" });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "invalid JSON body" });
  }
  console.error(err);
  res.status(500).json({ error: "internal server error" });
});

app.listen(PORT, () => {
  console.log(`Help Desk API listening on http://localhost:${PORT}`);
});
