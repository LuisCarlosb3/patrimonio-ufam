import { useAuth } from '../../data/hooks/auth';

export interface IPage {
  id: number;
  icon?: 'home' | 'search' | 'report' | 'user' | 'document';
  path: string; // route
  name: string; // name in sidebar
  nav: boolean; // show in Sidebar
  block: boolean;
}

const useSidebarRoutes = (): IPage[] => {
  const { user } = useAuth();

  const pages: IPage[] = [
    {
      id: 0,
      icon: 'home',
      path: '/home',
      name: 'Home',
      nav: true,
      block: false,
    },
    {
      id: 1,
      icon: 'search',
      path: '/search',
      name: 'Busca Avançada',
      nav: true,
      block: true,
    },
    {
      id: 2,
      icon: 'report',
      path: '/report',
      name: 'Relatórios',
      nav: true,
      block: true,
    },
    {
      id: 3,
      icon: 'user',
      path: '/users',
      name: 'Usuários',
      nav: user?.permission === 2,
      block: false,
    },
    {
      id: 4,
      icon: 'document',
      path: '/patrimony',
      name: 'Patrimonio',
      nav: true,
      block: false,
    },
  ];

  return pages;
};

export default useSidebarRoutes;
