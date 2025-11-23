const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export const formatCurrency = (value = 0) => currency.format(value);

export const formatNumber = (value = 0) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value);

export const formatDate = (value?: string) => {
  if (!value) return 'NA';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

