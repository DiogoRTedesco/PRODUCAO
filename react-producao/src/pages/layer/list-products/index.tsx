
import React from 'react';
import { ListProd } from '../interfaces';



export const ListProducts: React.FC<{ data: ListProd[] }> = ({ data }) => {
    /*const total = data.reduce((sum, item) => {
        if (item.NmObj !== "INTEIRAS - PRIMEIRA") {
            return sum + Number(item.Qt);
        }
        return sum;
    }, 0);**/
    const { total, totalInteiras, totalInteirasPrimeira } = data.reduce(
        (acc, item) => {
            if (item.NmObj === "INTEIRAS") {
                acc.totalInteiras += Number(item.Qt);
            }
            if (item.NmObj === "INTEIRAS - PRIMEIRA") {
                acc.totalInteirasPrimeira += Number(item.Qt);
            }
            if (item.NmObj !== "INTEIRAS - PRIMEIRA") {
                acc.total += Number(item.Qt);
            }
            return acc;
        },
        { total: 0, totalInteiras: 0, totalInteirasPrimeira: 0 }

    );

    const formatNumber = (num: number) => {
        return num < 10 ? `0${num}` : num.toString();
    };
     // Calcular a porcentagem de "INTEIRAS - PRIMEIRA" em relação ao total de inteiras
     const percentageInteirasPrimeira = (totalInteirasPrimeira / totalInteiras) * 100;


    const formatPercentage = (num: number) => {
        return `${num.toFixed(2)}%`;
    };

    return (
        <div className="space-y-1">
            
            {data.map((item, index) => {
                const percentage = (item.Qt / total) * 100;
                return (
                    <div key={index} className="font-semibold">
                        {/*Quebra de Linha suave 29/10/2024 */}
                        <div className="flex flex-wrap justify-between py-1">
                            <span className="flex-1 break-words text-sm md:text-base">
                                {item.NmObj}
                            </span>
                            <span className="text-right text-sm md:text-xl flex-1">
                                {formatNumber(item.Qt)}{' '}
                                {item.NmObj === "INTEIRAS - PRIMEIRA"
                                    ? `(${formatPercentage(percentageInteirasPrimeira)})`
                                    : `(${formatPercentage(percentage)})`}
                            </span>
                        </div>
                        {/* Linha horizontal entre os itens, exceto após o último item */}
                        {index < data.length - 1 && <div className="border-b border-gray-300"></div>}
                    </div>
                );
            })}
        </div>
    );
};
