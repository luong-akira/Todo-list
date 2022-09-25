import express, { Express } from "express";
import userRoutes from "./routes/user.route";
import todoRoutes from "./routes/todo.route";
import { sequelize } from "./configs/db.config";
import { ROOT_DIR, UPLOAD_FOLDER_CONFIG } from "./configs/constants.config";
import { ExpressAdapter } from "@bull-board/express";
import {BullAdapter} from '@bull-board/api/bullAdapter';
import {createBullBoard} from '@bull-board/api';
import * as dotenv from "dotenv";
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
import { excelQueue } from "./services/todo.service";
import path from "path";
dotenv.config();

createBullBoard({
  queues: [new BullAdapter(excelQueue)],
  serverAdapter: serverAdapter,
});

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

app.use('/admin/queues', serverAdapter.getRouter());

app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
