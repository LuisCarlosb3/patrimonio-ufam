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

export function autoCapitalize<T>(value: T): string | T {
  const data =
    typeof value === 'string'
      ? value
          .toLowerCase()
          .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))
      : value;

  return data;
}

export function FormataStringData(data: string): string {
  if (data) {
    const dia = data.split('/')[0];
    const mes = data.split('/')[1];
    const ano = data.split('/')[2];

    // eslint-disable-next-line
    return ano + '-' + ('0' + mes).slice(-2) + '-' + ('0' + dia).slice(-2);
  }
  return '';
}
