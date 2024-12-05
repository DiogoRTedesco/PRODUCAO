import { MenuIcon } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface MenuProps {
  items: { label: string; link: string }[];
}

export const Menu: React.FC<MenuProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-zinc-50">
      <button onClick={toggleMenu} className="p-4">
      <MenuIcon className='w-6 h-6'/>
      </button>
      {isOpen && (
        <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? '0%' : '-100%' }}
        transition={{ duration: 0.3 }}
        className="absolute top-14 left-3 w-full bg-gray-800 text-white z-50"
        >
          <ul className="space-y-8 space-x-8 p-6">
            {items.map((item) => (
              <li key={item.label}>
                <Link to={item.link} 
                className="text-white hover:underline "
                onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

