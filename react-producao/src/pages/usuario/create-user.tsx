
import React, { type FormEvent } from "react";

interface NewUser {
  usuario: string;
  password: string;
  accessLevel: string;
}

interface CreateUserProps {
  handleCreateUser: (event: FormEvent<HTMLFormElement>) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setNewUser: (newUser: NewUser) => void;
  newUser: NewUser;
}

export const CreateUser: React.FC<CreateUserProps> = ({
  newUser,
  setNewUser,
  setIsModalOpen,
  handleCreateUser,
}) => {
  return (
    <form onSubmit={handleCreateUser} className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Cadastro de Usuário</h2>
        <input
          type="text"
          placeholder="Username"
          className="border mb-4 p-2 w-full rounded-lg"
          value={newUser.usuario}
          onChange={(e) => setNewUser({ ...newUser, usuario: e.target.value })}
        />
        <input
          type="password"
          placeholder="Senha"
          className="border mb-4 p-2 w-full rounded-lg"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <select
          className="border mb-4 p-2 w-full rounded-lg"
          value={newUser.accessLevel}
          onChange={(e) => setNewUser({ ...newUser, accessLevel: e.target.value })}
        >
          <option value="">Selecione o perfil</option>
          <option value="Admin">Administrador</option>
          <option value="Staff">Staff</option>
          <option value="User">Usuário</option>
        </select>
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Cadastrar
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
};
