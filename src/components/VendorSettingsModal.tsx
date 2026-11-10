import React, { useState } from 'react';
import { VendorProfile } from '../types';
import { X, Save, Phone, User, KeyRound, Lock } from 'lucide-react';

interface VendorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: VendorProfile;
  onSave: (updated: VendorProfile) => void;
}

export const VendorSettingsModal: React.FC<VendorSettingsModalProps> = ({
  isOpen,
  onClose,
  vendor,
  onSave,
}) => {
  const [name, setName] = useState(vendor.name);
  const [phone, setPhone] = useState(vendor.phone);
  const [pixKey, setPixKey] = useState(vendor.pixKey);
  const [pixType, setPixType] = useState<VendorProfile['pixType']>(vendor.pixType);
  const [pinCode, setPinCode] = useState(vendor.pinCode || '1234');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim() || 'Vendedor',
      phone: phone.replace(/\D/g, '') || '5511999998888',
      pixKey: pixKey.trim() || phone,
      pixType,
      pinCode: pinCode.trim() || '1234',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-900 text-white">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold">Configurações & Senha do Vendedor</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            Configure seu perfil, a senha de login do painel exclusivo e a chave Pix para receber de clientes e fiados.
          </p>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Senha / PIN de Login (Área Exclusiva)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="Ex: 1234"
                required
                className="w-full pl-9 pr-3 py-2 text-sm font-mono font-bold tracking-widest border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/50"
              />
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">
              Usada para desbloquear o sistema caso você saia ou bloqueie a tela.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Nome do Vendedor / Barraca
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Seu Zé do Espetinho"
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              WhatsApp Oficial (com DDD)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 5511999998888"
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Tipo Pix
              </label>
              <select
                value={pixType}
                onChange={(e) => setPixType(e.target.value as VendorProfile['pixType'])}
                className="w-full px-2.5 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50"
              >
                <option value="telefone">Telefone</option>
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
                <option value="email">E-mail</option>
                <option value="aleatoria">Aleatória</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Chave Pix Oficial
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="Chave Pix para receber pagamentos"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-4 h-4" />
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
