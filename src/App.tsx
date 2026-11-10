import React, { useState, useEffect } from 'react';
import { 
  EventSession, 
  VendorProfile, 
  CustomerItem, 
  ProductItem, 
  PaymentRecord 
} from './types';
import { 
  loadVendorProfile, 
  saveVendorProfile, 
  loadSessions, 
  saveSessions, 
  loadCurrentSessionId, 
  saveCurrentSessionId, 
  loadCustomers,
  saveCustomers,
  loadProducts,
  saveProducts,
  loadPayments,
  savePayments,
  loadAuthStatus,
  saveAuthStatus,
  calculateFinancialSummary, 
  formatCurrency, 
  formatDateBr,
  INITIAL_SAMPLE_SESSION
} from './storage';
import { Header, AppTabType } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { MetricCards } from './components/MetricCards';
import { ComandasManager } from './components/ComandasManager';
import { SalesManager } from './components/SalesManager';
import { ExpensesManager } from './components/ExpensesManager';
import { DevedoresPorData } from './components/DevedoresPorData';
import { PaymentsHistoryManager } from './components/PaymentsHistoryManager';
import { CustomersManager } from './components/CustomersManager';
import { ProductsManager } from './components/ProductsManager';
import { DailyClosureReport } from './components/DailyClosureReport';
import { SpreadsheetGuide } from './components/SpreadsheetGuide';
import { VendorSettingsModal } from './components/VendorSettingsModal';
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Trash2,
  TrendingUp,
  Flame,
  Coins,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  // Autenticação do Vendedor
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(loadAuthStatus);

  // Estados principais
  const [vendor, setVendor] = useState<VendorProfile>(loadVendorProfile);
  const [sessions, setSessions] = useState<EventSession[]>(loadSessions);
  const [currentSessionId, setCurrentSessionId] = useState<string>(loadCurrentSessionId);
  const [customers, setCustomers] = useState<CustomerItem[]>(loadCustomers);
  const [products, setProducts] = useState<ProductItem[]>(loadProducts);
  const [payments, setPayments] = useState<PaymentRecord[]>(loadPayments);

  const [activeTab, setActiveTab] = useState<AppTabType>('comandas');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);

  // Form para nova sessão / campeonato
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().slice(0, 10));
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newPurchasedQty, setNewPurchasedQty] = useState(250);

  // Obter sessão ativa
  const currentSession = sessions.find((s) => s.id === currentSessionId) || sessions[0] || INITIAL_SAMPLE_SESSION;

  // Resumo financeiro calculado com os 6 cálculos
  const summary = calculateFinancialSummary(currentSession);

  // Sincronizar persistência
  useEffect(() => {
    saveVendorProfile(vendor);
  }, [vendor]);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    saveCurrentSessionId(currentSessionId);
  }, [currentSessionId]);

  useEffect(() => {
    saveCustomers(customers);
  }, [customers]);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  useEffect(() => {
    savePayments(payments);
  }, [payments]);

  useEffect(() => {
    saveAuthStatus(isAuthenticated);
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    saveAuthStatus(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    saveAuthStatus(false);
  };

  const handleUpdateCurrentSession = (updated: EventSession) => {
    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleAddPayment = (newPayment: PaymentRecord) => {
    setPayments((prev) => [newPayment, ...prev]);
  };

  const handleCreateNewSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim()) return;

    const newSession: EventSession = {
      id: `session-${Date.now()}`,
      eventName: newEventName.trim(),
      date: newEventDate || new Date().toISOString().slice(0, 10),
      location: newEventLocation.trim() || 'Campo de Futebol',
      purchasedSkewersQty: Number(newPurchasedQty) || 200,
      expenses: [],
      sales: [
        { id: `sale-${Date.now()}-1`, period: 'Início / 1º Tempo', priceType: 10, quantity: 0 },
        { id: `sale-${Date.now()}-2`, period: 'Final / Promoção Saideira', priceType: 8, quantity: 0 },
      ],
      cashCount: { cash: 0, pix: 0, card: 0 },
      fiados: [],
      createdAt: Date.now(),
    };

    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setIsNewSessionModalOpen(false);
    setNewEventName('');
    setNewEventLocation('');
  };

  const handleDeleteSession = (id: string) => {
    if (sessions.length <= 1) return;
    if (confirm('Deseja realmente excluir este campeonato/rodada?')) {
      const remaining = sessions.filter((s) => s.id !== id);
      setSessions(remaining);
      if (currentSessionId === id) {
        setCurrentSessionId(remaining[0].id);
      }
    }
  };

  // Se o vendedor não estiver autenticado, exibir a tela de login exclusiva
  if (!isAuthenticated) {
    return <LoginScreen vendor={vendor} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 pb-16 font-sans">
      {/* 1. TOPO DA TELA COM O CONTATO DO VENDEDOR, TABS E BOTÃO DE BLOQUEIO */}
      <Header
        vendor={vendor}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* SELETOR DE CAMPEONATO / RODADA ATIVA */}
        <div className="no-print bg-white border border-stone-200 rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Campeonato:
              </span>
              <select
                value={currentSession.id}
                onChange={(e) => setCurrentSessionId(e.target.value)}
                className="font-bold text-sm text-stone-900 bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-amber-500 max-w-xs sm:max-w-md truncate"
              >
                {sessions.map((sess) => (
                  <option key={sess.id} value={sess.id}>
                    {sess.eventName} ({formatDateBr(sess.date)})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-stone-500 flex items-center gap-2">
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                {formatDateBr(currentSession.date)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {currentSession.location || 'Campo'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setIsNewSessionModalOpen(true)}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Novo Campeonato
            </button>

            {sessions.length > 1 && (
              <button
                onClick={() => handleDeleteSession(currentSession.id)}
                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Excluir este campeonato"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* CONTEÚDO DAS ABAS CONFORME A ESTRUTURA DO ANEXO */}
        
        {/* ABA 1: COMANDAS (Touch-friendly para beira de campo) */}
        {activeTab === 'comandas' && (
          <ComandasManager
            session={currentSession}
            vendor={vendor}
            customers={customers}
            products={products}
            payments={payments}
            onUpdateSession={handleUpdateCurrentSession}
            onAddPayment={handleAddPayment}
          />
        )}

        {/* ABA 2: LUCRO REAL & DEMONSTRATIVO FINANCEIRO (Os 6 Cálculos) */}
        {activeTab === 'lucro' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <h2 className="text-lg font-bold text-stone-900">
                  Balanço Financeiro & Lucro Real do Evento
                </h2>
                <p className="text-xs text-stone-500">
                  Resumo executivo de custos, arrecadação em caixa, fiados e margens.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('fechamento')}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors self-start"
              >
                Gerar Relatório de Fechamento →
              </button>
            </div>

            {/* Os 6 Cards de Cálculos Obrigatórios */}
            <MetricCards summary={summary} />

            {/* Margem Bruta por Produto Cadastrado */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                Margem de Lucro Bruto por Item Vendido
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {products.map((p) => {
                  const profit = p.price - p.cost;
                  const pct = p.price > 0 ? (profit / p.price) * 100 : 0;
                  return (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 flex justify-between items-center text-xs"
                    >
                      <div>
                        <span className="font-bold text-stone-900 text-sm block">
                          {p.icon} {p.name}
                        </span>
                        <span className="text-stone-500 font-mono mt-0.5 block">
                          Custo: {formatCurrency(p.cost)} · Venda: {formatCurrency(p.price)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-700 block text-sm">
                          +{formatCurrency(profit)}
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
                          {pct.toFixed(0)}% margem
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Balanço de Vendas e Caixa Detalhado */}
            <SalesManager
              session={currentSession}
              onUpdateSession={handleUpdateCurrentSession}
            />
          </div>
        )}

        {/* ABA 3: COMPRAS / GASTOS */}
        {activeTab === 'compras' && (
          <ExpensesManager
            session={currentSession}
            onUpdateSession={handleUpdateCurrentSession}
          />
        )}

        {/* ABA 4: FIADOS POR DATA */}
        {activeTab === 'devedores' && (
          <DevedoresPorData
            session={currentSession}
            customers={customers}
            vendor={vendor}
            onOpenComanda={(customerName) => {
              const found = customers.find(c => c.name.toLowerCase() === customerName.toLowerCase());
              if (found) {
                setActiveTab('comandas');
              }
            }}
          />
        )}

        {/* ABA 5: HISTÓRICO DE PAGAMENTOS COM ESTORNO */}
        {activeTab === 'historico' && (
          <PaymentsHistoryManager
            payments={payments}
            session={currentSession}
            onUpdatePayments={setPayments}
            onUpdateSession={handleUpdateCurrentSession}
          />
        )}

        {/* ABA 6: CLIENTES */}
        {activeTab === 'clientes' && (
          <CustomersManager
            customers={customers}
            session={currentSession}
            onUpdateCustomers={setCustomers}
          />
        )}

        {/* ABA 7: PRODUTOS */}
        {activeTab === 'produtos' && (
          <ProductsManager
            products={products}
            onUpdateProducts={setProducts}
          />
        )}

        {/* ABA 8: FECHAMENTO DIÁRIO */}
        {activeTab === 'fechamento' && (
          <DailyClosureReport
            session={currentSession}
            vendor={vendor}
            summary={summary}
          />
        )}

        {/* ABA 9: FÓRMULAS PLANILHA GOOGLE SHEETS / EXCEL */}
        {activeTab === 'planilha' && <SpreadsheetGuide />}
      </main>

      {/* MODAL: CONFIGURAÇÕES & SENHA DO VENDEDOR */}
      <VendorSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        vendor={vendor}
        onSave={setVendor}
      />

      {/* MODAL: NOVO CAMPEONATO / RODADA */}
      {isNewSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
              <h3 className="text-base font-semibold">Novo Campeonato / Dia de Jogo</h3>
              <button
                onClick={() => setIsNewSessionModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewSession} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nome do Torneio / Partida
                </label>
                <input
                  type="text"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  placeholder="Ex: Torneio Society da Amizade - Rodada 2"
                  required
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Data do Jogo
                  </label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Qtd. Espetos Comprados
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={newPurchasedQty}
                    onChange={(e) => setNewPurchasedQty(parseInt(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Local / Campo
                </label>
                <input
                  type="text"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  placeholder="Ex: Campo do Grêmio Mauá"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSessionModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 rounded-lg hover:bg-stone-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700"
                >
                  Iniciar Campeonato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
