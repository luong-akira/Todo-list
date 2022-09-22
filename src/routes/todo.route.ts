import express from "express";
const router = express.Router();
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  uploadFromExcelFile,
} from "../controllers/todo.controller";

router.get("/", isAuthenticated, getAllTodos);
router.get("/:id", isAuthenticated, getTodoById);
router.post("/", isAuthenticated, createTodo);
router.put("/:id", isAuthenticated, updateTodo);
router.delete("/:id", isAuthenticated, deleteTodo);
router.post("/fromExcel", isAuthenticated, uploadFromExcelFile);
// import todo from excel (by user) - exceljs
// stt|title|body|status

export default router;
