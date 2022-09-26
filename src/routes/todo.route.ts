import express from "express";
const router = express.Router();
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  importFromExcelFile,
  exportToExcel,
  importFromExcelFileStream,
  exportToExcelStream,
  importFromExcelFileQueue,
  exportToExcelQueue,
} from "../controllers/todo.controller";
import upload from "../configs/multer.config";

router.get("/", isAuthenticated, getAllTodos);
router.get("/exportToExcel", isAuthenticated, exportToExcel);
router.get("/exportToExcelStream", isAuthenticated, exportToExcelStream);
router.get("/exportToExcelQueue", isAuthenticated, exportToExcelQueue);
router.get("/:id", isAuthenticated, getTodoById);
router.post("/", isAuthenticated, createTodo);
router.put("/:id", isAuthenticated, updateTodo);
router.delete("/:id", isAuthenticated, deleteTodo);
router.post(
  "/importFromExcel",
  isAuthenticated,
  upload.single("excel"),
  importFromExcelFile
);
router.post(
  "/importFromExcelStream",
  isAuthenticated,
  upload.single("excel"),
  importFromExcelFileStream
);

router.post(
  "/importFromExcelQueue",
  isAuthenticated,
  upload.single("excel"),
  importFromExcelFileQueue
);

// import todo from excel (by user) - exceljs
// stt|title|body|status

export default router;
