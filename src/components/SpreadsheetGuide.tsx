import React, { useState } from 'react';
import { Copy, Check, Download, FileSpreadsheet, ExternalLink } from 'lucide-react';

export const SpreadsheetGuide: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleDownloadCsvTemplate = () => {
    const csvContent =
      `# ESTRUTURA RECOMENDADA DE CONTROLE FINANCEIRO - ESPETINHO FC\n\n` +
      `[ABA 1 - COMPRAS E DESPESAS]\n` +
      `Item,Qtd,Custo Unitario,Total Mercadoria,Outras Despesas,Categoria\n` +
      `Espetinhos de Carne/Frango,250,5.00,=B3*C3,0,Mercadoria\n` +
      `Carvao Vegetal,3,30.00,0,90.00,Carvao e Fogo\n` +
      `Paes e Vinagrete,1,85.00,0,85.00,Acompanhamentos\n` +
      `Embalagens e Guardanapos,1,35.00,0,35.00,Embalagens\n` +
      `Taxa do Campeonato,1,80.00,0,80.00,Taxa do Campo\n` +
      `Frete e Transporte,1,50.00,0,50.00,Transporte\n` +
      `SUBTOTAL MERCADORIA,,,=D3,,\n` +
      `SUBTOTAL OUTRAS DESPESAS,,,,=SOMA(E4:E8),\n` +
      `CUSTO TOTAL DO EVENTO (1),,,,=D9+E10,\n\n` +
      `[ABA 2 - VENDAS E CAIXA]\n` +
      `Periodo,Preco Unitario,Qtd Vendida,Subtotal Faturado,Margem Unitaria,Margem Total\n` +
      `Inicio / 1o Tempo,10.00,95,=B16*C16,=B16-5,=E16*C16\n` +
      `Intervalo / Decisao,10.00,80,=B17*C17,=B17-5,=E17*C17\n` +
      `Final / Promocao,8.00,45,=B18*C18,=B18-5,=E18*C18\n` +
      `TOTAL VENDAS REGISTRADAS,,,=SOMA(D16:D18),,\n\n` +
      `CONFERENCIA REAL DE CAIXA\n` +
      `Metodo,Valor Conferido\n` +
      `Dinheiro Fisico (Gaveta),850.00\n` +
      `Pix em Conta,1020.00\n` +
      `Cartao de Debito/Credito,240.00\n` +
      `FATURAMENTO BRUTO EM CAIXA (2),=SOMA(B23:B25)\n` +
      `DIFERENCA DE CAIXA (6),=B26-D19\n` +
      `STATUS CAIXA,=SE(ABS(B27)<0.01;"Batido";SE(B27>0;"Sobra";"Falta"))\n\n` +
      `[ABA 3 - CONTROLE DE FIADOS]\n` +
      `Cliente,Telefone WhatsApp,Data Venda,Data Limite,Qtd Espetos,Preco Unitario,Total Divida,Status,Data Pagamento,Confirmado Vendedor\n` +
      `Marcao Zagueiro,5511987654321,2026-11-10,2026-11-13,4,10.00,=E33*F33,Pendente,,SIM\n` +
      `Beto Tecnico,5511977776666,2026-11-10,2026-11-15,5,10.00,=E34*F34,Pendente,,SIM\n` +
      `Renato Arbitro,5511966665555,2026-11-08,2026-11-09,2,8.00,=E35*F35,Pago,2026-11-10,SIM\n` +
      `TOTAL FIADO PENDENTE (3),=SOMASE(H33:H35;"Pendente";G33:G35)\n` +
      `TOTAL FIADO PAGO,=SOMASE(H33:H35;"Pago";G33:G35)\n\n` +
      `[ABA 4 - FECHAMENTO E LUCRO]\n` +
      `Indicador,Formula/Origem,Valor\n` +
      `1. Custo Total do Evento,='Compras e Despesas'!E11,1590.00\n` +
      `2. Faturamento Bruto em Caixa,='Vendas e Caixa'!B26,2110.00\n` +
      `3. Total Fiado Pendente,='Controle de Fiados'!G36,90.00\n` +
      `4. Lucro Liquido Realizado,=B43-B42,520.00\n` +
      `5. Lucro Projetado Total,=(B43+B44)-B42,610.00\n` +
      `6. Diferenca de Caixa,='Vendas e Caixa'!B27,0.00\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'planilha_financeiro_espetinho_fc.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner de Apresentação */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Estrutura de Tabelas & Fórmulas para Google Sheets / Excel
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Modelagem pronta para você copiar e colar diretamente na sua planilha com as fórmulas exatas em português.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadCsvTemplate}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            Baixar Modelo CSV Pronto
          </button>
        </div>

        <p className="text-xs text-stone-600 mt-4 leading-relaxed">
          Esta modelagem foi desenhada sob medida para a venda de espetinhos em jogos de futebol com precificação flexível (R$ 10 / R$ 8), custo fixo de compra de R$ 5,00, gestão rigorosa de fiados e conciliação física de caixa.
        </p>
      </div>

      {/* PLANILHA 1: COMPRAS E DESPESAS */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-500 text-stone-950 text-xs font-bold rounded">
              Aba 1
            </span>
            <h3 className="text-sm font-bold">Compras & Despesas do Evento</h3>
          </div>

          <button
            onClick={() =>
              copyToClipboard(
                `=B2*5\n=SOMA(D2:D50)\n=SOMA(E2:E50)\n=D51+E51`,
                'formulas-compras'
              )
            }
            className="text-xs font-semibold text-stone-300 hover:text-white flex items-center gap-1.5"
          >
            {copiedSection === 'formulas-compras' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copiedSection === 'formulas-compras' ? 'Copiado!' : 'Copiar Fórmulas'}
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-stone-200">
              <thead className="bg-stone-100 font-semibold text-stone-700">
                <tr>
                  <th className="p-2.5 border-r border-stone-200">Coluna A: Item / Despesa</th>
                  <th className="p-2.5 border-r border-stone-200">Coluna B: Quantidade</th>
                  <th className="p-2.5 border-r border-stone-200">Coluna C: Custo Unitário</th>
                  <th className="p-2.5 border-r border-stone-200">Coluna D: Total Mercadoria</th>
                  <th className="p-2.5">Coluna E: Outras Despesas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono text-stone-800">
                <tr>
                  <td className="p-2.5 font-sans border-r border-stone-200">Espetinhos (Compra)</td>
                  <td className="p-2.5 border-r border-stone-200">250</td>
                  <td className="p-2.5 border-r border-stone-200">R$ 5,00</td>
                  <td className="p-2.5 bg-amber-50 font-bold border-r border-stone-200 text-amber-900">
                    =B2*5 (ou =B2*C2)
                  </td>
                  <td className="p-2.5 text-stone-400">-</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans border-r border-stone-200">Carvão Vegetal 10kg (3 sacos)</td>
                  <td className="p-2.5 border-r border-stone-200">3</td>
                  <td className="p-2.5 border-r border-stone-200">R$ 30,00</td>
                  <td className="p-2.5 border-r border-stone-200 text-stone-400">-</td>
                  <td className="p-2.5 font-bold">R$ 90,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans border-r border-stone-200">Pães e Vinagrete</td>
                  <td className="p-2.5 border-r border-stone-200">1</td>
                  <td className="p-2.5 border-r border-stone-200">R$ 85,00</td>
                  <td className="p-2.5 border-r border-stone-200 text-stone-400">-</td>
                  <td className="p-2.5 font-bold">R$ 85,00</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans border-r border-stone-200">Taxa de Espaço no Torneio</td>
                  <td className="p-2.5 border-r border-stone-200">1</td>
                  <td className="p-2.5 border-r border-stone-200">R$ 80,00</td>
                  <td className="p-2.5 border-r border-stone-200 text-stone-400">-</td>
                  <td className="p-2.5 font-bold">R$ 80,00</td>
                </tr>
                <tr className="bg-stone-50 font-bold text-stone-900">
                  <td colSpan={3} className="p-2.5 font-sans border-r border-stone-200 text-right">
                    Subtotais:
                  </td>
                  <td className="p-2.5 border-r border-stone-200 bg-amber-100/70">
                    =SOMA(D2:D10)
                  </td>
                  <td className="p-2.5 bg-stone-200">
                    =SOMA(E2:E10)
                  </td>
                </tr>
                <tr className="bg-stone-900 text-white font-bold">
                  <td colSpan={3} className="p-2.5 font-sans border-r border-stone-700 text-right">
                    1. CUSTO TOTAL DO EVENTO:
                  </td>
                  <td colSpan={2} className="p-2.5 text-amber-400 text-sm">
                    =D11 + E11 &nbsp;&nbsp;(Mercadoria + Outras Despesas)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PLANILHA 2: VENDAS E CAIXA */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-500 text-stone-950 text-xs font-bold rounded">
              Aba 2
            </span>
            <h3 className="text-sm font-bold">Registro de Vendas e Caixa</h3>
          </div>

          <button
            onClick={() =>
              copyToClipboard(
                `=B2*C2\n=B2-5\n=C2*E2\n=SOMA(D2:D10)\n=SOMA(B15:B17)\n=B18-D11\n=SE(ABS(B19)<0.01; "Caixa Batido"; SE(B19>0; "Sobra no Caixa"; "Falta no Caixa"))`,
                'formulas-vendas'
              )
            }
            className="text-xs font-semibold text-stone-300 hover:text-white flex items-center gap-1.5"
          >
            {copiedSection === 'formulas-vendas' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copiedSection === 'formulas-vendas' ? 'Copiado!' : 'Copiar Fórmulas'}
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-stone-200">
              <thead className="bg-stone-100 font-semibold text-stone-700">
                <tr>
                  <th className="p-2.5 border-r border-stone-200">A: Período / Momento</th>
                  <th className="p-2.5 border-r border-stone-200">B: Preço de Venda</th>
                  <th className="p-2.5 border-r border-stone-200">C: Quantidade</th>
                  <th className="p-2.5 border-r border-stone-200">D: Subtotal Faturado</th>
                  <th className="p-2.5 border-r border-stone-200">E: Margem Unitária</th>
                  <th className="p-2.5">F: Margem Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono text-stone-800">
                <tr>
                  <td className="p-2.5 font-sans border-r border-stone-200">Início / 1º Tempo</td>
                  <td className="p-2.5 border-r border-stone-200">R$ 10,00</td>
                  <td className="p-2.5 border-r border-stone-200">95</td>
                  <td className="p-2.5 border-r border-stone-200 font-bold bg-amber-50">=B2*C2 (R$ 950)</td>
                  <td className="p-2.5 border-r border-stone-200">=B2 - 5,00 (R$ 5,00)</td>
                  <td className="p-2.5 font-bold text-emerald-700">=C2*E2 (R$ 475)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans border-r border-stone-200">Intervalo do Jogo</td>
                  <td className="p-2.5 border-r border-stone-200">R$ 10,00</td>
                  <td className="p-2.5 border-r border-stone-200">80</td>
                  <td className="p-2.5 border-r border-stone-200 font-bold bg-amber-50">=B3*C3 (R$ 800)</td>
                  <td className="p-2.5 border-r border-stone-200">=B3 - 5,00 (R$ 5,00)</td>
                  <td className="p-2.5 font-bold text-emerald-700">=C3*E3 (R$ 400)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans border-r border-stone-200">Fim de Jogo (Promoção)</td>
                  <td className="p-2.5 border-r border-stone-200">R$ 8,00</td>
                  <td className="p-2.5 border-r border-stone-200">45</td>
                  <td className="p-2.5 border-r border-stone-200 font-bold bg-sky-50">=B4*C4 (R$ 360)</td>
                  <td className="p-2.5 border-r border-stone-200">=B4 - 5,00 (R$ 3,00)</td>
                  <td className="p-2.5 font-bold text-emerald-700">=C4*E4 (R$ 135)</td>
                </tr>
                <tr className="bg-stone-50 font-bold">
                  <td className="p-2.5 font-sans border-r border-stone-200">Total Vendas Registradas:</td>
                  <td className="p-2.5 border-r border-stone-200">-</td>
                  <td className="p-2.5 border-r border-stone-200">=SOMA(C2:C4)</td>
                  <td className="p-2.5 border-r border-stone-200 text-stone-900 bg-amber-100">=SOMA(D2:D4)</td>
                  <td className="p-2.5 border-r border-stone-200">-</td>
                  <td className="p-2.5 text-emerald-800 bg-emerald-100">=SOMA(F2:F4)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
              Tabela de Conferência de Caixa (Fechamento Físico & Digital)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
              <div className="bg-white p-2.5 rounded border border-stone-200">
                <span className="font-sans block text-stone-500">Célula B15: Dinheiro</span>
                <span className="font-bold">R$ 850,00</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-stone-200">
                <span className="font-sans block text-stone-500">Célula B16: Pix em Conta</span>
                <span className="font-bold">R$ 1.020,00</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-stone-200">
                <span className="font-sans block text-stone-500">Célula B17: Cartão Maquininha</span>
                <span className="font-bold">R$ 240,00</span>
              </div>
            </div>
            <div className="mt-3 p-3 bg-stone-900 text-white rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-stone-400 block font-sans">2. Faturamento Bruto em Caixa:</span>
                <code className="text-emerald-400 font-bold">=SOMA(B15:B17)</code>
              </div>
              <div>
                <span className="text-stone-400 block font-sans">6. Diferença de Caixa:</span>
                <code className="text-amber-400 font-bold">=B18 - D5 (Conferido − Vendas)</code>
              </div>
              <div>
                <span className="text-stone-400 block font-sans">Diagnóstico Automático:</span>
                <code className="text-sky-300 font-bold text-[11px]">=SE(ABS(B19)&lt;0.01; "Batido"; SE(B19&gt;0; "Sobra"; "Falta"))</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PLANILHA 3: CONTROLE DE FIADOS */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-amber-500 text-stone-950 text-xs font-bold rounded">
              Aba 3
            </span>
            <h3 className="text-sm font-bold">Módulo de Vendas Fiadas</h3>
          </div>

          <button
            onClick={() =>
              copyToClipboard(
                `=E2*F2\n=SOMASE(H2:H50; "Pendente"; G2:G50)\n=SOMASE(H2:H50; "Pago"; G2:G50)`,
                'formulas-fiados'
              )
            }
            className="text-xs font-semibold text-stone-300 hover:text-white flex items-center gap-1.5"
          >
            {copiedSection === 'formulas-fiados' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copiedSection === 'formulas-fiados' ? 'Copiado!' : 'Copiar Fórmulas'}
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-stone-200">
              <thead className="bg-stone-100 font-semibold text-stone-700">
                <tr>
                  <th className="p-2 border-r border-stone-200">A: Cliente</th>
                  <th className="p-2 border-r border-stone-200">B: Telefone WhatsApp</th>
                  <th className="p-2 border-r border-stone-200">C: Data Venda</th>
                  <th className="p-2 border-r border-stone-200">D: Data Limite</th>
                  <th className="p-2 border-r border-stone-200">E: Qtd</th>
                  <th className="p-2 border-r border-stone-200">F: Preço</th>
                  <th className="p-2 border-r border-stone-200">G: Total Dívida</th>
                  <th className="p-2 border-r border-stone-200">H: Status</th>
                  <th className="p-2">I: Aviso Vendedor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono text-stone-800">
                <tr>
                  <td className="p-2 font-sans border-r border-stone-200">Marcão Zagueiro</td>
                  <td className="p-2 border-r border-stone-200">11987654321</td>
                  <td className="p-2 border-r border-stone-200">10/11/2026</td>
                  <td className="p-2 border-r border-stone-200">13/11/2026</td>
                  <td className="p-2 border-r border-stone-200">4</td>
                  <td className="p-2 border-r border-stone-200">R$ 10,00</td>
                  <td className="p-2 border-r border-stone-200 font-bold bg-amber-50">=E2*F2 (R$ 40)</td>
                  <td className="p-2 border-r border-stone-200 font-sans font-bold text-amber-800">Pendente</td>
                  <td className="p-2 font-sans text-stone-500">Baixa c/ confirmação</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans border-r border-stone-200">Beto Técnico</td>
                  <td className="p-2 border-r border-stone-200">11977776666</td>
                  <td className="p-2 border-r border-stone-200">10/11/2026</td>
                  <td className="p-2 border-r border-stone-200">15/11/2026</td>
                  <td className="p-2 border-r border-stone-200">5</td>
                  <td className="p-2 border-r border-stone-200">R$ 10,00</td>
                  <td className="p-2 border-r border-stone-200 font-bold bg-amber-50">=E3*F3 (R$ 50)</td>
                  <td className="p-2 border-r border-stone-200 font-sans font-bold text-amber-800">Pendente</td>
                  <td className="p-2 font-sans text-stone-500">Baixa c/ confirmação</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans border-r border-stone-200">Renato Árbitro</td>
                  <td className="p-2 border-r border-stone-200">11966665555</td>
                  <td className="p-2 border-r border-stone-200">08/11/2026</td>
                  <td className="p-2 border-r border-stone-200">09/11/2026</td>
                  <td className="p-2 border-r border-stone-200">2</td>
                  <td className="p-2 border-r border-stone-200">R$ 8,00</td>
                  <td className="p-2 border-r border-stone-200 font-bold bg-emerald-50">=E4*F4 (R$ 16)</td>
                  <td className="p-2 border-r border-stone-200 font-sans font-bold text-emerald-800">Pago</td>
                  <td className="p-2 font-sans text-stone-500">Pix confirmado</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <span className="font-sans font-semibold text-amber-900 block">
                3. Total Fiado Pendente (A Receber):
              </span>
              <code className="text-amber-950 font-bold block mt-1">
                =SOMASE(H2:H100; "Pendente"; G2:G100)
              </code>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <span className="font-sans font-semibold text-emerald-900 block">
                Total Fiado Já Quitado (Confirmado):
              </span>
              <code className="text-emerald-950 font-bold block mt-1">
                =SOMASE(H2:H100; "Pago"; G2:G100)
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* PLANILHA 4: PAINEL DE FECHAMENTO COM OS 6 CÁLCULOS */}
      <div className="bg-stone-900 text-white rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between border-b border-stone-700 pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white">
              Aba 4: Painel de Fechamento Geral (Os 6 Cálculos Automáticos)
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Fórmulas integradas que cruzam os dados das abas anteriores no Excel ou Google Sheets.
            </p>
          </div>

          <button
            onClick={() =>
              copyToClipboard(
                `='Compras_Despesas'!D12\n='Vendas_Caixa'!B18\n='Controle_Fiados'!G102\n=B2-B1\n=(B2+B3)-B1\n='Vendas_Caixa'!B19`,
                'formulas-fechamento'
              )
            }
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
          >
            {copiedSection === 'formulas-fechamento' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copiedSection === 'formulas-fechamento' ? 'Copiado!' : 'Copiar Todas Fórmulas'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="border border-stone-800 rounded-lg p-3.5 bg-stone-950/60">
            <span className="font-sans font-bold text-stone-300 block">1. Custo Total do Evento</span>
            <code className="text-amber-400 font-bold block mt-1">='Compras_Despesas'!D12</code>
            <span className="font-sans text-stone-400 text-[11px] mt-0.5 block">
              (Qtd Comprada × 5,00) + Outras Despesas
            </span>
          </div>

          <div className="border border-stone-800 rounded-lg p-3.5 bg-stone-950/60">
            <span className="font-sans font-bold text-stone-300 block">2. Faturamento Bruto em Caixa</span>
            <code className="text-emerald-400 font-bold block mt-1">='Vendas_Caixa'!B18</code>
            <span className="font-sans text-stone-400 text-[11px] mt-0.5 block">
              Dinheiro Físico + Pix + Cartão conferidos
            </span>
          </div>

          <div className="border border-stone-800 rounded-lg p-3.5 bg-stone-950/60">
            <span className="font-sans font-bold text-stone-300 block">3. Total Fiado Pendente</span>
            <code className="text-amber-400 font-bold block mt-1">
              =SOMASE('Controle_Fiados'!H:H; "Pendente"; 'Controle_Fiados'!G:G)
            </code>
            <span className="font-sans text-stone-400 text-[11px] mt-0.5 block">
              Soma de todas as dívidas não quitadas
            </span>
          </div>

          <div className="border border-stone-800 rounded-lg p-3.5 bg-stone-950/60">
            <span className="font-sans font-bold text-stone-300 block">4. Lucro Líquido Realizado (No Bolso)</span>
            <code className="text-emerald-400 font-bold block mt-1">=B2 - B1 (Caixa Arrecadado − Custo Total)</code>
            <span className="font-sans text-stone-400 text-[11px] mt-0.5 block">
              Resultado em dinheiro líquido após pagar todas as despesas
            </span>
          </div>

          <div className="border border-stone-800 rounded-lg p-3.5 bg-stone-950/60">
            <span className="font-sans font-bold text-stone-300 block">5. Lucro Projetado Total</span>
            <code className="text-sky-400 font-bold block mt-1">=(B2 + B3) - B1</code>
            <span className="font-sans text-stone-400 text-[11px] mt-0.5 block">
              (Caixa Arrecadado + Fiados Pendentes) − Custo Total
            </span>
          </div>

          <div className="border border-stone-800 rounded-lg p-3.5 bg-stone-950/60">
            <span className="font-sans font-bold text-stone-300 block">6. Diferença de Caixa</span>
            <code className="text-amber-300 font-bold block mt-1">='Vendas_Caixa'!B19</code>
            <span className="font-sans text-stone-400 text-[11px] mt-0.5 block">
              Valor Conferido − Vendas Registradas (Sobra / Falta / Batido)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
