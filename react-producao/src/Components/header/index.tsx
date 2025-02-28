
import Cione from '../../../public/cioneLogoPequena.png';
import React from 'react';
import { CalendarDaysIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Sidebar } from '../sideBar'; // Ajuste o caminho conforme necessário


interface HeaderProps {
  title: string;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

const Header: React.FC<HeaderProps> = ({ title, selectedDate, setSelectedDate }) => {
  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-zinc-800 text-white p-4 flex items-center justify-between shadow-lg z-50">
      <Sidebar />
        <div className="flex items-center">
          <img src={Cione} alt="Logo" className="h-8 w-8 mr-4 ml-10" />
          <h1 className="text-2xl font-bold space-x-3">{title}</h1>
        </div>
        <div className="text-zinc-950 text-lg font-semibold flex items-center">
          <CalendarDaysIcon className="size-10 text-zinc-50 mr-2" />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            className="bg-white p-2 rounded-md cursor-pointer"
          />
        </div>
      </header>
    </>
  );
};

export default Header;
