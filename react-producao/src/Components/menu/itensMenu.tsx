import { MenuSquare, Ticket, Nut, Popcorn, User, LogIn, LogsIcon } from "lucide-react";

export const menuItems = [
  { label: 'Painel Cione', link: '/PanelCione', icon: Nut }, //Rota sem autenticação
  { label: 'Painel Corn House', link: '/PanelCornHouse', icon: Popcorn },//Rota sem autenticação
  { label: 'Painel Total de Produção', link: '/PanelCioneCornHouse', icon: MenuSquare },//Rota sem autenticação
  { label: 'Painel Embalagem', link: '/Rateio', icon: Ticket },
  { label: 'Usuarios', link: '/users', icon: User },
  { label: 'Login', link: '/login', icon: LogIn }, // Sempre visível para não autenticados
  { label: 'Logs', link: '/logs', icon: LogsIcon }


];