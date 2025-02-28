import { LogOut, MenuIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { menuItems } from '../menu/itensMenu';
import { useAuth } from '../../contexts/AuthContext';


export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth()


  const filteredMenuItems = menuItems.filter(item => {
    if (!user) {
      // Se o usuário não estiver autenticado, exibe apenas rotas públicas + login
      const publicRoutes = ['/PanelCione', '/PanelCornHouse', '/PanelCioneCornHouse'];
      return publicRoutes.includes(item.link) || item.link === '/login';
    }
    if (item.link === '/login') return false;
    if (user.roles.includes('Admin')) return true;
    if (item.link === '/users' && (user.roles.includes('Staff') || user.roles.includes('User'))) return false;
    if (item.link === '/logs' && (user.roles.includes('Staff') || user.roles.includes('User'))) return false;

    return true;
  });

  return (
    <>
      {/* Botão Flutuante para abrir o Menu */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-zinc-800 text-white rounded-full shadow-lg hover:bg-zinc-600 transition"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Overlay (Fundo escuro) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)} // Fecha ao clicar fora
        />
      )}

      {/* Sidebar Modal */}
      <div
        className={`fixed top-0 left-0 h-full bg-zinc-900 text-white p-4 w-64 shadow-lg z-50 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Botão de Fechar */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-400 transition"
        >
          <XIcon className="w-6 h-6" />
        </button>




        <h2 className="text-lg font-semibold mb-6">Menu</h2>

        {/* Itens do Menu */}
        <ul className="space-y-4">
          {filteredMenuItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.link}
                className="flex items-center gap-2 p-2 rounded hover:bg-blue-600 transition"
                onClick={() => setIsOpen(false)} // Fecha ao clicar
              >
                {item.icon && <item.icon className="w-6 h-6" />}
                <span>{item.label}</span>
              </Link>

            </li>
          ))}
        </ul>
        {user && (
          <ul>
            <li>
              <Link
                to={'/'}
                className="flex items-center gap-2 p-2 rounded hover:bg-blue-600 transition"
                onClick={logout}
              >
                <LogOut className="w-6 h-6" />
                <span>Sair</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </>
  );
};
