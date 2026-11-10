import { 
  EventSession, 
  VendorProfile, 
  FiadoRecord, 
  ProductItem, 
  CustomerItem, 
  PaymentRecord 
} from './types';

export const SKEWER_PURCHASE_COST = 5.00;

export const DEFAULT_VENDOR: VendorProfile = {
  name: 'Seu Zé do Espetinho',
  phone: '5511999998888',
  pixKey: '11999998888',
  pixType: 'telefone',
  pinCode: '1234', // Senha padrão para acesso do vendedor
};

export const DEFAULT_CUSTOMERS: CustomerItem[] = [
  { id: '1', name: 'Marcão Zagueiro', emoji: '⚽', phone: '5511987654321' },
  { id: '2', name: 'Beto Técnico', emoji: '🧢', phone: '5511977776666' },
  { id: '3', name: 'Renato Árbitro', emoji: '🟨', phone: '5511966665555' },
  { id: '4', name: 'Brunão Volante', emoji: '🍻', phone: '5511955554444' },
  { id: '5', name: 'Paulinho Camisa 10', emoji: '🔥', phone: '5511944443333' },
  { id: '6', name: 'Dona Sônia da Torcida', emoji: '👵', phone: '5511933332222' },
];

export const DEFAULT_PRODUCTS: ProductItem[] = [
  { id: 'prod-espeto-10', name: 'Espetinho (Padrão)', cost: 5.00, price: 10.00, category: 'Espetinhos', icon: '🍢' },
  { id: 'prod-espeto-8', name: 'Espetinho (Promocional)', cost: 5.00, price: 8.00, category: 'Espetinhos', icon: '🏷️' },
  { id: 'prod-pao-alho', name: 'Pão de Alho Especial', cost: 3.50, price: 8.00, category: 'Acompanhamentos', icon: '🥖' },
  { id: 'prod-cerveja', name: 'Cerveja Lata Gelada', cost: 2.80, price: 6.00, category: 'Bebidas', icon: '🍺' },
  { id: 'prod-refri', name: 'Refrigerante Lata', cost: 2.20, price: 5.00, category: 'Bebidas', icon: '🥤' },
  { id: 'prod-agua', name: 'Água Mineral 500ml', cost: 1.20, price: 3.50, category: 'Bebidas', icon: '💧' },
];

const STORAGE_KEY_VENDOR = 'espetinho_vendor_profile';
const STORAGE_KEY_SESSIONS = 'espetinho_event_sessions';
const STORAGE_KEY_CURRENT_ID = 'espetinho_current_session_id';
const STORAGE_KEY_CUSTOMERS = 'espetinho_customers_list';
const STORAGE_KEY_PRODUCTS = 'espetinho_products_list';
const STORAGE_KEY_PAYMENTS = 'espetinho_payments_history';
const STORAGE_KEY_AUTH = 'espetinho_is_logged_in';

