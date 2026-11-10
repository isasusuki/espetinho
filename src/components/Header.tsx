import React from 'react';
import { VendorProfile } from '../types';
import { generateWhatsAppLink } from '../storage';
import { 
  MessageCircle, 
  Settings, 
  ShieldAlert, 
  Lock, 
  ShoppingBag, 
  TrendingUp, 
  ShoppingCart, 
  Wallet, 
  History, 
  Users, 
  Package, 
  FileSpreadsheet, 
  Receipt 
} from 'lucide-react';

export type AppTabType = 
  | 'comandas' 
  | 'lucro' 
  | 'compras' 
  | 'devedores' 
  | 'historico' 
  | 'clientes' 
  | 'produtos' 
  | 'fechamento' 
  | 'planilha';

interface HeaderProps {
  vendor: VendorProfile;
  activeTab: AppTabType;
  setActiveTab: (tab: AppTabType) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  vendor,
  activeTab,
  setActiveTab,
  onOpenSettings,
  onLogout,
}) => {
  const whatsappUrl = generateWhatsAppLink(
    vendor.phone,
    `Olá ${vendor.name}! Estou entrando em contato referente ao acerto/dúvida de espetinhos no campeonato.`
  );

  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-40 shadow-xs">
      {/* Top Banner: Mandatory Vendor Notice & Direct WhatsApp */}
      <div className="bg-amber-500 text-stone-950 px-4 py-1.5 border-b border-amber-600 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 font-medium">
            <ShieldAlert className="w-4 h-4 shrink-0 text-stone-950" />
            <span>
              <strong>Área do Vendedor ({vendor.name}):</strong> Dúvidas ou pagamentos (especialmente fiados) só podem ser feitos diretamente com o titular.
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-950 text-white hover:bg-stone-800 rounded-md font-semibold text-xs transition-colors shadow-xs"
              title="Abrir WhatsApp direto do vendedor"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>WhatsApp: +{vendor.phone}</span>
            </a>

            <button
              onClick={onOpenSettings}
              className="p-1 text-stone-800 hover:text-stone-950 hover:bg-amber-400 rounded transition-colors"
              title="Configurações do vendedor e senha"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1 px-2 py-1 bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold rounded text-xs transition-colors"
              title="Bloquear tela do vendedor"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">Bloquear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-xs">
            ⚽
          </div>
          <span className="text-base font-bold tracking-tight text-stone-900 whitespace-nowrap hidden sm:inline">
            Espetinho FC <span className="text-amber-600 font-extrabold">Vendas</span>
          </span>
        </div>

        {/* Desktop Navigation Tabs - Exactly in the structure of the attachment */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('comandas')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'comandas'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Comandas</span>
          </button>

          <button
            onClick={() => setActiveTab('lucro')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'lucro'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Lucro & Financeiro</span>
          </button>

          <button
            onClick={() => setActiveTab('compras')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'compras'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Compras / Gastos</span>
          </button>

          <button
            onClick={() => setActiveTab('devedores')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'devedores'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Fiados por Data</span>
          </button>

          <button
            onClick={() => setActiveTab('historico')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'historico'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Pagamentos</span>
          </button>

          <button
            onClick={() => setActiveTab('clientes')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'clientes'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Clientes</span>
          </button>

          <button
            onClick={() => setActiveTab('produtos')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'produtos'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Produtos</span>
          </button>

          <button
            onClick={() => setActiveTab('fechamento')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'fechamento'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Fechamento</span>
          </button>

          <button
            onClick={() => setActiveTab('planilha')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'planilha'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Fórmulas Excel</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
