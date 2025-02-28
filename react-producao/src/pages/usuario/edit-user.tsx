import React, { useState } from "react";

interface EditUserModalProps {
  userId: number;
  currentAccessLevel: string;
  onEditUser: (userId: number, updatedAccessLevel: string) => void;
  setIsEditUserModalOpen: (value: boolean) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  userId,
  currentAccessLevel,
  onEditUser,
  setIsEditUserModalOpen,
}) => {
  const [selectedAccessLevel, setSelectedAccessLevel] =
    useState<string>(currentAccessLevel);

  const handleSave = () => {
    onEditUser(userId, selectedAccessLevel);
    setIsEditUserModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Permissões de Usuário</h2>
        <select
          value={selectedAccessLevel}
          onChange={(e) => setSelectedAccessLevel(e.target.value)}
          className="border mb-4 p-2 w-full rounded-lg"
        >
          <option value="Admin">Administrador</option>
          <option value="Staff">Staff</option>
          <option value="User">Usuário</option>
        </select>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Salvar
          </button>
          <button
            onClick={() => setIsEditUserModalOpen(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};