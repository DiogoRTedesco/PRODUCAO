import React from 'react';
import { Cell, Label, Pie, PieChart } from 'recharts';

interface ChartData {
    name: string;
    value: number;
    percent: number;
    color: string;
}

// Props para o componente de gráfico de meia lua
interface SemiCircleChartProps {
    data: ChartData[];
}

export const SemiCircleChart: React.FC<SemiCircleChartProps> = ({ data }) => {
    return (
        <PieChart width={200} height={120}>
            <Pie
                data={data}
                cx={100}
                cy={100}
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <Label
                    value={`${data[0].value} - ${data[0].percent}%`}
                    position="center"
                    className="text-lg font-bold"
                    fill="#333"
                />
            </Pie>
        </PieChart>
    );
};