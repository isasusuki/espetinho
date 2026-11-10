import React from 'react';
import { FinancialSummary, formatCurrency } from '../storage';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Coins, 
  Flame,
  Scale
} from 'lucide-react';

interface MetricCardsProps {
  summary: FinancialSummary;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ summary }) => {
  const isRealizedPositive = summary.realizedNetProfit >= 0;
  const isProjectedPositive = summary.projectedTotalProfit >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. CUSTO TOTAL DO EVENTO */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              1. Custo Total do Evento
            </span>
            <span className="text-xs text-stone-400 mt-0.5 block">
              Mercadoria (R$ 5,00/un) + Despesas
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900">
            {formatCurrency(summary.totalCost)}
          </div>
          <div className="text-xs text-stone-500 mt-1 flex items-center gap-2">
            <span>Espetinhos: <strong className="font-mono text-stone-700">{formatCurrency(summary.skewerGoodsCost)}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Extras: <strong className="font-mono text-stone-700">{formatCurrency(summary.otherExpensesCost)}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. FATURAMENTO BRUTO EM CAIXA */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              2. Faturamento Bruto em Caixa
            </span>
            <span className="text-xs text-stone-400 mt-0.5 block">
              Dinheiro + Pix + Cartão conferidos
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700">
            {formatCurrency(summary.cashRegisterTotal)}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            <span>Vendas registradas: </span>
            <strong className="font-mono text-stone-700">{formatCurrency(summary.theoreticalRegisteredSales)}</strong>
          </div>
        </div>
      </div>

      {/* 3. TOTAL FIADO PENDENTE */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              3. Total Fiado Pendente
            </span>
            <span className="text-xs text-stone-400 mt-0.5 block">
              A receber (contas em aberto)
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-800">
            {formatCurrency(summary.totalFiadoPending)}
          </div>
          <div className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
            <span>{summary.pendingFiadoCount} {summary.pendingFiadoCount === 1 ? 'cliente pendente' : 'clientes pendentes'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-800 font-medium">Acerto exclusivo c/ vendedor</span>
          </div>
        </div>
      </div>

      {/* 4. LUCRO LÍQUIDO REALIZADO */}
      <div className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between ${
        isRealizedPositive ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider block">
              4. Lucro Líquido Realizado
            </span>
            <span className="text-xs text-stone-500 mt-0.5 block">
              Caixa Conferido − Custo Total
            </span>
          </div>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isRealizedPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className={`text-2xl font-bold font-mono tabular-nums ${
            isRealizedPositive ? 'text-emerald-700' : 'text-rose-700'
          }`}>
            {formatCurrency(summary.realizedNetProfit)}
          </div>
          <div className="text-xs text-stone-600 mt-1">
            <span>Margem realizada sobre caixa: </span>
            <strong className="font-mono">{summary.realizedMarginPercent.toFixed(1)}%</strong>
          </div>
        </div>
      </div>

      {/* 5. LUCRO PROJETADO TOTAL */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              5. Lucro Projetado Total
            </span>
            <span className="text-xs text-stone-400 mt-0.5 block">
              (Caixa + Fiados) − Custo Total
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-700">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className={`text-2xl font-bold font-mono tabular-nums ${
            isProjectedPositive ? 'text-stone-900' : 'text-rose-700'
          }`}>
            {formatCurrency(summary.projectedTotalProfit)}
          </div>
          <div className="text-xs text-stone-500 mt-1">
            <span>Potencial se receber todos os fiados</span>
          </div>
        </div>
      </div>

      {/* 6. DIFERENÇA DE CAIXA */}
      <div className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between ${
        summary.cashDifferenceStatus === 'ok' 
          ? 'border-stone-200' 
          : summary.cashDifferenceStatus === 'surplus' 
            ? 'border-emerald-200 bg-emerald-50/20' 
            : 'border-rose-200 bg-rose-50/20'
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider block">
              6. Diferença de Caixa
            </span>
            <span className="text-xs text-stone-500 mt-0.5 block">
              Conferido vs Vendas Registradas
            </span>
          </div>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            summary.cashDifferenceStatus === 'ok' 
              ? 'bg-stone-100 text-stone-700' 
              : summary.cashDifferenceStatus === 'surplus' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-rose-100 text-rose-800'
          }`}>
            <Scale className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className={`text-2xl font-bold font-mono tabular-nums ${
            summary.cashDifferenceStatus === 'ok' 
              ? 'text-stone-900' 
              : summary.cashDifferenceStatus === 'surplus' 
                ? 'text-emerald-700' 
                : 'text-rose-700'
          }`}>
            {summary.cashDifference > 0 ? `+${formatCurrency(summary.cashDifference)}` : formatCurrency(summary.cashDifference)}
          </div>
          <div className="text-xs mt-1 flex items-center gap-1.5">
            {summary.cashDifferenceStatus === 'ok' && (
              <span className="text-stone-600 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                Caixa 100% batido
              </span>
            )}
            {summary.cashDifferenceStatus === 'surplus' && (
              <span className="text-emerald-700 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                Sobra no caixa (+ gorjetas ou itens avulsos)
              </span>
            )}
            {summary.cashDifferenceStatus === 'shortage' && (
              <span className="text-rose-700 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 inline" />
                Falta no caixa (verifique trocos ou fiados não anotados)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
