// //todo: (1) Configure and understand cors settings

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

import { Server, Socket } from "socket.io";
import http from "http";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents } from "../types/types";
import { dbConnect } from "../lib/dbConnect";
import { Users } from "../models/user.model";

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.IO server is running');
});

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents
>( httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("hello", (data) => {
    const { name, age } = data;
    if (name == "Darsh" && age == 19) {
      console.log("Name:", name);
      console.log("Age:", age);
      startTimer(socket);
    } else {
      console.log("Invalid name or age");
      socket.emit("noArg");
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

async function startTimer(socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, any>) {
  console.log("Starting timer...");
  const event1Registrations = await Users.countDocuments({ events: 1 });
  const timer = setInterval(() => {
    const date = new Date();
    console.log("registrations:", event1Registrations);
    console.log("Date:", date);
    socket.emit("timer", { message: "30 seconds passed", timestamp: date });
  }, 2000);
  
  setTimeout(() => {
    clearInterval(timer);
    console.log("Timer stopped after 30 seconds");
  }, 31000);
}

httpServer.listen(port, async () => {
  try {
    await dbConnect();
    console.log(`Server is running on http://${hostname}:${port}`);
  } catch (error) {
    console.log(error);
  }
});
