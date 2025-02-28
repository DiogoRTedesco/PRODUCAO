import React, { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { toast } from "react-toastify";

interface ProdutoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVincular: (produtoId: number, quantidade: number, observacao: string) => void;
}

interface Produto {
    ProdutoID: number;
    Produto: string;
}

export const ProductionModal: React.FC<ProdutoModalProps> = ({
    isOpen,
    onClose,
    onVincular,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
    const [quantidade, setQuantidade] = useState<number>(0);
    const [observacao, setObservacao] = useState<string>("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProdutos = async () => {
            if (searchTerm.length > 2) {
                setLoading(true);
                try {
                    const response = await api.get(`/query/produtoTopManager?search=${searchTerm}`);
                    setProdutos(response.data);
                    console.log(response.data)
                } catch (error) {
                    toast.error("Erro ao buscar produtos:");
                } finally {
                    setLoading(false);
                }
            } else {
                setProdutos([]);
            }
        };

        const timeoutId = setTimeout(fetchProdutos, 300); // Delay para evitar chamadas excessivas
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleProduzir = () => {
        if (selectedProduto && quantidade > 0) {
            onVincular(selectedProduto.ProdutoID, quantidade, observacao);
            handleClose();
        }
    };

    const handleClose = () => {
        setSearchTerm("");
        setProdutos([]);
        setSelectedProduto(null);
        setQuantidade(0);
        setObservacao('')
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-zinc-950">
                <h2 className="text-xl font-bold mb-4">Selecionar Produto</h2>

                {/* Campo de busca */}
                <input
                    type="text"
                    placeholder="Digite o nome do produto..."
                    className="border p-2 w-full rounded-lg "
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Feedback de carregamento */}
                {loading && <p className="text-gray-500 text-sm mt-2">Carregando produtos...</p>}

                {/* Lista de produtos */}
                {produtos.length > 0 && (
                    <ul className="border mt-2 rounded-lg max-h-40 overflow-y-auto">
                        {produtos.map((produto) => (
                            <li
                                key={produto.ProdutoID}
                                className={`p-2 cursor-pointer ${selectedProduto?.ProdutoID === produto.ProdutoID ? "bg-blue-500" : ""
                                    }`}
                                onClick={() => setSelectedProduto(produto)}
                            >
                                {produto.Produto}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Produto selecionado e entrada de quantidade */}
                {selectedProduto && (
                    <div className="mt-4">
                        <p className="font-medium">Produto Selecionado: {selectedProduto.Produto}</p>
                        <label className="block mt-2 text-sm ">Quantidade:</label>
                        <input
                            type="number"
                            min="1"
                            className="border p-2 w-full rounded-lg"
                            value={quantidade}
                            onChange={(e) => setQuantidade(Number(e.target.value))}
                        />
                    </div>
                )}
                {selectedProduto && (
                    <div className="mt-4">
                        <label className="block mt-2 text-sm ">Observação:</label>
                        <input
                            type="text"
                            className="border p-2 w-full rounded-lg"
                            value={observacao}
                            onChange={(e) => setObservacao(e.target.value)}
                        />
                    </div>
                )}

                {/* Botões */}
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        onClick={handleProduzir}
                        className={`px-4 py-2 rounded-lg text-white ${selectedProduto && quantidade > 0 ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
                            }`}
                        disabled={!selectedProduto || quantidade <= 0}
                    >
                        Gerar Rateio
                    </button>
                    <button
                        onClick={handleClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};
