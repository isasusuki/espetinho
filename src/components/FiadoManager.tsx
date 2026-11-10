import React, { useState } from 'react';
import { EventSession, FiadoRecord, VendorProfile } from '../types';
import { formatCurrency, formatDateBr, generateWhatsAppLink } from '../storage';
import { 
  AlertOctagon, 
  CheckCircle2, 
  MessageCircle, 
  Plus, 
  Trash2, 
  User, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

interface FiadoManagerProps {
  session: EventSession;
  vendor: VendorProfile;
  onUpdateSession: (updated: EventSession) => void;
}

export const FiadoManager: React.FC<FiadoManagerProps> = ({ session, vendor, onUpdateSession }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('pending');
  
  // Novo fiado form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [saleDate, setSaleDate] = useState(session.date || new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10));
  const [quantity, setQuantity] = useState(2);
  const [unitPrice, setUnitPrice] = useState<8 | 10>(10);
  const [notes, setNotes] = useState('');

  // Confirmação de baixa modal
  const [confirmingFiadoId, setConfirmingFiadoId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);

  // Cálculos de fiados
  const totalPendingAmount = session.fiados
    .filter((f) => f.status === 'Pendente')
    .reduce((acc, f) => acc + (f.totalAmount || 0), 0);

  const totalPaidAmount = session.fiados
    .filter((f) => f.status === 'Pago')
    .reduce((acc, f) => acc + (f.totalAmount || 0), 0);

  const totalAllAmount = totalPendingAmount + totalPaidAmount;

  const overdueCount = session.fiados.filter(
    (f) => f.status === 'Pendente' && f.dueDate && f.dueDate < todayStr
  ).length;

  const filteredFiados = session.fiados.filter((item) => {
    if (filter === 'pending') return item.status === 'Pendente';
    if (filter === 'paid') return item.status === 'Pago';
    if (filter === 'overdue') return item.status === 'Pendente' && item.dueDate && item.dueDate < todayStr;
    return true;
  });

  const handleAddFiado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    const total = quantity * unitPrice;
    const newFiado: FiadoRecord = {
      id: `fiado-${Date.now()}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      saleDate: saleDate || todayStr,
      dueDate: dueDate || todayStr,
      quantity,
      unitPrice,
      totalAmount: total,
      status: 'Pendente',
      notes: notes.trim() || undefined,
    };

    onUpdateSession({
      ...session,
      fiados: [newFiado, ...session.fiados],
    });

    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
    setQuantity(2);
  };

  const handleConfirmPayment = (id: string) => {
    onUpdateSession({
      ...session,
      fiados: session.fiados.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'Pago',
            paidDate: todayStr,
          };
        }
        return item;
      }),
    });
    setConfirmingFiadoId(null);
  };

  const handleReopenPayment = (id: string) => {
    onUpdateSession({
      ...session,
      fiados: session.fiados.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'Pendente',
            paidDate: undefined,
          };
        }
        return item;
      }),
    });
  };

  const handleDeleteFiado = (id: string) => {
    onUpdateSession({
      ...session,
      fiados: session.fiados.filter((item) => item.id !== id),
    });
  };

  const getCobrançaMessage = (fiado: FiadoRecord) => {
    return (
      `Olá ${fiado.customerName}, tudo bem? Aqui é o ${vendor.name} da barraca de espetinhos do futebol.\n\n` +
      `Estou passando para lembrar do acerto referente ao jogo do dia ${formatDateBr(fiado.saleDate)}:\n` +
      `🍢 Quantidade: ${fiado.quantity} espetinho(s) (R$ ${fiado.unitPrice.toFixed(2)} cada)\n` +
      `💰 Total: ${formatCurrency(fiado.totalAmount)}\n` +
      `📅 Vencimento combinado: ${formatDateBr(fiado.dueDate)}\n\n` +
      `🔑 Chave Pix para acerto: ${vendor.pixKey} (${vendor.name})\n\n` +
      `⚠️ IMPORTANTE: Qualquer dúvida ou comprovante deve ser enviado DIRETAMENTE por aqui para o vendedor conferir e dar baixa!`
    );
  };

  return (
    <div className="space-y-8">
      {/* 1. AVISO VISUAL DE SEGURANÇA E REGRA DE NEGÓCIO OBRIGATÓRIA */}
      <div className="bg-amber-500 text-stone-950 rounded-xl p-5 shadow-sm border border-amber-600">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-stone-950 text-amber-400 rounded-lg shrink-0 mt-0.5">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight uppercase">
              Aviso Obrigatório de Segurança: Baixa Exclusiva do Vendedor
            </h2>
            <p className="text-xs font-medium text-stone-900 mt-1 leading-relaxed">
              A baixa no pagamento de contas fiadas <strong>SÓ DEVE SER FEITA MEDIANTE CONFIRMAÇÃO DIRETA COM O VENDEDOR ({vendor.name})</strong>.
              Nenhum ajudante ou terceiro tem autorização para dar quitação sem o comprovante bancário ou dinheiro entregue em mãos ao titular.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs bg-stone-950 text-white px-2.5 py-1 rounded font-mono">
                Chave Pix Oficial: {vendor.pixKey}
              </span>
              <a
                href={generateWhatsAppLink(vendor.phone, 'Olá, estou confirmando um pagamento de fiado aqui no campeonato!')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-stone-950 font-bold text-xs rounded hover:bg-stone-100 transition-colors shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                Falar com Vendedor (+{vendor.phone})
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CARDS RESUMO DO FIADO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
            3. Total Fiado Pendente (A Receber)
          </span>
          <div className="text-2xl font-bold font-mono text-amber-800 mt-2">
            {formatCurrency(totalPendingAmount)}
          </div>
          <span className="text-xs text-stone-400 mt-1 block">
            Impacta no Lucro Projetado do Evento
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
            Total Já Quitado (Pago)
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-2">
            {formatCurrency(totalPaidAmount)}
          </div>
          <span className="text-xs text-stone-400 mt-1 block">
            Já confirmado e no bolso/caixa
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
            Status dos Prazos
          </span>
          <div className="text-xl font-bold font-mono mt-2 flex items-center gap-2 text-stone-900">
            <span>{session.fiados.filter(f => f.status === 'Pendente').length} em aberto</span>
            {overdueCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                {overdueCount} vencido(s)
              </span>
            )}
          </div>
          <span className="text-xs text-stone-400 mt-1 block">
            Total histórico: {formatCurrency(totalAllAmount)}
          </span>
        </div>
      </div>

      {/* 3. FORMULÁRIO DE NOVO FIADO */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-600" />
          Anotar Venda Fiada (Caderno Digital)
        </h3>

        <form onSubmit={handleAddFiado} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nome do Cliente / Apelido no Time
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Paulinho Camisa 10"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                WhatsApp do Cliente (p/ cobrança)
              </label>
              <div className="relative">
                <MessageCircle className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ex: 11987654321"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Data da Venda Fiada
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Data Limite para Pagamento
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Qtd. de Espetinhos Fiados
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                required
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Preço Cobrado Unitário
              </label>
              <select
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value) as 8 | 10)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50 font-medium"
              >
                <option value={10}>R$ 10,00 (Preço Padrão)</option>
                <option value={8}>R$ 8,00 (Preço Promocional)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Total Calculado da Dívida
              </label>
              <div className="px-3 py-2 text-base font-mono font-black text-amber-800 bg-amber-50 border border-amber-200 rounded-lg">
                {formatCurrency(quantity * unitPrice)}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Salvar Fiado
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Observações (Time, momento do jogo, quem indicou)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Jogador do Juventus, camisa 7, prometeu acertar no próximo sábado"
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
            />
          </div>
        </form>
      </div>

      {/* 4. LISTA DE CLIENTES FIADOS & FILTROS */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-stone-900">Caderno de Contas a Receber</h3>
            <span className="text-xs text-stone-500 font-mono">({filteredFiados.length} registros)</span>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === 'pending' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Pendentes ({session.fiados.filter(f => f.status === 'Pendente').length})
            </button>
            <button
              onClick={() => setFilter('overdue')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === 'overdue' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Vencidos ({overdueCount})
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === 'paid' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Pagos ({session.fiados.filter(f => f.status === 'Pago').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === 'all' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Todos ({session.fiados.length})
            </button>
          </div>
        </div>

        {filteredFiados.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-xs">
            Nenhum registro encontrado para o filtro selecionado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-600">
                <tr>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Data Venda</th>
                  <th className="px-6 py-3">Prazo Limite</th>
                  <th className="px-6 py-3">Consumo</th>
                  <th className="px-6 py-3">Total Devido</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Ações & Cobrança</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-800">
                {filteredFiados.map((item) => {
                  const isOverdue = item.status === 'Pendente' && item.dueDate && item.dueDate < todayStr;
                  const isDueToday = item.status === 'Pendente' && item.dueDate && item.dueDate === todayStr;

                  const cobrancaUrl = item.customerPhone
                    ? generateWhatsAppLink(item.customerPhone, getCobrançaMessage(item))
                    : null;

                  return (
                    <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="font-semibold text-stone-900">{item.customerName}</div>
                        {item.customerPhone && (
                          <div className="text-xs text-stone-500 font-mono">
                            +{item.customerPhone}
                          </div>
                        )}
                        {item.notes && (
                          <div className="text-[11px] text-stone-400 italic mt-0.5 max-w-xs truncate">
                            {item.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-xs text-stone-600 font-mono">
                        {formatDateBr(item.saleDate)}
                      </td>
                      <td className="px-6 py-3.5 text-xs font-mono">
                        <div className={isOverdue ? 'text-rose-700 font-bold' : isDueToday ? 'text-amber-700 font-bold' : 'text-stone-700'}>
                          {formatDateBr(item.dueDate)}
                        </div>
                        {isOverdue && (
                          <span className="text-[10px] text-rose-600 font-sans font-semibold flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" /> Vencido
                          </span>
                        )}
                        {isDueToday && (
                          <span className="text-[10px] text-amber-600 font-sans font-semibold flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> Vence Hoje
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-xs">
                        <span className="font-mono font-bold">{item.quantity} espetos</span>
                        <span className="text-stone-400 ml-1">@ {formatCurrency(item.unitPrice)}</span>
                      </td>
                      <td className="px-6 py-3.5 font-mono font-bold text-sm text-stone-900">
                        {formatCurrency(item.totalAmount)}
                      </td>
                      <td className="px-6 py-3.5">
                        {item.status === 'Pago' ? (
                          <div className="text-xs">
                            <span className="font-semibold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Pago
                            </span>
                            {item.paidDate && (
                              <span className="text-[10px] text-stone-400 font-mono">
                                em {formatDateBr(item.paidDate)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-amber-800 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Pendente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          {/* Cobrança WhatsApp */}
                          {item.status === 'Pendente' && cobrancaUrl && (
                            <a
                              href={cobrancaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
                              title="Enviar cobrança personalizada no WhatsApp do cliente"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              Cobrar
                            </a>
                          )}

                          {/* Dar Baixa */}
                          {item.status === 'Pendente' ? (
                            <button
                              onClick={() => setConfirmingFiadoId(item.id)}
                              className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                              title="Dar baixa no pagamento mediante confirmação do vendedor"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                              Baixar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReopenPayment(item.id)}
                              className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-xs transition-colors"
                              title="Desfazer baixa e retornar para pendente"
                            >
                              Reabrir
                            </button>
                          )}

                          {/* Excluir */}
                          <button
                            onClick={() => handleDeleteFiado(item.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Remover do caderno"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE BAIXA COM O VENDEDOR */}
      {confirmingFiadoId && (() => {
        const fiado = session.fiados.find((f) => f.id === confirmingFiadoId);
        if (!fiado) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
              <div className="bg-amber-500 px-6 py-4 border-b border-amber-600 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-stone-950 shrink-0" />
                <h3 className="text-base font-bold text-stone-950">
                  Confirmação com Vendedor Titular
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                  ⚠️ <strong>Regra de Negócio:</strong> A baixa no pagamento só deve ser feita se o vendedor <strong>{vendor.name}</strong> confirmou o recebimento do Pix ou do dinheiro físico em mãos.
                </div>

                <div className="border border-stone-200 rounded-lg p-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Cliente:</span>
                    <strong className="text-stone-900">{fiado.customerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Consumo:</span>
                    <span className="font-mono">{fiado.quantity} espetinhos (@ {formatCurrency(fiado.unitPrice)})</span>
                  </div>
                  <div className="flex justify-between text-base border-t border-stone-200 pt-1 mt-1">
                    <span className="font-semibold text-stone-700">Valor Total:</span>
                    <strong className="font-mono text-emerald-700">{formatCurrency(fiado.totalAmount)}</strong>
                  </div>
                </div>

                <p className="text-xs text-stone-600">
                  O valor será registrado como <strong>Quitado</strong> na data de hoje ({formatDateBr(todayStr)}).
                </p>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setConfirmingFiadoId(null)}
                    className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleConfirmPayment(fiado.id)}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
                  >
                    Confirmar Recebimento & Baixa
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
