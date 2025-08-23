import { createContext, useState, useEffect, useContext } from "react";

export const TokenContext = createContext(undefined);
export function TokenProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const removeToken = () => setToken(null);

    return (
        <TokenContext.Provider value={{ token, setToken, removeToken }}>
            {children}
        </TokenContext.Provider>
    );
}
export const useToken = () => useContext(TokenContext);
