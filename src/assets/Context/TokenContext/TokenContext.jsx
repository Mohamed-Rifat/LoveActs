import { createContext, useState, useEffect, useContext } from "react";

export const TokenContext = createContext(undefined);
export function TokenProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const removeToken = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <TokenContext.Provider value={{ token, setToken, user, setUser, removeToken }}>
      {children}
    </TokenContext.Provider>
  );
}
export const useToken = () => useContext(TokenContext);