export const INITIAL_SAMPLE_SESSION: EventSession = {
  id: 'session-final-copa-varzea',
  eventName: 'Copa Regional dos Campeões - Grande Final',
  date: new Date().toISOString().slice(0, 10),
  location: 'Campo do Estrela da Colina',
  purchasedSkewersQty: 250, // 250 espetinhos comprados @ R$ 5,00 = R$ 1.250,00
  expenses: [
    { id: 'exp-1', category: 'Carvão & Fogo', description: '3 sacos de carvão vegetal 10kg', amount: 90.00 },
    { id: 'exp-2', category: 'Acompanhamentos', description: 'Pães franceses, farofa temperada e molho vinagrete', amount: 85.00 },
    { id: 'exp-3', category: 'Embalagens', description: 'Guardanapos, pratinhos e papel alumínio', amount: 35.00 },
    { id: 'exp-4', category: 'Taxa do Campo', description: 'Taxa da comissão organizadora do torneio', amount: 80.00 },
    { id: 'exp-5', category: 'Transporte', description: 'Combustível carroça / frete do freezer', amount: 50.00 },
  ],
  sales: [
    { id: 'sale-1', period: 'Início / 1º Tempo dos Jogos', priceType: 10, quantity: 95, timeNote: '11:00 às 13:30' },
    { id: 'sale-2', period: 'Intervalo & Decisão das Semis', priceType: 10, quantity: 80, timeNote: '13:30 às 15:30' },
    { id: 'sale-3', period: 'Final do Jogo / Promoção de Saideira', priceType: 8, quantity: 45, timeNote: '16:00 às 17:30' },
  ],
  cashCount: {
    cash: 850.00,
    pix: 1020.00,
    card: 240.00,
  }, // Total conferido = 2.110,00
  fiados: [
    {
      id: 'fiado-1',
      customerName: 'Marcão Zagueiro',
      customerPhone: '5511987654321',
      saleDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
      quantity: 4,
      unitPrice: 10,
      totalAmount: 40.00,
      status: 'Pendente',
      notes: 'Comeu no intervalo com refrigerante',
    },
    {
      id: 'fiado-2',
      customerName: 'Beto Técnico',
      customerPhone: '5511977776666',
      saleDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10),
      quantity: 5,
      unitPrice: 10,
      totalAmount: 50.00,
      status: 'Pendente',
      notes: 'Pediu para pagar no próximo treino de quinta',
    },
    {
      id: 'fiado-3',
      customerName: 'Renato Árbitro',
      customerPhone: '5511966665555',
      saleDate: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
      dueDate: new Date(Date.now() - 86400000 * 1).toISOString().slice(0, 10),
      quantity: 2,
      unitPrice: 8,
      totalAmount: 16.00,
      status: 'Pago',
      paidDate: new Date().toISOString().slice(0, 10),
      notes: 'Transferiu via Pix direto para o vendedor',
    },
  ],
  createdAt: Date.now(),
};

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 1,
    customerName: 'Renato Árbitro',
    dateStr: new Date().toLocaleDateString('pt-BR'),
    amount: 16.00,
    paymentMethod: 'Pix',
    notes: 'Quitação de 2 espetinhos promocionais',
  },
  {
    id: 2,
    customerName: 'Brunão Volante',
    dateStr: new Date(Date.now() - 86400000).toLocaleDateString('pt-BR'),
    amount: 30.00,
    paymentMethod: 'Dinheiro',
    notes: 'Acerto de domingo passado em mãos',
  },
];

export function loadVendorProfile(): VendorProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VENDOR);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_VENDOR,
        ...parsed,
        pinCode: parsed.pinCode || DEFAULT_VENDOR.pinCode,
      };
    }
  } catch (e) {
    console.error('Erro ao ler perfil do vendedor', e);
  }
  return DEFAULT_VENDOR;
}

export function saveVendorProfile(profile: VendorProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_VENDOR, JSON.stringify(profile));
  } catch (e) {
    console.error('Erro ao salvar perfil do vendedor', e);
  }
}

export function loadSessions(): EventSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Erro ao ler sessões salvas', e);
  }
  return [INITIAL_SAMPLE_SESSION];
}

export function saveSessions(sessions: EventSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Erro ao salvar sessões', e);
  }
}

export function loadCurrentSessionId(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENT_ID);
    if (saved) return saved;
  } catch (e) {
    console.error('Erro ao ler id da sessão atual', e);
  }
  return INITIAL_SAMPLE_SESSION.id;
}

export function saveCurrentSessionId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT_ID, id);
  } catch (e) {
    console.error('Erro ao salvar id da sessão atual', e);
  }
}

export function loadCustomers(): CustomerItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Erro ao ler clientes', e);
  }
  return DEFAULT_CUSTOMERS;
}

export function saveCustomers(customers: CustomerItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(customers));
  } catch (e) {
    console.error('Erro ao salvar clientes', e);
  }
}

export function loadProducts(): ProductItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Erro ao ler produtos', e);
  }
  return DEFAULT_PRODUCTS;
}

export function saveProducts(products: ProductItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Erro ao salvar produtos', e);
  }
}

export function loadPayments(): PaymentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PAYMENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Erro ao ler pagamentos', e);
  }
  return INITIAL_PAYMENTS;
}

export function savePayments(payments: PaymentRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(payments));
  } catch (e) {
    console.error('Erro ao salvar pagamentos', e);
  }
}

export function loadAuthStatus(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  } catch {
    return false;
  }
}

export function saveAuthStatus(status: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_AUTH, status ? 'true' : 'false');
  } catch (e) {
    console.error('Erro ao salvar autenticação', e);
  }
}

// Formatters
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value || 0);
}

