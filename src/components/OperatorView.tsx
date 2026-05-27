import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  QrCode, 
  Wrench, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  FileText, 
  AlertTriangle,
  Flame,
  Check
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OperatorViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export default function OperatorView({
  orders,
  onUpdateOrderStatus
}: OperatorViewProps) {
  const [operatorSearch, setOperatorSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Simulated scanner state
  const [scanInput, setScanInput] = useState('');
  const [manualCodeSuccess, setManualCodeSuccess] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Recibido' | 'En proceso' | 'Listo'>('Todos');

  // Simulated checklist state for active work
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    inspect: false,
    laces: false,
    clean: false,
    disinfect: false,
    qc: false
  });

  const handleSimulateScan = (orderId: string) => {
    const found = orders.find(o => o.id === orderId);
    if (found) {
      setSelectedOrder(found);
      setScanInput(orderId);
      setManualCodeSuccess(true);
      // Reset checklist
      setChecklist({
        inspect: false,
        laces: false,
        clean: false,
        disinfect: false,
        qc: false
      });
      setTimeout(() => setManualCodeSuccess(false), 2000);
    }
  };

  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(o => o.id.toUpperCase() === scanInput.trim().toUpperCase());
    if (found) {
      setSelectedOrder(found);
      setChecklist({
        inspect: false,
        laces: false,
        clean: false,
        disinfect: false,
        qc: false
      });
      setManualCodeSuccess(true);
      setTimeout(() => setManualCodeSuccess(false), 2000);
    } else {
      alert('Error: Código QR de tique no coincide con ninguna orden en base de datos.');
    }
  };

  const changeStatusInTaller = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    onUpdateOrderStatus(selectedOrder.id, newStatus);
    // Update local reference to keep visual sync
    setSelectedOrder({ ...selectedOrder, status: newStatus });
  };

  const getUrgencyBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Recibido': return 'bg-blue-105 text-blue-800 border-blue-200';
      case 'En proceso': return 'bg-amber-105 text-amber-800 border-amber-200';
      default: return 'bg-emerald-105 text-emerald-800 border-emerald-250';
    }
  };

  const filteredOrdersQueue = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(operatorSearch.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(operatorSearch.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 animate-fade-in" id="operator-taller-view">
      
      {/* Taller / Workshop layout container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Orders list queue */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-150 pb-4">
              <span className="bg-neutral-900 text-yellow-400 font-bold font-mono text-4xs px-2.5 py-1 rounded-full uppercase tracking-widest">
                Taller Matriz
              </span>
              <h2 className="text-lg font-extrabold text-neutral-950 mt-1.5">Cola de Trabajo (Taller)</h2>
              <p className="text-3xs text-slate-400">Inspecciona y procesa las prendas/calzados activos.</p>
            </div>

            {/* Quick scanning box placeholder */}
            <form onSubmit={handleManualCodeSubmit} className="space-y-2">
              <label className="text-3xs font-mono font-bold text-slate-400 uppercase">
                Escanear Código QR del Tique
              </label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <QrCode className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Escribir ID (ej. ORD-9871)..."
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 uppercase font-mono"
                  />
                  {manualCodeSuccess && (
                    <span className="absolute right-3 top-2.5 text-emerald-500 font-bold text-xs animate-bounce">✓</span>
                  )}
                </div>
                <button 
                  type="submit"
                  className="bg-neutral-950 text-white text-xs px-3 py-2 rounded-xl hover:bg-neutral-800 transition"
                >
                  Cargar
                </button>
              </div>
            </form>

            {/* Filters */}
            <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setStatusFilter('Todos')}
                className={`text-4xs font-bold py-1 px-1 rounded-md transition ${statusFilter === 'Todos' ? 'bg-white text-neutral-950 shadow-xs' : 'text-slate-500'}`}
              >
                Todos
              </button>
              <button 
                onClick={() => setStatusFilter('Recibido')}
                className={`text-4xs font-bold py-1 px-1 rounded-md transition ${statusFilter === 'Recibido' ? 'bg-white text-neutral-950 shadow-xs' : 'text-slate-500'}`}
              >
                Recibidos
              </button>
              <button 
                onClick={() => setStatusFilter('En proceso')}
                className={`text-4xs font-bold py-1 px-1 rounded-md transition ${statusFilter === 'En proceso' ? 'bg-white text-neutral-950 shadow-xs' : 'text-slate-500'}`}
              >
                Proceso
              </button>
              <button 
                onClick={() => setStatusFilter('Listo')}
                className={`text-4xs font-bold py-1 px-1 rounded-md transition ${statusFilter === 'Listo' ? 'bg-white text-neutral-950 shadow-xs' : 'text-slate-500'}`}
              >
                Listos
              </button>
            </div>

            {/* Queue listing widget */}
            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
              {filteredOrdersQueue.map((o) => (
                <div 
                  key={o.id}
                  onClick={() => {
                    setSelectedOrder(o);
                    setScanInput(o.id);
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${selectedOrder?.id === o.id ? 'border-neutral-900 bg-neutral-50 shadow-xs' : 'border-slate-150 hover:bg-slate-50/50'}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-mono font-extrabold text-neutral-950">{o.id}</strong>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono uppercase font-bold ${getUrgencyBadge(o.status)}`}>
                        {o.status}
                      </span>
                    </div>
                    <p className="text-3xs text-slate-500">Cliente: {o.customerName.split(' ')[0]}</p>
                    <p className="text-4xs text-slate-400 font-mono italic truncate max-w-[170px]">
                      {o.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                    </p>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSimulateScan(o.id);
                    }}
                    className="p-1 px-2 hover:bg-slate-150 rounded border text-3xs font-mono flex items-center gap-0.5"
                    title="Simular escaneo de etiqueta de caja"
                  >
                    <QrCode className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {filteredOrdersQueue.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-8">No hay tiques en este filtro.</p>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 text-center">
            <span className="text-[10px] text-slate-400 font-mono">Clean & Care Studio • Panel de Operador v1.0</span>
          </div>
        </div>

        {/* Right Column: Dynamic active workshop process station workbench */}
        <div className="lg:col-span-8 space-y-6">
          {selectedOrder ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
              
              {/* Bench Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-150 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 bg-yellow-400 text-neutral-950 rounded-lg">
                      <Wrench className="h-4.5 w-4.5" />
                    </span>
                    <h2 className="text-xl font-bold text-neutral-950 font-sans">Mesa de Trabajo: {selectedOrder.id}</h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    Procesando pedido para <strong>{selectedOrder.customerName}</strong> ({selectedOrder.customerPhone})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-3xs font-mono text-slate-400 uppercase">Estado taller:</span>
                  <select 
                    value={selectedOrder.status}
                    onChange={(e) => changeStatusInTaller(e.target.value as OrderStatus)}
                    className="text-xs p-2 rounded-xl border border-slate-200 bg-white font-mono font-bold"
                  >
                    <option value="Recibido">Recibido (En Espera)</option>
                    <option value="En proceso">En Proceso (Taller)</option>
                    <option value="Listo">Listo para Entrega ⭐</option>
                  </select>
                </div>
              </div>

              {/* Items details breakdown */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-4">
                <h3 className="font-extrabold text-xs uppercase tracking-wide text-slate-400 font-mono">DETALLES DEL TRABAJO CONTRATADO</h3>
                <div className="divide-y divide-slate-200/60">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between items-start text-xs sm:text-sm">
                      <div className="space-y-0.5">
                        <strong className="text-neutral-950">{item.quantity}x {item.name}</strong>
                        {item.detailsSummary && (
                          <div className="text-3xs text-slate-500 bg-white p-2 rounded border border-slate-150 max-w-sm mt-1 italic">
                            Especificado: {item.detailsSummary}
                          </div>
                        )}
                        {item.type === 'service' ? (
                          <span className="bg-yellow-105 text-amber-900 border border-yellow-200 text-4xs px-1.5 py-0.2 rounded font-mono">
                            SERVICIO TALLER
                          </span>
                        ) : (
                          <span className="bg-blue-105 text-blue-900 border border-blue-200 text-4xs px-1.5 py-0.2 rounded font-mono">
                            DESPACHO ALMACÉN
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-neutral-950">${item.price * item.quantity} MXN</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive task checklist to guides the worker */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-extrabold text-xs text-neutral-950 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Protocolo Obligatorio de Calidad en Taller</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border">
                    Checklist de operaciones
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div 
                    onClick={() => setChecklist({ ...checklist, inspect: !checklist.inspect })}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${checklist.inspect ? 'bg-slate-50 border-emerald-500/30' : 'border-slate-150'}`}
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${checklist.inspect ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                      {checklist.inspect && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className="text-2xs font-semibold text-slate-700">1. Inspección de materiales preliminar</span>
                  </div>

                  <div 
                    onClick={() => setChecklist({ ...checklist, laces: !checklist.laces })}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${checklist.laces ? 'bg-slate-50 border-emerald-500/30' : 'border-slate-150'}`}
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${checklist.laces ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                      {checklist.laces && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className="text-2xs font-semibold text-slate-700">2. Retiro de agujetas / Clasificación de telas</span>
                  </div>

                  <div 
                    onClick={() => setChecklist({ ...checklist, clean: !checklist.clean })}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${checklist.clean ? 'bg-slate-50 border-emerald-500/30' : 'border-slate-150'}`}
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${checklist.clean ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                      {checklist.clean && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className="text-2xs font-semibold text-slate-700">3. Lavado ultrasónico / Tratamiento orgánico</span>
                  </div>

                  <div 
                    onClick={() => setChecklist({ ...checklist, disinfect: !checklist.disinfect })}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${checklist.disinfect ? 'bg-slate-50 border-emerald-500/30' : 'border-slate-150'}`}
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${checklist.disinfect ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                      {checklist.disinfect && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className="text-2xs font-semibold text-slate-700">4. Secado térmico UV / Ozonización</span>
                  </div>
                </div>

                <div className="bg-yellow-50/50 p-4 rounded-2xl border border-yellow-200/70 text-2xs text-yellow-900 flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Indicaciones de Cuidado de Planta:</p>
                    <p className="text-slate-600 mt-1 leading-relaxed">
                      Si el tique unifica calzados seminuevos de alta gama para entrega directa, asegúrate de blanquear bordes laterales y cepillar con cerdas de cerdo finas para evitar desgaste en capelladas Primeknit.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status workflow triggers */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  onClick={() => changeStatusInTaller('En proceso')}
                  className="flex-1 py-3 border border-amber-300 text-amber-900 bg-amber-50 rounded-xl hover:bg-amber-100 transition text-xs font-bold"
                >
                  Cambiar a: En Proceso (Taller)
                </button>
                <button 
                  onClick={() => changeStatusInTaller('Listo')}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition text-xs font-bold flex items-center justify-center gap-2"
                >
                  <span>Completar: Listo para Entrega ⭐</span>
                  <Check className="h-4 w-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="h-[520px] bg-white border border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-8 space-y-4 shadow-3s">
              <div className="p-4 bg-slate-100 rounded-3xl text-slate-450 text-4xl animate-pulse">
                ⚙️
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h3 className="font-extrabold text-neutral-950 text-base">Banco de Trabajo Inactivo</h3>
                <p className="text-xs text-slate-500">
                  Selecciona una orden de compra mixta de la lista lateral o simula el escaneo con el botón QR para cargar todos los detalles de desinfección o lavado.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap justify-center gap-2">
                <button 
                  onClick={() => {
                    if (orders.length > 0) handleSimulateScan(orders[0].id);
                  }}
                  className="px-4 py-2 bg-neutral-950 text-white rounded-xl text-3xs font-extrabold transition font-mono"
                >
                  Cargar Primer Pedido de la Cola
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
