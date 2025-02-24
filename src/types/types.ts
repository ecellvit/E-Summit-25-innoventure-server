//todo: (1) Understand each of these socket.io types
//todo: (2) Divide the types into different files

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  timer: (data: TimerData) => void;
  marketPrice: (data: {elementId: number, marketPrice: number}) => void;
}

export interface ClientToServerEvents {
  hello: (data: SocketData) => void;
  purchase: (elementId: number) => void;
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