import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(false);


export const AuthProvider  = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        //console.log('token', token, !!token)
        setIsAuthenticated(!!token);
    }, [])
    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}

export const Logout = () => {
    localStorage.removeItem('token');
}