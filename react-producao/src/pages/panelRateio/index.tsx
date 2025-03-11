
import React, { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { CardList } from "./cardList";
import { CardData } from "./card";
import Header from "../../Components/header";
import { useDate } from "../../contexts/DateContext";
import { Modal } from "./cardModal";
import { useAuth } from "../../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { ProductionModal } from "./productionModal";



export interface RawData {
  ProducaoID: number;
  Produto: string;
  Total: number;
  Beneficiario: string;
  ValorRateado: string;
  DataRegistro: string;
  HoraRegistro: string;
  CriadoPor: string | null;
  ProcessoConcluido: "Concluido" | "Pendente" | string;
  confirmRateio: () => void
}



// Componente Principal
export const PanelRateioEmb: React.FC = () => {
  const [data, setData] = useState<CardData[]>([])
  const userId = sessionStorage.getItem("userId")
  const token = sessionStorage.getItem("accessToken");
  const { selectedDate, setSelectedDate } = useDate();
  const [total, setTotal] = useState<number | null>(0)
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [selectedData, setSelectedData] = useState<CardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [beneficiariosTexto, setBeneficiariosTexto] = useState("");
  const [isModalProduction, setIsModalProduction] = useState(false)

  const { user } = useAuth()
  const handleOpenModal = (data: CardData) => {
    setSelectedData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCheckedItems([]);
    setSelectedData(null);
  };


  const handleCheckboxChange = (producaoId: number) => {
    setCheckedItems((prevChecked) =>
      prevChecked.includes(producaoId)
        ? prevChecked.filter((id) => id !== producaoId) // Remove se já está marcado
        : [...prevChecked, producaoId] // Adiciona se não está marcado
    );
  };

  const getRateio = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
      api.get(`/query/rateio?data=${formattedDate}`)
        .then(response => {
          const groupedData = groupData(response.data);
          setData(groupedData);
        })
        .catch(error => {
          console.error('Erro ao buscar dados:', error);
        });
    }
  }
  const getTotalDia = async (date: Date | null) => {
    if (!date) return;

    try {
      const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
      const response = await api.get(`/query/total?data=${formattedDate}`);

      if (response.data.length > 0) {
        setTotal(response.data[0].Total);
      } else {
        setTotal(0); // Define 0 se não houver dados retornados
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    getRateio(selectedDate)
    getTotalDia(selectedDate)
  }, [selectedDate])

  useEffect(() => {
    let interval: any;
    if (selectedDate && isToday(selectedDate)) {
      interval = setInterval(() => {

        getRateio(selectedDate)
        getTotalDia(selectedDate)
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [selectedDate]);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const groupData = (rawData: RawData[]): CardData[] => {
    return rawData.reduce<CardData[]>((acc, curr) => {
      // Tenta encontrar um item existente com o mesmo ProducaoID
      const existing = acc.find((item) => item.ProducaoID === curr.ProducaoID);

      if (existing) {
        // Se já existir, adiciona os dados do beneficiário e valor rateado
        existing.Beneficiarios.push(curr.Beneficiario);
        existing.ValoresRateados.push(curr.ValorRateado);
      } else {
        // Se não existir, cria um novo objeto e adiciona ao acumulador
        acc.push({
          ProducaoID: curr.ProducaoID,
          Produto: curr.Produto,
          Total: curr.Total,
          DataRegistro: curr.DataRegistro,
          HoraRegistro: curr.HoraRegistro,
          ProcessoConcluido: curr.ProcessoConcluido,
          Beneficiarios: [curr.Beneficiario],
          ValoresRateados: [curr.ValorRateado],
          CriadoPor: curr.CriadoPor,
        });
      }

      return acc;
    }, []);
  };
  const handleCriarProduto = async (produtoId: number, quantidade: number, observacao: string) => {
    try {
      console.log("Produto Selecionado:", produtoId, "Quantidade:", quantidade, "Observação:", observacao);
      await api.post(`/query/createrateio`, { ProdutoID: produtoId, QuantidadeTotal: quantidade, Observacao: observacao, userId, }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Rateio Criado com sucesso')
      getRateio(selectedDate);
      setIsModalProduction(false)
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      toast.error("Erro ao executar a operação! Tente novamente.");
    }
  };
  const handleSave = async (checkedItems: number[]) => {
    const confirmSave = window.confirm(
      "Você tem certeza de que deseja salvar as alterações?"
    );

    if (!confirmSave) return;

    try {
      for (const producaoId of checkedItems) {
        await api.put(`/query/updaterateio?producaoId=${producaoId}`, { userId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      toast.success('Rateio Efetuado com sucesso')
      getRateio(selectedDate); // Atualiza os dados após salvar
      handleCloseModal()
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      toast.error("Erro ao executar a operação! Tente novamente.");
    }
  };

  const getBeneficiario = async () => {
    try {
      const response = await api.get('/query/beneficiarios');

      if (response.data && Array.isArray(response.data)) {
        const beneficiarios = response.data;

        const textoFormatado = beneficiarios.reduce((acc, item, index) => {
          return acc + `${item.Nome}: <span class="text-red-600">${item.Percentual}%</span>${index < beneficiarios.length - 1 ? " " : ""}`;
        }, "Percentual de Rateio: ");
        setBeneficiariosTexto(textoFormatado);
      } else {
        throw new Error("Dados inválidos da API");
      }
    } catch (error) {
      console.error("Erro ao buscar beneficiários:", error);
      setBeneficiariosTexto("Erro ao carregar os dados");
    }
  };


  useEffect(() => {
    getBeneficiario()
  }, [])

  return (


    <div className="min-h-screen bg-yellow-100  ">
      <Header
        title="Painel de Rateio Embalagem"
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <ToastContainer position={"top-right"} autoClose={5000} />
      <div className="flex flex-wrap  p-4 mt-16 gap-3">
        <div className="p-4 bg-gray-100 border rounded text-zinc-800" ><div dangerouslySetInnerHTML={{ __html: beneficiariosTexto }} />  Total Produzido do Dia: <span className="text-red-600 ">{total}</span> </div>

        {(user?.roles.includes("Staff") || user?.roles.includes("Admin")) && selectedDate && isToday(selectedDate) && (
          <button className="bg-blue-500 text-white rounded-lg px-5 py-2 font-medium hover:bg-blue-600 " onClick={() => setIsModalProduction(true)}>
            Registrar Nova Produção
          </button>
        )}
      </div>
      <div className="flex  flex-wrap -mt-2 p-4">
        <CardList items={data}
          onSave={handleSave}
          onOpenModal={handleOpenModal}
          checkedItems={checkedItems}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>
      {isModalOpen && selectedData && (
        <Modal
          data={selectedData}
          onClose={handleCloseModal}
          onSave={() => handleSave(checkedItems)}
          checkedItems={checkedItems}
          handleCheckboxChange={handleCheckboxChange}
          user={user}
        />)}
      <ProductionModal
        isOpen={isModalProduction}
        onClose={() => setIsModalProduction(false)}
        onVincular={handleCriarProduto}
      />

    </div>


  );
};


