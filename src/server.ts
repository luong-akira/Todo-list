import express, { Request, Response, Express } from "express";
import userRoutes from "./routes/user.route";
import todoRoutes from "./routes/todo.route";
import path from "path";
import { sequelize } from "./configs/db.config";
import * as dotenv from "dotenv";
import { ROOT_DIR, UPLOAD_FOLDER_CONFIG } from "./configs/constants.config";
dotenv.config();

const app: Express = express();

let PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

console.log();

app.use(
  `/${UPLOAD_FOLDER_CONFIG.DIRNAME}`,
  express.static(path.join(ROOT_DIR, UPLOAD_FOLDER_CONFIG.DIRNAME))
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
