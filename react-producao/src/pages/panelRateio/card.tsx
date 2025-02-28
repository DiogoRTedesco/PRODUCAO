import React from "react";
//import { api } from "../../lib/axios";
//import { useAuth } from '../../contexts/AuthContext';


export interface CardData {
  ProducaoID: number;
  Produto: string;
  Total: number;
  DataRegistro: string;
  HoraRegistro: string;
  ProcessoConcluido: "Concluido" | "Pendente" | string;
  CriadoPor: string | null;
  Beneficiarios: string[];
  ValoresRateados: string[];

}
// Propriedades esperadas no componente Card
interface CardProps {
  data: CardData;
  onSave: (checkedItems: number[]) => void;
  onOpenModal: (card: CardData) => void
}

export const Card: React.FC<CardProps> = ({ data,onOpenModal }) => {
  //const [isModalOpen, setModalOpen] = useState<boolean>(false);
  //const [checkedItems, setCheckedItems] = useState<number[]>([]);
  //const{user}= useAuth()
 

  const statusColors: Record<string, string> = {
    Concluido: "bg-green-500",
    Pendente: "bg-red-500",
    default: "bg-gray-500",
  };


  /*const handleCheckboxChange = async (producaoId: number) => {
    setCheckedItems((prevChecked) =>
      prevChecked.includes(producaoId)
        ? prevChecked.filter((id) => id !== producaoId) // Remove se já está marcado
        : [...prevChecked, producaoId] // Adiciona se não está marcado
    );
  };*/
  

  const backgroundColor = statusColors[data.ProcessoConcluido] || statusColors.default;

  return (
    <>
      {/* Card */}
      <div
        className={`w-40 h-40 border-2 border-black p-4 rounded-md shadow-md cursor-pointer shadow-shape text-white flex flex-col justify-between ${backgroundColor}`}
        onClick={() => onOpenModal(data)}
      >
        <h2 className="text-lg font-bold">ID: {data.ProducaoID}</h2>
        <h2 className="text-lg font-bold">{data.Produto}</h2>
        <p className="text-sm">{data.HoraRegistro}</p>
        <p className="text-sm font-semibold">Quantidade: {data.Total}</p>
      </div>

      {/* Modal 
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-gray-800">
            <strong>Info do Produto</strong>
            <h2 className="text-xl font-bold mb-4">ID: {data.ProducaoID}</h2>
            <h2 className="text-xl font-bold mb-4">Produto: {data.Produto}</h2>
            <p className="mb-2">
              <strong>Data e Hora:</strong> {data.DataRegistro} - {data.HoraRegistro}
            </p>
            <div className="w-full h-px bg-zinc-800" />
            <strong>Info do Rateio</strong>
            <p className="mb-2">
              <strong>Total:</strong> {data.Total}
            </p>
            <ul className="mb-4">
              {data.Beneficiarios.map((beneficiario, index) => (
                <li key={index}>
                  <strong>{beneficiario}:</strong> {data.ValoresRateados[index]}
                </li>
              ))}
            </ul>
            <p className="mb-4">
              <strong>Status:</strong> {data.ProcessoConcluido}
            </p>
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
                className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-950 ${data.ProcessoConcluido === "Concluido" ? "opacity-50 cursor-not-allowed" : ""
                  } ${user?.roles.includes('User') ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => onSave(checkedItems)}
                disabled={data.ProcessoConcluido === "Concluido"|| user?.roles.includes('User')}
              >
                Salvar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-950"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}*/}

    </>
  );
};
