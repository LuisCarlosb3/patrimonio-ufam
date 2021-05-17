import React from 'react';
import Home from '../../presentation/pages/Home';
import Search from '../../presentation/pages/Search';
import Report from '../../presentation/pages/Report';

interface IPage {
  id: number;
  icon: 'home' | 'search' | 'report';
  path: string;
  name: string;
  component: React.FC;
}

export const pages: IPage[] = [
  {
    id: 0,
    icon: 'home',
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    id: 1,
    icon: 'search',
    path: '/search',
    name: 'Busca Avançada',
    component: Search,
  },
  {
    id: 2,
    icon: 'report',
    path: '/report',
    name: 'Relatórios',
    component: Report,
  },
];
