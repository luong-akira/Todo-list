import express, { Router } from "express";
import { register, login, getUsers } from "../controllers/user.controller";

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

import { isLoggedIn } from "../middlewares/isLoggedIn";
import { role } from "../middlewares/role";

const router: Router = express.Router();

router.post("/", upload.single("avatar"), register);
router.post("/login", login);

// admin/user/:id  admin update avatar for user
// user/           user upload that user data
// req.user = {id, role}
// authoirzed: authorizedRole.container(user.role) => next()
// throw Error(Unauthorized)
router.get("/admin/getUsers", isLoggedIn, role(["admin"]), getUsers);

export default router;
