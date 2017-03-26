export interface Entry {
  namespace: string;
  message: string;
  createdAt: Date;
  hostname: string;
}

export interface Levels {
  [key: string]: number;
}

export type MessageTemplate = string;
