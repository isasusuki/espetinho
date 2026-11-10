import React, { useState } from 'react';
import { 
  CustomerItem, 
  ProductItem, 
  EventSession, 
  VendorProfile, 
  FiadoRecord, 
  PaymentRecord 
} from '../types';
import { 
  formatCurrency, 
  formatDateBr, 
  generateWhatsAppLink 
} from '../storage';
import { 
  PlusCircle, 
  Share2, 
  RotateCcw, 
  CheckCircle2, 
  User, 
  Calendar, 
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';

interface ComandasManagerProps {
  session: EventSession;
  vendor: VendorProfile;
  customers: CustomerItem[];
  products: ProductItem[];
  payments: PaymentRecord[];
  onUpdateSession: (updated: EventSession) => void;
  onAddPayment: (payment: PaymentRecord) => void;
}

export const ComandasManager: React.FC<ComandasManagerProps> = ({
  session,
  vendor,
  customers,
  products,
  payments,
  onUpdateSession,
  onAddPayment,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [eventDate, setEventDate] = useState<string>(session.date || new Date().toISOString().slice(0, 10));
  const [currentOrder, setCurrentOrder] = useState<{ [productId: string]: number }>({});
  const [copiedZap, setCopiedZap] = useState(false);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  // Obter fiados pendentes deste cliente específico
  const customerFiados = session.fiados.filter(
    (f) => f.customerName.toLowerCase() === selectedCustomer?.name.toLowerCase()
  );

  const customerPendingFiados = customerFiados.filter((f) => f.status === 'Pendente');
  const customerTotalPending = customerPendingFiados.reduce((acc, f) => acc + (f.totalAmount || 0), 0);

  // Calcular total da comanda em aberto no momento
  const currentOrderTotal = Object.entries(currentOrder).reduce((acc, [prodId, qty]) => {
    const prod = products.find((p) => String(p.id) === String(prodId));
    return acc + (prod ? prod.price * qty : 0);
  }, 0);

  const handleAddProduct = (productId: string | number) => {
    const key = String(productId);
    setCurrentOrder((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + 1,
    }));
  };

  const handleAlterQty = (productId: string | number, delta: number) => {
    const key = String(productId);
    setCurrentOrder((prev) => {
      const nextQty = (prev[key] || 0) + delta;
      if (nextQty <= 0) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return { ...prev, [key]: nextQty };
    });
  };

  const handleClearCurrentOrder = () => {
    setCurrentOrder({});
  };

  // 1. Lançar na Conta do Cliente (Venda Fiada)
  const handleLancarNaConta = () => {
    if (currentOrderTotal <= 0) {
      alert('Selecione ao menos um produto antes de lançar!');
      return;
    }

    let itemsDescription: string[] = [];
    let totalSkewers = 0;

    Object.entries(currentOrder).forEach(([prodId, qty]) => {
      const prod = products.find((p) => String(p.id) === String(prodId));
      if (prod) {
        itemsDescription.push(`${qty}x ${prod.name}`);
        if (prod.category === 'Espetinhos' || prod.name.toLowerCase().includes('espeto')) {
          totalSkewers += qty;
        }
      }
    });

    const newFiado: FiadoRecord = {
      id: `fiado-${Date.now()}`,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone || '',
      saleDate: eventDate,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
      quantity: totalSkewers || 1,
      unitPrice: totalSkewers > 0 ? currentOrderTotal / totalSkewers : currentOrderTotal,
      totalAmount: currentOrderTotal,
      status: 'Pendente',
      notes: itemsDescription.join(', '),
      eventName: session.eventName,
    };

    onUpdateSession({
      ...session,
      fiados: [newFiado, ...session.fiados],
    });

    setCurrentOrder({});
    alert(`Lançado ${formatCurrency(currentOrderTotal)} na conta de ${selectedCustomer.name}!`);
  };

  // 2. Receber Pagamento Imediato (Pix / Dinheiro / Cartão)
  const handleReceberPagamento = (meio: 'Pix' | 'Dinheiro' | 'Cartao') => {
    const amountToPay = currentOrderTotal > 0 ? currentOrderTotal : customerTotalPending;

    if (amountToPay <= 0) {
      alert('Nenhum valor a pagar no momento (comanda e débitos estão zerados)!');
      return;
    }

    const valorStr = prompt(
      `Recebimento de ${selectedCustomer.name} via ${meio}:\nDigite o valor pago:`,
      amountToPay.toFixed(2)
    );

    const valorPago = parseFloat(valorStr || '0');
    if (!valorPago || isNaN(valorPago) || valorPago <= 0) return;

    // Se estiver pagando a comanda do momento
    if (currentOrderTotal > 0) {
      // Registrar no caixa do dia
      const updatedCashCount = {
        ...session.cashCount,
        [meio === 'Dinheiro' ? 'cash' : meio === 'Pix' ? 'pix' : 'card']:
          (session.cashCount[meio === 'Dinheiro' ? 'cash' : meio === 'Pix' ? 'pix' : 'card'] || 0) + valorPago,
      };

      // Adicionar à lista de pagamentos
      onAddPayment({
        id: Date.now(),
        customerName: selectedCustomer.name,
        dateStr: new Date().toLocaleDateString('pt-BR'),
        amount: valorPago,
        paymentMethod: meio,
        notes: `Comanda de ${selectedCustomer.name} no evento ${formatDateBr(eventDate)}`,
      });

      onUpdateSession({
        ...session,
        cashCount: updatedCashCount,
      });

      setCurrentOrder({});
      alert(`Pagamento de ${formatCurrency(valorPago)} via ${meio} recebido e lançado no caixa com sucesso!`);
    } else {
      // Baixar fiados pendentes do cliente
      let restante = valorPago;
      const updatedFiados = session.fiados.map((f) => {
        if (f.customerName.toLowerCase() === selectedCustomer.name.toLowerCase() && f.status === 'Pendente' && restante > 0) {
          if (restante >= f.totalAmount) {
            restante -= f.totalAmount;
            return {
              ...f,
              status: 'Pago' as const,
              paidDate: new Date().toISOString().slice(0, 10),
            };
          }
        }
        return f;
      });

      const updatedCashCount = {
        ...session.cashCount,
        [meio === 'Dinheiro' ? 'cash' : meio === 'Pix' ? 'pix' : 'card']:
          (session.cashCount[meio === 'Dinheiro' ? 'cash' : meio === 'Pix' ? 'pix' : 'card'] || 0) + valorPago,
      };

      onAddPayment({
        id: Date.now(),
        customerName: selectedCustomer.name,
        dateStr: new Date().toLocaleDateString('pt-BR'),
        amount: valorPago,
        paymentMethod: meio,
        notes: `Quitação de débitos fiados de ${selectedCustomer.name}`,
      });

      onUpdateSession({
        ...session,
        fiados: updatedFiados,
        cashCount: updatedCashCount,
      });

      alert(`Quitação de ${formatCurrency(valorPago)} recebida via ${meio} e registrada no caixa!`);
    }
  };

  // 3. Copiar Extrato para WhatsApp
  const handleCopiarExtratoZap = () => {
    let text = `*EXTRATO DE CONSUMO - ESPETINHO DO FUTEBOL*\n`;
    text += `👤 *Amigo(a):* ${selectedCustomer.name}\n`;
    text += `🏟️ *Evento:* ${session.eventName} (${formatDateBr(eventDate)})\n`;
    text += `----------------------------------------\n`;

    if (currentOrderTotal > 0) {
      text += `🍢 *Consumo do Dia:*\n`;
      Object.entries(currentOrder).forEach(([prodId, qty]) => {
        const prod = products.find((p) => String(p.id) === String(prodId));
        if (prod) {
          text += `• ${qty}x ${prod.name}: ${formatCurrency(prod.price * qty)}\n`;
        }
      });
      text += `👉 *Subtotal do Dia:* ${formatCurrency(currentOrderTotal)}\n\n`;
    }

    if (customerTotalPending > 0) {
      text += `📋 *Débitos Anteriores Pendentes:*\n`;
      customerPendingFiados.forEach((f) => {
        text += `• ${formatDateBr(f.saleDate)}: ${f.notes || `${f.quantity} espetos`} - ${formatCurrency(f.totalAmount)}\n`;
      });
      text += `👉 *Total Pendente Acumulado:* ${formatCurrency(customerTotalPending)}\n\n`;
    }

    const totalGeral = currentOrderTotal + customerTotalPending;
    text += `💰 *SALDO TOTAL A ACERTAR:* ${formatCurrency(totalGeral)}\n\n`;
    text += `🔑 *Chave Pix do Vendedor:* ${vendor.pixKey} (${vendor.name})\n`;
    text += `⚠️ *Aviso:* Pagamentos devem ser confirmados diretamente com o vendedor!\n`;
    text += `📱 WhatsApp direto: wa.me/${vendor.phone}`;

    navigator.clipboard.writeText(text);
    setCopiedZap(true);
    setTimeout(() => setCopiedZap(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* PAINEL ESQUERDO: SELEÇÃO DE CLIENTE E PRODUTOS (7 colunas) */}
      <div className="lg:col-span-7 bg-white rounded-xl shadow-xs border border-stone-200 flex flex-col overflow-hidden">
        {/* Topo do Painel: Data & Clientes */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 space-y-3">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              1. Data do Jogo / Evento
            </label>
            <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-lg px-2.5 py-1">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="text-xs font-bold text-stone-900 outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              2. Selecione o Amigo / Cliente
            </span>
            <span className="text-[11px] text-stone-400">Toque para abrir a comanda</span>
          </div>

          {/* Grid de Clientes com Emojis */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
            {customers.map((c) => {
              const isSelected = c.id === selectedCustomerId;
              const pendingFiados = session.fiados.filter(
                (f) => f.customerName.toLowerCase() === c.name.toLowerCase() && f.status === 'Pendente'
              );
              const totalPending = pendingFiados.reduce((acc, f) => acc + (f.totalAmount || 0), 0);

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCustomerId(c.id)}
                  className={`p-2.5 rounded-xl border-2 flex items-center gap-2.5 transition-all text-left ${
                    isSelected
                      ? 'bg-amber-50 border-amber-500 shadow-xs ring-2 ring-amber-200'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className="text-2xl shrink-0">{c.emoji || '👤'}</span>
                  <div className="overflow-hidden w-full">
                    <p className="font-bold text-stone-900 text-xs truncate">{c.name}</p>
                    {totalPending > 0 ? (
                      <span className="inline-block px-1.5 py-0.5 bg-rose-600 text-white font-mono font-bold text-[9px] rounded-md">
                        {formatCurrency(totalPending)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-700 font-semibold">Quitado</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Grade de Produtos / Consumo Rápido */}
        <div className="p-4 flex-1 bg-white">
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              3. Marcar Consumo (Toque no Card p/ Adicionar)
            </label>
            <span className="text-[11px] text-amber-800 font-semibold">
              Espeto Padrão R$ 10 / Promo R$ 8
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {products.map((p) => {
              const qtyInOrder = currentOrder[String(p.id)] || 0;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleAddProduct(p.id)}
                  className={`p-3 border rounded-xl flex flex-col justify-between items-start transition-all relative text-left ${
                    qtyInOrder > 0
                      ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                      : 'border-stone-200 bg-stone-50/50 hover:border-amber-400 hover:bg-stone-50'
                  }`}
                >
                  {qtyInOrder > 0 && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-amber-600 text-white font-mono font-bold text-[10px] rounded-full">
                      {qtyInOrder}x
                    </span>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{p.icon || '🍢'}</span>
                    <span className="font-semibold text-stone-900 text-xs line-clamp-1">{p.name}</span>
                  </div>
                  <div className="flex justify-between items-center w-full mt-2">
                    <span className="text-amber-700 font-mono font-bold text-xs">
                      {formatCurrency(p.price)}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Custo: {formatCurrency(p.cost)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PAINEL DIREITO: COMANDA DO AMIGO & AÇÕES DE PAGAMENTO (5 colunas) */}
      <div className="lg:col-span-5 bg-white rounded-xl shadow-xs border border-stone-200 flex flex-col overflow-hidden">
        {/* Cabeçalho da Comanda */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <span className="text-xl">{selectedCustomer?.emoji || '👤'}</span>
              <span>{selectedCustomer?.name || 'Selecione um amigo'}</span>
            </p>
            <p className={`text-xs font-bold mt-0.5 font-mono ${
              customerTotalPending > 0 ? 'text-rose-700' : 'text-emerald-700'
            }`}>
              {customerTotalPending > 0
                ? `Saldo Fiado Anterior: ${formatCurrency(customerTotalPending)}`
                : 'Nenhum fiado acumulado'}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopiarExtratoZap}
              className="text-xs text-emerald-800 font-bold px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1 transition-colors"
              title="Copiar extrato para colar no WhatsApp"
            >
              {copiedZap ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{copiedZap ? 'Copiado!' : 'Zap'}</span>
            </button>
            <button
              onClick={handleClearCurrentOrder}
              className="text-xs text-stone-600 font-bold px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors"
              title="Limpar comanda atual"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Corpo da Comanda: Itens do Evento Atual */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-96">
          <div>
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-2">
              Marcando no Evento ({formatDateBr(eventDate)}):
            </span>

            {Object.keys(currentOrder).length === 0 ? (
              <p className="text-stone-400 text-xs italic py-2">
                Nenhum item selecionado nesta data. Toque nos produtos ao lado para adicionar.
              </p>
            ) : (
              <div className="space-y-1.5">
                {Object.entries(currentOrder).map(([prodId, qty]) => {
                  const prod = products.find((p) => String(p.id) === String(prodId));
                  if (!prod) return null;
                  const subtotal = prod.price * qty;

                  return (
                    <div
                      key={prodId}
                      className="flex justify-between items-center p-2 bg-amber-50/70 rounded-lg border border-amber-200 text-xs"
                    >
                      <span className="font-semibold text-stone-900">
                        {qty}x {prod.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-900">
                          {formatCurrency(subtotal)}
                        </span>
                        <div className="inline-flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleAlterQty(prodId, -1)}
                            className="w-5 h-5 bg-white border border-stone-300 text-stone-700 font-bold rounded flex items-center justify-center hover:bg-stone-100"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAlterQty(prodId, 1)}
                            className="w-5 h-5 bg-amber-500 text-white font-bold rounded flex items-center justify-center hover:bg-amber-600"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <hr className="border-stone-200" />

          {/* Histórico de Débitos / Fiados Pendentes */}
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
              Extrato por Datas Pendentes:
            </span>

            {customerPendingFiados.length === 0 ? (
              <p className="text-stone-400 text-xs italic">Sem débitos acumulados.</p>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {customerPendingFiados.map((f) => (
                  <div
                    key={f.id}
                    className="flex justify-between items-center p-2 bg-stone-50 rounded-lg border border-stone-200 text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-stone-500 text-[10px] block">
                        {formatDateBr(f.saleDate)} (Vence {formatDateBr(f.dueDate)})
                      </span>
                      <span className="text-stone-800 font-medium">
                        {f.notes || `${f.quantity} espetos`}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-rose-700">
                      {formatCurrency(f.totalAmount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rodapé: Totais e Botões de Lançamento / Quitação */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
          <div className="flex justify-between items-center font-bold text-stone-900 px-1">
            <span className="text-xs text-stone-500 uppercase tracking-wider">
              Consumo do Evento Atual:
            </span>
            <span className="text-base font-mono text-stone-900">
              {formatCurrency(currentOrderTotal)}
            </span>
          </div>

          {/* Botão de Lançar como Fiado */}
          <button
            type="button"
            onClick={handleLancarNaConta}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl shadow-xs text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Lançar Consumo na Conta (Fiado / Pendente)
          </button>

          <hr className="border-stone-200" />

          {/* Botões Rápidos de Quitação: PIX, Dinheiro, Cartão */}
          <div>
            <span className="text-[11px] font-semibold text-stone-500 block mb-1.5 text-center">
              Receber Agora no Caixa:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleReceberPagamento('Pix')}
                className="py-2 px-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs active:scale-95 text-xs transition-colors"
              >
                PIX
              </button>
              <button
                type="button"
                onClick={() => handleReceberPagamento('Dinheiro')}
                className="py-2 px-1 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-lg shadow-xs active:scale-95 text-xs transition-colors"
              >
                Dinheiro
              </button>
              <button
                type="button"
                onClick={() => handleReceberPagamento('Cartao')}
                className="py-2 px-1 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg shadow-xs active:scale-95 text-xs transition-colors"
              >
                Cartão
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
