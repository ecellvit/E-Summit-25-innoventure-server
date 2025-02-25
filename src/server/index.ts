import { Server, Socket } from "socket.io";
import http from "http";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents } from "../types/types";
import { dbConnect } from "../lib/dbConnect";
import { Users } from "../models/user.model";
import MarketModel from "../models/event1/CommonInfo.model";
import resourceData from "../constants/round1/element.json";
import TeamModelRound1 from "../models/event1/event1Round1Team.model";

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
  console.log(socket.handshake.auth.user);
  const sessionUser = socket.handshake.auth.user;
  socket.join(sessionUser.email);

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

  //* PURCHASE EVENT HANDLER *//
  socket.on("purchase", async (elementId: number)=> {
    console.log(elementId);
    const marketData = await MarketModel.findOne({ elementId: elementId });
    console.log(marketData);
    if (!marketData || !marketData.marketPrice) {
      io.emit("marketPrice", {elementId: elementId, marketPrice: resourceData[elementId].base})
      return;
    }
    io.emit("marketPrice", {elementId: elementId, marketPrice: marketData.marketPrice})
  });

  //* LEASE1 EVENT HANDLER *//
  socket.on("lease1", async (elementId: number)=> {
    //? Update the market data
    const marketData = await MarketModel.findOne({ elementId: elementId });
    if (!marketData || !marketData.marketPrice) {
      io.emit("marketPrice", {elementId: elementId, marketPrice: resourceData[elementId].base})
      return;
    }
    io.emit("marketPrice", {elementId: elementId, marketPrice: marketData.marketPrice})

    const team = await TeamModelRound1.findOne({ teamLeaderEmail: sessionUser.email });
    if (!team) {
      console.log("Team not found");
      socket.emit("error", "Team not found");
      return;
    }

    const lease1Rate = team.lease1Rate;
    if (!lease1Rate) {
      console.log("lease1 rate not found");
      socket.emit("error", "lease1 rate not found");
      return;
    }

    const timer = setInterval(async () => {
      const updatedTeam = await TeamModelRound1.findOneAndUpdate(
        { teamLeaderEmail: sessionUser.email },
        { $inc: { [`portfolio.${elementId}`]: lease1Rate } },
        { new: true }
      );

      if (!updatedTeam) {
        console.log("Team not found");
        socket.emit("error", "Team not found");
        return;
      }
      
      console.log("Updated team portfolio:", updatedTeam.portfolio);
      socket.to(sessionUser.email).emit("portfolioUpdate", {portfolio: updatedTeam.portfolio});
    }, 2000);
    
    setTimeout(() => {
      clearInterval(timer);
      console.log("Timer stopped after 30 seconds");
      socket.emit("timer", { message: "Timer stopped", timestamp: new Date() });
    }, 31000);
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
    socket.emit("timer", { message: `There are ${event1Registrations} registrations in event 1`, timestamp: date });
  }, 2000);
  
  setTimeout(() => {
    clearInterval(timer);
    console.log("Timer stopped after 30 seconds");
  }, 31000);
}


//? HTTP SERVER CREATION

httpServer.listen(port, async () => {
  try {
    await dbConnect();
    console.log(`Server is running on http://${hostname}:${port}`);
  } catch (error) {
    console.log(error);
  }
});
