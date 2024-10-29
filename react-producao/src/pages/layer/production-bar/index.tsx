import React from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ProductionChartProps } from '../interfaces';





export const ProductionChart: React.FC<ProductionChartProps> = ({ data }) => {
  const getPath = (x: any, y: any, width: any, height: any) => (
    `M${x},${y + height}
     C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
     C${x + width / 2},${y + height / 3} ${x + 2 * width / 3},${y + height} ${x + width}, ${y + height}
     Z`
  );

  const TriangleBar = (props: any) => {
    const {
      fill, x, y, width, height,
    } = props;

    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

  return (
    <div className='font-semibold text-sm' >
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data} margin={{ top: 50, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="Dias" allowDataOverflow={false} />
          <YAxis domain={[0, 'dataMax + 200']} />
          <Tooltip wrapperStyle={{ width: 120, backgroundColor: '#ccc' }} />
          <Bar dataKey="Total" fill="#82ca9d" shape={<TriangleBar />}>
            <LabelList dataKey="Total" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
};

