import { Product, BrandPartner, ServiceBase, Addon, Order } from './types';

// Brands defined
export const INITIAL_BRANDS: BrandPartner[] = [
  { id: '1', name: 'Nike', description: 'Just Do It. Innovación y estilo deportivo líder en el mundo.' },
  { id: '2', name: 'Adidas', description: 'Imposible is Nothing. Clásicos del streetwear y calzado técnico.' },
  { id: '3', name: 'Crep Protect', description: 'El protector definitivo para tus tenis favoritos. Tecnología de escudo.' },
  { id: '4', name: 'Jason Markk', description: 'Productos de limpieza premium biodegradables para amantes del calzado.' },
  { id: '5', name: 'Reshoevn8r', description: 'Sistemas de limpieza profunda patentados para calzado deportivo de colección.' },
  { id: '6', name: 'New Balance', description: 'Hecho para durar. Comodidad inigualable y siluetas retro de culto.' },
  { id: '7', name: 'Jordan', description: 'Inspirado por la grandeza de Michael Jordan. Cultura de básquetbol y colección.' }
];

// Seed raw shoe catalog (will generate 520 programmatically)
const SHOE_BRANDS = ['Nike', 'Adidas', 'Jordan', 'New Balance', 'Yeezy', 'Puma', 'Reebok', 'Vans', 'Converse', 'ASICS'];
const SHOE_MODELS: Record<string, string[]> = {
  Nike: ['Air Force 1', 'Dunk Low', 'Air Max 90', 'Air Max 270', 'Pegasus Runner', 'Blazer Mid', 'Cortez Class', 'Zoom Freak'],
  Adidas: ['Ultraboost 1.0', 'Samba OG', 'Gazelle Super', 'Stan Smith', 'NMD R1', 'Campus 00s', 'Superstar Classic', 'Forum Low'],
  Jordan: ['Air Jordan 1 High', 'Air Jordan 4 Retro', 'Air Jordan 11 Bred', 'Air Jordan 3 Cement', 'Jordan Delta 3', 'Air Jordan 5 Tech'],
  'New Balance': ['550 Retro', '990v5 Heritage', '2002R Protection', '327 Lifestyle', '574 Core', '1906R Tech'],
  Yeezy: ['Boost 350 V2', 'Boost 700 Wave', 'Slide Resin', 'Foam Runner Onyx', 'Yeezy 500 Blush'],
  Puma: ['Suede Classic', 'Cali Dream', 'RS-X Reinvent', 'Palermo OG', 'Slipstream Retro'],
  Reebok: ['Club C 85', 'Classic Leather', 'Pump Omni Zone', 'Nano X3 Trainer'],
  Vans: ['Old Skool Core', 'Sk8-Hi High', 'Slip-On Classic', 'Authentic Canvas'],
  Converse: ['Chuck Taylor All Star', 'Chuck 70 High-Top', 'Run Star Hike', 'One Star Pro'],
  ASICS: ['Gel-Kayano 14', 'Gel-Lyte III', 'GT-2160 Sport', 'Novablast Runner']
};

const SHOE_COLORS = ['Negro', 'Blanco', 'Gris', 'Azul Marino', 'Rojo Fuego', 'Verde Oliva', 'Pana Beige', 'Multicolor', 'Menta', 'Rosa Pastel'];

// Generating 520 shoes programmatically
export function generateShoeCatalog(): Product[] {
  const list: Product[] = [];
  let idCounter = 1;

  for (let b = 0; b < SHOE_BRANDS.length; b++) {
    const brand = SHOE_BRANDS[b];
    const models = SHOE_MODELS[brand];

    for (let m = 0; m < models.length; m++) {
      const model = models[m];

      for (let c = 0; c < SHOE_COLORS.length; c++) {
        const color = SHOE_COLORS[c];
        
        // Generate a deterministic SKU/Product
        const id = `shoe-${idCounter}`;
        const name = `${brand} ${model} "${color}"`;
        const price = 1200 + ((idCounter * 37) % 3600); // stable prices from $1200 to $4800 MXN
        const stock = (idCounter * 11) % 18 + 1; // stock from 1 to 18
        const description = `Edición premium en color ${color.toLowerCase()}. Calzado totalmente restaurado por nuestros talleres o de inventario exclusivo. Suelas desinfectadas y costuras reforzadas de fábrica. Perfectos para tu colección.`;
        
        // Dynamic simulated shoe image based on brand/color
        const imgIndex = (idCounter % 5) + 1;
        // Unsplash shoe images that exist and look modern
        const shoeImages = [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60', // Red Nike
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=60', // Colorful Nike
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=60', // Volt Nike
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=60', // New Balance styles
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=60', // Adidas white/green
          'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&auto=format&fit=crop&q=60'  // Red converse
        ];
        const imageUrl = shoeImages[idCounter % shoeImages.length];

        list.push({
          id,
          name,
          category: 'Zapatos',
          price,
          stock,
          brand,
          description,
          imageUrl
        });

        idCounter++;
        if (idCounter > 520) break; // Hard limit at 520
      }
      if (idCounter > 520) break;
    }
    if (idCounter > 520) break;
  }
  return list;
}

