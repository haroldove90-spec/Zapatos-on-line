import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Settings, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Layers, 
  Users, 
  FolderPlus, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCircle,
  Plus,
  RefreshCw,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { Product, ServiceBase, Addon, Order, UserProfile, BrandPartner } from '../types';

interface AdminViewProps {
  products: Product[];
  services: ServiceBase[];
  addons: Addon[];
  brands: BrandPartner[];
  orders: Order[];
  registeredUsers: UserProfile[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateServices: (services: ServiceBase[]) => void;
  onUpdateAddons: (addons: Addon[]) => void;
  onUpdateBrands: (brands: BrandPartner[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
}

export default function AdminView({
  products,
  services,
  addons,
  brands,
  orders,
  registeredUsers,
  onUpdateProducts,
  onUpdateServices,
  onUpdateAddons,
  onUpdateBrands,
  onUpdateOrders
}: AdminViewProps) {
  // Navigation Tabs inside admin
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'services' | 'orders' | 'users'>('dashboard');

  // Search filter
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Editing state for products
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Zapatos' as 'Zapatos' | 'Líquido de Limpieza',
    price: 0,
    stock: 0,
    brand: '',
    description: '',
    imageUrl: ''
  });

  // Editing state for brand partners
  const [brandForm, setBrandForm] = useState({
    name: '',
    description: ''
  });

  // Editing state for services
  const [editingService, setEditingService] = useState<ServiceBase | null>(null);
  const [servicePriceForm, setServicePriceForm] = useState<number>(0);

  // Editing state for addons
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [addonForm, setAddonForm] = useState({
    name: '',
    price: 0,
    category: 'Zapatos' as 'Zapatos' | 'Cloth',
    description: ''
  });

  // Calculations for KPI widgets
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const activeOrders = orders.filter(o => o.status !== 'Listo').length;
    const completedOrders = orders.filter(o => o.status === 'Listo').length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalShoesCount = products.filter(p => p.category === 'Zapatos').length;
    
    return {
      totalRevenue,
      activeOrders,
      completedOrders,
      totalStock,
      totalShoesCount
    };
  }, [orders, products]);

  // Product Actions
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Zapatos',
      price: 1500,
      stock: 10,
      brand: 'Nike',
      description: 'Descripción del nuevo calzado o producto de la lista oficial.',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60'
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category as 'Zapatos' | 'Líquido de Limpieza',
      price: prod.price,
      stock: prod.stock,
      brand: prod.brand,
      description: prod.description,
      imageUrl: prod.imageUrl
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      // Modify
      const updated = products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...productForm }
          : p
      );
      onUpdateProducts(updated);
    } else {
      // Create
      const newProd: Product = {
        id: `shoe-${Date.now()}`,
        name: productForm.name,
        category: productForm.category as 'Zapatos' | 'Líquido de Limpieza' | 'Ropa',
        price: productForm.price,
        stock: productForm.stock,
        brand: productForm.brand,
        description: productForm.description,
        imageUrl: productForm.imageUrl
      };
      onUpdateProducts([newProd, ...products]);
    }
    setIsProductModalOpen(false);
  };

  const deleteProduct = (prodId: string) => {
    if (confirm('¿Estás seguro de eliminar este producto del inventario?')) {
      onUpdateProducts(products.filter(p => p.id !== prodId));
    }
  };

  // Brand partners actions
  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandForm.name) return;
    const newBrand: BrandPartner = {
      id: `brand-${Date.now()}`,
      name: brandForm.name,
      description: brandForm.description || 'Socio oficial de la tienda Clean & Care.'
    };
    onUpdateBrands([...brands, newBrand]);
    setBrandForm({ name: '', description: '' });
  };

  const deleteBrand = (brandId: string) => {
    if (confirm('¿Eliminar este Socio Marca del listado de la app?')) {
      onUpdateBrands(brands.filter(b => b.id !== brandId));
    }
  };

  // Base Service pricing actions
  const startEditService = (srv: ServiceBase) => {
    setEditingService(srv);
    setServicePriceForm(srv.basePrice);
  };

  const submitServicePrice = () => {
    if (!editingService) return;
    const updated = services.map(s => 
      s.id === editingService.id 
        ? { ...s, basePrice: Number(servicePriceForm) }
        : s
    );
    onUpdateServices(updated);
    setEditingService(null);
  };

  // Addons Actions
  const openNewAddonModal = () => {
    setAddonForm({
      name: '',
      price: 50,
      category: 'Zapatos',
      description: 'Descripción básica del servicio extra.'
    });
    setIsAddonModalOpen(true);
  };

  const handleCreateAddon = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddon: Addon = {
      id: `add-${Date.now()}`,
      name: addonForm.name,
      price: Number(addonForm.price),
      category: addonForm.category,
      description: addonForm.description
    };
    onUpdateAddons([...addons, newAddon]);
    setIsAddonModalOpen(false);
  };

  const deleteAddon = (addId: string) => {
    if (confirm('¿Eliminar este Add-on del catálogo?')) {
      onUpdateAddons(addons.filter(a => a.id !== addId));
    }
  };

  // Order state operations updates
  const handleOrderStatusUpdate = (orderId: string, newStatus: any) => {
    const updated = orders.map(o => 
      o.id === orderId 
        ? { ...o, status: newStatus }
        : o
    );
    onUpdateOrders(updated);
  };

  // Filtered lists for rendering inside tabs
  const filteredProductsAdmin = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  const filteredOrdersAdmin = useMemo(() => {
    return orders.filter(o => 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase())
    );
  }, [orders, orderSearch]);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 animate-fade-in" id="admin-control-view">
      {/* Admin header */}
      <div className="bg-neutral-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-3xl shadow-lg mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-400 text-neutral-900 rounded-2xl">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight font-sans">Panel de Control: Web Admin</h1>
            <p className="text-xs text-slate-400 font-mono">Consola para la gestión de sucursal Clean & Care</p>
          </div>
        </div>

        {/* Dashboard Nav Tabs */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setAdminTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'dashboard' ? 'bg-yellow-400 text-neutral-900 shadow' : 'bg-neutral-850 hover:bg-neutral-800 text-slate-300'}`}
          >
            Métricas Sucursal
          </button>
          <button 
            onClick={() => setAdminTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'products' ? 'bg-yellow-400 text-neutral-900 shadow' : 'bg-neutral-850 hover:bg-neutral-800 text-slate-300'}`}
          >
            Gestión Inventario
          </button>
          <button 
            onClick={() => setAdminTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'services' ? 'bg-yellow-400 text-neutral-900 shadow' : 'bg-neutral-850 hover:bg-neutral-800 text-slate-300'}`}
          >
            Servicios & Precios
          </button>
          <button 
            onClick={() => setAdminTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'orders' ? 'bg-yellow-400 text-neutral-900 shadow' : 'bg-neutral-850 hover:bg-neutral-800 text-slate-300'}`}
          >
            Consola Pedidos
          </button>
          <button 
            onClick={() => setAdminTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'users' ? 'bg-yellow-400 text-neutral-900 shadow' : 'bg-neutral-850 hover:bg-neutral-800 text-slate-300'}`}
          >
            Usuarios
          </button>
        </div>
      </div>

      {/* METRIC CARD WIDGETS */}
      {adminTab === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-3xs uppercase font-mono font-bold tracking-wide">Ventas Totales</span>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-neutral-950 font-mono">${stats.totalRevenue} MXN</p>
              <div className="text-3xs text-emerald-700 font-bold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>+12.4% vs Mes Anterior</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-3xs uppercase font-mono font-bold tracking-wide">Tiques Activos</span>
                <RefreshCw className="h-4 w-4 text-amber-500 animate-spin-slow" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-neutral-950 font-mono">{stats.activeOrders}</p>
              <div className="text-3xs text-slate-400">Servicios en taller operador</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-3xs uppercase font-mono font-bold tracking-wide">Entregados / Listos</span>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-neutral-950 font-mono">{stats.completedOrders}</p>
              <div className="text-3xs text-slate-400">Órdenes completas listas</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-3xs uppercase font-mono font-bold tracking-wide">Calzado Registrado</span>
                <Package className="h-4 w-4 text-slate-500" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-neutral-950 font-mono">{stats.totalShoesCount}</p>
              <div className="text-3xs text-neutral-500">500+ Catálogo Programático</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-3xs uppercase font-mono font-bold tracking-wide">Usuarios Activos</span>
                <Users className="h-4 w-4 text-indigo-600" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-neutral-950 font-mono">{registeredUsers.length}</p>
              <div className="text-3xs text-slate-400">Clientes registrados en app</div>
            </div>
          </div>

          {/* Graphical info block explaining workflows */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 lg:col-span-2 space-y-4">
              <h3 className="font-extrabold text-neutral-900 border-b border-slate-100 pb-3 text-base">
                Análisis Operativo: Consola de Ventas Mixtas
              </h3>
              
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
                <p className="font-bold text-neutral-950">📦 ¿Cómo funciona el inventario mixto?</p>
                <p className="text-slate-600 leading-relaxed">
                  Clean & Care es un negocio híbrido. Los clientes agregan en la misma canasta del tique tanto productos físicos (un gel de limpieza de calzado de $349) como servicios de lavandería por kilo. El software valida la orden de compra y le asigna un código QR único impreso digitalmente. El operador escanea en taller para proceder al lavado.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-indigo-50 text-indigo-950 p-4 rounded-xl border border-indigo-150">
                  <p className="font-bold text-xs">Estadísticas Rápidas:</p>
                  <ul className="list-disc pl-4 space-y-1 text-2xs text-indigo-900 mt-2">
                    <li>Promedio del tique mixto: <strong>$599 MXN</strong></li>
                    <li>Socio Marca más vendido: <strong>Jason Markk</strong></li>
                    <li>Servicio preferido: <strong>Mantenimiento sneaker premium</strong></li>
                  </ul>
                </div>
                <div className="bg-emerald-50 text-emerald-950 p-4 rounded-xl border border-emerald-150">
                  <p className="font-bold text-xs">Cumpleaños Clientes:</p>
                  <ul className="list-disc pl-4 space-y-1 text-2xs text-emerald-950 mt-2">
                    <li>Campañas automatizadas activas: <strong>1</strong></li>
                    <li>Descuentos aplicados en taller: <strong>50%</strong></li>
                    <li>Sincronización con agenda: <strong>Activa</strong></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick configuration overview panel */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
              <h3 className="font-extrabold text-neutral-900 border-b border-slate-100 pb-3 text-base">Proveedores & Marcas</h3>
              
              <form onSubmit={handleAddBrand} className="space-y-3">
                <p className="text-3xs uppercase font-mono font-bold text-slate-400">Registrar Socio de Marca</p>
                <input 
                  type="text" 
                  required
                  placeholder="Nombre de la marca (ej. Nike, Crep)"
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                />
                <input 
                  type="text" 
                  placeholder="Descripción corta"
                  value={brandForm.description}
                  onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                />
                <button 
                  type="submit"
                  className="w-full py-2 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Registrar Marca
                </button>
              </form>

              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
                {brands.map((b) => (
                  <div key={b.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-neutral-900 block">{b.name}</span>
                      <span className="text-3xs text-slate-400 block line-clamp-1">{b.description}</span>
                    </div>
                    <button 
                      onClick={() => deleteBrand(b.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WEB INVENTORY MANAGEMENT */}
      {adminTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">Control de Productos & Stock</h2>
              <p className="text-xs text-slate-500">Agrega, edita o elimina zapatos e insumos de limpieza del catálogo oficial.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0 sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar en almacén..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 w-full focus:outline-none"
                />
              </div>
              <button 
                onClick={openNewProductModal}
                className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap shadow-xs"
              >
                <Plus className="h-4 w-4" /> Nuevo Producto
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-150 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-150 text-slate-500 uppercase font-mono text-3xs font-bold">
                <tr>
                  <th className="p-4">SKU / Imagen</th>
                  <th className="p-4">Nombre Producto</th>
                  <th className="p-4">Socio Marca</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4 text-right">Precio Base</th>
                  <th className="p-4 text-center">En Existencia</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredProductsAdmin.slice(0, 40).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={p.imageUrl} 
                          alt={p.name}
                          className="h-10 w-10 object-cover rounded-lg border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-mono text-3xs text-slate-400 font-bold uppercase">{p.id}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <strong className="text-neutral-900 font-bold block">{p.name}</strong>
                      <span className="text-3xs text-slate-400 line-clamp-1">{p.description}</span>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-neutral-850 px-2 py-0.5 rounded-md font-semibold text-2xs">
                        {p.brand}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{p.category}</td>
                    <td className="p-4 text-right font-bold font-mono text-neutral-950">${p.price}</td>
                    <td className="p-4 text-center font-bold font-mono text-slate-700">
                      <span className={`px-2 py-0.5 rounded ${p.stock < 5 ? 'bg-red-50 text-red-700 border border-red-150' : 'bg-slate-100'}`}>
                        {p.stock} pz
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => openEditProductModal(p)}
                          className="p-1.5 hover:bg-slate-150 rounded-lg text-slate-600 hover:text-neutral-950 transition"
                          title="Editar"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProductsAdmin.length > 40 && (
              <div className="p-4 bg-slate-50 text-center text-slate-400 text-3xs font-mono">
                Se muestran los primeros 40 de {filteredProductsAdmin.length} artículos del inventario (usa la barra para buscar específicos)
              </div>
            )}
          </div>
        </div>
      )}

      {/* WEB CONFIGURATOR SERVICES & ADDONS */}
      {adminTab === 'services' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          
          {/* Base Service configuring console block */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">Precios Base de Lavado & Limpieza</h2>
              <p className="text-xs text-slate-400">Ajusta directamente la tarifa base para ropa de vestir y calzado premium en sucursal.</p>
            </div>

            <div className="space-y-4">
              {services.map((srv) => (
                <div key={srv.id} className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-3s hover:bg-slate-50/20 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{srv.type === 'Zapatos' ? '👟' : '👕'}</span>
                      <strong className="text-xs sm:text-sm text-neutral-950 font-bold">{srv.name}</strong>
                    </div>
                    <p className="text-2xs text-slate-500 leading-snug">{srv.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {editingService?.id === srv.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-500 font-mono">$</span>
                        <input 
                          type="number"
                          value={servicePriceForm}
                          onChange={(e) => setServicePriceForm(Number(e.target.value))}
                          className="w-20 p-1 text-xs border rounded text-right font-bold"
                        />
                        <button onClick={submitServicePrice} className="px-2 py-1 bg-neutral-950 text-white text-3xs rounded font-bold">✓ Acc</button>
                        <button onClick={() => setEditingService(null)} className="px-2 py-1 bg-slate-100 text-slate-500 text-3xs rounded">Can</button>
                      </div>
                    ) : (
                      <>
                        <span className="font-extrabold text-xs sm:text-sm font-mono text-neutral-900 bg-slate-100 px-3 py-1 rounded-md">
                          ${srv.basePrice} MXN
                        </span>
                        <button 
                          onClick={() => startEditService(srv)}
                          className="text-2xs font-bold text-indigo-600 hover:underline"
                        >
                          Ajustar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add-ons administration console list */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900">Mantenimiento de Add-ons</h2>
                <p className="text-xs text-slate-400">Agrega o ajusta las tarifas de complementos extra del taller taller.</p>
              </div>
              <button 
                onClick={openNewAddonModal}
                className="bg-neutral-950 text-white text-3xs px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition font-bold"
              >
                + Nuevo Addon
              </button>
            </div>

            <div className="divide-y divide-slate-150">
              {addons.map((add) => (
                <div key={add.id} className="py-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xs font-bold font-mono tracking-wide uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        {add.category}
                      </span>
                      <strong className="text-xs font-semibold text-neutral-950">{add.name}</strong>
                    </div>
                    <p className="text-3xs text-slate-500 mt-1">{add.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded-md">
                      +${add.price}
                    </span>
                    <button 
                      onClick={() => deleteAddon(add.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* WEB ORDERS CONSOLE INCLUDES STATUS */}
      {adminTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">Consola de Control de Ventas</h2>
              <p className="text-xs text-slate-400">Ver tiques mixtos, montos cobrados en Stripe y cambiar estados rápidos.</p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Filtrar por ID o Cliente..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 w-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrdersAdmin.map((ord) => (
              <div key={ord.id} className="p-5 rounded-2xl border border-slate-150 hover:border-slate-350 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Meta details */}
                <div className="space-y-3 flex-grow max-w-xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-black bg-slate-100 px-3 py-1 rounded border border-slate-200 text-neutral-950">
                      {ord.id}
                    </span>
                    <span className="text-2xs text-slate-450 font-mono">
                      {new Date(ord.createdAt).toLocaleDateString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="flex items-center gap-2 text-2xs">
                      <span className="text-slate-400 font-bold">•</span>
                      <strong className="text-slate-700 uppercase">Cliente: {ord.customerName}</strong>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 space-y-2 text-2xs text-slate-650">
                    <p className="font-mono text-3xs font-bold text-slate-400">PRODUCTOS & TALLER CONTRATADO:</p>
                    {ord.items.map((item, id) => (
                      <div key={id} className="flex justify-between font-mono">
                        <span>{item.quantity}x {item.name} {item.detailsSummary && <span className="text-slate-400 text-3xs">({item.detailsSummary})</span>}</span>
                        <strong className="text-neutral-900">${item.price * item.quantity}</strong>
                      </div>
                    ))}
                    <div className="border-t border-dashed pt-2 flex justify-between font-bold text-slate-900 text-xs mt-2">
                      <span>Total Mixto</span>
                      <span className="font-mono text-sm font-black">${ord.total} MXN</span>
                    </div>
                  </div>
                </div>

                {/* Operations change buttons */}
                <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="space-y-1">
                    <p className="text-3xs font-mono font-bold text-slate-400 uppercase">Estado Operacional:</p>
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => handleOrderStatusUpdate(ord.id, 'Recibido')}
                        className={`px-3 py-1 text-3xs font-bold rounded-md border transition ${ord.status === 'Recibido' ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-xs' : 'bg-white hover:bg-slate-50'}`}
                      >
                        Recibido
                      </button>
                      <button 
                        onClick={() => handleOrderStatusUpdate(ord.id, 'En proceso')}
                        className={`px-3 py-1 text-3xs font-bold rounded-md border transition ${ord.status === 'En proceso' ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-xs' : 'bg-white hover:bg-slate-50'}`}
                      >
                        En Proceso
                      </button>
                      <button 
                        onClick={() => handleOrderStatusUpdate(ord.id, 'Listo')}
                        className={`px-3 py-1 text-3xs font-bold rounded-md border transition ${ord.status === 'Listo' ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs' : 'bg-white hover:bg-slate-50'}`}
                      >
                        Listo ⭐
                      </button>
                    </div>
                  </div>

                  {/* QR small preview */}
                  <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                    <img 
                      src={ord.qrCodeUrl} 
                      alt="Mini QR"
                      className="w-12 h-12 bg-white p-0.5 rounded border"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-3s text-slate-400 font-mono flex flex-col">
                      <span>QR Valid</span>
                      <span className="text-indigo-650 hover:underline cursor-pointer flex items-center gap-0.5">
                        Print QR <ExternalLink className="h-2 w-2" />
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* WEB USER LOG / DIRECTORY */}
      {adminTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4 animate-fade-in">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900">Gestión de Usuarios & Clientes</h2>
            <p className="text-xs text-slate-500">Listado de clientes registrados en Clean & Care para verificación de servicios y promociones de cumpleaños.</p>
          </div>

          <div className="overflow-x-auto border border-slate-150 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-150 text-slate-500 uppercase font-mono text-3xs font-bold">
                <tr>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Contacto Móvil</th>
                  <th className="p-4">Correo Electrónico</th>
                  <th className="p-4">Cumpleaños</th>
                  <th className="p-4">Dirección Guardada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {registeredUsers.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-xs">
                          {usr.name[0]}
                        </div>
                        <strong className="text-neutral-900 font-bold block">{usr.name}</strong>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-semibold text-slate-600">{usr.phone}</td>
                    <td className="p-4 text-slate-500 font-mono">{usr.email}</td>
                    <td className="p-4 text-indigo-700 font-mono font-bold">
                      {usr.birthday || 'No declarada'}
                    </td>
                    <td className="p-4 text-slate-500 line-clamp-1 max-w-xs">{usr.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL WINDOWS FOR EDITING INVENTORY OR CREATING NEW ONE */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleProductSubmit}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-xl border border-slate-150 animate-scale-up"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-extrabold text-sm">{editingProduct ? 'Editar Producto del Almacén' : 'Añadir Nuevo Calzado a la Grid'}</h3>
              <button 
                type="button" 
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-neutral-950 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-3xs uppercase font-mono font-bold text-slate-400">Nombre del Producto</label>
                <input 
                  type="text" 
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="ej. Nike VaporMax 'Cyan Accent'"
                  className="w-full text-xs p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-3xs uppercase font-mono font-bold text-slate-400">Precio de Venta (MXN)</label>
                  <input 
                    type="number" 
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-3xs uppercase font-mono font-bold text-slate-400">Stock Inicial</label>
                  <input 
                    type="number" 
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-3xs uppercase font-mono font-bold text-slate-400">Socio de Marca</label>
                  <select 
                    value={productForm.brand} 
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full text-xs p-2.5 border rounded-xl bg-white"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-3xs uppercase font-mono font-bold text-slate-400">Categoría</label>
                  <select 
                    value={productForm.category} 
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full text-xs p-2.5 border rounded-xl bg-white"
                  >
                    <option value="Zapatos">Zapato Premium</option>
                    <option value="Líquidos">Líquido de Limpieza</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-3xs uppercase font-mono font-bold text-slate-400">Dirección URL de la Imagen</label>
                <input 
                  type="text" 
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full text-xs p-2.5 border rounded-xl font-mono text-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-3xs uppercase font-mono font-bold text-slate-400">Descripción Corta</label>
                <textarea 
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full text-xs p-2.5 border rounded-xl h-16"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-850 text-white rounded-xl text-xs font-bold"
            >
              Guardar en Base de Datos de Almacén
            </button>
          </form>
        </div>
      )}

      {isAddonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateAddon}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-xl border border-slate-150 animate-scale-up"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-extrabold text-sm">Crear Nuevo Add-on Extra</h3>
              <button 
                type="button" 
                onClick={() => setIsAddonModalOpen(false)}
                className="text-slate-400 hover:text-neutral-950 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-3xs uppercase font-mono font-bold text-slate-400">Nombre del Complemento</label>
                <input 
                  type="text" 
                  required
                  value={addonForm.name}
                  onChange={(e) => setAddonForm({ ...addonForm, name: e.target.value })}
                  placeholder="ej. Impermeabilización Extrema"
                  className="w-full text-xs p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-3xs uppercase font-mono font-bold text-slate-400">Precio Adicional (MXN)</label>
                  <input 
                    type="number" 
                    required
                    value={addonForm.price}
                    onChange={(e) => setAddonForm({ ...addonForm, price: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-3xs uppercase font-mono font-bold text-slate-400">Categoría Aplicable</label>
                  <select 
                    value={addonForm.category} 
                    onChange={(e) => setAddonForm({ ...addonForm, category: e.target.value as any })}
                    className="w-full text-xs p-2.5 border rounded-xl bg-white"
                  >
                    <option value="Zapatos">👟 Calzado / Tenis</option>
                    <option value="Cloth">👕 Ropa (Cloth)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-3xs uppercase font-mono font-bold text-slate-400">Descripción del trabajo</label>
                <textarea 
                  value={addonForm.description}
                  onChange={(e) => setAddonForm({ ...addonForm, description: e.target.value })}
                  className="w-full text-xs p-2.5 border rounded-xl h-16"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-2.5 bg-neutral-950 text-white hover:bg-neutral-850 rounded-xl text-xs font-bold"
            >
              Dar de Alta en Catálogo de Servicios
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
