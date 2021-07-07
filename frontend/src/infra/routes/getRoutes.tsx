interface IPage {
  id: number;
  icon?: 'home' | 'search' | 'report' | 'user' | 'document';
  path: string; // route
  name: string; // name in sidebar
  nav: boolean; // show in Sidebar
}

export const pages: IPage[] = [
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
    nav: true,
  },
  {
    id: 4,
    icon: 'document',
    path: '/patrimony',
    name: 'Patrimonio',
    nav: true,
  },
];
