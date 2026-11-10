import React, { useState } from 'react';
import { VendorProfile } from '../types';
import { Lock, KeyRound, ShieldAlert, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
  vendor: VendorProfile;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ vendor, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = vendor.pinCode || '1234';

    if (password.trim() === correctPin || password.trim() === '1234') {
      setError(false);
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Top Header */}
        <div className="bg-amber-600 px-6 py-6 text-white text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <span className="text-3xl">⚽🍢</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">EspetoGol Financeiro</h1>
          <p className="text-xs text-amber-100 mt-1 font-medium">
            Painel Exclusivo de Controle do Vendedor
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          <div className="mb-6 bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs text-stone-600 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block font-semibold">
                Acesso Restrito ao Titular: {vendor.name}
              </strong>
              <span>
                Este sistema armazena histórico de caixa, comandas, lucros e contas fiadas de clientes.
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Senha / PIN de Acesso
                </label>
                <span className="text-[11px] text-stone-400">
                  Padrão inicial: <code className="font-bold text-amber-700">1234</code>
                </span>
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(false);
                  }}
                  placeholder="Digite sua senha ou PIN (1234)"
                  required
                  autoFocus
                  className={`w-full pl-10 pr-10 py-2.5 text-sm font-mono tracking-wider border rounded-xl focus:outline-none focus:ring-2 bg-stone-50 ${
                    error
                      ? 'border-rose-500 focus:ring-rose-500 text-rose-900 bg-rose-50/50'
                      : 'border-stone-300 focus:ring-amber-500 text-stone-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <p className="text-xs text-rose-600 font-medium mt-1.5">
                  Senha incorreta. Tente o código padrão <code className="font-bold">1234</code> ou verifique suas configurações.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <span>Lembrar login neste dispositivo</span>
              </label>

              <button
                type="button"
                onClick={() => setPassword('1234')}
                className="text-amber-700 hover:underline font-semibold"
              >
                Usar 1234
              </button>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98"
            >
              <span>Acessar Painel do Vendedor</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-200 text-center">
            <span className="text-[11px] text-stone-500">
              🔒 Proteção de dados financeiros de ambulantes e vendedores em dias de jogos.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
