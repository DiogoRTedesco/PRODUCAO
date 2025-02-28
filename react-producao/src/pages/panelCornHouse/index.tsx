import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { api } from '../../lib/axios';
import { ListProd, ProductionData } from '../layer/interfaces';
import { LimeChart } from '../layer/line-chart';
import { ListProducts } from '../layer/list-products';
import { ProductionChart } from '../layer/production-bar';
import Header from '../../Components/header';
import { useDate } from '../../contexts/DateContext';



export const DashboardCH: React.FC = () => {
    const [data, setData] = useState<ProductionData[]>([]);
    const [tipo, setTipo] = useState<ListProd[]>([]);
    const [products, setProducts] = useState<ListProd[]>([]);
    const [qualidade, setQualidade] = useState<ListProd[]>([]);
    //const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const { selectedDate, setSelectedDate } = useDate();
    const [total, setTotal] = useState<number | null>()

    const [selectedOption, setSelectedOption] = useState<'totalCaixas' | 'porcentagemInteiras' | 'porcentagemInteirasPrimeiras'>(() => {
        return (localStorage.getItem('selectedOption') as 'totalCaixas' | 'porcentagemInteiras' | 'porcentagemInteirasPrimeiras') || 'totalCaixas';
    });

    useEffect(() => {
        handleOptionChange(selectedOption);
        fetchTypeData(selectedDate)
        fetchProductData(selectedDate)
        fetchQualityData(selectedDate)
    }, [selectedDate]);

    const handleOptionChange = (option: 'totalCaixas' | 'porcentagemInteiras' | 'porcentagemInteirasPrimeiras') => {
        setSelectedOption(option);
        localStorage.setItem('selectedOption', option);

        if (option === 'totalCaixas') {
            fetchProductionData(selectedDate);
        } else if (option === 'porcentagemInteiras') {
            fetchIntegerData(selectedDate);
        } else if (option === 'porcentagemInteirasPrimeiras') {
            fetchPorcentagemInteirasPrimeiraData(selectedDate);
        }
    };
    const getTitle = () => {
        switch (selectedOption) {
            case 'totalCaixas':
                return 'Total de Caixas - Últimos 15 Dias de Produção';
            case 'porcentagemInteiras':
                return 'Porcentagem de Inteiras - Últimos 15 Dias de Produção';
            case 'porcentagemInteirasPrimeiras':
                return 'Porcentagem de Inteiras Primeiras - Últimos 15 Dias de Produção';
            default:
                return '';
        }
    };
    const fetchProductionData = (date: Date | null) => {
        if (date) {
            const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
            api.get<ProductionData[]>(`/query/prodsCH?data=${formattedDate}`)
                .then(response => {
                    if (Array.isArray(response.data)) {
                        // Ajustar a data para evitar problemas com o fuso horário
                        const formattedData = response.data.map(item => {
                            if (item && item.Dias) {
                                const date = new Date(item.Dias);
                                // Ajuste manual para o fuso horário local
                                const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
                                return {
                                    ...item,
                                    Dias: format(localDate, 'dd/MM'), // ou 'dd MMM'
                                };
                            }
                            return item; // Retorna o item como está, se não puder ser formatado
                        });
                        setData(formattedData);
                    } else {
                        console.error("Erro: A resposta não é um array", response.data);
                        // Se a resposta não for um array, pode-se definir um estado de erro ou tomar outras ações
                        setData([]);
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar dados:', error);
                });
        }
    };

    const fetchIntegerData = (date: Date | null) => {
        if (date) {
            const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
            api.get(`/query/intprodsCH?data=${formattedDate}`)
                .then(response => {
                    if (Array.isArray(response.data)) {
                        // Ajustar a data para evitar problemas com o fuso horário
                        const formattedData = response.data.map(item => {
                            if (item && item.Dias) {
                                const date = new Date(item.Dias);
                                const inteiras = Number(item.Inteiras) || 0;
                                const total = Number(item.Total) || 1; // Evita divisão por zero
                                const porcentagem = ((inteiras / total) * 100).toFixed(2);
                                // Ajuste manual para o fuso horário local
                                const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

                                return {
                                    Dias: format(localDate, 'dd/MM'), // ou 'dd MMM',
                                    Total: porcentagem
                                };
                            }
                            return item; // Retorna o item como está, se não puder ser formatado
                        });
                        setData(formattedData);
                    } else {
                        console.error("Erro: A resposta não é um array", response.data);
                        // Se a resposta não for um array, pode-se definir um estado de erro ou tomar outras ações
                        setData([]);
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar dados:', error);
                });
        }
    };
    const fetchPorcentagemInteirasPrimeiraData = (date: Date | null) => {
        if (date) {
            const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');

            api.get(`/query/int1prodsCH?data=${formattedDate}`)
                .then(response => {
                    if (Array.isArray(response.data)) {
                        // Ajustar a data para evitar problemas com o fuso horário
                        const formattedData = response.data.map(item => {
                            if (item && item.Dias) {
                                const date = new Date(item.Dias);
                                const inteiras = Number(item.Inteiras) || 0;
                                const total = Number(item.Total) || 1; // Evita divisão por zero
                                const porcentagem = ((inteiras / total) * 100).toFixed(2);
                                // Ajuste manual para o fuso horário local
                                const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

                                return {
                                    Dias: format(localDate, 'dd/MM'), // ou 'dd MMM',
                                    Total: porcentagem
                                };
                            }
                            return item; // Retorna o item como está, se não puder ser formatado
                        });
                        setData(formattedData);
                    } else {
                        console.error("Erro: A resposta não é um array", response.data);
                        // Se a resposta não for um array, pode-se definir um estado de erro ou tomar outras ações
                        setData([]);
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar dados:', error);
                });
        }
    };


    const fetchTypeData = (date: Date | null) => {
        if (date) {
            const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
            Promise.all([
                api.get<ListProd[]>(`/query/tipoCH?data=${formattedDate}`),
                api.get<ListProd[]>(`/query/tipo1CH?data=${formattedDate}`)
            ])
                .then(([tipoResponse, primeiraInteiraResponse]) => {
                    const tipoData = tipoResponse.data;
                    const primeiraInteiraData = primeiraInteiraResponse.data

                    const updateTipo: ListProd[] = [...tipoData, ...primeiraInteiraData];
                    setTipo(updateTipo);

                })
                .catch(error => {
                    console.error("Erro ao buscar dados:", error);
                });
        }
    }


    const fetchProductData = (date: Date | null) => {
        if (date) {
            const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
            api.get<ListProd[]>(`/query/productCH?data=${formattedDate}`)
                .then(response => {
                    setProducts(response.data);
                })
                .catch(error => {
                    console.error("Erro ao buscar dados:", error);
                });
        }
    }

    const fetchQualityData = (date: Date | null) => {
        if (date) {
            const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
            api.get<ListProd[]>(`/query/qualidadeCH?data=${formattedDate}`)
                .then(response => {
                    setQualidade(response.data);
                })
                .catch(error => {
                    console.error("Erro ao buscar dados:", error);
                });
        }
    }

    // Atualização automática a cada 5 segundos quando a data selecionada for a data atual
    useEffect(() => {
        let interval: any;
        if (selectedDate && isToday(selectedDate)) {
            interval = setInterval(() => {
                handleOptionChange(selectedOption);
                fetchTypeData(selectedDate)
                fetchProductData(selectedDate)
                fetchQualityData(selectedDate)
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [selectedDate, selectedOption]);

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };
    useEffect(() => {
        const total = products.reduce((previousValue, currentValue) =>
            previousValue + Number(currentValue.Qt), 0);

        setTotal(total)
    }, [products])

    return (

        < div className="min-h-screen bg-yellow-100 text-zinc-900" >
            <Header
                title="Painel de Produção Corn House"
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />
            <main className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
                {/* Seção 1: Produtos Produzidos */}
                <section className="bg-white p-4 rounded shadow ">
                    <h2 className="text-xl font-semibold mb-4">Produtos Produzidos - Caixas</h2>
                    <ListProducts data={products} />
                </section>

                <section className="grid grid-cols-4 gap-4 max-h-96">
                    {/* Gráfico 1 */}
                    <div className="bg-white p-4 rounded shadow col-span-2">
                        <h3 className="text-lg font-semibold">Tipos</h3>
                        <ListProducts data={tipo} />
                    </div>
                    {/* Gráfico 2 */}
                    <div className="bg-white p-4 rounded shadow col-span-2">
                        <h3 className="text-lg font-semibold">Qualidade</h3>
                        <ListProducts data={qualidade} />
                    </div>
                    {/* Gráfico 3 */}
                    <div className="bg-white p-4 rounded shadow col-span-2 space-y-10">
                        <h3 className="text-lg font-semibold">Total</h3>
                        <div className='space-y-3 flex justify-center'>
                            <span className='text-5xl'>{total} - Cxs</span>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded shadow col-span-2 space-y-10">
                        <h3 className="text-lg font-semibold">Total de Produtos</h3>
                        <div className='space-y-3 flex justify-center'>
                            <span className='text-3xl'>{products.length} - Produtos</span>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-2 gap-4 max-h-96">
                    <div className='col-span-2 bg-white p-4 rounded shadow'>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className='font-semibold text-xl'>{getTitle()}</h2>
                            <select
                                value={selectedOption}
                                onChange={(e) => handleOptionChange(e.target.value as 'totalCaixas' | 'porcentagemInteiras' | 'porcentagemInteirasPrimeiras')}
                                className="p-2 border rounded"
                            >
                                <option value="totalCaixas">Total de Caixas</option>
                                <option value="porcentagemInteiras">% de Inteiras</option>
                                <option value="porcentagemInteirasPrimeiras">% de Inteiras Primeiras</option>
                            </select>
                        </div>
                        {selectedOption === "totalCaixas" ? <ProductionChart data={data} /> : <LimeChart data={data} />}
                    </div>
                </section>
            </main>
        </div >

    );
};
