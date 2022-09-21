import express, { Router } from "express";
import {
  register,
  login,
  getUsers,
  updateAvatarForUser,
  updateUser,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";
import { role } from "../middlewares/role.middleware";
import upload from "../configs/multer.config";

const router: Router = express.Router();

router.post("/", upload.single("avatar"), register);
router.post("/login", login);
router.get("/admin/getUsers", isAuthenticated, role(["admin"]), getUsers);
router.post(
  "/admin/user/:id",
  isAuthenticated,
  role(["admin"]),
  upload.single("avatar"),
  updateAvatarForUser
);
router.post("/edit", isAuthenticated, upload.single("avatar"), updateUser);

export default router;