// Cleaning liquids
export const INITIAL_LIQUIDS: Product[] = [
  {
    id: 'liq-1',
    name: 'Jason Markk Essential Clean Solution',
    category: 'Líquido de Limpieza',
    price: 349,
    stock: 45,
    brand: 'Jason Markk',
    description: 'Solución limpiadora premium biodegradable. Segura para todos los materiales, incluyendo gamuza, cuero, lona y malla. Contenido 8 oz (rinde más de 100 lavadas).',
    imageUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: 'liq-2',
    name: 'Crep Protect Cure Supreme Kit Liquid',
    category: 'Líquido de Limpieza',
    price: 420,
    stock: 30,
    brand: 'Crep Protect',
    description: 'Fórmula de limpieza ultra-avanzada con extractos de coco y jojoba. Incluye cepillo de cerdas de cerdo premium y microfibra de alta densidad.',
    imageUrl: 'https://images.unsplash.com/photo-1563172891-9321b1e6005c?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: 'liq-3',
    name: 'Reshoevn8r Laundry Detergent Gel',
    category: 'Líquido de Limpieza',
    price: 499,
    stock: 22,
    brand: 'Reshoevn8r',
    description: 'Detergente líquido concentrado especial para lavado de calzado en lavadora. Remueve manchas profundas del tejido Knit y Malla sin dañar las fibras.',
    imageUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d1e0ca96?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: 'liq-4',
    name: 'Escudo Repelente Water & Stain Crep',
    category: 'Líquido de Limpieza',
    price: 380,
    stock: 50,
    brand: 'Crep Protect',
    description: 'Aerosol impermeabilizante invisible de tecnología de nano capsula. Protege tus tenis contra lluvia, lodo y manchas accidentales hasta por 4 semanas.',
    imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=60'
  }
];

// Base Services
export const INITIAL_SERVICES: ServiceBase[] = [
  { id: 'ser-1', name: 'Lavado Básico de Tenis / Sneakers', type: 'Zapatos', basePrice: 199, description: 'Limpieza física exterior de la capellada, media suela y agujetas con cepillos suaves de acuerdo al material.' },
  { id: 'ser-2', name: 'Limpieza Premium Profunda de Calzado', type: 'Zapatos', basePrice: 349, description: 'Limpieza a detalle de capellada, suela interior, desinfección interna UV, lavado de agujetas y pulido de entresuela.' },
  { id: 'ser-3', name: 'Lavado Normal de Ropa (Por Kilogramo)', type: 'Cloth', basePrice: 45, description: 'Servicio de lavado, centrifugado y doblado de ropa de diario por peso. Mínimo 3 kg en orden.' },
  { id: 'ser-4', name: 'Tintorería Especializada (Sacos, Vestidos)', type: 'Cloth', basePrice: 140, description: 'Servicio en seco para prendas delicadas y de etiqueta. Incluye planchado con vapor.' }
];

// Addons available
export const INITIAL_ADDONS: Addon[] = [
  { id: 'add-1', name: 'Desinfección Antibacterial Profunda (Zapatos)', price: 60, category: 'Zapatos', description: 'Tratamiento de ozono que elimina el 99.9% de las bacterias causantes del mal olor en las plantillas.' },
  { id: 'add-2', name: 'Costura / Reparación de Rejilla (Zapatos)', price: 120, category: 'Zapatos', description: 'Refuerzo de sastre profesional a mano sobre mallas rasgadas o punteras despegadas.' },
  { id: 'add-3', name: 'Teñido de Materiales Desgastados (Zapatos)', price: 180, category: 'Zapatos', description: 'Pigmentación manual de gamuza o lona decolorada con tintes de grado profesional.' },
  { id: 'add-4', name: 'Protección Repelente de Manchas Nano (Zapatos)', price: 50, category: 'Zapatos', description: 'Aplicación de aerosol sellante nano-tecnológico para evitar manchas líquidas inmediatas.' },
  { id: 'add-5', name: 'Planchado Adicional y Almidonado (Ropa)', price: 30, category: 'Cloth', description: 'Planchado manual minucioso y aplicación de almidón ligero para camisas impecables.' },
  { id: 'add-6', name: 'Remoción de Manchas Químicas Difíciles (Ropa)', price: 70, category: 'Cloth', description: 'Tratamiento pre-lavado con solventes orgánicos para despegar grasa, vino duro o tinta.' }
];

// Initial pre-loaded orders and tracking simulated
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9871',
    customerName: 'Juan Pérez García',
    customerPhone: '5512345678',
    customerAddress: 'Av. Paseo de la Reforma 405, CDMX, 06500',
    items: [
      { name: 'Limpieza Premium Profunda de Calzado', price: 349, quantity: 1, type: 'service', detailsSummary: 'Zapatos - Extras: Desinfección Antibacterial Profunda (Zapatos)' },
      { name: 'Jason Markk Essential Clean Solution', price: 349, quantity: 2, type: 'product' }
    ],
    total: 1047,
    status: 'En proceso',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ORD-9871',
    qrCodeText: 'ORD-9871',
    createdAt: '2026-05-26T20:15:00Z'
  },
  {
    id: 'ORD-5432',
    customerName: 'María Rodríguez Vega',
    customerPhone: '8187654321',
    customerAddress: 'Calle San Pedro 129, Monterrey, NL',
    items: [
      { name: 'Lavado Normal de Ropa (Por Kilogramo)', price: 45, quantity: 5, type: 'service', detailsSummary: 'Cloth - Extras: Remoción de Manchas Químicas Difíciles (Ropa)' }
    ],
    total: 295,
    status: 'Listo',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ORD-5432',
    qrCodeText: 'ORD-5432',
    createdAt: '2026-05-25T11:40:00Z'
  },
  {
    id: 'ORD-3321',
    customerName: 'Santiago Lema',
    customerPhone: '3398712345',
    customerAddress: 'Avenida Chapultepec 510, Guadalajara, JAL',
    items: [
      { name: 'Nike Dunks Premium Restored', price: 1680, quantity: 1, type: 'product' }
    ],
    total: 1680,
    status: 'Recibido',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ORD-3321',
    qrCodeText: 'ORD-3321',
    createdAt: '2026-05-27T02:10:00Z'
  }
];
