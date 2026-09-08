import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [email, setEmail] = useState(localStorage.getItem('email'));

    const login = (token, role, email) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('email', email);
        setToken(token);
        setRole(role);
        setEmail(email);
    };

    const logout = () => {
        localStorage.clear();
        setToken(null);
        setRole(null);
        setEmail(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, email, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
