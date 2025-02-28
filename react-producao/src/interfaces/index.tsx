export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
    hasRole: (role: string) => boolean;
    refreshAccessToken: (token: string) => void;
  }
  export interface LoginCredentials {
    usuario: string;
    password: string;
  }

  export interface User {
    id: string;
    username: string;
    roles: string[];
  }