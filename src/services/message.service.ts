import axios from 'axios';
import { Message, MessageFormBody } from '../types';

const MESSAGE_URL = import.meta.env.VITE_API_URL + '/messages/';

export const sendMessages = async (messageFormBodies: MessageFormBody[]) => {
  return axios.post<Message>(MESSAGE_URL, messageFormBodies);
}

export const getMessagesByRecipient = async (
    lastMessageId: number,
    recipientId: number,
    page: number,
    size: number
  ) => {
  return axios.get<Message[]>(MESSAGE_URL + `id/lower-than-equal/${lastMessageId}`, {
    params: {
      recipientId,
      page,
      size
    }
  });
}

export const getNewMessages = async (lastMessageId: number, recipientId: number) => {
  return axios.get<Message[]>(MESSAGE_URL + `id/greater-than/${lastMessageId}`, {
    params: {
      recipientId
    }
  });
}

export const getMessageCountByRecipient = async (recipientId: number) => {
  return axios.get<number>(MESSAGE_URL + 'count', {
    params: {
      recipientId
    }
  });
}

export const getLastMessageIdByRecipient = async (recipientId: number) => {
  return axios.get<number>(MESSAGE_URL + 'id/max', {
    params: {
      recipientId
    }
  })
}

export const updateIsRead = async (id: number, isRead: boolean) => {
  return axios.patch<Message>(MESSAGE_URL + `${id}/is-read`, {
    isRead
  });
}
