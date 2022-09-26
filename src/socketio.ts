import colors from "colors/safe";
import { exportToExcelFileQueue } from "./services/todo.service";

export function sockImpl(ioServer: any) {
  ioServer.on("connection", (socket: any) => {
    console.log("user has been connected");

    socket.on(
      "getDownloadLink",
      (userId: string, requestPage: number, limit: number) => {
        console.log(requestPage, limit);
        exportToExcelFileQueue(userId, requestPage, limit, socket.id);
      }
    );

    socket.on("client", (message: string) => {});

    socket.on("hello", (message: string) => {
      console.log(colors.yellow(colors.underline(message)));
    });

    socket.on("completed", (message: string) => {
      console.log(colors.blue(colors.underline(message)));
    });

    socket.on("failed", (message: string) => {
      console.log(colors.red(colors.underline(message)));
    });

    socket.on("active", (message: string) => {
      console.log(colors.green(colors.underline(message)));
    });
  });
}
