import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export const LoginPage: React.FC = () => {
  const { login, error } = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const loginCredentials = {
    usuario: userName,
    password: password,
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    await login(loginCredentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gray-800">
      <form
        onSubmit={handleLogin}
        className=" bg-gray-700 p-8 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-300 ">
          Login
        </h1>

        <div className="mb-4">
          <label
            className="block text-gray-200  mb-2"
            htmlFor="username"
          >
            Usuário
          </label>
          <input
            type="text"
            id="username"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400  bg-gray-600 text-gray-200"
            placeholder="Digite seu usuário"
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-300 mb-2"
            htmlFor="password"
          >
            Senha
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400  bg-gray-600 text-gray-200"
            placeholder="Digite sua senha"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit" // Define o botão como do tipo submit
          className="w-full  text-white py-2 rounded-lg transition duration-300 dark:bg-blue-400 dark:hover:bg-blue-500"
        >
          Login
        </button>

        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      </form>
    </div>
  );
};