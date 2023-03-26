import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { User } from '../types';
import { saveUser, removeUser, getUser } from './../services/storage.service';

type CreateUserContext = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

type ProviderProps = {
  children: ReactNode;
}

const UserContext = createContext<CreateUserContext>({
  user: null,
  setUser: (user) => {},
  logout: () => {}
});

export const useUserContext = () => {
  return useContext(UserContext);
}

export const UserContextProvider: FC<ProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setUser(user);
    }
  }, []);

  const handleSetUser = useCallback((user: User) => {
    saveUser(user);
    setUser(user);
  }, []);

  const handleLogout = useCallback(() => {
    removeUser();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    setUser: handleSetUser,
    logout: handleLogout
  }), [user, handleSetUser, handleLogout]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
