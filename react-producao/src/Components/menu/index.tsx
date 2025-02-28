import { MenuIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { menuItems } from './itensMenu';

export interface MenuProps {
  items?: { label: string; link: string }[];
}

export const Menu: React.FC<MenuProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-zinc-50 shadow-md">
      {/* Botão para abrir o menu */}
      <button
        onClick={toggleMenu}
        className="p-4 flex items-center justify-center bg-zinc-800 text-white rounded-md hover:bg-blue-600 focus:outline-none"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Menu horizontal */}
      {isOpen && (
        <div className="absolute top-14 left-0 w-full text-white py-4 z-50 shadow-lg rounded-md">
          <ul className="flex justify-center gap-8"> {/* gap-8 para espaçamento horizontal */}
            {menuItems.map((item) => (
              <li key={item.label} className="px-4"> {/* px-4 para espaçamento interno */}
                <Link
                  to={item.link}
                  className="text-lg font-semibold hover:underline hover:text-blue-800 transition"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};
