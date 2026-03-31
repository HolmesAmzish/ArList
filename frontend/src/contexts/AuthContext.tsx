import React, { createContext, useContext } from 'react';
import { useAuth as useOidcAuth } from "react-oidc-context";

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AppAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const auth = useOidcAuth();

    // 当需要登录时，重定向到 9000 服务器
    const login = () => {
        auth.signinRedirect();
    };

    // 当需要登出时，清除本地状态并可能通知 9000 服务器
    const logout = () => {
        auth.signoutRedirect();
        auth.removeUser();
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated: auth.isAuthenticated, 
            login, 
            logout,
            token: auth.user?.access_token || null
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AppAuthProvider');
    return context;
};
