// lib/constants.ts

// ============================================
// КАТЕГОРИИ
// ============================================
export const CATEGORIES = [
  { slug: 'all', label: 'Все' },
  { slug: 'portrait', label: 'Портреты' },
  { slug: 'fantasy', label: 'Фэнтези' },
  { slug: 'anime', label: 'Аниме' },
  { slug: 'illustration', label: 'Иллюстрации' },
  { slug: '3d', label: '3D' },
  { slug: 'pixel', label: 'Пиксель-арт' },
  { slug: 'scifi', label: 'Sci-Fi' },
  { slug: 'concept', label: 'Концепт-арт' },
  { slug: 'sketch', label: 'Скетчи' },
  { slug: 'nature', label: 'Природа' },
  { slug: 'architecture', label: 'Архитектура' },
  { slug: 'other', label: 'Другое' },
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  portrait: 'Портреты',
  fantasy: 'Фэнтези',
  anime: 'Аниме',
  illustration: 'Иллюстрации',
  '3d': '3D',
  pixel: 'Пиксель-арт',
  scifi: 'Sci-Fi',
  concept: 'Концепт-арт',
  sketch: 'Скетчи',
  nature: 'Природа',
  architecture: 'Архитектура',
  other: 'Другое',
};

export function getCategoryLabel(slug: string | null | undefined): string {
  if (!slug) return 'Другое';
  return CATEGORY_LABELS[slug] || slug;
}

// ============================================
// ЦЕНЫ / БЮДЖЕТЫ
// ============================================
type ServicePriceInput = {
  price: number;
  price_type: string | null;
  price_to: number | null;
};

export function formatServicePrice(service: ServicePriceInput): string {
  if (service.price_type === 'from') {
    return `от ${service.price.toLocaleString('ru-RU')}₽`;
  }
  if (service.price_type === 'range' && service.price_to) {
    return `${service.price.toLocaleString('ru-RU')}–${service.price_to.toLocaleString('ru-RU')}₽`;
  }
  return `${service.price.toLocaleString('ru-RU')}₽`;
}

type OrderBudgetInput = {
  budget: number;
  budget_type: string | null;
  budget_to: number | null;
};

export function formatOrderBudget(order: OrderBudgetInput): string {
  if (order.budget_type === 'up_to') {
    return `до ${order.budget.toLocaleString('ru-RU')}₽`;
  }
  if (order.budget_type === 'range' && order.budget_to) {
    return `${order.budget.toLocaleString('ru-RU')}–${order.budget_to.toLocaleString('ru-RU')}₽`;
  }
  return `${order.budget.toLocaleString('ru-RU')}₽`;
}

// ============================================
// СРОКИ
// ============================================
export function formatDelivery(days: number | null | undefined): string {
  if (!days) return 'Не указан';
  if (days === 1) return '1 день';
  if (days < 5) return `${days} дня`;
  return `${days} дней`;
}

export function formatDeliveryShort(days: number | null | undefined): string | null {
  if (!days) return null;
  if (days === 1) return '1 день';
  if (days < 5) return `${days} дня`;
  return `${days} дней`;
}

// ============================================
// ВРЕМЯ
// ============================================
export function timeAgo(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'сейчас';
  if (diffMin < 60) return `${diffMin} мин`;
  if (diffH < 24) return `${diffH} ч`;
  if (diffD < 7) return `${diffD} дн`;
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
}

export function timeAgoFull(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 60) return `${diffMinutes} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays < 7) return `${diffDays} дн назад`;
  return date.toLocaleDateString('ru-RU');
}

// ============================================
// СТАТУСЫ СДЕЛОК
// ============================================
export const DEAL_STATUS_LABELS: Record<
  string,
  { label: string; color: string; description: string }
> = {
  pending: {
    label: 'Ожидает оплаты',
    color: 'yellow',
    description: 'Клиент ещё не оплатил сделку',
  },
  paid: {
    label: 'Оплачено',
    color: 'blue',
    description: 'Деньги в эскроу, художник может приступать',
  },
  in_progress: {
    label: 'В работе',
    color: 'purple',
    description: 'Художник выполняет работу',
  },
  completed: {
    label: 'Завершено',
    color: 'green',
    description: 'Заказчик подтвердил, деньги переведены художнику',
  },
  disputed: {
    label: 'Спор',
    color: 'red',
    description: 'Открыт спор, разбирается арбитраж',
  },
  cancelled: {
    label: 'Отменено',
    color: 'gray',
    description: 'Сделка отменена',
  },
};

export const DEAL_STATUS_BADGE: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  paid: 'text-blue-400 bg-blue-400/10',
  in_progress: 'text-purple-400 bg-purple-400/10',
  completed: 'text-green-400 bg-green-400/10',
  disputed: 'text-red-400 bg-red-400/10',
  cancelled: 'text-gray-400 bg-gray-400/10',
};

// ============================================
// ПРОЧЕЕ
// ============================================
export const COMMISSION_PERCENT = 5;
export const MIN_DEAL_AMOUNT = 500;

// ============================================
// ФОРМАТИРОВАНИЕ ЧИСЕЛ
// ============================================
export function formatNumber(n: number): string {
  return n.toLocaleString('ru-RU');
}