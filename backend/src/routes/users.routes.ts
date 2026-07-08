import { Router } from "express";
import { listUsers } from "../controllers/users.controller";

const router = Router();

router.get("/", listUsers);

export default router;
