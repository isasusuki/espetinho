export interface VendorProfile {
  name: string;
  phone: string; // e.g. "5511999998888"
  pixKey: string;
  pixType: 'telefone' | 'cpf' | 'cnpj' | 'email' | 'aleatoria';
  pinCode: string; // Senha de acesso do vendedor (padrão "1234")
}

export interface ProductItem {
  id: string | number;
  name: string;
  cost: number; // Custo de aquisição (ex: R$ 5,00 para espetinho)
  price: number; // Preço de venda (ex: R$ 10,00 ou R$ 8,00)
  category?: 'Espetinhos' | 'Bebidas' | 'Acompanhamentos' | 'Outros';
  icon?: string;
}

export interface CustomerItem {
  id: string;
  name: string;
  emoji: string;
  phone?: string;
}

export interface OrderItem {
  productId: string | number;
  quantity: number;
}

export interface PaymentRecord {
  id: number;
  customerName: string;
  dateStr: string;
  amount: number;
  paymentMethod: 'Pix' | 'Dinheiro' | 'Cartao';
  notes?: string;
}

export interface SaleBatch {
  id: string;
  period: string; // e.g., "Início / Pré-jogo", "Intervalo 1º Tempo", "2º Tempo", "Final / Pós-jogo"
  priceType: 10 | 8;
  quantity: number;
  timeNote?: string;
}

export interface ExpenseItem {
  id: string;
  category: 'Mercadoria' | 'Carvão & Fogo' | 'Acompanhamentos' | 'Embalagens' | 'Taxa do Campo' | 'Transporte' | 'Outros';
  description: string;
  amount: number;
}

export interface FiadoRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  saleDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: 'Pendente' | 'Pago';
  paidDate?: string;
  notes?: string;
  eventName?: string;
}

export interface CashCount {
  cash: number; // Dinheiro físico
  pix: number; // Pix recebido
  card: number; // Cartão débito/crédito
}

export interface EventSession {
  id: string;
  eventName: string;
  date: string; // YYYY-MM-DD
  location: string;
  purchasedSkewersQty: number; // Qtd comprada @ R$ 5,00
  expenses: ExpenseItem[];
  sales: SaleBatch[];
  cashCount: CashCount;
  fiados: FiadoRecord[];
  createdAt: number;
}
