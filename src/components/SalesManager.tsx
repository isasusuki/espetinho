import React, { useState } from 'react';
import { EventSession, SaleBatch } from '../types';
import { formatCurrency, SKEWER_PURCHASE_COST } from '../storage';
import { Plus, Trash2, Banknote, QrCode, CreditCard, Scale, CheckCircle2, AlertTriangle, Sparkles, Clock } from 'lucide-react';

interface SalesManagerProps {
  session: EventSession;
  onUpdateSession: (updated: EventSession) => void;
}

export const SalesManager: React.FC<SalesManagerProps> = ({ session, onUpdateSession }) => {
  const [newPeriod, setNewPeriod] = useState('');
  const [newPrice, setNewPrice] = useState<10 | 8>(10);
  const [newQty, setNewQty] = useState<number>(10);
  const [newTimeNote, setNewTimeNote] = useState('');

  // Totais de vendas por tipo
  const salesR10 = session.sales.filter((s) => s.priceType === 10);
  const salesR8 = session.sales.filter((s) => s.priceType === 8);

  const totalQtyR10 = salesR10.reduce((acc, s) => acc + (s.quantity || 0), 0);
  const totalAmountR10 = totalQtyR10 * 10;
  const marginTotalR10 = totalQtyR10 * (10 - SKEWER_PURCHASE_COST); // R$ 5,00 por espeto

  const totalQtyR8 = salesR8.reduce((acc, s) => acc + (s.quantity || 0), 0);
  const totalAmountR8 = totalQtyR8 * 8;
  const marginTotalR8 = totalQtyR8 * (8 - SKEWER_PURCHASE_COST); // R$ 3,00 por espeto

  const totalDirectSalesQty = totalQtyR10 + totalQtyR8;
  const theoreticalSalesTotal = totalAmountR10 + totalAmountR8;
  const totalGrossMarginDirect = marginTotalR10 + marginTotalR8;

  // Caixa conferido
  const cashTotal = (session.cashCount.cash || 0) + (session.cashCount.pix || 0) + (session.cashCount.card || 0);
  const difference = cashTotal - theoreticalSalesTotal;

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeriod.trim()) return;

    const newBatch: SaleBatch = {
      id: `sale-${Date.now()}`,
      period: newPeriod.trim(),
      priceType: newPrice,
      quantity: Number(newQty) || 0,
      timeNote: newTimeNote.trim() || undefined,
    };

    onUpdateSession({
      ...session,
      sales: [...session.sales, newBatch],
    });

    setNewPeriod('');
    setNewQty(10);
    setNewTimeNote('');
  };

  const handleDeleteBatch = (id: string) => {
    onUpdateSession({
      ...session,
      sales: session.sales.filter((s) => s.id !== id),
    });
  };

  const handleUpdateQty = (id: string, delta: number) => {
    onUpdateSession({
      ...session,
      sales: session.sales.map((s) => {
        if (s.id === id) {
          const next = Math.max(0, (s.quantity || 0) + delta);
          return { ...s, quantity: next };
        }
        return s;
      }),
    });
  };

  const handleCashCountChange = (field: 'cash' | 'pix' | 'card', value: number) => {
    onUpdateSession({
      ...session,
      cashCount: {
        ...session.cashCount,
        [field]: Math.max(0, value),
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* 1. Header do Módulo & Precificação Flexível */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Registro de Vendas e Caixa do Dia</h2>
            <p className="text-xs text-stone-500 mt-1">
              Controle de venda rápida com precificação dinâmica conforme o andamento da partida.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs">
              <span className="font-bold text-amber-900">Padrão: R$ 10,00</span>
              <span className="text-amber-700 ml-1.5">(Margem: R$ 5,00/un)</span>
            </div>
            <div className="bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 text-xs">
              <span className="font-bold text-sky-900">Promocional: R$ 8,00</span>
              <span className="text-sky-700 ml-1.5">(Margem: R$ 3,00/un)</span>
            </div>
          </div>
        </div>

        {/* Resumo de Vendas por Preço */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
            <div className="flex justify-between items-center text-xs text-stone-600">
              <span className="font-semibold">Vendas a R$ 10,00 (Padrão)</span>
              <span className="font-mono">{totalQtyR10} un</span>
            </div>
            <div className="text-xl font-bold font-mono text-stone-900 mt-2">
              {formatCurrency(totalAmountR10)}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Lucro Bruto: <strong className="font-mono text-emerald-700">{formatCurrency(marginTotalR10)}</strong>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
            <div className="flex justify-between items-center text-xs text-stone-600">
              <span className="font-semibold">Vendas a R$ 8,00 (Promocional)</span>
              <span className="font-mono">{totalQtyR8} un</span>
            </div>
            <div className="text-xl font-bold font-mono text-stone-900 mt-2">
              {formatCurrency(totalAmountR8)}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Lucro Bruto: <strong className="font-mono text-emerald-700">{formatCurrency(marginTotalR8)}</strong>
            </div>
          </div>

          <div className="bg-stone-900 text-white rounded-lg p-4">
            <div className="flex justify-between items-center text-xs text-stone-300">
              <span className="font-semibold">Total Geral de Vendas Diretas</span>
              <span className="font-mono">{totalDirectSalesQty} espetinhos</span>
            </div>
            <div className="text-xl font-bold font-mono text-amber-400 mt-2">
              {formatCurrency(theoreticalSalesTotal)}
            </div>
            <div className="text-[11px] text-stone-300 mt-1">
              Margem Bruta Direta: <strong className="font-mono text-emerald-400">{formatCurrency(totalGrossMarginDirect)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Formulário de Novo Lote de Venda */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          Registrar Lote / Período de Venda
        </h3>

        <form onSubmit={handleAddBatch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Período do Campeonato / Momento
            </label>
            <input
              type="text"
              value={newPeriod}
              onChange={(e) => setNewPeriod(e.target.value)}
              placeholder="Ex: Aquecimento, 1º Tempo, Pós-jogo..."
              required
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Preço de Venda
            </label>
            <select
              value={newPrice}
              onChange={(e) => setNewPrice(Number(e.target.value) as 10 | 8)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50 font-medium"
            >
              <option value={10}>R$ 10,00 (Padrão / Alto Movimento)</option>
              <option value={8}>R$ 8,00 (Promoção / Fim de Jogo)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Qtd. de Espetinhos
            </label>
            <input
              type="number"
              min="1"
              value={newQty}
              onChange={(e) => setNewQty(Math.max(1, parseInt(e.target.value) || 0))}
              required
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50 font-mono"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Adicionar Lote
            </button>
          </div>
        </form>

        {/* Atalhos Rápidos de Período Comuns em Campeonatos */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs text-stone-500">
          <span className="font-medium mr-1">Sugestões rápidas:</span>
          {['Início / Chegada das Torcidas', 'Intervalo do 1º Tempo', 'Decisão nos Pênaltis', 'Fim de Jogo / Resenha'].map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => setNewPeriod(sug)}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Tabela de Lotes de Vendas Registrados */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Histórico de Lotes de Venda no Evento</h3>
          <span className="text-xs text-stone-500 font-mono">
            {session.sales.length} {session.sales.length === 1 ? 'lote registrado' : 'lotes registrados'}
          </span>
        </div>

        {session.sales.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-xs">
            Nenhum lote registrado ainda para este campeonato. Use o formulário acima para registrar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600">
                <tr>
                  <th className="px-6 py-3">Período / Momento</th>
                  <th className="px-6 py-3">Preço Unitário</th>
                  <th className="px-6 py-3 text-center">Quantidade</th>
                  <th className="px-6 py-3">Subtotal</th>
                  <th className="px-6 py-3">Margem Bruta</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-800">
                {session.sales.map((sale) => {
                  const subtotal = sale.quantity * sale.priceType;
                  const unitMargin = sale.priceType - SKEWER_PURCHASE_COST;
                  const totalMargin = sale.quantity * unitMargin;

                  return (
                    <tr key={sale.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="font-medium text-stone-900">{sale.period}</div>
                        {sale.timeNote && (
                          <div className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {sale.timeNote}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                          sale.priceType === 10 ? 'bg-amber-100 text-amber-900' : 'bg-sky-100 text-sky-900'
                        }`}>
                          {formatCurrency(sale.priceType)}
                        </span>
                        <span className="text-xs text-stone-500 ml-2">
                          ({sale.priceType === 10 ? 'Padrão' : 'Promocional'})
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateQty(sale.id, -1)}
                            className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-xs"
                            title="Diminuir 1"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold w-12 text-center text-stone-900">
                            {sale.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(sale.id, 1)}
                            className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-xs"
                            title="Aumentar 1"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleUpdateQty(sale.id, 5)}
                            className="px-1.5 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 text-[11px] font-mono ml-1"
                            title="Adicionar +5"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 font-mono font-bold text-stone-900">
                        {formatCurrency(subtotal)}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-emerald-700 text-xs">
                        {formatCurrency(totalMargin)}
                        <span className="text-stone-400 text-[10px] block">
                          ({formatCurrency(unitMargin)}/un)
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteBatch(sale.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Remover lote"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. CONFERÊNCIA DE CAIXA E COMPARATIVO (Obrigatório) */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-stone-800" />
            <div>
              <h3 className="text-base font-bold text-stone-900">Conferência Real de Caixa</h3>
              <p className="text-xs text-stone-500">
                Insira o valor físico e digital contado na gaveta/contas para conferir se bateu com as vendas registradas.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-stone-500 block">Vendas Teóricas Registradas</span>
            <span className="text-base font-bold font-mono text-stone-900">
              {formatCurrency(theoreticalSalesTotal)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Dinheiro */}
          <div className="border border-stone-200 rounded-lg p-4 bg-stone-50/50">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
              <span className="flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-emerald-600" />
                Dinheiro Físico
              </span>
              <span className="text-stone-400">Gaveta</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-400">R$</span>
              <input
                type="number"
                step="0.50"
                min="0"
                value={session.cashCount.cash || ''}
                onChange={(e) => handleCashCountChange('cash', parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                className="w-full pl-9 pr-3 py-2 text-base font-mono font-bold text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>
          </div>

          {/* Pix */}
          <div className="border border-stone-200 rounded-lg p-4 bg-stone-50/50">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
              <span className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-teal-600" />
                Pix Recebidos
              </span>
              <span className="text-stone-400">Conta Bancária</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-400">R$</span>
              <input
                type="number"
                step="0.50"
                min="0"
                value={session.cashCount.pix || ''}
                onChange={(e) => handleCashCountChange('pix', parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                className="w-full pl-9 pr-3 py-2 text-base font-mono font-bold text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>
          </div>

          {/* Cartão */}
          <div className="border border-stone-200 rounded-lg p-4 bg-stone-50/50">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-sky-600" />
                Cartão (Débito / Crédito)
              </span>
              <span className="text-stone-400">Maquininha</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-400">R$</span>
              <input
                type="number"
                step="0.50"
                min="0"
                value={session.cashCount.card || ''}
                onChange={(e) => handleCashCountChange('card', parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                className="w-full pl-9 pr-3 py-2 text-base font-mono font-bold text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Comparativo de Fechamento de Caixa */}
        <div className="mt-6 p-4 rounded-xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-stone-500 block">Total Real Conferido (Dinheiro + Pix + Cartão)</span>
            <div className="text-xl font-bold font-mono text-stone-900">
              {formatCurrency(cashTotal)}
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-stone-500 block">Resultado da Conferência (Diferença de Caixa)</span>
            <div className="flex items-center sm:justify-end gap-2 mt-0.5">
              {Math.abs(difference) < 0.01 ? (
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold font-mono text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  R$ 0,00 (Caixa 100% Batido)
                </div>
              ) : difference > 0 ? (
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold font-mono text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  +{formatCurrency(difference)} (Sobra no Caixa)
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-rose-700 font-bold font-mono text-base">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  {formatCurrency(difference)} (Falta no Caixa)
                </div>
              )}
            </div>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              {Math.abs(difference) < 0.01
                ? 'Todas as vendas registradas correspondem exatamente ao caixa.'
                : difference > 0
                ? 'Há mais dinheiro conferido do que o registrado (gorjeta ou venda sem anotar).'
                : 'Atenção: faltam recursos ou houve fiado não computado no módulo de fiados.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
