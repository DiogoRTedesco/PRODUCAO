import React, { useState, useEffect } from "react";
import { api } from "../../lib/axios";

interface VincularUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVincular: (usuarioId: number) => void;
}

interface Usuario {
  id: number;
  usuario: string;
}

export const VincularUsuarioModal: React.FC<VincularUsuarioModalProps> = ({
  isOpen,
  onClose,
  onVincular,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Buscar usuários conforme o usuário digita
  useEffect(() => {
    if (searchTerm.length > 2) {
      api
        .get(`/query/usuarioTopManager?search=${searchTerm}`)
        .then((response) => {
          setUsuarios(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar usuários:", error);
        });
    } else {
      setUsuarios([]);
    }
  }, [searchTerm]);

  const handleVincular = () => {
    if (selectedUserId) {
      onVincular(selectedUserId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Vincular Usuário</h2>
        <input
          type="text"
          placeholder="Digite o nome do usuário..."
          className="border p-2 w-full rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {usuarios.length > 0 && (
          <ul className="border mt-2 rounded-lg max-h-40 overflow-y-auto">
            {usuarios.map((user) => (
              <li
                key={user.id}
                className={`p-2 cursor-pointer ${selectedUserId === user.id ? "bg-blue-200" : "hover:bg-gray-200"
                  }`}
                onClick={() => setSelectedUserId(user.id)}
              >
                {user.usuario}
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={handleVincular}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            disabled={!selectedUserId}
          >
            Vincular
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
