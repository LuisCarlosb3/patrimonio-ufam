import moment from 'moment';

export const formatCurrency = (value: string): string => {
  return parseFloat(value).toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const formatDate = (date: string): string => {
  return moment(new Date(date)).format('DD/MM/YYYY');
};
