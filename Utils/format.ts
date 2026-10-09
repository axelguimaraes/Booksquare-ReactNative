const priceFormatter = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });

// 8.5 -> "8,50 €"
export const formatPrice = (value: number | null | undefined): string =>
  value == null || Number.isNaN(value) ? '' : priceFormatter.format(value);

// -> "9 de outubro de 2026"
export const formatDate = (date: Date | string | number): string =>
  new Date(date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });

// Parses a price typed with either a comma or a dot as decimal separator ("7,5" -> 7.5).
export const parsePrice = (text: string): number | null => {
  const value = Number.parseFloat(text.replace(',', '.'));
  return Number.isFinite(value) ? value : null;
};

// Keeps only digits and one decimal separator with up to two decimals, for price inputs.
export const sanitizePriceInput = (text: string): string => {
  const [whole, ...rest] = text.replace(/[^0-9.,]/g, '').replace(/\./g, ',').split(',');
  const decimals = rest.join('').slice(0, 2);
  const cleanWhole = whole.replace(/^0+(?=\d)/, '');
  return rest.length > 0 ? `${cleanWhole || '0'},${decimals}` : cleanWhole;
};

// Search compares text without case or accents ("ficcao" matches "Ficção").
export const normalizeText = (text: string): string =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
