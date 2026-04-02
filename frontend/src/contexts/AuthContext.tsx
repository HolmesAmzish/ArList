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

    // Redirect to SSO server when login is needed
    const login = () => {
        auth.signinRedirect();
    };

    // Clear local state and notify SSO server when logout is needed
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
