import React, { useState } from 'react';
import { PaymentRecord, EventSession } from '../types';
import { formatCurrency } from '../storage';
import { RotateCcw, Coins, QrCode, Banknote, CreditCard, History } from 'lucide-react';

interface PaymentsHistoryManagerProps {
  payments: PaymentRecord[];
  session: EventSession;
  onUpdatePayments: (updated: PaymentRecord[]) => void;
  onUpdateSession: (updated: EventSession) => void;
}

export const PaymentsHistoryManager: React.FC<PaymentsHistoryManagerProps> = ({
  payments,
  session,
  onUpdatePayments,
  onUpdateSession,
}) => {
  const [filterCustomer, setFilterCustomer] = useState<string>('');

  const filtered = filterCustomer
    ? payments.filter((p) => p.customerName.toLowerCase() === filterCustomer.toLowerCase())
    : payments;

  const totalArrecadado = filtered.reduce((acc, p) => acc + (p.amount || 0), 0);

  const handleEstorno = (payment: PaymentRecord) => {
    if (
      confirm(
        `Deseja CANCELAR/ESTORNAR o pagamento de ${formatCurrency(payment.amount)} de ${payment.customerName}?\nO valor será removido do caixa e os débitos serão reabertos.`
      )
    ) {
      // 1. Remover do histórico
      onUpdatePayments(payments.filter((p) => p.id !== payment.id));

      // 2. Abater do caixa da sessão atual se aplicável
      const methodKey = payment.paymentMethod === 'Dinheiro' ? 'cash' : payment.paymentMethod === 'Pix' ? 'pix' : 'card';
      const currentCashVal = session.cashCount[methodKey] || 0;
      const updatedCashCount = {
        ...session.cashCount,
        [methodKey]: Math.max(0, currentCashVal - payment.amount),
      };

      onUpdateSession({
        ...session,
        cashCount: updatedCashCount,
      });

      alert(`Estorno de ${formatCurrency(payment.amount)} concluído com sucesso.`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <History className="w-5 h-5 text-amber-600" />
              Histórico de Pagamentos Recebidos
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Registro de acertos efetuados em Dinheiro, Pix ou Cartão (com opção de estorno por engano).
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 text-right">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
              Total Arrecadado Listado
            </span>
            <span className="text-xl font-bold font-mono text-emerald-800">
              {formatCurrency(totalArrecadado)}
            </span>
          </div>
        </div>

        {/* Filtros */}
        <div className="mt-4 flex items-center gap-2">
          <label className="text-xs font-semibold text-stone-600">Filtrar por Cliente:</label>
          <input
            type="text"
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
            placeholder="Digite o nome..."
            className="px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
          />
          {filterCustomer && (
            <button
              onClick={() => setFilterCustomer('')}
              className="text-xs text-stone-500 hover:text-stone-800 underline"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Lista de Pagamentos */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500">
            Nenhum pagamento registrado no histórico.
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between hover:bg-stone-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    item.paymentMethod === 'Pix'
                      ? 'bg-teal-50 text-teal-700'
                      : item.paymentMethod === 'Dinheiro'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-purple-50 text-purple-700'
                  }`}>
                    {item.paymentMethod === 'Pix' && <QrCode className="w-5 h-5" />}
                    {item.paymentMethod === 'Dinheiro' && <Banknote className="w-5 h-5" />}
                    {item.paymentMethod === 'Cartao' && <CreditCard className="w-5 h-5" />}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{item.customerName}</h4>
                    <span className="text-xs text-stone-500 font-mono">
                      {item.dateStr} · Pago via {item.paymentMethod}
                    </span>
                    {item.notes && (
                      <span className="text-[11px] text-stone-400 block italic">{item.notes}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-bold font-mono text-emerald-700">
                    {formatCurrency(item.amount)}
                  </span>

                  <button
                    onClick={() => handleEstorno(item)}
                    className="px-2.5 py-1 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-md border border-rose-200 transition-colors flex items-center gap-1"
                    title="Estornar este lançamento se foi registrado por engano"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Estornar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
