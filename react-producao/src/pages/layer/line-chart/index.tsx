import React from 'react';
import {
    CartesianGrid,
    LabelList,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { ProductionChartProps } from '../interfaces';



export const LimeChart: React.FC<ProductionChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={500}>
            <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Dias" />
                <YAxis domain={[0, 'dataMax + 100']}/>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line type="monotone" dataKey="Total" name="Total Produzido" stroke="#8884d8"
                    dot={{ stroke: 'red', strokeWidth: 2, fill: 'red' }}>
                    <LabelList dataKey="Total" position="top" formatter={(value: any) => `${value}%`} />
                </Line>
            </LineChart>
        </ResponsiveContainer>
    );
};