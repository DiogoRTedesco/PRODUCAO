
import React from 'react';
import { ListProd } from '../interfaces';



export const ListProducts: React.FC<{ data: ListProd[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => {
        if (item.NmObj !== "INTEIRAS - PRIMEIRA") {
            return sum + Number(item.Qt);
        }
        return sum;
    }, 0);

    const formatNumber = (num: number) => {
        return num < 10 ? `0${num}` : num.toString();
    };

    const formatPercentage = (num: number) => {
        return `${num.toFixed(2)}%`;
    };

    return (
        <div className="space-y-1">
            {data.map((item, index) => {
                const percentage = (item.Qt / total) * 100;
                return (
                    <div key={index} className="font-semibold ">
                        <div className="flex justify-between py-1">
                            <span className="flex-1">{item.NmObj}</span>
                            <span className="text-right text-xl justify-between">
                                {formatNumber(item.Qt)} ({formatPercentage(percentage)}) 
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