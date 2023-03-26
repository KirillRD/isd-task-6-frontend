import axios from 'axios';
import { LoginFormBody, User } from '../types';

const AUTH_URL = import.meta.env.VITE_API_URL + '/auth/';

export const login = async (loginFormBody: LoginFormBody) => {
  return axios.post<User>(AUTH_URL, loginFormBody);
}
