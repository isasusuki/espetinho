import React, { useState } from 'react';
import { EventSession, CustomerItem, VendorProfile } from '../types';
import { formatCurrency, formatDateBr, generateWhatsAppLink } from '../storage';
import { Calendar, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DevedoresPorDataProps {
  session: EventSession;
  customers: CustomerItem[];
  vendor: VendorProfile;
  onOpenComanda: (customerName: string) => void;
}

export const DevedoresPorData: React.FC<DevedoresPorDataProps> = ({
  session,
  customers,
  vendor,
  onOpenComanda,
}) => {
  const [filterDate, setFilterDate] = useState<string>('');

  // Obter datas distintas de fiados
  const uniqueDates = Array.from(
    new Set(session.fiados.map((f) => f.saleDate).filter(Boolean))
  ).sort().reverse();

  // Filtrar fiados pendentes
  const fiadosPendentes = session.fiados.filter((f) => {
    if (f.status !== 'Pendente') return false;
    if (filterDate && f.saleDate !== filterDate) return false;
    return true;
  });

  // Agrupar por cliente
  const groupedByCustomer: { [customerName: string]: typeof fiadosPendentes } = {};
  fiadosPendentes.forEach((f) => {
    if (!groupedByCustomer[f.customerName]) {
      groupedByCustomer[f.customerName] = [];
    }
    groupedByCustomer[f.customerName].push(f);
  });

  const totalAReceber = fiadosPendentes.reduce((acc, f) => acc + (f.totalAmount || 0), 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Relatório de Pendências / Fiados por Evento
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Filtre por data para ver quem ficou devendo em um domingo ou partida específica.
            </p>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-2 text-right">
            <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider block">
              Total a Receber Filtrado
            </span>
            <span className="text-xl font-bold font-mono text-rose-800">
              {formatCurrency(totalAReceber)}
            </span>
          </div>
        </div>

        {/* Filtro por data */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-xs font-semibold text-stone-700">Filtrar por Partida / Data:</label>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-stone-300 rounded-lg bg-stone-50 focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Todas as Datas (Acumulado Total)</option>
            {uniqueDates.map((d) => (
              <option key={d} value={d}>
                Partida de {formatDateBr(d)}
              </option>
            ))}
          </select>
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="text-xs text-stone-500 hover:text-stone-800 underline"
            >
              Ver Todas as Datas
            </button>
          )}
        </div>
      </div>

      {/* Cards de Devedores Agrupados */}
      {Object.keys(groupedByCustomer).length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-xl p-12 text-center text-stone-500 text-xs">
          Nenhuma pendência encontrada para o filtro selecionado! 🎉 Todos os amigos estão com as contas em dia.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(groupedByCustomer).map(([customerName, items]) => {
            const customerObj = customers.find(
              (c) => c.name.toLowerCase() === customerName.toLowerCase()
            );
            const emoji = customerObj?.emoji || '👤';
            const phone = customerObj?.phone || items[0]?.customerPhone;
            const subtotalCliente = items.reduce((acc, i) => acc + i.totalAmount, 0);

            const whatsappUrl = phone
              ? generateWhatsAppLink(
                  phone,
                  `Olá ${customerName}! Passando para lembrar do acerto de ${formatCurrency(subtotalCliente)} referente aos espetinhos no futebol. Chave Pix: ${vendor.pixKey} (${vendor.name}). Dúvidas fale direto comigo!`
                )
              : null;

            return (
              <div
                key={customerName}
                className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-center border-b border-stone-100 pb-2 mb-2">
                    <span className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                      <span className="text-xl">{emoji}</span>
                      <span className="truncate">{customerName}</span>
                    </span>
                    <span className="font-mono font-bold text-rose-700 text-sm">
                      {formatCurrency(subtotalCliente)}
                    </span>
                  </div>

                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                    Consumos Anotados:
                  </p>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {items.map((it) => (
                      <div key={it.id} className="text-xs text-stone-600 flex justify-between bg-stone-50 p-1.5 rounded">
                        <div>
                          <b className="text-stone-800 text-[11px] block">{formatDateBr(it.saleDate)}</b>
                          <span className="text-[11px]">{it.notes || `${it.quantity} espetinhos`}</span>
                        </div>
                        <span className="font-mono font-bold text-stone-800">
                          {formatCurrency(it.totalAmount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-stone-100 flex gap-2">
                  <button
                    onClick={() => onOpenComanda(customerName)}
                    className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-lg text-xs transition-colors"
                  >
                    Abrir Comanda
                  </button>
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors flex items-center justify-center"
                      title="Cobrar via WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
