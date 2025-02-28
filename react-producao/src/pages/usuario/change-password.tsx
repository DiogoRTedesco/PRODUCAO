import React,{ useState } from "react";

interface ChangePasswordModalProps {
    userId: number;
    onClose: () => void;
    onChangePassword: (userId: number, newPassword: string) => void;
  }
  
  export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    userId,
    onClose,
    onChangePassword,
  }) => {
    const [newPassword, setNewPassword] = useState("");
  
    const handleSubmit = () => {
      onChangePassword(userId, newPassword);
      onClose();
    };
  
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Alterar Senha</h2>
          <input
            type="password"
            placeholder="Nova Senha"
            className="border mb-4 p-2 w-full rounded-lg"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Alterar Senha
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };
  