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
  if (sessionUser && sessionUser.email) {
    socket.join(sessionUser.email);
  }

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

  //* PRIMARY RESOURCE EVENT HANDLER *//
  socket.on("primary", async (elementId: number)=> {
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

    const primaryRate = team.primaryRate;
    if (!primaryRate) {
      console.log("primary rate not found");
      socket.emit("error", "primary rate not found");
      return;
    }

    const timer = setInterval(async () => {
      const updatedTeam = await TeamModelRound1.findOneAndUpdate(
        { teamLeaderEmail: sessionUser.email },
        { $inc: { [`portfolio.${elementId}`]: primaryRate } },
        { new: true }
      );

      if (!updatedTeam) {
        console.log("Team not updated");
        socket.emit("error", "Team not updated");
        return;
      }
      
      console.log("Updated team portfolio:", updatedTeam.portfolio);
      socket.to(sessionUser.email).emit("portfolioUpdate", {portfolio: updatedTeam.portfolio});
    }, 5*1000);
    
    setTimeout(() => {
      clearInterval(timer);
      console.log("Primary element timer stopped after 2 minutes");
      socket.emit("timer", { message: "Timer stopped", timestamp: new Date() });
    }, 2*60*1000);
  });

  //* SECONDARY RESOURCE EVENT HANDLER *//
  socket.on("secondary", async (elementId: number)=> {
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

    const secondaryRate = team.secondaryRate;
    if (!secondaryRate) {
      console.log("secondary rate not found");
      socket.emit("error", "secondary rate not found");
      return;
    }

    const timer = setInterval(async () => {
      const updatedTeam = await TeamModelRound1.findOneAndUpdate(
        { teamLeaderEmail: sessionUser.email },
        { $inc: { [`portfolio.${elementId}`]: secondaryRate } },
        { new: true }
      );

      if (!updatedTeam) {
        console.log("Team not updated");
        socket.emit("error", "Team not updated");
        return;
      }
      
      console.log("Updated team portfolio:", updatedTeam.portfolio);
      socket.to(sessionUser.email).emit("portfolioUpdate", {portfolio: updatedTeam.portfolio});
    }, 5*1000);
    
    setTimeout(() => {
      clearInterval(timer);
      console.log("Secondary element timer stopped after 2 minutes");
      socket.emit("timer", { message: "Timer stopped", timestamp: new Date() });
    }, 2*60*1000);
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
        console.log("Team not updated");
        socket.emit("error", "Team not updated");
        return;
      }
      
      console.log("Updated team portfolio:", updatedTeam.portfolio);
      socket.to(sessionUser.email).emit("portfolioUpdate", {portfolio: updatedTeam.portfolio});
    }, 2*1000);
    
    setTimeout(() => {
      clearInterval(timer);
      console.log("Lease 1 timer stopped after 30 seconds");
      socket.emit("timer", { message: "Timer stopped", timestamp: new Date() });
    }, 30*1000);
  });

  //* LEASE2 EVENT HANDLER *//
  socket.on("lease2", async (elementId: number)=> {
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

    const lease2Rate = team.lease2Rate;
    if (!lease2Rate) {
      console.log("lease2 rate not found");
      socket.emit("error", "lease2 rate not found");
      return;
    }

    const timer = setInterval(async () => {
      const updatedTeam = await TeamModelRound1.findOneAndUpdate(
        { teamLeaderEmail: sessionUser.email },
        { $inc: { [`portfolio.${elementId}`]: lease2Rate } },
        { new: true }
      );

      if (!updatedTeam) {
        console.log("Team not updated");
        socket.emit("error", "Team not updated");
        return;
      }
      
      console.log("Updated team portfolio:", updatedTeam.portfolio);
      socket.to(sessionUser.email).emit("portfolioUpdate", {portfolio: updatedTeam.portfolio});
    }, 2*1000);
    
    setTimeout(() => {
      clearInterval(timer);
      console.log("Lease 2 timer stopped after 30 seconds");
      socket.emit("timer", { message: "Timer stopped", timestamp: new Date() });
    }, 30*1000);
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
  }, 2*1000);
  
  setTimeout(() => {
    clearInterval(timer);
    console.log("Timer stopped after 30 seconds");
  }, 30*1000);
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
