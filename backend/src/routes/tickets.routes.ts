import { Router } from "express";
import {
  listTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../controllers/tickets.controller";
import { listComments, createComment } from "../controllers/comments.controller";

const router = Router();

router.get("/", listTickets);
router.get("/:id", getTicket);
router.post("/", createTicket);
router.patch("/:id", updateTicket);
router.delete("/:id", deleteTicket);

router.get("/:id/comments", listComments);
router.post("/:id/comments", createComment);

export default router;
