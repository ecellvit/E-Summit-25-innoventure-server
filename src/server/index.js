"use strict";
// //todo: (1) Configure and understand cors settings
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { createServer } from "node:http";
// import next from "next";
// import { Server } from "socket.io";
// //* dev = false means the server is running in production mode
// const dev = process.env.NODE_ENV !== "production";
// //* hostname refers to the hostname (or domain) where the Next.js server will be available.
// const hostname = process.env.HOSTNAME || "localhost";
// //* port refers to the port where the Next.js server will be available.
// const port = 8080;
// // this creates a next server
// const app = next({ dev, hostname, port });
// const handler = app.getRequestHandler();
// app.prepare().then(() => {
//   const httpServer = createServer(handler);
//   const io = new Server<
//     ClientToServerEvents,
//     ServerToClientEvents,
//     InterServerEvents,
//     SocketData
//   >(httpServer, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//     },
//   });
//   io.on("connection", (socket) => {
//     // ...
//   });
//   httpServer
//     .once("error", (err) => {
//       console.error(err);
//       process.exit(1);
//     })
//     .listen(port, () => {
//       console.log(`> Ready on http://${hostname}:${port}`);
//     });
// });
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
const httpServer = http_1.default.createServer();
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("hello", (data) => {
        const { name, age } = data;
        if (name == "Darsh" && age == 19) {
            console.log("Name:", name);
            console.log("Age:", age);
            startTimer();
        }
        else {
            console.log("Invalid name or age");
            socket.emit("noArg");
        }
    });
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});
function startTimer() {
    console.log("Starting timer...");
    const timer = setInterval(() => {
        const date = new Date();
        console.log("Date:", date);
        io.emit("timer", { message: "30 seconds passed", timestamp: date });
    }, 2000);
    setTimeout(() => {
        clearInterval(timer);
        console.log("Timer stopped after 30 seconds");
    }, 31000);
}
httpServer.listen(port, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
});
