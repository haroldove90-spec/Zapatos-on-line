import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Wrench, 
  Sparkles, 
  Database, 
  ShieldAlert, 
  HelpCircle,
  Clock
} from 'lucide-react';

import { Product, ServiceBase, Addon, Order, UserProfile, BrandPartner } from './types';
import { 
  generateShoeCatalog, 
  INITIAL_LIQUIDS, 
  INITIAL_SERVICES, 
  INITIAL_ADDONS, 
  INITIAL_BRANDS, 
  INITIAL_ORDERS 
} from './mockData';

import CustomerView from './components/CustomerView';
import AdminView from './components/AdminView';
import OperatorView from './components/OperatorView';

export default function App() {
  // Global Role state: 'customer' | 'admin' | 'operator'
  const [currentRole, setCurrentRole] = useState<'customer' | 'admin' | 'operator'>('customer');
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  // Shared state engines loaded from localStorage if exist, else seeded
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<ServiceBase[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [brands, setBrands] = useState<BrandPartner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Load and seed state on mount
  useEffect(() => {
    // 1. Products (Zapatos + liquids)
    const localProds = localStorage.getItem('cc_products');
    if (localProds) {
      setProducts(JSON.parse(localProds));
    } else {
      const generatedShoes = generateShoeCatalog(); // 520 shoes
      const combined = [...generatedShoes, ...INITIAL_LIQUIDS];
      setProducts(combined);
      localStorage.setItem('cc_products', JSON.stringify(combined));
    }

    // 2. Services
    const localSrvs = localStorage.getItem('cc_services');
    if (localSrvs) {
      setServices(JSON.parse(localSrvs));
    } else {
      setServices(INITIAL_SERVICES);
      localStorage.setItem('cc_services', JSON.stringify(INITIAL_SERVICES));
    }

    // 3. Addons
    const localAddons = localStorage.getItem('cc_addons');
    if (localAddons) {
      setAddons(JSON.parse(localAddons));
    } else {
      setAddons(INITIAL_ADDONS);
      localStorage.setItem('cc_addons', JSON.stringify(INITIAL_ADDONS));
    }

    // 4. Brands
    const localBrands = localStorage.getItem('cc_brands');
    if (localBrands) {
      setBrands(JSON.parse(localBrands));
    } else {
      setBrands(INITIAL_BRANDS);
      localStorage.setItem('cc_brands', JSON.stringify(INITIAL_BRANDS));
    }

    // 5. Orders
    const localOrders = localStorage.getItem('cc_orders');
    if (localOrders) {
      setOrders(JSON.parse(localOrders));
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('cc_orders', JSON.stringify(INITIAL_ORDERS));
    }

    // 6. Registered Users
    const localUsers = localStorage.getItem('cc_users');
    const defaultUser: UserProfile = {
      id: 'usr-default',
      name: 'Juan Pérez García',
      email: 'appdesignh51048817@gmail.com',
      phone: '5543210987',
      address: 'Avenida de la Constitución 1024, Glorieta Juárez, CDMX',
      birthday: '1992-06-18'
    };
    if (localUsers) {
      setRegisteredUsers(JSON.parse(localUsers));
    } else {
      const initUsers = [defaultUser];
      setRegisteredUsers(initUsers);
      localStorage.setItem('cc_users', JSON.stringify(initUsers));
    }

    // Set guest initially so they can use the login/registration form with any email and password
    const localCurrentUser = localStorage.getItem('cc_current_user');
    if (localCurrentUser) {
      setCurrentUser(JSON.parse(localCurrentUser));
    } else {
      setCurrentUser(null);
    }

  }, []);

  // Save states to localStorage whenever they change
  const saveProducts = (updatedProds: Product[]) => {
    setProducts(updatedProds);
    localStorage.setItem('cc_products', JSON.stringify(updatedProds));
  };

  const saveServices = (updatedSrvs: ServiceBase[]) => {
    setServices(updatedSrvs);
    localStorage.setItem('cc_services', JSON.stringify(updatedSrvs));
  };

  const saveAddons = (updatedAddons: Addon[]) => {
    setAddons(updatedAddons);
    localStorage.setItem('cc_addons', JSON.stringify(updatedAddons));
  };

  const saveBrands = (updatedBrands: BrandPartner[]) => {
    setBrands(updatedBrands);
    localStorage.setItem('cc_brands', JSON.stringify(updatedBrands));
  };

  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('cc_orders', JSON.stringify(updatedOrders));
  };

  const saveCurrentUser = (user: UserProfile) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('cc_current_user', JSON.stringify(user));
      // Save/Add to registeredUsers if not already there
      const exists = registeredUsers.some(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (!exists) {
        const expanded = [user, ...registeredUsers];
        setRegisteredUsers(expanded);
        localStorage.setItem('cc_users', JSON.stringify(expanded));
      }
    } else {
      localStorage.removeItem('cc_current_user');
    }
  };

  // Add order callback helper
  const handleAddOrder = (newOrder: Order) => {
    const updated = [newOrder, ...orders];
    saveOrders(updated);
  };

  // Status modifier helper for operators
  const handleUpdateOrderStatus = (orderId: string, newStatus: any) => {
    const updated = orders.map(o => 
      o.id === orderId 
        ? { ...o, status: newStatus }
        : o
    );
    saveOrders(updated);
  };

  // Simulated Time display formatted
  const currentTimeString = '2026-05-27 04:07 - Real-Time UTC';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* RENDER ACTIVE ROUTE VIEW GRID */}
      <div className="flex-grow">
        {currentRole === 'customer' && (
          <CustomerView 
            products={products}
            services={services}
            addons={addons}
            brands={brands}
            orders={orders}
            onAddOrder={handleAddOrder}
            currentUser={currentUser}
            onSetCurrentUser={saveCurrentUser}
          />
        )}

        {currentRole === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <AdminView 
              products={products}
              services={services}
              addons={addons}
              brands={brands}
              orders={orders}
              registeredUsers={registeredUsers}
              onUpdateProducts={saveProducts}
              onUpdateServices={saveServices}
              onUpdateAddons={saveAddons}
              onUpdateBrands={saveBrands}
              onUpdateOrders={saveOrders}
            />
          </div>
        )}

        {currentRole === 'operator' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <OperatorView 
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          </div>
        )}
      </div>

      {/* FLOATING ACTION BUTTON (FAB) FOR ROLE SELECTION (Bottom-Right) */}
      <div className="fixed bottom-24 right-4 sm:right-6 lg:bottom-8 lg:right-8 z-50 flex flex-col items-end">
        {/* Popover Menu */}
        {showRoleSelector && (
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl p-4 mb-3 w-64 space-y-3 animate-slide-up">
            <div className="border-b border-slate-800 pb-2">
              <h4 className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Selector de Roles (Demo)</h4>
              <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-1 font-mono">
                <Database className="h-3.5 w-3.5 text-blue-400" /> DB Simulada: LocalStorage
              </p>
            </div>
            
            <div className="space-y-1">
              <button
                onClick={() => {
                  setCurrentRole('customer');
                  setShowRoleSelector(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                  currentRole === 'customer' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5" />
                  <span>👤 Cliente (Tienda)</span>
                </div>
                {currentRole === 'customer' && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
              </button>

              <button
                onClick={() => {
                  setCurrentRole('admin');
                  setShowRoleSelector(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                  currentRole === 'admin' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-3.5 w-3.5" />
                  <span>⚙️ Administrador</span>
                </div>
                {currentRole === 'admin' && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
              </button>

              <button
                onClick={() => {
                  setCurrentRole('operator');
                  setShowRoleSelector(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                  currentRole === 'operator' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Wrench className="h-3.5 w-3.5" />
                  <span>🛠️ Operador (Staff)</span>
                </div>
                {currentRole === 'operator' && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
              </button>
            </div>
            
            <div className="text-[9px] text-center text-slate-500 font-mono pt-1.5 border-t border-slate-800">
              Presiona para cambiar de vista interactiva
            </div>
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          onClick={() => setShowRoleSelector(!showRoleSelector)}
          className="bg-neutral-950 border border-slate-800 hover:bg-neutral-900 text-white flex items-center gap-2.5 px-4.5 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          id="floating-role-selector"
        >
          <div className="relative">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block animate-ping absolute -top-0.5 -right-0.5" />
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full inline-block absolute -top-0.5 -right-0.5" />
            <span className="text-base select-none">🔑</span>
          </div>
          <span className="text-xs font-black uppercase tracking-wider font-mono">
            {currentRole === 'customer' ? 'Roles' : currentRole === 'admin' ? 'Ver Admin' : 'Ver Operador'}
          </span>
        </button>
      </div>

      {/* Small informative toast for developers visiting */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 font-mono mt-auto">
        <p>Clean & Care - Plataforma Omnicanal de Tintorería & Restauración de Calzado.</p>
        <p className="text-3xs mt-1 text-slate-350">
          Desarrollado en React, TypeScript y Tailwind CSS de acuerdo a requerimientos de diseño de cliente.
        </p>
      </footer>

    </div>
  );
}
