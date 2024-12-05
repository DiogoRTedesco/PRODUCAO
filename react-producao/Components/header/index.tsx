import { CalendarDaysIcon } from 'lucide-react';
import React from 'react';
import DatePicker from 'react-datepicker';
import Cione from '../../public/cioneLogoPequena.png';
import { Menu } from '../menu'; // Certifique-se do caminho correto

export const Header: React.FC = () => {
  return (
    <header className="bg-zinc-800 text-white p-4 flex items-center justify-between">
    <div className='flex items-center space-x-9'>
        <img src={Cione} alt="Logo" className="h-8 w-8 mr-4" />

        <h1 className="text-2xl font-bold ">Painel Cione de Produção</h1>
        <Menu items={[
           { label: 'Painel Cione  ', link: '/' },
           { label: 'Painel Corn House  ', link: '/PanelCornHouse' },
           { label: 'Painel - Cione x Corn House', link: '/cionecornhouse' },
            // Adicione mais itens conforme necessário
        ]} />
    </div>
    <div className='text-zinc-950 text-lg font-semibold flex'>
        <CalendarDaysIcon className='size-10 text-zinc-50' />
        <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            className="bg-white p-2 rounded-md cursor-pointer"

        />
    </div>
</header>
  );
};
