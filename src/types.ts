export type OrderStatus = 'Recibido' | 'En proceso' | 'Listo';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  birthday: string;
}

export interface BrandPartner {
  id: string;
  name: string;
  logoUrl?: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Zapatos' | 'Líquido de Limpieza' | 'Ropa';
  price: number;
  stock: number;
  brand: string;
  description: string;
  imageUrl: string;
}

export interface ServiceBase {
  id: string;
  name: string;
  type: 'Cloth' | 'Zapatos';
  basePrice: number;
  description: string;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  category: 'Cloth' | 'Zapatos';
  description: string;
}

export interface CartItem {
  id: string; // Unique for cart (can be product-id or service-config-id)
  type: 'product' | 'service';
  name: string;
  price: number;
  quantity: number;
  details?: {
    baseServiceId?: string;
    addonsSelected?: string[];
    specialInstructions?: string;
  };
  product?: Product;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    type: 'product' | 'service';
    detailsSummary?: string;
  }[];
  total: number;
  status: OrderStatus;
  qrCodeUrl: string;
  qrCodeText: string;
  createdAt: string;
}
