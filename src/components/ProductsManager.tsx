import React, { useState } from 'react';
import { ProductItem } from '../types';
import { formatCurrency, SKEWER_PURCHASE_COST } from '../storage';
import { Plus, Trash2, Edit2, Package, Sparkles } from 'lucide-react';

interface ProductsManagerProps {
  products: ProductItem[];
  onUpdateProducts: (updated: ProductItem[]) => void;
}

export const ProductsManager: React.FC<ProductsManagerProps> = ({
  products,
  onUpdateProducts,
}) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState<number | ''>(5.00);
  const [price, setPrice] = useState<number | ''>(10.00);
  const [category, setCategory] = useState<ProductItem['category']>('Espetinhos');
  const [icon, setIcon] = useState('🍢');
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price === '' || cost === '') return;

    if (editingId) {
      onUpdateProducts(
        products.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: name.trim(),
                cost: Number(cost),
                price: Number(price),
                category,
                icon,
              }
            : p
        )
      );
      setEditingId(null);
    } else {
      const newProduct: ProductItem = {
        id: `prod-${Date.now()}`,
        name: name.trim(),
        cost: Number(cost),
        price: Number(price),
        category,
        icon,
      };
      onUpdateProducts([...products, newProduct]);
    }

    setName('');
    setCost(5.00);
    setPrice(10.00);
    setIcon('🍢');
  };

  const handleEdit = (p: ProductItem) => {
    setEditingId(p.id);
    setName(p.name);
    setCost(p.cost);
    setPrice(p.price);
    setCategory(p.category || 'Espetinhos');
    setIcon(p.icon || '🍢');
  };

  const handleDelete = (id: string | number) => {
    if (confirm('Deseja remover este produto do cardápio?')) {
      onUpdateProducts(products.filter((p) => p.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setName('');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-stone-900 mb-1">
          Gerenciar Produtos, Preços e Custos Unitários
        </h2>
        <p className="text-xs text-stone-500 mb-4">
          Tabela base de precificação: Custo tabelado de <strong className="text-stone-800">R$ 5,00 por espetinho</strong> com preços flexíveis de R$ 10,00 e R$ 8,00.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Nome do Produto
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Espetinho de Carne / Frango"
              required
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Ícone
            </label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3 py-2 text-base border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
            >
              <option value="🍢">🍢 Espeto</option>
              <option value="🍺">🍺 Cerveja</option>
              <option value="🥤">🥤 Refrigerante</option>
              <option value="💧">💧 Água</option>
              <option value="🥖">🥖 Pão de Alho</option>
              <option value="🏷️">🏷️ Promoção</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductItem['category'])}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
            >
              <option value="Espetinhos">Espetinhos</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Acompanhamentos">Acompanhamentos</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Custo de Compra (R$)
            </label>
            <input
              type="number"
              step="0.10"
              min="0"
              value={cost}
              onChange={(e) => setCost(parseFloat(e.target.value) || '')}
              placeholder="5.00"
              required
              className="w-full px-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Preço de Venda (R$)
            </label>
            <input
              type="number"
              step="0.50"
              min="0.50"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || '')}
              placeholder="10.00"
              required
              className="w-full px-3 py-2 text-sm font-mono font-bold border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-stone-50"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end gap-2">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName('');
                  setCost(5.00);
                  setPrice(10.00);
                }}
                className="px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              {editingId ? 'Salvar Produto' : 'Adicionar Produto'}
            </button>
          </div>
        </form>
      </div>

      {/* Grid de Produtos com Margem de Lucro */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => {
          const unitProfit = p.price - p.cost;
          const marginPct = p.price > 0 ? (unitProfit / p.price) * 100 : 0;

          return (
            <div
              key={p.id}
              className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{p.icon || '🍢'}</span>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{p.name}</h4>
                    <span className="text-[11px] text-stone-500 font-mono">
                      Custo: {formatCurrency(p.cost)} · Venda: {formatCurrency(p.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-1 text-stone-400 hover:text-amber-700 rounded transition-colors"
                    title="Editar produto"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                    title="Excluir produto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-700 font-mono">
                  Lucro: +{formatCurrency(unitProfit)}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono text-[10px]">
                  {marginPct.toFixed(0)}% margem
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
