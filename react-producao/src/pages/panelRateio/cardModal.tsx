
import React from "react";
import { CardData } from "./card"; // Importando a interface CardData se estiver separada

interface ModalProps {
    data: CardData;
    onClose: () => void;
    onSave: () => void;
    checkedItems: number[];
    handleCheckboxChange: (producaoId: number) => void;
    user: { roles: string[] } | null;
}
export const Modal: React.FC<ModalProps> = ({ data, onClose, onSave, checkedItems, handleCheckboxChange, user }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-gray-800">
                <strong>Info do Produto</strong>
                <h2 className="text-xl font-bold mb-4">ID: {data.ProducaoID}</h2>
                <h2 className="text-xl font-bold mb-4">Produto: {data.Produto}</h2>
                <p className="mb-2"><strong>Data e Hora:</strong> {data.DataRegistro} - {data.HoraRegistro}</p>
                <div className="w-full h-px bg-zinc-800" />

                <strong>Info do Rateio</strong>
                <p className="mb-2"><strong>Total:</strong> {data.Total}</p>
                <ul className="mb-4">
                    {data.Beneficiarios.map((beneficiario, index) => (
                        <li key={index}>
                            <strong>{beneficiario}:</strong> {data.ValoresRateados[index]}
                        </li>
                    ))}
                </ul>

                <p className="mb-4"><strong>Status:</strong> {data.ProcessoConcluido}</p>
                <div className="w-full h-px bg-zinc-800" />

                <div className="flex items-center mb-4">
                    <input
                        id={`confirm-${data.ProducaoID}`}
                        type="checkbox"
                        className="mr-2"
                        checked={checkedItems.includes(data.ProducaoID) || data.ProcessoConcluido === "Concluido"}
                        disabled={data.ProcessoConcluido === "Concluido" || user?.roles.includes('User')}
                        onChange={() => handleCheckboxChange(data.ProducaoID)}
                    />
                    <label htmlFor={`confirm-${data.ProducaoID}`} className="text-sm">
                        Confirma a criação de caixas conforme o rateio?
                    </label>
                </div>

                <div className="flex justify-between">
                    <button
                        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-950 ${data.ProcessoConcluido === "Concluido" ? "opacity-50 cursor-not-allowed" : ""} ${user?.roles.includes('User') ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={onSave}
                        disabled={data.ProcessoConcluido === "Concluido" || user?.roles.includes('User')}
                    >
                        Salvar
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-950"
                        onClick={onClose}
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};
