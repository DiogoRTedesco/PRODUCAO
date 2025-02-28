import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/axios";
import type { AuthContextType, LoginCredentials, User } from "../interfaces";


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
  };
  
  const isTokenExpired = (token: string): boolean => {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.exp * 10000 < Date.now();
  };
  export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean| null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      if (token && !isTokenExpired(token)) {
        const userData = JSON.parse(atob(token.split(".")[1]));
        setUser({
          id: userData.id,
          username: userData.username,
          roles: userData.roles,
        });
        setIsAuthenticated(true);
      } else if (refreshToken) {
        refreshAccessToken(refreshToken); // Tentativa de atualizar o accessToken se estiver expirado
      } 
        setLoading(false); // Finaliza o carregamento caso não haja tokens válidos
      
    }, []);
  
    const token = sessionStorage.getItem("acessToken");
    const refreshToken = sessionStorage.getItem("refreshToken");
  
    const login = async ({ usuario, password }: LoginCredentials) => {
      try {
        setLoading(true);
        const response = await api.post("/auth/login", {
          usuario,
          password,
        });
        const { accessToken, refreshToken } = response.data;
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
  
        const userData = JSON.parse(atob(accessToken.split(".")[1]));
        setUser({
          id: userData.id,
          username: userData.user,
          roles: userData.role,
        });
        setIsAuthenticated(true);
        sessionStorage.setItem('userId',userData.id)
      } catch (err) {
        setError("Falha ao realizar login");
      }
        setLoading(false);
      
    };
  
    const logout = () => {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("userId");
      setIsAuthenticated(false);
      setUser(null);
    };
  
    const hasRole = (role: string): boolean => {
      return user?.roles.includes(role) ?? false;
    };
  
    const refreshAccessToken = async (refreshToken: string) => {
      try {
        const response = await api.post("/auth/refresh", {
          refreshToken,
        }); // Enviar como objeto
        const { accessToken } = response.data;
        sessionStorage.setItem("accessToken", accessToken);
  
        const userData = JSON.parse(atob(accessToken.split(".")[1]));
        setUser({
          id: userData.id,
          username: userData.user,
          roles: userData.role,
        });
        setIsAuthenticated(true);
      } catch (error) {
        logout();
      }
    };
  
    return (
      <AuthContext.Provider
        value={{
          user,
          isAuthenticated,
          login,
          logout,
          loading,
          error,
          hasRole,
          refreshAccessToken,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };