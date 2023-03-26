export type User = {
  id: number;
  name: string;
}

export type Message = {
  id: number;
  senderId: number;
  sender?: User;
  recipientId: number;
  recipient?: User;
  date: Date;
  title: string;
  body: string;
  isRead: boolean;
}

export type LoginFormBody = {
  name: string;
}

export type MessageFormBody = {
  senderId: number;
  recipientId: number;
  title: string;
  body: string;
}
