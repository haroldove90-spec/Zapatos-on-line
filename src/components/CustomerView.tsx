import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Trash2, 
  QrCode, 
  CheckCircle, 
  User, 
  Plus, 
  Minus, 
  Search, 
  Droplet, 
  Scissors, 
  ShieldAlert, 
  Calendar, 
  Phone, 
  MapPin, 
  RotateCw, 
  Play, 
  Pause,
  Filter,
  Check,
  CreditCard,
  History
} from 'lucide-react';
import { Product, ServiceBase, Addon, CartItem, Order, UserProfile, BrandPartner } from '../types';

interface CustomerViewProps {
  products: Product[];
  services: ServiceBase[];
  addons: Addon[];
  brands: BrandPartner[];
  orders: Order[];
  onAddOrder: (order: Order) => void;
  currentUser: UserProfile | null;
  onSetCurrentUser: (user: UserProfile) => void;
}

export default function CustomerView({
  products,
  services,
  addons,
  brands,
  orders,
  onAddOrder,
  currentUser,
  onSetCurrentUser
}: CustomerViewProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'services' | 'history' | 'profile'>('home');
  const [productCategory, setProductCategory] = useState<'all' | 'Zapatos' | 'Líquidos'>('all');
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination for 520 shoes
  const [shoePage, setShoePage] = useState(1);
  const shoesPerPage = 12;

  // Video state
  const [isPlaying, setIsPlaying] = useState(false);

  // 3D rotation angle simulation
  const [rotationAngle, setRotationAngle] = useState(0);
  const [selectedSimColor, setSelectedSimColor] = useState<'emerald' | 'crimson' | 'indigo'>('emerald');

  // Customer Authentication state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    birthday: '',
    password: ''
  });
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Services Configurator State
  const [selectedBaseService, setSelectedBaseService] = useState<ServiceBase | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [serviceQty, setServiceQty] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'processing' | 'done'>('form');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '4556 7812 9011 2344',
    cardExpiry: '12/29',
    cardCvc: '415',
    cardName: 'JUAN PEREZ'
  });
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Setup initial default selected service on mount
  React.useEffect(() => {
    if (services.length > 0 && !selectedBaseService) {
      setSelectedBaseService(services[0]);
    }
  }, [services, selectedBaseService]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email) return;
    const profile: UserProfile = {
      id: `usr-${Date.now()}`,
      name: loginForm.email.split('@')[0].toUpperCase(),
      email: loginForm.email,
      phone: '5566332211',
      address: 'Calle Juárez 514, Colonia Centro, CDMX',
      birthday: '1995-08-14'
    };
    onSetCurrentUser(profile);
    setActiveTab('home');
  };

  // Handle Register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email) return;
    const profile: UserProfile = {
      id: `usr-${Date.now()}`,
      name: regForm.name,
      email: regForm.email,
      phone: regForm.phone,
      address: regForm.address,
      birthday: regForm.birthday
    };
    onSetCurrentUser(profile);
    setActiveTab('home');
  };

  // Log Out
  const handleLogout = () => {
    // Reset or delete user (simulated)
    // We can keep it simple or set null
    // @ts-ignore
    onSetCurrentUser(null);
    setCart([]);
  };

  // Filtering products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = 
        productCategory === 'all' ||
        (productCategory === 'Zapatos' && p.category === 'Zapatos') ||
        (productCategory === 'Líquidos' && p.category === 'Líquido de Limpieza');
      
      const matchesBrand = !brandFilter || p.brand.toLowerCase() === brandFilter.toLowerCase();
      
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesBrand && matchesSearch;
    });
  }, [products, productCategory, brandFilter, searchQuery]);

  // Paginated shoes & products
  const paginatedProducts = useMemo(() => {
    const startIndex = (shoePage - 1) * shoesPerPage;
    return filteredProducts.slice(startIndex, startIndex + shoesPerPage);
  }, [filteredProducts, shoePage]);

  const totalPages = Math.ceil(filteredProducts.length / shoesPerPage);

  // Cart actions
  const addToCartProduct = (product: Product) => {
    const existing = cart.find(item => item.type === 'product' && item.product?.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        (item.type === 'product' && item.product?.id === product.id) 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: `cart-prod-${product.id}`,
        type: 'product',
        name: product.name,
        price: product.price,
        quantity: 1,
        product
      };
      setCart([...cart, newItem]);
    }
  };

  const addToCartService = () => {
    if (!selectedBaseService) return;
    
    // Calculate final static service price based on selected add-ons
    const basePrice = selectedBaseService.basePrice;
    const addonsTotal = selectedAddons.reduce((sum, adId) => {
      const ad = addons.find(a => a.id === adId);
      return sum + (ad ? ad.price : 0);
    }, 0);
    const finalPrice = basePrice + addonsTotal;

    const addonsNames = selectedAddons
      .map(adId => addons.find(a => a.id === adId)?.name || '')
      .filter(Boolean);

    const detailString = `${selectedBaseService.type} - Extras: ${addonsNames.join(', ') || 'Ninguno'}`;

    const configId = `cart-srv-${selectedBaseService.id}-${selectedAddons.join('-')}-${Date.now()}`;
    const newItem: CartItem = {
      id: configId,
      type: 'service',
      name: selectedBaseService.name,
      price: finalPrice,
      quantity: serviceQty,
      details: {
        baseServiceId: selectedBaseService.id,
        addonsSelected: [...selectedAddons],
        specialInstructions
      }
    };
    // Save to cart & reset configurator
    setCart([...cart, newItem]);
    setSelectedAddons([]);
    setSpecialInstructions('');
    setServiceQty(1);
    
    // Quick notification or redirection
    alert('¡Servicio configurado y añadido a tu carrito mixto!');
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateCartQty = (itemId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  // Checkout submission
  const handlePerformCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('processing');
    
    setTimeout(() => {
      const randomId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: randomId,
        customerName: currentUser?.name || 'Cliente de Paso',
        customerPhone: currentUser?.phone || 'Sin télefono',
        customerAddress: currentUser?.address || 'Recogida en tienda',
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          type: item.type,
          detailsSummary: item.details?.baseServiceId 
            ? `${services.find(s => s.id === item.details?.baseServiceId)?.name} (${item.details.addonsSelected?.length || 0} adicionales)`
            : undefined
        })),
        total: cartTotal,
        status: 'Recibido',
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${randomId}`,
        qrCodeText: randomId,
        createdAt: new Date().toISOString()
      };

      onAddOrder(newOrder);
      setLastCreatedOrder(newOrder);
      setCart([]);
      setCheckoutStep('done');
    }, 2000);
  };

  // Dynamic status tint
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Listo': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'En proceso': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 lg:flex lg:flex-row">
      
      {/* SIDEBAR NAVIGATION FOR DESKTOP / FULLSCREEN (lg:flex) */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-white border-r border-slate-200 sticky top-0 h-screen shrink-0 z-30 p-6 flex-col justify-between">
        <div className="space-y-8">
          {/* Brand/Logo block */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <div className="w-4.5 h-4.5 bg-white rounded-full opacity-95"></div>
            </div>
            <div>
              <span className="text-lg font-black text-slate-850 tracking-tight uppercase">ZAPATERÍA<span className="text-blue-600"> EN LÍNEA</span></span>
              <p className="text-slate-400 text-[8px] uppercase font-black tracking-widest font-mono">Clean &amp; Care Studio</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1.5">
            <button 
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-4 px-4 py-3 text-xs font-extrabold rounded-2xl transition ${activeTab === 'home' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              id="sidebar-btn-home"
            >
              <span className="text-base">🏠</span>
              <span>Inicio Bento</span>
            </button>
            <button 
              onClick={() => setActiveTab('catalog')}
              className={`w-full flex items-center gap-4 px-4 py-3 text-xs font-extrabold rounded-2xl transition ${activeTab === 'catalog' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              id="sidebar-btn-catalog"
            >
              <span className="text-base">👟</span>
              <span>Comprar Tienda</span>
            </button>
            <button 
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-4 px-4 py-3 text-xs font-extrabold rounded-2xl transition ${activeTab === 'services' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              id="sidebar-btn-services"
            >
              <span className="text-base">🧺</span>
              <span>Lavado &amp; Cuidado</span>
            </button>
            {currentUser && (
              <button 
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center gap-4 px-4 py-3 text-xs font-extrabold rounded-2xl transition ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                id="sidebar-btn-history"
              >
                <span className="text-base">🔍</span>
                <span>Tracking QR ({orders.length})</span>
              </button>
            )}
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-4 px-4 py-3 text-xs font-extrabold rounded-2xl transition ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              id="sidebar-btn-profile"
            >
              <span className="text-base">👤</span>
              <span>{currentUser ? currentUser.name.split(' ')[0] : 'Iniciar Sesión'}</span>
            </button>
          </nav>
        </div>

        {/* User Badge footer */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          {currentUser ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                  {currentUser.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-slate-850 truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full py-2 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-xl hover:bg-rose-100 transition"
              >
                Cerrar Sesión Activa
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl text-center space-y-2">
              <p className="text-[10px] text-slate-500 font-semibold leading-normal">Accede para registrar pedidos con código QR.</p>
              <button 
                onClick={() => setActiveTab('profile')}
                className="w-full py-1.5 bg-neutral-900 text-white text-[10px] font-bold rounded-xl hover:bg-neutral-850 transition"
              >
                Entrar al Demo
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* CONTENT INNER WRAPPER (Adapts to Sidebar presence) */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top Banner Message */}
        <div className="bg-neutral-900 text-neutral-100 text-[11px] px-4 py-2.5 text-center font-medium tracking-wide flex items-center justify-center gap-2 shrink-0">
          <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
          <span>ENTREGA EN TIENDA O DOMICILIO SIN COSTO en pedidos de mantenimiento mayores a $500 MXN</span>
        </div>

        {/* MOBILE STICKY BRAND HEADER (lg:hidden) */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200 py-3.5 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-xs">
              <div className="w-3.5 h-3.5 bg-white rounded-full opacity-95"></div>
            </div>
            <div>
              <span className="text-sm font-black text-slate-800 tracking-tight uppercase">ZAPATERÍA<span className="text-blue-600"> EN LÍNEA</span></span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`p-1.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 transition ${currentUser ? 'bg-blue-50 border-blue-300' : ''}`}
            >
              <User className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* MAIN CONTAINER */}
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 pb-24 lg:pb-8 flex-grow">
        
        {/* VIEW 1: HOME PAGE (Multimedia, interactive, welcoming Bento Grid) */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto animate-fade-in" id="customer-home-view">
            
            {/* BLOCK 1: Hero Banner Compartment (fits col-span-12 lg:col-span-8) */}
            <div className="relative md:col-span-12 lg:col-span-8 rounded-3xl overflow-hidden bg-slate-900 group shadow-lg min-h-[380px] flex flex-col justify-end border border-slate-800">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/30 to-transparent z-10"></div>
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDDf1DY-rgc0XAoEvTf_NuHeXwxgpyNIMHWg&s" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-103 opacity-75" 
                alt="Professional care"
              />
              <div className="relative z-20 p-8 h-full flex flex-col justify-end">
                <span className="text-blue-400 font-bold tracking-[0.2em] text-xs uppercase mb-2 italic">Nueva Experiencia 3D • Cuidado Sostenible</span>
                <h1 className="text-4xl sm:text-5xl font-black text-white leading-none tracking-tight uppercase">
                  CUIDADO<br />PROFESIONAL
                </h1>
                <p className="text-slate-300 mt-4 max-w-sm text-xs sm:text-sm">
                  Limpieza premium para calzado y textiles con tecnología de punta y procesos eco-friendly.
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                  <button 
                    onClick={() => setActiveTab('services')}
                    className="bg-white hover:bg-slate-100 text-slate-900 px-5 py-2.5 rounded-full font-extrabold text-xs shadow-lg transition-all transform hover:scale-102"
                  >
                    Ver Servicios
                  </button>
                  <button 
                    onClick={() => setActiveTab('catalog')}
                    className="bg-blue-600/40 hover:bg-blue-600/65 backdrop-blur-md text-white border border-white/20 px-5 py-2.5 rounded-full font-extrabold text-xs transition duration-300 transform hover:scale-102"
                  >
                    Virtual Tour Tienda
                  </button>
                </div>
              </div>
            </div>

            {/* BLOCK 2: Live Tracking / QR code representation (col-span-12 md:col-span-6 lg:col-span-4) */}
            <div className="md:col-span-6 lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-full border-b border-slate-100 pb-3 mb-3">
                <h2 className="text-2xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <QrCode className="h-4 w-4 text-slate-400" />
                  <span>Tu Próxima Entrega</span>
                </h2>
              </div>
              {orders.length > 0 ? (
                <div className="w-full flex flex-col items-center justify-center">
                  <div className="bg-slate-50 p-3 rounded-2xl mb-3 border border-slate-150">
                    <img 
                      src={orders[0].qrCodeUrl} 
                      alt="Código QR del Pedido" 
                      className="w-28 h-28 object-contain mix-blend-multiply" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <p className="text-sm font-extrabold text-slate-800">Pedido #{orders[0].id}</p>
                  <div className={`mt-2 px-4 py-1 text-4xs font-bold rounded-full uppercase tracking-widest ${
                    orders[0].status === 'Listo' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                    orders[0].status === 'En proceso' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                    'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {orders[0].status === 'Listo' ? 'Listo para Recoger' : orders[0].status === 'En proceso' ? 'En proceso' : 'Recibido'}
                  </div>
                  <p className="text-slate-400 text-[9px] mt-3 uppercase font-semibold font-mono">Presenta el QR en el taller o local</p>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center">
                  <div className="bg-slate-100 p-4 rounded-2xl mb-4">
                    <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-slate-200">
                      <div className="w-24 h-24 grid grid-cols-4 grid-rows-4 gap-1">
                        <div className="bg-black"></div><div className="bg-black"></div><div></div><div className="bg-black"></div>
                        <div></div><div className="bg-black"></div><div className="bg-black"></div><div></div>
                        <div className="bg-black"></div><div className="bg-black"></div><div></div><div className="bg-black"></div>
                        <div className="bg-black"></div><div></div><div className="bg-black"></div><div className="bg-black"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xl font-extrabold text-slate-800">Pedido #CH-8821</p>
                  <div className="mt-2 px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-tighter">
                    Listo para Recoger
                  </div>
                  <p className="text-slate-400 text-[10px] mt-4 uppercase font-semibold">Muestra este QR en el taller</p>
                </div>
              )}
            </div>

            {/* BLOCK 3: Fast Categories switcher using blue-50 card matching exact aesthetic */}
            <div className="md:col-span-6 lg:col-span-4 bg-blue-50 border border-blue-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Categorías</h3>
                <div className="space-y-3">
                  <div 
                    onClick={() => { setProductCategory('all'); setActiveTab('catalog'); }}
                    className="flex items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-xl">👕</div>
                    <span className="font-semibold text-slate-700">Lavandería (Cloth)</span>
                  </div>
                  <div 
                    onClick={() => { setProductCategory('Zapatos'); setActiveTab('catalog'); }}
                    className="flex items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-blue-500"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-xl">👟</div>
                    <span className="font-semibold text-slate-700">Cuidado Calzado</span>
                  </div>
                  <div 
                    onClick={() => { setProductCategory('Líquidos'); setActiveTab('catalog'); }}
                    className="flex items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 text-xl">🧼</div>
                    <span className="font-semibold text-slate-700">Líquidos &amp; Kits</span>
                  </div>
                </div>
              </div>
              <span className="text-slate-400 text-3xs italic mt-3">*Selecciona una categoría rápida</span>
            </div>

            {/* BLOCK 4: Curated Products Preview matching design and utilizing real catalog data (col-span-12 lg:col-span-5) */}
            <div className="md:col-span-12 lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between overflow-hidden">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Catálogo de Calzado</h3>
                  <span className="text-blue-600 text-xs font-bold">{products.filter(p => p.category === 'Zapatos').length}+ Ítems</span>
                </div>
                
                {/* 2 items preview matching sneakers look */}
                <div className="grid grid-cols-2 gap-4">
                  {products.filter(p => p.category === 'Zapatos').slice(0, 2).map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-col justify-between cursor-pointer hover:border-slate-200 transition"
                      onClick={() => { setActiveTab('catalog'); }}
                    >
                      <div>
                        <div className="h-24 bg-white rounded-xl mb-2 flex items-center justify-center overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            className="w-full h-full object-cover" 
                            alt={item.name} 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter line-clamp-1">{item.brand}</p>
                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</p>
                      </div>
                      <p className="text-blue-600 font-extrabold text-sm mt-1">${item.price.toFixed(2)} MXN</p>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => { setActiveTab('catalog'); }}
                className="text-blue-600 text-xs font-bold text-left hover:underline mt-4 flex items-center gap-1"
              >
                <span>Ver catálogo exclusivo de limpieza profunda →</span>
              </button>
            </div>

            {/* BLOCK 5: Interactive Brand Partner / Card (Sneaker Labs) col-span-12 md:col-span-6 lg:col-span-3 */}
            <div className="md:col-span-6 lg:col-span-3 flex flex-col space-y-4">
              <div className="flex-1 bg-orange-500 rounded-3xl p-5 text-white flex flex-col justify-between overflow-hidden shadow-lg shadow-orange-200 hover:scale-101 transition duration-300">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase opacity-80 tracking-widest">Socio Marca</span>
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs">✦</div>
                </div>
                <div>
                  <h4 className="text-2xl font-black italic">SNEAKER<br />LABS</h4>
                  <p className="text-[10px] font-semibold opacity-90 mt-2 hover:underline cursor-pointer" onClick={() => { setBrandFilter('Sneaker Labs'); setProductCategory('all'); setActiveTab('catalog'); }}>
                    Ver catálogo exclusivo de limpieza profunda →
                  </p>
                </div>
              </div>
              
              <div className="h-20 bg-slate-800 rounded-3xl flex items-center justify-center space-x-3 px-4 shadow-lg">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border-2 border-slate-800 bg-blue-400"></div>
                  <div className="w-6 h-6 rounded-full border-2 border-slate-800 bg-slate-300"></div>
                  <div className="w-6 h-6 rounded-full border-2 border-slate-800 bg-orange-300"></div>
                </div>
                <div className="text-[10px] text-white font-bold leading-tight uppercase">
                  +{brands.length} Marcas<br />Asociadas
                </div>
              </div>
            </div>

            {/* BLOCK 6: 3D Shoe Visualizer Render (Col-span-12 md:col-span-6) */}
            <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-indigo-50 text-indigo-700 font-semibold font-mono text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Visualizador Interactivo 3D
                  </span>
                  <button 
                    onClick={() => setRotationAngle(prev => (prev + 45) % 360)}
                    className="p-1.5 hover:bg-slate-100 rounded-full transition text-slate-500"
                    title="Rotar modelo"
                  >
                    <RotateCw className="h-4 w-4 text-purple-600" />
                  </button>
                </div>
                <h3 className="text-sm font-bold text-neutral-900 uppercase">Render Automático de Calzado</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Modela dinámicamente tu calzado de colección y previsualiza los acabados premium en tiempo real.
                </p>
              </div>

              {/* 3D viewport canvas simulation */}
              <div className="my-4 relative border border-slate-150 h-44 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/50 flex flex-col items-center justify-center overflow-hidden shadow-inner group">
                <div 
                  className="transition-transform duration-500 p-4"
                  style={{ transform: `rotateY(${rotationAngle}deg) rotateX(15deg)` }}
                >
                  <svg className="w-36 h-20 transform drop-shadow-xl" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M20,60 C40,40 70,35 120,50 C140,40 170,18 190,55 C195,65 190,82 170,85 C150,85 40,85 20,85 C10,85 10,75 20,60 Z" 
                      fill={selectedSimColor === 'emerald' ? '#0f766e' : selectedSimColor === 'crimson' ? '#be123c' : '#4338ca'} 
                      stroke="#fff" 
                      strokeWidth="2"
                    />
                    <path d="M18,80 C40,82 150,82 185,80 C182,85 160,86 150,86 C40,86 20,85 18,80 Z" fill="#ffffff" />
                    <path d="M18,85 C40,87 150,87 182,85 C180,88 160,89 150,89 C40,89 20,88 18,85 Z" fill="#1e293b" />
                    <path d="M60,53 C95,43 145,28 165,58 C135,53 90,62 60,53 Z" fill="#facc15" opacity="0.9" />
                    <path d="M125,50 L115,35 M135,48 L123,31 M145,45 L132,27" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-slate-700 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-[9px] font-mono">
                  <span>Ángulo: {rotationAngle}°</span>
                  <span>Color: {selectedSimColor}</span>
                </div>
              </div>

              {/* Color Selector controls inside 3d widget */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => setSelectedSimColor('emerald')}
                    className={`w-6 h-6 rounded-full bg-teal-700 border transition ${selectedSimColor === 'emerald' ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'}`}
                  />
                  <button 
                    onClick={() => setSelectedSimColor('crimson')}
                    className={`w-6 h-6 rounded-full bg-rose-700 border transition ${selectedSimColor === 'crimson' ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'}`}
                  />
                  <button 
                    onClick={() => setSelectedSimColor('indigo')}
                    className={`w-6 h-6 rounded-full bg-indigo-700 border transition ${selectedSimColor === 'indigo' ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'}`}
                  />
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setRotationAngle(prev => (prev - 45 + 360) % 360)} className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 text-[10px] rounded border font-mono">Rot-</button>
                  <button onClick={() => setRotationAngle(prev => (prev + 45) % 360)} className="px-2 py-0.5 bg-neutral-900 text-white hover:bg-neutral-800 text-[10px] rounded font-mono font-bold">Rot+</button>
                </div>
              </div>
            </div>

            {/* BLOCK 7: Video Compartment (Col-span-12 md:col-span-6) */}
            <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="bg-amber-50 text-amber-700 font-semibold font-mono text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Artesanía Detrás del Taller
                </span>
                <h3 className="text-sm font-bold text-neutral-900 mt-2 uppercase">Proceso de Limpieza Matriz</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Ver el video explicativo de nuestros procesos de hidratación de gamuza y recuperación de costura.
                </p>
              </div>

              {/* Simulated video player container */}
              <div className="my-4 relative rounded-2xl h-44 bg-slate-900 overflow-hidden shadow-inner flex flex-col justify-center">
                {isPlaying ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 text-white p-4">
                    <div className="absolute top-0 left-0 h-1 bg-blue-500 animate-pulse" style={{width: '65%'}}></div>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping mb-2" />
                    <p className="text-[9px] text-yellow-400 font-mono tracking-widest uppercase">STREAMING: EN ACCIÓN</p>
                    <p className="text-2xs text-center text-slate-300 mt-1 max-w-xs px-2 italic">"Técnica de limpieza por ultrasonido y teñido de fibra de alta densidad"</p>
                    <button 
                      onClick={() => setIsPlaying(false)}
                      className="mt-3 px-3 py-1 bg-white/20 text-white text-[10px] rounded-full hover:bg-white/30 transition flex items-center gap-1 font-mono"
                    >
                      <Pause className="h-3 w-3" /> PAUSAR VIDEO
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-cover bg-center flex flex-col items-center justify-center p-4 text-center text-white" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=60')` }}>
                    <div className="absolute inset-0 bg-neutral-950/75" />
                    <div className="relative z-10 space-y-2">
                      <button 
                        onClick={() => setIsPlaying(true)}
                        className="h-10 w-10 rounded-full bg-yellow-400 hover:bg-yellow-500 text-neutral-950 flex items-center justify-center shadow-lg transition duration-300 mx-auto"
                      >
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      </button>
                      <p className="font-extrabold text-xs">Mantenimiento de Sneakers de Colección</p>
                      <p className="text-[9px] text-slate-300">Duración: 1:45 min • Calidad Premium HD</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-1.5 border-t border-slate-100">
                <span>Fidelidad de Audio Estéreo</span>
                <span>152k vistas</span>
              </div>
            </div>

            {/* BLOCK 8: Horizontal Brand Slide Bento Panel (Col-span-12) */}
            <div className="md:col-span-12 bg-white rounded-3xl p-6 border border-slate-200">
              <div className="text-center space-y-1.5 mb-5">
                <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">NUESTROS SOCIOS MARCA REGISTRADOS</span>
                <h3 className="text-sm font-bold text-neutral-900 uppercase">Garantías y Certificación de Insumos Oficiales</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {brands.map((b) => (
                  <div 
                    key={b.id} 
                    onClick={() => {
                      setBrandFilter(b.name);
                      setProductCategory('all');
                      setActiveTab('catalog');
                    }}
                    className="p-3 bg-slate-50 hover:bg-blue-50 hover:scale-103 rounded-xl border border-slate-150 transition text-center cursor-pointer hover:border-blue-300 group"
                  >
                    <span className="font-black text-slate-700 tracking-wider group-hover:text-blue-600 font-sans block text-xs">
                      {b.name}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-1">Ver tintorería</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: PRODUCT CATALOGUE (Shoes + liquids) */}
        {activeTab === 'catalog' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" id="customer-store-view">
            {/* Left filtration bar */}
            <div className="lg:col-span-3 space-y-6">
              {/* Category selector */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
                <h3 className="font-bold text-neutral-900 text-sm tracking-tight flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Filter className="h-4 w-4 text-slate-500" />
                  <span>Categorías</span>
                </h3>
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => { setProductCategory('all'); setBrandFilter(null); setShoePage(1); }}
                    className={`text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors ${productCategory === 'all' && !brandFilter ? 'bg-neutral-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    Todo el Inventario
                  </button>
                  <button 
                    onClick={() => { setProductCategory('Zapatos'); setBrandFilter(null); setShoePage(1); }}
                    className={`text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors ${productCategory === 'Zapatos' ? 'bg-neutral-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    Zapatos (500+ Modelos)
                  </button>
                  <button 
                    onClick={() => { setProductCategory('Líquidos'); setBrandFilter(null); setShoePage(1); }}
                    className={`text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors ${productCategory === 'Líquidos' ? 'bg-neutral-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    Líquidos Limpiadores
                  </button>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
                <h3 className="font-bold text-neutral-900 text-sm tracking-tight border-b border-slate-100 pb-2">
                  Filtrar por Socio Marca
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => { setBrandFilter(null); setShoePage(1); }}
                    className={`px-2.5 py-1 text-2xs font-semibold rounded-full border transition ${!brandFilter ? 'bg-yellow-400 border-yellow-500 text-neutral-900' : 'bg-slate-50 hover:bg-slate-100'}`}
                  >
                    Todas las marcas
                  </button>
                  {brands.map(b => (
                    <button
                      key={b.id}
                      onClick={() => { setBrandFilter(b.name); setShoePage(1); }}
                      className={`px-2.5 py-1 text-2xs font-semibold rounded-full border transition ${brandFilter === b.name ? 'bg-yellow-400 border-yellow-500 text-neutral-900' : 'bg-slate-50 hover:bg-slate-100'}`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected stats info card */}
              <div className="bg-neutral-900 text-white rounded-2xl p-5 relative overflow-hidden">
                <p className="text-2xs font-mono text-yellow-400 tracking-wider">GARANTÍA CLEAN & SNEAKERS</p>
                <h4 className="font-bold text-sm mt-1">Calzado Auténtico & Restaurado</h4>
                <p className="text-3xs text-neutral-400 mt-2 leading-relaxed">
                  Todos nuestros 500+ tenis pasan por un exhaustivo proceso de validación de autenticidad, desinfección total de interiores, blanqueado contra amarilleo y cambio de agujetas si se requiere.
                </p>
                <div className="h-10 w-10 text-yellow-400/10 absolute bottom-2 right-2">
                  <Sparkles className="h-full w-full" />
                </div>
              </div>
            </div>

            {/* Right inventory lists */}
            <div className="lg:col-span-9 space-y-8">
              {/* Search bar and pagination info */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar tenis o limpiadores..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShoePage(1); }}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-neutral-500"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => { setSearchQuery(''); setShoePage(1); }}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 font-bold text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-500 font-mono text-right w-full sm:w-auto">
                  Encontrados: <strong className="text-slate-900">{filteredProducts.length}</strong> artículos
                </div>
              </div>

              {/* Standard Inventory Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map(p => (
                    <div 
                      key={p.id} 
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-md transition duration-300 flex flex-col justify-between group"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square bg-slate-100 overflow-hidden">
                        <img 
                          src={p.imageUrl} 
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 duration-500"
                          referrerPolicy="no-referrer"
                        />
                        {/* Discount/Tag */}
                        <span className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-xs text-white text-3xs font-bold font-mono px-2 py-0.5 rounded-full">
                          {p.brand}
                        </span>
                        {p.category === 'Zapatos' && (
                          <span className="absolute top-3 right-3 bg-yellow-400 text-neutral-950 text-3xs font-extrabold font-mono px-2 py-0.5 rounded-full">
                            Seminuevo Grado A
                          </span>
                        )}
                      </div>

                      {/* Info body */}
                      <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                        <div>
                          <p className="text-2xs text-slate-400 font-semibold uppercase tracking-wider">{p.category}</p>
                          <h4 className="font-bold text-neutral-900 text-xs sm:text-sm line-clamp-2 mt-0.5 hover:text-neutral-700 transition">
                            {p.name}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                            {p.description}
                          </p>
                        </div>

                        {/* Price & Cart button */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                          <div>
                            <span className="text-2xs text-slate-400 block font-mono">Precio</span>
                            <span className="text-base font-extrabold text-neutral-900">${p.price} MXN</span>
                          </div>
                          
                          <button 
                            onClick={() => addToCartProduct(p)}
                            className="bg-neutral-900 hover:bg-neutral-800 text-white p-2 rounded-xl transition shadow-xs flex items-center gap-1 text-xs font-bold font-sans"
                            id={`add-cart-btn-${p.id}`}
                          >
                            <Plus className="h-4 w-4" />
                            <span>Añadir</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-slate-500 space-y-2">
                    <p className="text-base font-bold">No se encontraron productos coincidentes.</p>
                    <p className="text-xs">Intenta ampliando tus términos de búsqueda o eliminando los filtros.</p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-4">
                  <div className="text-2xs font-mono text-slate-500">
                    Mostrando {(shoePage - 1) * shoesPerPage + 1} – {Math.min(shoePage * shoesPerPage, filteredProducts.length)} de {filteredProducts.length} productos
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setShoePage(prev => Math.max(1, prev - 1))}
                      disabled={shoePage === 1}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-medium transition disabled:opacity-40 disabled:hover:bg-slate-50"
                    >
                      Anterior
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                      // Simple pager
                      let pageNum = idx + 1;
                      if (shoePage > 3 && totalPages > 5) {
                        pageNum = shoePage - 3 + idx;
                        if (pageNum + (4 - idx) > totalPages) {
                          pageNum = totalPages - 4 + idx;
                        }
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setShoePage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition ${shoePage === pageNum ? 'bg-neutral-950 text-white' : 'hover:bg-slate-100 border border-slate-200'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button 
                      onClick={() => setShoePage(prev => Math.min(totalPages, prev + 1))}
                      disabled={shoePage === totalPages}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-medium transition disabled:opacity-40 disabled:hover:bg-slate-50"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: LAUNDRY / SHOE CARE SERVICES CONFIGURATOR */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-fade-in" id="customer-configurator-view">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Selector (Base services and configuration options) */}
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-8 border-r border-slate-200">
                <div>
                  <span className="bg-yellow-100 text-yellow-900 font-bold font-mono text-2xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Configurador Especializado
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-2">Módulo de Servicios Co-diseñado</h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Selecciona tu servicio base de ropa (Cloth) o calzado (Zapatos) y añade extras profesionales para un resultado insuperable. Tu tique mixtamente unirá productos y servicios.
                  </p>
                </div>

                {/* Paso 1: Seleccionar Tipo */}
                <div className="space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-slate-400">Paso 1: Categoría Base</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => {
                        // Pick first shoe service
                        const firstShoe = services.find(s => s.type === 'Zapatos');
                        if (firstShoe) setSelectedBaseService(firstShoe);
                        setSelectedAddons([]);
                      }}
                      className={`p-4 rounded-xl border text-center transition ${selectedBaseService?.type === 'Zapatos' ? 'border-neutral-900 bg-neutral-900/5 ring-1 ring-neutral-900' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      <span className="block text-2xl mb-1">👟</span>
                      <strong className="block text-xs font-bold text-neutral-900">Mantenimiento de Calzado</strong>
                      <span className="text-3xs text-slate-400 block mt-1">Suelas, costuras, gamuza</span>
                    </button>

                    <button 
                      onClick={() => {
                        // Pick first clothing service
                        const firstCloth = services.find(s => s.type === 'Cloth');
                        if (firstCloth) setSelectedBaseService(firstCloth);
                        setSelectedAddons([]);
                      }}
                      className={`p-4 rounded-xl border text-center transition ${selectedBaseService?.type === 'Cloth' ? 'border-neutral-900 bg-neutral-900/5 ring-1 ring-neutral-900' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      <span className="block text-2xl mb-1">👕</span>
                      <strong className="block text-xs font-bold text-neutral-900">Lavado de Ropa (Cloth)</strong>
                      <span className="text-3xs text-slate-400 block mt-1">Por kilogramo, tintorería</span>
                    </button>
                  </div>
                </div>

                {/* Paso 2: Seleccionar Servicio Base de la Categoría */}
                <div className="space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-slate-400">
                    Paso 2: Elegir Paquete de {selectedBaseService?.type === 'Zapatos' ? 'Calzado' : 'Prendas/Ropa'}
                  </h3>
                  <div className="space-y-2">
                    {services
                      .filter(s => s.type === selectedBaseService?.type)
                      .map(s => (
                        <div 
                          key={s.id}
                          onClick={() => setSelectedBaseService(s)}
                          className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-4 ${selectedBaseService?.id === s.id ? 'border-neutral-900 bg-neutral-50 shadow-xs' : 'border-slate-150 hover:bg-slate-50'}`}
                        >
                          <input 
                            type="radio" 
                            name="baseService" 
                            checked={selectedBaseService?.id === s.id}
                            onChange={() => setSelectedBaseService(s)}
                            className="mt-1 text-slate-900 accent-neutral-900"
                          />
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs sm:text-sm text-neutral-900">{s.name}</span>
                              <span className="font-extrabold text-xs sm:text-sm text-neutral-900 bg-slate-100 px-2 py-0.5 rounded-md font-mono">${s.basePrice} MXN</span>
                            </div>
                            <p className="text-2xs text-slate-500 mt-1">{s.description}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Paso 3: Add-ons / Extras */}
                <div className="space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-slate-400">
                    Paso 3: Servicios Adicionales (Add-ons seleccionables)
                  </h3>
                  {addons.filter(a => a.category === selectedBaseService?.type).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {addons
                        .filter(a => a.category === selectedBaseService?.type)
                        .map(a => {
                          const isSelected = selectedAddons.includes(a.id);
                          return (
                            <div 
                              key={a.id}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedAddons(selectedAddons.filter(id => id !== a.id));
                                } else {
                                  setSelectedAddons([...selectedAddons, a.id]);
                                }
                              }}
                              className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${isSelected ? 'border-yellow-500 bg-yellow-400/5 shadow-xs' : 'border-slate-150 hover:bg-slate-50'}`}
                            >
                              <div className="mt-0.5">
                                <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${isSelected ? 'bg-yellow-400 border-yellow-500 text-neutral-950' : 'border-slate-300 bg-white'}`}>
                                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                </div>
                              </div>
                              <div className="flex-grow">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-bold text-2xs text-neutral-900">{a.name}</span>
                                  <span className="font-bold text-2xs text-emerald-700 bg-emerald-55/60 px-1.5 py-0.5 rounded-sm font-mono">+${a.price}</span>
                                </div>
                                <p className="text-3xs text-slate-500 mt-0.5 leading-tight">{a.description}</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-405">No hay adicionales disponibles.</p>
                  )}
                </div>

                {/* Paso 4: Instrucciones Especiales */}
                <div className="space-y-2">
                  <label className="block text-2xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Indicaciones especiales para el taller (Opcional)
                  </label>
                  <textarea 
                    placeholder="Ej. 'Tratar con cuidado la costura derecha, o indicar si se requiere entrega en bolsa bio'..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-neutral-500 h-20"
                  />
                </div>
              </div>

              {/* Right Receipt Preview and Add to Basket Panel */}
              <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <h3 className="font-extrabold text-neutral-900 text-sm font-sans">Resumen de Tu Servicio</h3>
                    <p className="text-3xs text-slate-400">Recalculado en tiempo real</p>
                  </div>

                  {/* Summary ticket graphics design */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 relative">
                    {/* Simulated ticket dots on border */}
                    <div className="absolute top-0 left-0 right-0 h-1 flex justify-between px-4 overflow-hidden -mt-1.5">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <span key={i} className="w-2.5 h-2.5 rounded-full bg-slate-50 border border-slate-200 flex-shrink-0 block -mt-1" />
                      ))}
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {selectedBaseService?.type === 'Zapatos' ? '👟' : '👕'}
                        </span>
                        <div>
                          <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Servicio Base elegido</p>
                          <p className="font-extrabold text-xs sm:text-sm text-neutral-900">{selectedBaseService?.name}</p>
                        </div>
                      </div>

                      {/* Addons detailed lists */}
                      <div className="space-y-2 pt-2 border-t border-dashed border-slate-150">
                        <p className="text-3xs font-bold uppercase text-slate-400 font-mono">EXTRAS INTEGRADOS:</p>
                        {selectedAddons.length > 0 ? (
                          selectedAddons.map(adId => {
                            const ad = addons.find(a => a.id === adId);
                            if (!ad) return null;
                            return (
                              <div key={ad.id} className="flex items-center justify-between text-xs">
                                <span className="text-slate-600 flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-amber-500" />
                                  {ad.name}
                                </span>
                                <span className="font-bold text-slate-900 font-mono">+${ad.price} MXN</span>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-3xs text-slate-400 italic">Ningún servicio extra añadido.</p>
                        )}
                      </div>

                      {specialInstructions && (
                        <div className="pt-2 border-t border-dashed border-slate-150 bg-yellow-50/50 p-2 rounded-lg">
                          <p className="text-3xs font-mono font-bold text-amber-800 uppercase">INSTRUCCIONES EXTRA:</p>
                          <p className="text-3xs text-slate-600 line-clamp-2 italic">"{specialInstructions}"</p>
                        </div>
                      )}
                    </div>

                    {/* Quantity selectors */}
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-800">Cantidad (Paquetes)</span>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-lg">
                        <button 
                          type="button"
                          onClick={() => setServiceQty(prev => Math.max(1, prev - 1))}
                          className="p-1 hover:bg-white rounded text-slate-600"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs font-bold px-2 text-neutral-900 font-mono">{serviceQty}</span>
                        <button 
                          type="button"
                          onClick={() => setServiceQty(prev => prev + 1)}
                          className="p-1 hover:bg-white rounded text-slate-600"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Total static box */}
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between bg-yellow-400/5 -mx-5 -mb-5 p-5 rounded-b-2xl">
                      <div>
                        <span className="text-3xs font-mono uppercase text-slate-500 block">TOTAL ESTIMADO</span>
                        <span className="text-xs text-slate-400 block line-through">
                          ${((selectedBaseService?.basePrice || 0) + selectedAddons.reduce((sum, id) => sum + (addons.find(a => a.id === id)?.price || 0), 0)) * serviceQty * 1.16 === 0 ? '' : ''}
                        </span>
                        <span className="text-xl font-black text-neutral-950 font-mono">
                          ${((selectedBaseService?.basePrice || 0) + selectedAddons.reduce((sum, id) => sum + (addons.find(a => a.id === id)?.price || 0), 0)) * serviceQty} MXN
                        </span>
                      </div>
                      <span className="text-4xs text-slate-400 font-mono uppercase text-right">IVA incluido • Tarifa de mano de obra</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-6 lg:pt-0">
                  <button 
                    onClick={addToCartService}
                    className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold py-3 px-4 rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>Lanzar al Carrito Mixto</span>
                    <ShoppingBag className="h-4 w-4 text-yellow-400" />
                  </button>
                  <p className="text-4xs text-slate-400 text-center leading-normal">
                    Puedes agregar más calzado o líquidos limpiadores al tique común. Una sola cuenta con tique unificado.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 4: ACTIVE TRACKING SYSTEM & QR CODES */}
        {activeTab === 'history' && (
          <div className="space-y-8 animate-fade-in" id="customer-tracking-view">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-150 pb-5">
                <div>
                  <h2 className="text-2xl font-extrabold text-neutral-900">Seguimiento QR & Órdenes Activas</h2>
                  <p className="text-xs text-slate-500">Muestra el código QR en mostrador para entregar calzado o reclamar tus coleccionables listos.</p>
                </div>
                <div className="bg-neutral-900 text-yellow-400 text-xs px-3 py-1.5 rounded-lg font-mono font-bold flex items-center gap-1">
                  <QrCode className="h-4 w-4" />
                  <span>SISTEMA QR INTEGRADO</span>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-3">
                  <p className="text-base font-bold">Aún no tienes órdenes registradas.</p>
                  <p className="text-xs">¡Agrega productos o configura un servicio y haz Checkout para generar tu primer tique QR!</p>
                  <button 
                    onClick={() => setActiveTab('catalog')} 
                    className="px-4 py-2 bg-neutral-950 text-white rounded-xl text-xs font-bold"
                  >
                    Ir a Tienda
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-150 mt-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                      {/* Left: Metadata & items summary */}
                      <div className="space-y-4 flex-grow max-w-xl">
                        <div className="flex flex-wrap items-center gap-3">
                          <strong className="text-base font-black text-neutral-900 font-mono tracking-tight bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                            {ord.id}
                          </strong>
                          <span className={`${getStatusColor(ord.status)} border text-2xs px-2.5 py-0.5 rounded-full font-bold font-mono uppercase`}>
                            Estado: {ord.status}
                          </span>
                          <span className="text-2xs text-slate-505 font-mono">
                            {new Date(ord.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Visual timeline stepper tracking bar */}
                        <div className="space-y-1">
                          <p className="text-4xs font-mono font-bold text-slate-400 uppercase">BARRA DE SEGUIMIENTO:</p>
                          <div className="grid grid-cols-3 gap-2 text-center pt-1.5">
                            <div className={`p-1.5 rounded-md text-3xs font-extrabold border ${ord.status === 'Recibido' ? 'bg-blue-65 text-blue-800 border-blue-400' : 'bg-slate-50 text-slate-400 border-slate-150'}`}>
                              1. Recibido
                            </div>
                            <div className={`p-1.5 rounded-md text-3xs font-extrabold border ${ord.status === 'En proceso' ? 'bg-amber-60 text-amber-800 border-amber-400 animate-pulse' : 'bg-slate-50 text-slate-400 border-slate-150'}`}>
                              2. En Proceso
                            </div>
                            <div className={`p-1.5 rounded-md text-3xs font-extrabold border ${ord.status === 'Listo' ? 'bg-emerald-60 text-emerald-800 border-emerald-400' : 'bg-slate-50 text-slate-400 border-slate-150'}`}>
                              3. Listo en Tienda ⭐
                            </div>
                          </div>
                        </div>

                        {/* Items in order list */}
                        <div className="space-y-2 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                          <p className="text-3xs font-bold text-slate-400 uppercase font-mono">CONTENIDO DE LA COMPRA / SERVICIO:</p>
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="text-slate-700">
                                {it.quantity}x <strong className="text-neutral-900">{it.name}</strong> 
                                <span className="text-3xs text-slate-400 font-mono block pl-4">{it.detailsSummary}</span>
                              </span>
                              <span className="font-bold text-neutral-900 font-mono">${it.price * it.quantity} MXN</span>
                            </div>
                          ))}
                          <div className="border-t border-slate-200/60 pt-2 flex justify-between items-center text-xs font-bold mt-2">
                            <span>TOTAL COBRADO</span>
                            <span className="text-sm font-extrabold font-mono text-neutral-950">${ord.total} MXN</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Dynamic QR code imagery for physical validation */}
                      <div className="flex flex-col items-center bg-slate-50 p-4 rounded-2xl border border-slate-150 border-dashed w-full md:w-fit text-center space-y-2">
                        <p className="text-3xs font-mono font-bold text-slate-500 uppercase">Tique de Pickup / Entrega</p>
                        <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200 flex items-center justify-center">
                          <img 
                            src={ord.qrCodeUrl} 
                            alt={`QR ${ord.id}`}
                            className="w-36 h-36"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-3xs text-slate-400 font-mono">{ord.qrCodeText}</span>
                        <p className="text-4xs text-slate-400 max-w-xs leading-snug">
                          Guarda captura o muestra este código QR para dejar el calzado sucio en el mostrador o recoger tus pertenencias terminadas.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 5: USER PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl mx-auto space-y-6 animate-fade-in" id="customer-profile-view">
            {currentUser ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-150 pb-5">
                  <div className="h-14 w-14 bg-neutral-950 text-white rounded-2xl font-bold flex items-center justify-center text-xl">
                    {currentUser.name[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">{currentUser.name}</h2>
                    <p className="text-xs text-slate-500">Miembro desde Hoy • {currentUser.email}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="ml-auto text-xs font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                  >
                    Cerrar Sesión
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-3xs uppercase font-mono font-bold text-slate-400">Teléfono</span>
                    <p className="text-xs font-semibold text-neutral-900 flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {currentUser.phone}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-3xs uppercase font-mono font-bold text-slate-400">Fecha de Cumpleaños</span>
                    <p className="text-xs font-semibold text-neutral-900 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {currentUser.birthday || 'No provista'}
                    </p>
                  </div>

                  <div className="col-span-full p-3 bg-slate-50 rounded-xl space-y-1">
                    <span className="text-3xs uppercase font-mono font-bold text-slate-400">Dirección Guardada (Entregas / Recogidas)</span>
                    <p className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      {currentUser.address}
                    </p>
                  </div>
                </div>

                {/* Sub-información del perfil */}
                <div className="border hover:border-indigo-100 rounded-xl p-4 flex gap-3 text-2xs text-indigo-900 bg-indigo-55/40">
                  <CheckCircle className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>¡Atención cumpleañero!</strong> Te notificaremos 3 días antes de tu cumpleaños para un <strong>50% de DESCUENTO</strong> en lavado premium de tenis y boleto gratuito para lavandería.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <span className="text-3xs uppercase font-mono font-bold px-2.5 py-1 bg-blue-100 text-blue-850 rounded-full tracking-wider">
                    Modo Demostración Activo
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight uppercase">Bienvenido a Zapatería en Línea</h2>
                  <p className="text-xs text-slate-500">Inicia sesión con tu correo y clave favorita para acceder al perfil de cliente y activar el tracking de tiques QR.</p>
                </div>

                {/* DEMO NOTICE BANNER */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3 text-2xs text-blue-900">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-sm">
                    ✦
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-slate-800">Acceso Libre de Demostración</p>
                    <p className="leading-normal text-slate-600">
                      Para efectos de revisión del demo, puedes escribir <strong>cualquier correo electrónico</strong> y <strong>cualquier contraseña</strong> para crear y entrar de manera instantánea a tu perfil de cliente.
                    </p>
                  </div>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-xl max-w-xs mx-auto">
                  <button 
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 text-xs py-1.5 font-bold rounded-lg transition ${authMode === 'login' ? 'bg-white text-neutral-950 shadow-sm' : 'text-slate-600'}`}
                  >
                    Iniciar Sesión
                  </button>
                  <button 
                    onClick={() => setAuthMode('register')}
                    className={`flex-1 text-xs py-1.5 font-bold rounded-lg transition ${authMode === 'register' ? 'bg-white text-neutral-950 shadow-sm' : 'text-slate-600'}`}
                  >
                    Registrarse
                  </button>
                </div>

                {authMode === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto">
                    <div className="space-y-1">
                      <label className="text-3xs uppercase font-mono font-bold text-slate-400">Correo Electrónico</label>
                      <input 
                        type="email" 
                        required 
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        placeholder="cliente@ejemplo.com" 
                        className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-3xs uppercase font-mono font-bold text-slate-400">Contraseña de Demostración</label>
                      <input 
                        type="password" 
                        required 
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="Cualquier contraseña" 
                        className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-md"
                    >
                      Iniciar Sesión Instantánea
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4 max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-3xs uppercase font-mono font-bold text-slate-400">Nombre Completo</label>
                      <input 
                        type="text" 
                        required 
                        value={regForm.name}
                        onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                        placeholder="Juan Pérez García" 
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-3xs uppercase font-mono font-bold text-slate-400">Correo Electrónico</label>
                      <input 
                        type="email" 
                        required 
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        placeholder="correo@ejemplo.com" 
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-3xs uppercase font-mono font-bold text-slate-400">Teléfono Móvil</label>
                      <input 
                        type="tel" 
                        required 
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        placeholder="eg. 5512345678" 
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-3xs uppercase font-mono font-bold text-slate-400">Dirección para Entregas/Recogidas</label>
                      <input 
                        type="text" 
                        required 
                        value={regForm.address}
                        onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                        placeholder="Av. Paseo de la Reforma 405, Piso 4, CDMX" 
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-3xs uppercase font-mono font-bold text-slate-400">Fecha de Cumpleaños</label>
                      <input 
                        type="date" 
                        required 
                        value={regForm.birthday}
                        onChange={(e) => setRegForm({ ...regForm, birthday: e.target.value })}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-3xs uppercase font-mono font-bold text-slate-400">Contraseña</label>
                      <input 
                        type="password" 
                        required 
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        placeholder="Mínimo 6 caracteres" 
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                      />
                    </div>

                    <div className="sm:col-span-2 pt-3">
                      <button 
                        type="submit" 
                        className="w-full py-3 bg-neutral-950 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition"
                      >
                        Crear Cuenta & Comenzar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* FLOAT MIXED CART PREVIEW / TICKING DRAWER */}
      {cart.length > 0 && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-extrabold text-neutral-950 text-xs flex items-center gap-1">
              <ShoppingBag className="h-4 w-4 text-slate-600" />
              <span>Carrito Mixto ({cart.reduce((sum, it) => sum + it.quantity, 0)} ítems)</span>
            </h4>
            <button 
              onClick={() => setCart([])}
              className="text-3xs font-mono text-red-500 hover:underline flex items-center gap-0.5"
            >
              <Trash2 className="h-3 w-3" /> Limpiar
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-start text-3xs border-b border-slate-50 pb-2">
                <div className="space-y-0.5 flex-grow">
                  <p className="font-bold text-neutral-900">{item.name}</p>
                  {item.type === 'service' ? (
                    <span className="bg-yellow-100 text-yellow-905 px-1 rounded-sm text-4xs inline-block">Servicio</span>
                  ) : (
                    <span className="bg-blue-105 text-blue-900 px-1 rounded-sm text-4xs inline-block">Producto</span>
                  )}
                  <p className="text-slate-400 font-mono">${item.price} MXN c/u</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded">
                    <button onClick={() => updateCartQty(item.id, -1)} className="p-0.5 hover:bg-white rounded"><Minus className="h-2 w-2" /></button>
                    <span className="font-bold px-1 font-mono">{item.quantity}</span>
                    <button onClick={() => updateCartQty(item.id, 1)} className="p-0.5 hover:bg-white rounded"><Plus className="h-2 w-2" /></button>
                  </div>
                  <strong className="text-neutral-900 font-mono text-right min-w-[50px]">${item.price * item.quantity}</strong>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-450 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-150 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500 font-sans">Total Neto</span>
            <span className="text-sm font-black font-mono text-neutral-900">${cartTotal} MXN</span>
          </div>

          <button 
            onClick={() => {
              if (!currentUser) {
                alert('Inicia sesión o regístrate en la sección "Perfil" para completar tu tique y código QR.');
                setActiveTab('profile');
              } else {
                setCheckoutStep('form');
                setIsCheckoutOpen(true);
              }
            }}
            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition duration-300 shadow-md text-center block"
            id="checkout-trigger-btn"
          >
            Proceder al Pago Seguro
          </button>
        </div>
      )}

      {/* CHECKOUT BOX DIALOG MODAL (Stripe Integration simulation) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-scale-up border border-slate-150">
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute right-4 top-4 hover:bg-slate-100 p-1.5 rounded-full text-slate-400 transition"
            >
              ✕
            </button>

            {checkoutStep === 'form' && (
              <form onSubmit={handlePerformCheckout} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-150">
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                  <div>
                    <h3 className="font-extrabold text-neutral-950 text-sm">Pasarela de Pagos Segura</h3>
                    <p className="text-3xs text-slate-400">Simulación cifrada por SSL (Stripe / Mercado Pago)</p>
                  </div>
                </div>

                {/* Amount display */}
                <div className="bg-indigo-50/50 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-3s font-mono text-indigo-750 uppercase block">ORDEN MIXTA DE SERVICIO/PRODUCTO</span>
                    <span className="text-xs text-slate-550">{cart.length} artículos únicos</span>
                  </div>
                  <span className="text-base font-extrabold text-indigo-950 font-mono">${cartTotal} MXN</span>
                </div>

                {/* Delivery Option */}
                <div className="space-y-1">
                  <label className="text-3xs font-bold font-mono uppercase text-slate-400 block">Tipo de Recepción</label>
                  <select className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-white">
                    <option value="pickup">Dejar en Taller y recoger con Código QR QR</option>
                    <option value="delivery">Envío y Recogida a Domicilio (${currentUser?.address})</option>
                  </select>
                </div>

                {/* Card input */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-3xs font-bold font-mono uppercase text-slate-400">Titular de la Tarjeta</label>
                    <input 
                      type="text" 
                      required
                      value={paymentDetails.cardName}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value.toUpperCase() })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-3xs font-bold font-mono uppercase text-slate-400">Número de Tarjeta</label>
                    <input 
                      type="text" 
                      required
                      value={paymentDetails.cardNumber}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-3xs font-bold font-mono uppercase text-slate-400">Expiración (MM/AA)</label>
                      <input 
                        type="text" 
                        required
                        value={paymentDetails.cardExpiry}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cardExpiry: e.target.value })}
                        placeholder="MM/AA"
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-3xs font-bold font-mono uppercase text-slate-400">CVC (3 dígitos)</label>
                      <input 
                        type="password" 
                        required
                        value={paymentDetails.cardCvc}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cardCvc: e.target.value })}
                        maxLength={3}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-center"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-bold rounded-xl tracking-wider transition duration-300 flex items-center justify-center gap-2 mt-4"
                  id="pay-confirm-btn"
                >
                  <span>AUTORIZAR CARGO TOTAL DE ${cartTotal} MXN</span>
                </button>
              </form>
            )}

            {checkoutStep === 'processing' && (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="animate-spin h-10 w-10 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
                <div>
                  <h4 className="font-extrabold text-neutral-950">Validando tique de compra mixta...</h4>
                  <p className="text-xs text-slate-500 mt-1">Conectando con pasarela e imprimiendo el código QR del servicio.</p>
                </div>
              </div>
            )}

            {checkoutStep === 'done' && (
              <div className="py-4 space-y-6 text-center">
                <div className="h-12 w-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <div>
                  <h4 className="font-extrabold text-neutral-905 text-base">¡Pago Autorizado con éxito!</h4>
                  <p className="text-xs text-slate-505 mt-1">Se ha generado tu código QR único para la orden {lastCreatedOrder?.id}. Puedes verlo en tu sección de Seguimiento QR.</p>
                </div>

                {lastCreatedOrder && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-dashed text-center flex flex-col items-center">
                    <img 
                      src={lastCreatedOrder.qrCodeUrl} 
                      alt="Tique QR"
                      className="w-32 h-32"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-xs font-mono font-bold text-neutral-900 mt-2">{lastCreatedOrder.id}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setActiveTab('history');
                    }}
                    className="flex-1 py-2.5 bg-neutral-950 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition"
                  >
                    Ver mis Tiques QR
                  </button>
                  <button 
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setActiveTab('home');
                    }}
                    className="flex-1 py-1 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-xl font-medium transition"
                  >
                    Seguir Navegando
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION APP BAR (lg:hidden) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex items-center justify-around py-2 px-1 shadow-2xl pb-safe">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition ${activeTab === 'home' ? 'text-blue-600 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-[10px] tracking-tight font-extrabold">Inicio</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center gap-1.5 py-1 px-3 transition ${activeTab === 'catalog' ? 'text-blue-600 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <span className="text-xl font-medium">👟</span>
          <span className="text-[10px] tracking-tight font-extrabold">Tienda</span>
        </button>

        <button 
          onClick={() => setActiveTab('services')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition ${activeTab === 'services' ? 'text-blue-600 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <span className="text-xl">🧺</span>
          <span className="text-[10px] tracking-tight font-extrabold">Servicios</span>
        </button>

        {currentUser && (
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 py-1 px-3 transition ${activeTab === 'history' ? 'text-blue-600 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <span className="text-xl">🔍</span>
            <span className="text-[10px] tracking-tight font-extrabold">Tracking</span>
          </button>
        )}

        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1.5 py-1 px-3 transition ${activeTab === 'profile' ? 'text-blue-600 font-extrabold scale-105' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <span className="text-xl">👤</span>
          <span className="text-[10px] tracking-tight font-extrabold">{currentUser ? currentUser.name.split(' ')[0] : 'Perfil'}</span>
        </button>
      </div>

      </div>
    </div>
  );
}
