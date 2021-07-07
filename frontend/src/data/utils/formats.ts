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

export const moneyMask = (value: string): string => {
  value = value.replace('.', '').replace(',', '').replace(/\D/g, '');

  const options = { minimumFractionDigits: 2 };
  const result = new Intl.NumberFormat('pt-BR', options).format(
    parseFloat(value) / 100,
  );

  return `R$ ${result}`;
};
