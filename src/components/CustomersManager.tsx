import React, { useState } from 'react';
import { CustomerItem, EventSession } from '../types';
import { formatCurrency } from '../storage';
import { User, Plus, Trash2, Edit2, MessageCircle } from 'lucide-react';

interface CustomersManagerProps {
  customers: CustomerItem[];
  session: EventSession;
  onUpdateCustomers: (updated: CustomerItem[]) => void;
}

const EMOJI_OPTIONS = [
  '⚽', '🍻', '🍺', '🤠', '😎', '🔥', '👑', '🧢', '🟨', '🎯', 
  '🍗', '🥩', '🍔', '🌭', '🍟', '🥤', '🍷', '🏆', '⭐', '⚡', 
  '🚗', '🛵', '🎸', '🎤', '👵', '🧔', '👱‍♂️', '🦁', '🚀', '🥊'
];

export const CustomersManager: React.FC<CustomersManagerProps> = ({
  customers,
  session,
  onUpdateCustomers,
}) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('⚽');
  const [phone, setPhone] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      onUpdateCustomers(
        customers.map((c) =>
          c.id === editingId ? { ...c, name: name.trim(), emoji, phone: phone.trim() } : c
        )
      );
      setEditingId(null);
    } else {
      const newCustomer: CustomerItem = {
        id: `cust-${Date.now()}`,
        name: name.trim(),
        emoji,
        phone: phone.trim(),
      };
      onUpdateCustomers([...customers, newCustomer]);
    }

    setName('');
    setPhone('');
    setEmoji('⚽');
  };

  const handleEdit = (cust: CustomerItem) => {
    setEditingId(cust.id);
    setName(cust.name);
    setEmoji(cust.emoji);
    setPhone(cust.phone || '');
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente remover este cliente do cadastro?')) {
      onUpdateCustomers(customers.filter((c) => c.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setName('');
        setPhone('');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-stone-900 mb-1">
          Gerenciar Amigos / Clientes Cadastrados
        </h2>
        <p className="text-xs text-stone-500 mb-4">
          Adicione ou edite os amigos que compram nos campeonatos para abrir comandas rápidas com um toque.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Nome ou Apelido no Time
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Paulinho Camisa 10"
              required
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Ícone / Emoji
            </label>
            <select
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="w-full px-3 py-2 text-base border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
            >
              {EMOJI_OPTIONS.map((em) => (
                <option key={em} value={em}>
                  {em}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              WhatsApp (Opcional)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="11987654321"
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50 font-mono"
            />
          </div>

          <div className="sm:col-span-4 flex justify-end gap-2 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName('');
                  setPhone('');
                }}
                className="px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Cancelar Edição
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              {editingId ? 'Salvar Alterações' : 'Cadastrar Amigo'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Clientes */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center">
          <h3 className="text-sm font-bold text-stone-900">Clientes Cadastrados</h3>
          <span className="text-xs text-stone-500 font-mono">
            {customers.length} amigos
          </span>
        </div>

        <div className="divide-y divide-stone-200">
          {customers.map((c) => {
            const pendingFiados = session.fiados.filter(
              (f) => f.customerName.toLowerCase() === c.name.toLowerCase() && f.status === 'Pendente'
            );
            const totalPending = pendingFiados.reduce((acc, f) => acc + (f.totalAmount || 0), 0);

            return (
              <div key={c.id} className="p-4 flex items-center justify-between hover:bg-stone-50/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.emoji}</span>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{c.name}</h4>
                    <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                      {c.phone && <span className="font-mono">+{c.phone}</span>}
                      {totalPending > 0 ? (
                        <span className="font-mono font-bold text-rose-700">
                          Débito: {formatCurrency(totalPending)}
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-medium">Conta zerada</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Editar amigo"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remover cadastro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
