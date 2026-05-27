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
      
      {/* PERSISTENT REAL-TIME MULTI-ROLE SWITCHER FOOTER */}
      <div className="sticky top-0 z-50 bg-neutral-900 border-b border-neutral-800 text-neutral-300 py-2 px-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-yellow-405 text-yellow-400" />
          <span className="font-mono text-2xs tracking-tight text-slate-350">
            Base de Datos: <strong className="text-white">Conectada (Simulada LocalStorage)</strong>
          </span>
          <span className="hidden md:inline text-neutral-600">|</span>
          <span className="hidden md:inline font-mono text-[10px] text-zinc-400 flex items-center gap-1">
            <Clock className="h-3 w-3" /> {currentTimeString}
          </span>
        </div>

        {/* Roles Toggles */}
        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl">
          <span className="text-4xs uppercase tracking-widest font-mono text-slate-500 font-bold px-2">ROL ACTIVO:</span>
          <button 
            onClick={() => setCurrentRole('customer')}
            className={`px-3 py-1 text-2xs font-bold rounded-lg transition ${currentRole === 'customer' ? 'bg-yellow-405 bg-yellow-400 text-neutral-950' : 'text-slate-400 hover:text-white'}`}
            id="role-btn-customer"
          >
            <User className="inline-block h-3.5 w-3.5 mr-1" />
            Cliente (Tienda)
          </button>
          <button 
            onClick={() => setCurrentRole('admin')}
            className={`px-3 py-1 text-2xs font-bold rounded-lg transition ${currentRole === 'admin' ? 'bg-yellow-450 bg-yellow-400 text-neutral-950' : 'text-slate-400 hover:text-white'}`}
            id="role-btn-admin"
          >
            <Settings className="inline-block h-3.5 w-3.5 mr-1" />
            Administrador
          </button>
          <button 
            onClick={() => setCurrentRole('operator')}
            className={`px-3 py-1 text-2xs font-bold rounded-lg transition ${currentRole === 'operator' ? 'bg-yellow-450 bg-yellow-400 text-neutral-950' : 'text-slate-400 hover:text-white'}`}
            id="role-btn-operator"
          >
            <Wrench className="inline-block h-3.5 w-3.5 mr-1" />
            Operador (Staff)
          </button>
        </div>
      </div>

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
