import React, { useState } from 'react';
import { EventSession, ExpenseItem } from '../types';
import { formatCurrency, SKEWER_PURCHASE_COST } from '../storage';
import { Plus, Trash2, ShoppingBag, Flame, DollarSign, Layers } from 'lucide-react';

interface ExpensesManagerProps {
  session: EventSession;
  onUpdateSession: (updated: EventSession) => void;
}

export const ExpensesManager: React.FC<ExpensesManagerProps> = ({ session, onUpdateSession }) => {
  const [newCategory, setNewCategory] = useState<ExpenseItem['category']>('Carvão & Fogo');
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState<number | ''>('');

  const skewerGoodsCost = (session.purchasedSkewersQty || 0) * SKEWER_PURCHASE_COST;
  const otherExpensesCost = (session.expenses || []).reduce((acc, exp) => acc + (exp.amount || 0), 0);
  const totalCost = skewerGoodsCost + otherExpensesCost;

  const handleUpdatePurchasedQty = (qty: number) => {
    onUpdateSession({
      ...session,
      purchasedSkewersQty: Math.max(0, qty),
    });
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim() || !newAmount || Number(newAmount) <= 0) return;

    const newItem: ExpenseItem = {
      id: `exp-${Date.now()}`,
      category: newCategory,
      description: newDescription.trim(),
      amount: Number(newAmount),
    };

    onUpdateSession({
      ...session,
      expenses: [...session.expenses, newItem],
    });

    setNewDescription('');
    setNewAmount('');
  };

  const handleDeleteExpense = (id: string) => {
    onUpdateSession({
      ...session,
      expenses: session.expenses.filter((e) => e.id !== id),
    });
  };

  return (
    <div className="space-y-8">
      {/* 1. COMPRA DE MERCADORIA (ESPETINHOS) */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold text-stone-900">Aquisição de Mercadoria (Custo Fixo)</h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Custo de aquisição tabelado em <strong className="text-stone-700">R$ 5,00 por espetinho</strong>.
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-right">
            <span className="text-xs text-stone-500 block">Custo Total de Espetinhos Comprados</span>
            <span className="text-xl font-bold font-mono text-stone-900">
              {formatCurrency(skewerGoodsCost)}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Quantidade Total de Espetinhos Comprados para o Evento
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                step="5"
                value={session.purchasedSkewersQty || ''}
                onChange={(e) => handleUpdatePurchasedQty(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-48 px-4 py-2.5 text-lg font-mono font-bold text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
              />
              <span className="text-sm font-medium text-stone-600">unidades de espetinho</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs text-stone-500 mr-1 self-center">Ajuste rápido:</span>
              {[100, 150, 200, 250, 300, 400].map((qtd) => (
                <button
                  key={qtd}
                  type="button"
                  onClick={() => handleUpdatePurchasedQty(qtd)}
                  className="px-2.5 py-1 text-xs font-mono bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors"
                >
                  {qtd} un
                </button>
              ))}
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-2">
            <div className="font-semibold flex items-center gap-1.5 text-amber-900">
              <Flame className="w-4 h-4 text-amber-600" />
              Equação da Mercadoria
            </div>
            <div className="font-mono text-stone-700 bg-white/80 p-2 rounded border border-amber-200">
              {session.purchasedSkewersQty || 0} un × R$ 5,00 = <strong className="text-stone-900">{formatCurrency(skewerGoodsCost)}</strong>
            </div>
            <p className="text-[11px] text-amber-800 leading-tight">
              A cada unidade vendida a R$ 10,00 resta R$ 5,00 de margem; a R$ 8,00 restam R$ 3,00 de margem.
            </p>
          </div>
        </div>
      </div>

      {/* 2. OUTRAS DESPESAS OPERACIONAIS */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-stone-800" />
              <h2 className="text-lg font-bold text-stone-900">Outras Despesas Fixas e Variáveis</h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Carvão, pães, molhos, vinagrete, guardanapos, gelo, taxa de campo e frete/transporte.
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-right">
            <span className="text-xs text-stone-500 block">Subtotal de Outras Despesas</span>
            <span className="text-xl font-bold font-mono text-stone-900">
              {formatCurrency(otherExpensesCost)}
            </span>
          </div>
        </div>

        {/* Formulário de Adicionar Despesa */}
        <form onSubmit={handleAddExpense} className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Categoria
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as ExpenseItem['category'])}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
            >
              <option value="Carvão & Fogo">Carvão & Fogo</option>
              <option value="Acompanhamentos">Acompanhamentos (Pão/Molhos)</option>
              <option value="Embalagens">Embalagens & Descartáveis</option>
              <option value="Taxa do Campo">Taxa do Campo / Comissão</option>
              <option value="Transporte">Transporte / Combustível</option>
              <option value="Outros">Outros Insumos</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Descrição do Gasto
            </label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Ex: 2 sacos de carvão 10kg, 50 pães franceses..."
              required
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Valor (R$)
            </label>
            <input
              type="number"
              step="0.50"
              min="0.10"
              value={newAmount}
              onChange={(e) => setNewAmount(parseFloat(e.target.value) || '')}
              placeholder="0,00"
              required
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50 font-mono font-bold"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Adicionar Gasto
            </button>
          </div>
        </form>

        {/* Tabela de Despesas */}
        <div className="mt-6 border border-stone-200 rounded-lg overflow-hidden">
          {session.expenses.length === 0 ? (
            <div className="p-8 text-center text-stone-500 text-xs">
              Nenhuma despesa adicional registrada. Use o formulário acima para registrar carvão, taxas ou pães.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600">
                <tr>
                  <th className="px-6 py-3">Categoria</th>
                  <th className="px-6 py-3">Descrição</th>
                  <th className="px-6 py-3 text-right">Valor</th>
                  <th className="px-6 py-3 text-right">Excluir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-800">
                {session.expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-stone-900 font-medium">
                      {expense.description}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-bold text-stone-900">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Remover despesa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 3. CONSOLIDAÇÃO DO CUSTO TOTAL DO EVENTO */}
      <div className="bg-stone-900 text-white rounded-xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">1. Custo Total do Evento Calculado</h3>
          </div>
          <p className="text-xs text-stone-300 mt-1">
            Fórmula: (Espetinhos comprados × R$ 5,00) + Outras Despesas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="text-right">
            <span className="text-xs text-stone-400 block">Mercadoria</span>
            <span className="text-sm font-mono font-bold text-stone-200">{formatCurrency(skewerGoodsCost)}</span>
          </div>
          <div className="text-stone-500 font-bold text-lg">+</div>
          <div className="text-right">
            <span className="text-xs text-stone-400 block">Outras Despesas</span>
            <span className="text-sm font-mono font-bold text-stone-200">{formatCurrency(otherExpensesCost)}</span>
          </div>
          <div className="text-stone-500 font-bold text-lg">=</div>
          <div className="text-right">
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider block">Custo Total</span>
            <span className="text-2xl font-mono font-black text-amber-400">{formatCurrency(totalCost)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
