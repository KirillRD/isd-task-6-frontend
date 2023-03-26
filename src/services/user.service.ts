import axios from 'axios';
import { User } from '../types';

const USER_URL = import.meta.env.VITE_API_URL + '/users/';

export const getUsersByNameLike = async (name: string) => {
  return axios.get<User[]>(USER_URL + `name/like/${name}`);
}
