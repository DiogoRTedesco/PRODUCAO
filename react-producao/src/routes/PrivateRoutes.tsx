import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoginPage } from "../pages/login";


type AccessLevel = "Admin" | "Staff" | "User";

const MappedRoles: Record<AccessLevel, AccessLevel[]> = {
  Admin: ["Admin"],
  Staff: ["Admin", "Staff"],
  User: ["Admin", "Staff", "User"],
};

interface PrivateRouterProps {
  roles?: AccessLevel[];
}
interface LoginAuthProps {
  children: React.ReactNode;
}
export const PrivateRoute: React.FC<PrivateRouterProps> = ({ roles = [] }) => {
  const { isAuthenticated, user } = useAuth();



  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const userRoles = user?.roles
    ? Array.isArray(user.roles)
      ? user.roles
      : [user.roles]
    : [];

  // Se `userRoles` não existe ou está vazio, negar acesso
  if (!userRoles || userRoles.length === 0) {
    console.log("!userRoles || userRoles.length ===0");
    return <Navigate to="/unauthorized" />;
  }

  const hasPermission = userRoles.some((userRole) =>
    roles.every((role) => MappedRoles[role].includes(userRole as AccessLevel))
  );

  if (!hasPermission) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export const LoginAuth: React.FC<LoginAuthProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Se o usuário estiver autenticado, redireciona para a página principalS
  if (isAuthenticated) {
    return <Navigate to="/Rateio" />;
  } else {
    // Caso contrário, renderiza os filhos
    return <>{children}</>;
  }
};