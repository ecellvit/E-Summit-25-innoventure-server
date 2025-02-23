import { Server, Socket } from "socket.io";
import http from "http";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents } from "../types/types";
import { dbConnect } from "../lib/dbConnect";
import { Users } from "../models/user.model";
import MarketModel from "../models/event1/CommonInfo.model";
import resourceData from "../constants/round1/element.json";

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

  socket.on("purchase", async (data)=> {
    const marketData = await MarketModel.findOne({ elementId: data.elementId });
    if (!marketData || !marketData.marketPrice) {
      io.emit("marketPrice", {elementId: data.elementId, marketPrice: resourceData[data.elementId].base})
      return;
    }
    io.emit("marketPrice", {elementId: data.elementId, marketPrice: marketData.marketPrice})
  })

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
    socket.emit("timer", { message: `There are ${event1Registrations} registrations in event 1`, timestamp: date });
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
