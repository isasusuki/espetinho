import React, { useState } from 'react';
import { EventSession, VendorProfile } from '../types';
import { 
  FinancialSummary, 
  formatCurrency, 
  formatDateBr, 
  generateWhatsAppLink, 
  SKEWER_PURCHASE_COST 
} from '../storage';
import { 
  Printer, 
  Share2, 
  Check, 
  Copy, 
  MessageCircle, 
  FileText, 
  Scale, 
  Flame, 
  ShieldAlert, 
  TrendingUp, 
  Coins 
} from 'lucide-react';

interface DailyClosureReportProps {
  session: EventSession;
  vendor: VendorProfile;
  summary: FinancialSummary;
}

export const DailyClosureReport: React.FC<DailyClosureReportProps> = ({
  session,
  vendor,
  summary,
}) => {
  const [copied, setCopied] = useState(false);

  const vendorWaLink = generateWhatsAppLink(vendor.phone);

  const generateWhatsAppSummaryText = () => {
    const isRealizedPositive = summary.realizedNetProfit >= 0;
    const isProjectedPositive = summary.projectedTotalProfit >= 0;

    let text = `⚽🍢 *FECHAMENTO DE CAIXA - ESPETINHO FC*\n`;
    text += `🏟️ *Campeonato:* ${session.eventName}\n`;
    text += `📅 *Data:* ${formatDateBr(session.date)} | *Local:* ${session.location || 'Campo de Futebol'}\n`;
    text += `👤 *Responsável:* ${vendor.name} (WhatsApp: +${vendor.phone})\n`;
    text += `🔑 *Chave Pix:* ${vendor.pixKey}\n`;
    text += `----------------------------------------\n\n`;

    text += `📊 *1. CUSTOS TOTAIS DO EVENTO*\n`;
    text += `• Espetinhos Comprados: ${session.purchasedSkewersQty} un × R$ 5,00 = ${formatCurrency(summary.skewerGoodsCost)}\n`;
    text += `• Outras Despesas (Carvão, Pão, etc): ${formatCurrency(summary.otherExpensesCost)}\n`;
    text += `👉 *Custo Total:* ${formatCurrency(summary.totalCost)}\n\n`;

    text += `🍢 *2. VENDAS REALIZADAS*\n`;
    text += `• Padrão (R$ 10,00): ${summary.salesQtyR10} un (${formatCurrency(summary.salesTotalR10)})\n`;
    text += `• Promocional (R$ 8,00): ${summary.salesQtyR8} un (${formatCurrency(summary.salesTotalR8)})\n`;
    text += `• Total Vendido Direto: ${summary.totalSkewersSoldDirect} espetos\n`;
    text += `• Sobra de Estoque para Próximo Jogo: ${summary.remainingSkewersStock} espetinhos\n\n`;

    text += `💵 *3. CONFERÊNCIA DE CAIXA ARRECADADO*\n`;
    text += `• Dinheiro Físico: ${formatCurrency(session.cashCount.cash || 0)}\n`;
    text += `• Pix em Conta: ${formatCurrency(session.cashCount.pix || 0)}\n`;
    text += `• Cartão (Débito/Crédito): ${formatCurrency(session.cashCount.card || 0)}\n`;
    text += `👉 *Total Arrecadado em Caixa:* ${formatCurrency(summary.cashRegisterTotal)}\n`;
    text += `⚖️ *Diferença de Caixa:* ${summary.cashDifference >= 0 ? '+' : ''}${formatCurrency(summary.cashDifference)} (${
      summary.cashDifferenceStatus === 'ok' ? 'Batido' : summary.cashDifferenceStatus === 'surplus' ? 'Sobra' : 'Falta'
    })\n\n`;

    text += `📋 *4. CONTAS FIADAS (A RECEBER)*\n`;
    text += `• Total Fiado em Aberto: ${formatCurrency(summary.totalFiadoPending)} (${summary.pendingFiadoCount} pessoas)\n`;
    if (summary.pendingFiadoCount > 0) {
      session.fiados
        .filter((f) => f.status === 'Pendente')
        .forEach((f) => {
          text += `  - ${f.customerName}: ${formatCurrency(f.totalAmount)} (Prazo: ${formatDateBr(f.dueDate)})\n`;
        });
    }
    text += `⚠️ *Aviso:* Baixa de fiado somente com confirmação direta do vendedor!\n\n`;

    text += `🏆 *5. RESULTADO FINAL & LUCRO*\n`;
    text += `💰 *LUCRO LÍQUIDO REALIZADO (NO BOLSO):* ${formatCurrency(summary.realizedNetProfit)} (${summary.realizedMarginPercent.toFixed(1)}%)\n`;
    text += `📈 *LUCRO PROJETADO (C/ FIADOS):* ${formatCurrency(summary.projectedTotalProfit)}\n\n`;
    text += `📱 Dúvidas ou acertos: wa.me/${vendor.phone}`;

    return text;
  };

  const handleCopyWhatsApp = () => {
    const text = generateWhatsAppSummaryText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Barra de Ações Superior */}
      <div className="no-print bg-white border border-stone-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-bold text-stone-900">
            Relatório de Fechamento Diário por Campeonato
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyWhatsApp}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado para WhatsApp!' : 'Copiar Resumo p/ WhatsApp'}
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Salvar PDF
          </button>
        </div>
      </div>

      {/* Relatório Formatado (Perfeito na tela e na impressão A4/Térmica) */}
      <div className="bg-white border border-stone-300 rounded-2xl p-6 sm:p-10 shadow-sm max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* TOPO COM CONTATO DO VENDEDOR EM DESTAQUE (OBRIGATÓRIO) */}
        <div className="border-b-2 border-stone-900 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍢⚽</span>
                <h1 className="text-xl sm:text-2xl font-black text-stone-950 uppercase tracking-tight">
                  Fechamento de Caixa Diário
                </h1>
              </div>
              <p className="text-sm font-semibold text-stone-700 mt-0.5">
                {session.eventName}
              </p>
              <div className="text-xs text-stone-500 mt-1 flex flex-wrap items-center gap-2">
                <span>Data do Jogo: <strong className="text-stone-800">{formatDateBr(session.date)}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Local: <strong className="text-stone-800">{session.location || 'Campo de Futebol'}</strong></span>
              </div>
            </div>

            {/* BOX DO VENDEDOR COM LINK DIRETO WHATSAPP */}
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 sm:text-right shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                Contato Oficial do Vendedor
              </span>
              <div className="text-sm font-black text-stone-950 mt-0.5">
                {vendor.name}
              </div>
              <a
                href={vendorWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline mt-1"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 inline" />
                <span>wa.me/{vendor.phone}</span>
              </a>
              <div className="text-[11px] font-mono text-stone-600 mt-0.5">
                Chave Pix: <strong>{vendor.pixKey}</strong>
              </div>
            </div>
          </div>

          {/* Banner de Aviso de Pagamento Obrigatório */}
          <div className="mt-4 bg-stone-100 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-800 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Aviso de Auditoria:</strong> Qualquer dúvida, conferência ou quitação de fiado deve ser feita diretamente com o vendedor acima.
            </span>
          </div>
        </div>

        {/* 6 GRANDES CÁLCULOS OBRIGATÓRIOS DO FECHAMENTO */}
        <div className="py-6 border-b border-stone-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">
            Resumo Executivo dos 6 Cálculos Obrigatórios
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="border border-stone-200 rounded-lg p-3 bg-stone-50">
              <span className="text-[11px] text-stone-500 font-medium block">1. Custo Total Evento</span>
              <span className="text-lg font-bold font-mono text-stone-900 block mt-1">
                {formatCurrency(summary.totalCost)}
              </span>
            </div>

            <div className="border border-stone-200 rounded-lg p-3 bg-stone-50">
              <span className="text-[11px] text-stone-500 font-medium block">2. Faturamento em Caixa</span>
              <span className="text-lg font-bold font-mono text-emerald-700 block mt-1">
                {formatCurrency(summary.cashRegisterTotal)}
              </span>
            </div>

            <div className="border border-stone-200 rounded-lg p-3 bg-stone-50">
              <span className="text-[11px] text-stone-500 font-medium block">3. Total Fiado Pendente</span>
              <span className="text-lg font-bold font-mono text-amber-800 block mt-1">
                {formatCurrency(summary.totalFiadoPending)}
              </span>
            </div>

            <div className="border border-emerald-200 rounded-lg p-3 bg-emerald-50/50">
              <span className="text-[11px] text-stone-600 font-bold block">4. Lucro Líquido Realizado</span>
              <span className="text-lg font-bold font-mono text-emerald-800 block mt-1">
                {formatCurrency(summary.realizedNetProfit)}
              </span>
              <span className="text-[10px] text-stone-500 block">Margem: {summary.realizedMarginPercent.toFixed(1)}%</span>
            </div>

            <div className="border border-stone-200 rounded-lg p-3 bg-stone-50">
              <span className="text-[11px] text-stone-500 font-medium block">5. Lucro Projetado Total</span>
              <span className="text-lg font-bold font-mono text-sky-800 block mt-1">
                {formatCurrency(summary.projectedTotalProfit)}
              </span>
            </div>

            <div className="border border-stone-200 rounded-lg p-3 bg-stone-50">
              <span className="text-[11px] text-stone-500 font-medium block">6. Diferença de Caixa</span>
              <span className={`text-lg font-bold font-mono block mt-1 ${
                summary.cashDifferenceStatus === 'ok' ? 'text-stone-900' : summary.cashDifference > 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {summary.cashDifference > 0 ? `+${formatCurrency(summary.cashDifference)}` : formatCurrency(summary.cashDifference)}
              </span>
              <span className="text-[10px] text-stone-500 block">
                {summary.cashDifferenceStatus === 'ok' ? '100% Batido' : summary.cashDifference > 0 ? 'Sobra' : 'Falta'}
              </span>
            </div>
          </div>
        </div>

        {/* DETALHAMENTO DE VENDAS & ESTOQUE */}
        <div className="py-6 border-b border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              Balanço de Vendas e Estoque
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">Espetinhos Comprados no Dia:</span>
                <strong className="font-mono">{session.purchasedSkewersQty} un (Custo: {formatCurrency(summary.skewerGoodsCost)})</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">Vendidos a R$ 10,00 (Padrão):</span>
                <strong className="font-mono">{summary.salesQtyR10} un = {formatCurrency(summary.salesTotalR10)}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">Vendidos a R$ 8,00 (Promocional):</span>
                <strong className="font-mono">{summary.salesQtyR8} un = {formatCurrency(summary.salesTotalR8)}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">Espetinhos Entregues Fiados:</span>
                <strong className="font-mono">{summary.totalSkewersSoldFiado} un</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100 font-semibold text-stone-900">
                <span>Total de Espetinhos Consumidos:</span>
                <span className="font-mono">{summary.totalSkewersSold} un</span>
              </div>
              <div className="flex justify-between py-1 bg-amber-50 p-2 rounded text-amber-950 font-bold">
                <span>Sobra de Estoque p/ Próximo Jogo:</span>
                <span className="font-mono">{summary.remainingSkewersStock} espetinhos crus</span>
              </div>
            </div>
          </div>

          {/* MEIOS DE PAGAMENTO CONFERIDOS */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              Composição do Caixa Conferido
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">Dinheiro Físico na Gaveta:</span>
                <strong className="font-mono">{formatCurrency(session.cashCount.cash || 0)}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">Pix Confirmado em Conta:</span>
                <strong className="font-mono">{formatCurrency(session.cashCount.pix || 0)}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">Cartão de Débito / Crédito:</span>
                <strong className="font-mono">{formatCurrency(session.cashCount.card || 0)}</strong>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-stone-900 border-t border-stone-200">
                <span>Total Conferido em Caixa:</span>
                <span className="font-mono text-emerald-700">{formatCurrency(summary.cashRegisterTotal)}</span>
              </div>
              <div className="flex justify-between py-1 text-stone-500">
                <span>Vendas Diretas Teóricas:</span>
                <span className="font-mono">{formatCurrency(summary.theoreticalRegisteredSales)}</span>
              </div>
              <div className="flex justify-between py-1 text-xs font-semibold">
                <span>Diferença Apurada:</span>
                <span className={`font-mono ${summary.cashDifference >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {summary.cashDifference > 0 ? `+${formatCurrency(summary.cashDifference)}` : formatCurrency(summary.cashDifference)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* LISTAGEM DE FIADOS PENDENTES NESTE DIA */}
        <div className="py-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Controle de Fiados Deste Campeonato
            </h3>
            <span className="text-xs font-mono font-bold text-amber-800">
              Total a Receber: {formatCurrency(summary.totalFiadoPending)}
            </span>
          </div>

          {session.fiados.length === 0 ? (
            <p className="text-xs text-stone-500 italic">Nenhum fiado registrado para este campeonato.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600">
                  <tr>
                    <th className="py-2 px-3">Cliente</th>
                    <th className="py-2 px-3">Data Limite</th>
                    <th className="py-2 px-3">Espetinhos</th>
                    <th className="py-2 px-3">Valor</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {session.fiados.map((f) => (
                    <tr key={f.id}>
                      <td className="py-2 px-3 font-semibold text-stone-900">
                        {f.customerName}
                        {f.customerPhone && <span className="font-normal text-stone-400 block">{f.customerPhone}</span>}
                      </td>
                      <td className="py-2 px-3 font-mono text-stone-600">{formatDateBr(f.dueDate)}</td>
                      <td className="py-2 px-3 font-mono">{f.quantity} un (@ {formatCurrency(f.unitPrice)})</td>
                      <td className="py-2 px-3 font-mono font-bold">{formatCurrency(f.totalAmount)}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          f.status === 'Pago' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ASSINATURA / RODAPÉ DE VALIDAÇÃO */}
        <div className="pt-6 border-t border-stone-300 mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            <span>Fechamento gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.</span>
          </div>
          <div className="text-center sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
            <div className="w-48 border-b border-stone-400 mb-1 mx-auto sm:ml-auto"></div>
            <span className="font-semibold text-stone-800">Assinatura do Vendedor / Titular</span>
          </div>
        </div>
      </div>
    </div>
  );
};
