// DEMO VERİSİ
export const suppliers = [
  {
    id: "sup_coffee",
    name: "AKMİ Kahve",
    slogan: "Taze kavrum, hızlı teslim",
    logo: "",
    hq: "İstanbul",
    regions: ["Marmara", "Ege"],
    categories: ["Kahve", "Paketleme"],
    about: "Özel harmanlar ve esnek tedarik.",
    products: [
      {
        id: "p_espresso",
        name: "Espresso Blend",
        images: [],
        visibility: "visible",
        options: [
          {
            id: "o250",
            name: "250g",
            unit: "250 g",
            price: 120,
            stock: 30,
            visible: "visible",
          },
          {
            id: "o1kg",
            name: "1kg",
            unit: "1 kg",
            price: 420,
            stock: 12,
            visible: "visible",
          },
        ],
        overrides: { firma_y: { showStock: false, price: { o250: 110 } } },
      },
      {
        id: "p_filter",
        name: "Filtre Kahve",
        images: [],
        visibility: "visible",
        options: [
          {
            id: "o250",
            name: "250g",
            unit: "250 g",
            price: 95,
            stock: 5,
            visible: "visible",
          },
          {
            id: "o1kg",
            name: "1kg",
            unit: "1 kg",
            price: 360,
            stock: 0,
            visible: "visible",
          },
        ],
        overrides: {},
      },
    ],
  },
  {
    id: "sup_glass",
    name: "Cam&Bardak A.Ş.",
    slogan: "Dayanıklı ve şık",
    logo: "",
    hq: "İzmir",
    regions: ["Ege", "Akdeniz"],
    categories: ["Cam&Bardak", "Aksesuar"],
    about: "Kafe ve restoranlara özel ürün çizgisi.",
    products: [
      {
        id: "p_glass1",
        name: "Isıya Dayanıklı Bardak (200 ml)",
        images: [],
        options: [
          {
            id: "std",
            name: "Standart",
            unit: "adet",
            price: 25,
            stock: 400,
            visible: "visible",
          },
        ],
        visibility: "visible",
        overrides: {},
      },
    ],
  },
];

// “Müşteri perspektifi” simülasyonu için aktif firma
export const viewerFirm = "firma_y"; // ?viewer=firma_y ile products.html’de kullanılacak

// Basit siparişler
export const orders = [
  {
    id: "SIP-2025-0001",
    date: "2025-10-01",
    buyer: "firma_y",
    suppliers: ["sup_coffee", "sup_glass"],
    items: [
      {
        supplier: "sup_coffee",
        productId: "p_espresso",
        optionId: "o250",
        qty: 4,
        price: 120,
      },
      {
        supplier: "sup_glass",
        productId: "p_glass1",
        optionId: "std",
        qty: 24,
        price: 25,
      },
    ],
    status: "Hazırlanıyor",
    notes: {
      sup_coffee: "Bardak yazıları basılmasın",
      sup_glass: "Kırılmaya karşı ekstra paket",
    },
    deliveryAddress: "Maslak/İstanbul",
  },
  {
    id: "SIP-2025-0002",
    date: "2025-10-10",
    buyer: "firma_y",
    suppliers: ["sup_coffee"],
    items: [
      {
        supplier: "sup_coffee",
        productId: "p_filter",
        optionId: "o1kg",
        qty: 2,
        price: 360,
      },
    ],
    status: "Teslim edildi",
    notes: {},
    deliveryAddress: "Buca/İzmir",
  },
];

// Stok hareketleri (örnek)
export const stockMovements = [
  {
    date: "2025-09-20",
    product: "Espresso Blend / 250g",
    change: +20,
    reason: "Üretim girişi",
    user: "depo",
  },
  {
    date: "2025-10-05",
    product: "Filtre Kahve / 1kg",
    change: -1,
    reason: "Sayım düzeltmesi",
    user: "depo",
  },
];
