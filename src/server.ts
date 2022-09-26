import express, { Express } from "express";
import userRoutes from "./routes/user.route";
import todoRoutes from "./routes/todo.route";
import { sequelize } from "./configs/db.config";
import { ROOT_DIR, UPLOAD_FOLDER_CONFIG } from "./configs/constants.config";
import { ExpressAdapter } from "@bull-board/express";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { createBullBoard } from "@bull-board/api";
import * as dotenv from "dotenv";
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");
import path from "path";
import { excelQueue } from "./queue/importExportQueue";
import { io } from "socket.io-client";
import { createServer } from "http";
import { sockImpl } from "./socketio";
dotenv.config();

export const socketClient = io(process.env.BASE_RESOURCE_URL as string);

createBullBoard({
  queues: [new BullAdapter(excelQueue)],
  serverAdapter: serverAdapter,
});

const app: Express = express();

export const httpServer = createServer(app);
import { Server } from "socket.io";
export const ioServer = new Server(httpServer);

let PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

app.use(
  `/${UPLOAD_FOLDER_CONFIG.DIRNAME}`,
  express.static(path.join(ROOT_DIR, UPLOAD_FOLDER_CONFIG.DIRNAME))
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.use("/admin/queues", serverAdapter.getRouter());

app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

sockImpl(ioServer);

httpServer.listen(5000, () => {
  console.log(`Server is running on port ${PORT}`);
});
