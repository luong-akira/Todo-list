import express, { Router } from "express";
import { register, login } from "../controllers/userController";

const router: Router = express.Router();

router.post("/", register);
router.post("/login", login);

export default router;
