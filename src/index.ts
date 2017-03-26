export interface Levels {
  [key: string]: number;
}

export interface Entry {
  namespace: string;
  message: string;
  createdAt: Date;
  hostname: string;
}
