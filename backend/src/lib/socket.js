import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap.get(userId) || new Set();
}

// used to store online users
const userSocketMap = new Map(); // {userId: socketId}, TODO: catch more exceptions

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("A user connected", socket.id);

  //if(!userId) return;

  if (!userId) {
  socket.disconnect(true);
  return;
}
  if(!userSocketMap.has(userId)){
    userSocketMap.set(userId, new Set())
  }

  userSocketMap.get(userId).add(socket.id)
  //if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("online-users", Array.from(userSocketMap.keys()));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    const sockets = userSocketMap.get(userId);
    sockets.delete(socket.id);

    if(sockets.size === 0){
      userSocketMap.delete(userId);
    }
    //delete userSocketMap[userId];
    io.emit("online-users", Array.from(userSocketMap.keys()));
  });
});

export { io, app, server };