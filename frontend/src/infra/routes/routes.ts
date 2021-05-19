import React from 'react';
import Home from '../../presentation/pages/Home';
import Search from '../../presentation/pages/Search';
import Report from '../../presentation/pages/Report';

interface IPage {
  id: number;
  icon?: 'home' | 'search' | 'report';
  path: string; // route
  name: string; // name in sidebar
  component: React.FC;
  isPrivate?: boolean; // show only authorized users
  nav: boolean; // show in Sidebar
}

export const pages: IPage[] = [
  {
    id: 0,
    icon: 'home',
    path: '/',
    name: 'Home',
    component: Home,
    isPrivate: false,
    nav: true,
  },
  {
    id: 1,
    icon: 'search',
    path: '/search',
    name: 'Busca Avançada',
    component: Search,
    isPrivate: false,
    nav: true,
  },
  {
    id: 2,
    icon: 'report',
    path: '/report',
    name: 'Relatórios',
    component: Report,
    isPrivate: false,
    nav: false,
  },
];
