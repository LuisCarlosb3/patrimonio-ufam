import { useAuth } from '../../data/hooks/auth';

interface IPage {
  id: number;
  icon?: 'home' | 'search' | 'report' | 'user' | 'document';
  path: string; // route
  name: string; // name in sidebar
  nav: boolean; // show in Sidebar
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
    },
    {
      id: 1,
      icon: 'search',
      path: '/search',
      name: 'Busca Avançada',
      nav: true,
    },
    {
      id: 2,
      icon: 'report',
      path: '/report',
      name: 'Relatórios',
      nav: false,
    },
    {
      id: 3,
      icon: 'user',
      path: '/users',
      name: 'Usuários',
      nav: user?.permission === 2,
    },
    {
      id: 4,
      icon: 'document',
      path: '/patrimony',
      name: 'Patrimonio',
      nav: true,
    },
  ];

  return pages;
};

export default useSidebarRoutes;
