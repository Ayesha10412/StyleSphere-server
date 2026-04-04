import { Server } from "socket.io";

let io: Server;
export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    //user joins their own room
    socket.on("join", (userId: string) => {
      socket.join(userId);
    });
  });
};
export { io };
