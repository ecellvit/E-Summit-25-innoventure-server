//todo: (1) Understand each of these socket.io types
//todo: (2) Divide the types into different files

export interface ServerToClientEvents {
  noArg: () => void;
  error: (message: string) => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  timer: (data: TimerData) => void;
  marketPrice: (data: {elementId: number, marketPrice: number}) => void;
  portfolioUpdate: (data: {portfolio: number[]}) => void;
  walletUpdate: (balance: number) => void;
  calamityUpdate: (island: number) => void;
}

export interface ClientToServerEvents {
  hello: (data: SocketData) => void;
  primary: (elementId: number) => void;
  secondary: (elementId: number) => void;
  lease1: (elementId: number) => void;
  lease2: (elementId: number) => void;
  upgrade: () => void;
  sell: (data: {elementId: number, quantityLeft: number}) => void;
  calamity: (data: {teamsEffected: string[], island: number}) => void;
  refine: (data: {island: number, setup: number}) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

export interface TimerData {
  message: string; 
  timestamp: Date;
}