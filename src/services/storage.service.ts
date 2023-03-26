import { User } from '../types';

const USER_STORAGE = 'user';

export const saveUser = (user: User) => {
  localStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

export const getUser = (): User | null=> {
  return JSON.parse(localStorage.getItem(USER_STORAGE)!);
}

export const removeUser = () => {
  localStorage.removeItem(USER_STORAGE);
}

export const isAuth = (): boolean => {
  return !!getUser();
}