export function formatDateBr(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export function cleanPhone(phone: string): string {
  return (phone || '').replace(/\D/g, '');
}

export function generateWhatsAppLink(phone: string, message?: string): string {
  let cleaned = cleanPhone(phone);
  if (cleaned.length === 10 || cleaned.length === 11) {
    cleaned = '55' + cleaned;
  }
  const base = `https://wa.me/${cleaned}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}

// Financial calculations
export interface FinancialSummary {
  skewerGoodsCost: number;
  otherExpensesCost: number;
  totalCost: number;
  salesQtyR10: number;
  salesTotalR10: number;
  salesQtyR8: number;
  salesTotalR8: number;
  theoreticalRegisteredSales: number;
  cashRegisterTotal: number;
  totalFiadoPending: number;
  totalFiadoPaid: number;
  totalFiadoAll: number;
  pendingFiadoCount: number;
  realizedNetProfit: number;
  projectedTotalProfit: number;
  cashDifference: number;
  cashDifferenceStatus: 'ok' | 'surplus' | 'shortage';
  totalSkewersSoldDirect: number;
  totalSkewersSoldFiado: number;
  totalSkewersSold: number;
  remainingSkewersStock: number;
  realizedMarginPercent: number;
}

export function calculateFinancialSummary(session: EventSession): FinancialSummary {
  const skewerGoodsCost = (session.purchasedSkewersQty || 0) * SKEWER_PURCHASE_COST;
  const otherExpensesCost = (session.expenses || []).reduce((acc, exp) => acc + (exp.amount || 0), 0);
  const totalCost = skewerGoodsCost + otherExpensesCost;

  let salesQtyR10 = 0;
  let salesQtyR8 = 0;
  (session.sales || []).forEach(sale => {
    if (sale.priceType === 10) {
      salesQtyR10 += sale.quantity || 0;
    } else {
      salesQtyR8 += sale.quantity || 0;
    }
  });

  const salesTotalR10 = salesQtyR10 * 10;
  const salesTotalR8 = salesQtyR8 * 8;
  const theoreticalRegisteredSales = salesTotalR10 + salesTotalR8;

  const cashRegisterTotal = (session.cashCount?.cash || 0) + (session.cashCount?.pix || 0) + (session.cashCount?.card || 0);

  let totalFiadoPending = 0;
  let totalFiadoPaid = 0;
  let pendingFiadoCount = 0;
  let fiadoQty = 0;

  (session.fiados || []).forEach(fiado => {
    fiadoQty += fiado.quantity || 0;
    if (fiado.status === 'Pendente') {
      totalFiadoPending += fiado.totalAmount || 0;
      pendingFiadoCount += 1;
    } else {
      totalFiadoPaid += fiado.totalAmount || 0;
    }
  });

  const totalFiadoAll = totalFiadoPending + totalFiadoPaid;

  const realizedNetProfit = cashRegisterTotal - totalCost;
  const projectedTotalProfit = (cashRegisterTotal + totalFiadoPending) - totalCost;

  const cashDifference = cashRegisterTotal - theoreticalRegisteredSales;
  let cashDifferenceStatus: 'ok' | 'surplus' | 'shortage' = 'ok';
  if (Math.abs(cashDifference) < 0.01) {
    cashDifferenceStatus = 'ok';
  } else if (cashDifference > 0) {
    cashDifferenceStatus = 'surplus';
  } else {
    cashDifferenceStatus = 'shortage';
  }

  const totalSkewersSoldDirect = salesQtyR10 + salesQtyR8;
  const totalSkewersSoldFiado = fiadoQty;
  const totalSkewersSold = totalSkewersSoldDirect + totalSkewersSoldFiado;
  const remainingSkewersStock = (session.purchasedSkewersQty || 0) - totalSkewersSold;

  const realizedMarginPercent = cashRegisterTotal > 0 ? (realizedNetProfit / cashRegisterTotal) * 100 : 0;

  return {
    skewerGoodsCost,
    otherExpensesCost,
    totalCost,
    salesQtyR10,
    salesTotalR10,
    salesQtyR8,
    salesTotalR8,
    theoreticalRegisteredSales,
    cashRegisterTotal,
    totalFiadoPending,
    totalFiadoPaid,
    totalFiadoAll,
    pendingFiadoCount,
    realizedNetProfit,
    projectedTotalProfit,
    cashDifference,
    cashDifferenceStatus,
    totalSkewersSoldDirect,
    totalSkewersSoldFiado,
    totalSkewersSold,
    remainingSkewersStock,
    realizedMarginPercent,
  };
}
