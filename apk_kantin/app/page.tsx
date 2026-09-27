"use client";

import React, { useState, useMemo } from "react";

// --- Types ---
interface MenuItem {
  id: string;
  name: string;
  stall: string;
  stallLocation: string;
  category: "paket-hemat" | "makanan-berat" | "snack" | "minuman" | "cepat-saji";
  price: number;
  originalPrice?: number;
  prepTimeMinutes: number;
  rating: number;
  reviewCount: number;
  description: string;
  imageUrl: string;
  badge?: string;
  isPopular?: boolean;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface OrderConfirmation {
  orderId: string;
  pickupTime: string;
  stallList: string[];
  totalPrice: number;
  items: CartItem[];
  customerNote: string;
}

// --- Mock Data ---
const STALLS = [
  { id: "all", name: "Semua Stand", icon: "🍽️" },
  { id: "geprek-radit", name: "Ayam Geprek Mas Radit", location: "Stand 01 - Lt. 1", icon: "🍗" },
  { id: "warung-barokah", name: "Warung Nasi Barokah", location: "Stand 03 - Lt. 1", icon: "🍛" },
  { id: "mie-bakso-kampus", name: "Mie & Bakso Juara", location: "Stand 05 - Lt. 1", icon: "🍜" },
  { id: "kopi-cemilan-up", name: "Kopi & Kudapan UP", location: "Stand 08 - Lt. 2", icon: "☕" },
  { id: "dapur-bunda", name: "Dapur Bunda Rumahan", location: "Stand 11 - Lt. 2", icon: "🥗" },
];

const CATEGORIES = [
  { id: "all", label: "Semua Menu", icon: "✨" },
  { id: "paket-hemat", label: "Paket Hemat Mahasiswa", icon: "🎓" },
  { id: "makanan-berat", label: "Makanan Berat", icon: "🍛" },
  { id: "cepat-saji", label: "Siap Cepat (< 8 Menit)", icon: "⚡" },
  { id: "snack", label: "Cemilan & Dimsum", icon: "🥟" },
  { id: "minuman", label: "Minuman & Kopi", icon: "🥤" },
];

const MENU_ITEMS: MenuItem[] = [
  {
    id: "item-1",
    name: "Paket Geprek Sambal Korek + Es Teh",
    stall: "Ayam Geprek Mas Radit",
    stallLocation: "Stand 01 - Lt. 1",
    category: "paket-hemat",
    price: 15000,
    originalPrice: 18000,
    prepTimeMinutes: 7,
    rating: 4.9,
    reviewCount: 342,
    description: "Ayam krispi renyah digeprek sambal bawang pedas nampol + nasi pulen hangat & es teh manis segar.",
    imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80",
    badge: "Terlaris #1",
    isPopular: true,
  },
  {
    id: "item-2",
    name: "Nasi Goreng Gila Spesial Kampus",
    stall: "Warung Nasi Barokah",
    stallLocation: "Stand 03 - Lt. 1",
    category: "makanan-berat",
    price: 14000,
    prepTimeMinutes: 8,
    rating: 4.8,
    reviewCount: 215,
    description: "Nasi goreng racikan khas dengan topping sosis, bakso, telur orak-arik, dan taburan kerupuk bawang.",
    imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80",
    badge: "Porsi Kenyang",
    isPopular: true,
  },
  {
    id: "item-3",
    name: "Mie Ayam Komplit Bakso Urat",
    stall: "Mie & Bakso Juara",
    stallLocation: "Stand 05 - Lt. 1",
    category: "makanan-berat",
    price: 13000,
    originalPrice: 15000,
    prepTimeMinutes: 6,
    rating: 4.7,
    reviewCount: 189,
    description: "Mie kenyal gurih dengan tumisan ayam kecap manis legit, 2 bakso urat sapi asli, pangsit renyah, dan kuah kaldu hangat.",
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80",
    badge: "Diskon 13%",
  },
  {
    id: "item-4",
    name: "Kopi Susu Gula Aren 'Anti Mengantuk'",
    stall: "Kopi & Kudapan UP",
    stallLocation: "Stand 08 - Lt. 2",
    category: "minuman",
    price: 10000,
    originalPrice: 12000,
    prepTimeMinutes: 4,
    rating: 4.9,
    reviewCount: 420,
    description: "Espresso double shot dipadukan susu creamy dan gula aren organik. Teman setia ngerjain tugas kuliah.",
    imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80",
    badge: "Favorit Deadline",
    isPopular: true,
  },
  {
    id: "item-5",
    name: "Paket Nasi Telur Dadar Krispi + Sayur",
    stall: "Dapur Bunda Rumahan",
    stallLocation: "Stand 11 - Lt. 2",
    category: "paket-hemat",
    price: 9500,
    prepTimeMinutes: 5,
    rating: 4.8,
    reviewCount: 178,
    description: "Solusi penyelamat akhir bulan! Telur dadar renyah tebal, tempe orek manis, sayur sop/lodeh, dan sambal tomat.",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    badge: "Harga Mahasiswa",
  },
  {
    id: "item-6",
    name: "Dimsum Siomay Ayam Mentai (Isi 4)",
    stall: "Kopi & Kudapan UP",
    stallLocation: "Stand 08 - Lt. 2",
    category: "snack",
    price: 12000,
    prepTimeMinutes: 5,
    rating: 4.8,
    reviewCount: 96,
    description: "Siomay ayam padat lembut dengan saus mentai gurih dibakar torch harum kecokelatan dan taburan nori.",
    imageUrl: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=80",
    badge: "Cemilan Hits",
  },
  {
    id: "item-7",
    name: "Es Teh Solo Melati Jumbo Segar",
    stall: "Warung Nasi Barokah",
    stallLocation: "Stand 03 - Lt. 1",
    category: "minuman",
    price: 3500,
    prepTimeMinutes: 2,
    rating: 4.9,
    reviewCount: 512,
    description: "Teh racikan asli Solo wangi melati, manis pas dengan porsi jumbo 22oz penyegar dahaga sehabis jam kuliah siang.",
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80",
    badge: "Super Segar",
  },
  {
    id: "item-8",
    name: "Ayam Bakar Madu Pedas + Nasi",
    stall: "Ayam Geprek Mas Radit",
    stallLocation: "Stand 01 - Lt. 1",
    category: "makanan-berat",
    price: 16000,
    prepTimeMinutes: 9,
    rating: 4.8,
    reviewCount: 143,
    description: "Potongan ayam bakar bumbu madu legit meresap hingga ke serat daging, disajikan dengan lalapan segar dan sambal terasi.",
    imageUrl: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "item-9",
    name: "Pisang Goreng Keju Cokelat Krispi",
    stall: "Kopi & Kudapan UP",
    stallLocation: "Stand 08 - Lt. 2",
    category: "snack",
    price: 8000,
    prepTimeMinutes: 6,
    rating: 4.7,
    reviewCount: 88,
    description: "Pisang raja manis berselimut tepung krispi renyah dengan limpahan keju cheddar parut dan susu kental manis cokelat.",
    imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "item-10",
    name: "Rice Bowl Beef Teriyaki Telur Setengah Matang",
    stall: "Dapur Bunda Rumahan",
    stallLocation: "Stand 11 - Lt. 2",
    category: "cepat-saji",
    price: 18000,
    originalPrice: 20000,
    prepTimeMinutes: 6,
    rating: 4.9,
    reviewCount: 204,
    description: "Irisan daging sapi empuk dengan saus teriyaki gurih manis, taburan wijen sangrai, dan telur mata sapi lembut siap santap cepat.",
    imageUrl: "https://images.unsplash.com/photo-1546069901-d8a436ae4dbb?w=600&auto=format&fit=crop&q=80",
    badge: "Kilat & Bergizi",
  },
];

export default function KantinUPHomePage() {
  // --- States ---
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStall, setSelectedStall] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [pickupTimeOption, setPickupTimeOption] = useState<string>("10-15-mnt");
  const [orderNotes, setOrderNotes] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("qris");
  const [orderSuccess, setOrderSuccess] = useState<OrderConfirmation | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Handlers ---
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prevCart.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
    showToast(`✓ ${item.name} ditambahkan`);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((ci) => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const totalCartCount = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cart]);

  const totalCartPrice = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  }, [cart]);

  // --- Filtered Menu Items ---
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category Filter
      if (selectedCategory === "cepat-saji") {
        if (item.prepTimeMinutes > 7) return false;
      } else if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      // Stall Filter
      if (selectedStall !== "all") {
        const stallObj = STALLS.find((s) => s.id === selectedStall);
        if (stallObj && item.stall !== stallObj.name) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesStall = item.stall.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesStall;
      }

      return true;
    });
  }, [selectedCategory, selectedStall, searchQuery]);

  // --- Checkout Simulation ---
  const handleCheckout = () => {
    if (cart.length === 0) return;

    const uniqueStalls = Array.from(new Set(cart.map((c) => c.item.stall)));
    const pickupLabels: Record<string, string> = {
      "10-15-mnt": "Segera (10-15 menit lagi)",
      "istirahat-siang": "Istirahat Siang (12:00 WIB)",
      "istirahat-sore": "Istirahat Kuliah Sore (15:15 WIB)",
    };

    const newOrder: OrderConfirmation = {
      orderId: `KUP-${Math.floor(1000 + Math.random() * 9000)}`,
      pickupTime: pickupLabels[pickupTimeOption] || "10-15 Menit",
      stallList: uniqueStalls,
      totalPrice: totalCartPrice,
      items: [...cart],
      customerNote: orderNotes,
    };

    setOrderSuccess(newOrder);
    setCart([]);
    setIsCartOpen(false);
    setOrderNotes("");
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans selection:bg-amber-100 selection:text-amber-900 pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* --- Top Campus Banner --- */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-white text-xs sm:text-sm py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center justify-center bg-white/20 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
              ⚡ Antrean Bebas
            </span>
            <span className="hidden sm:inline">
              Kantin Kampus buka sampai 17:00 WIB • Rata-rata waktu tunggu cuma 7 menit!
            </span>
            <span className="sm:hidden truncate">Hemat waktu istirahatmu dengan KantinUP!</span>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-xs">
            <span className="bg-white/15 px-2.5 py-1 rounded-md font-mono font-medium tracking-wide">
              Kode: MAHASISWAHEMAT
            </span>
          </div>
        </div>
      </div>

      {/* --- Main Navigation Header --- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Campus Tag */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8h1a4 44 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Kantin<span className="text-orange-500">UP</span>
                </span>
                <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Campus
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Food Court Gedung Utama
              </p>
            </div>
          </div>

          {/* Quick Search in Navbar (Visible on Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Mau makan apa hari ini? Cari geprek, mie, es teh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/90 text-sm pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Header Navigation & Cart Action */}
          <div className="flex items-center gap-3">
            <a
              href="#cara-kerja"
              className="hidden lg:inline-flex text-xs font-semibold text-slate-600 hover:text-orange-600 transition-colors px-2 py-1"
            >
              Cara Pesan
            </a>
            <a
              href="#stand-kantin"
              className="hidden lg:inline-flex text-xs font-semibold text-slate-600 hover:text-orange-600 transition-colors px-2 py-1"
            >
              Daftar Stand
            </a>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm active:scale-95"
              aria-label="Buka Keranjang Pesanan"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="hidden sm:inline">Pesanan</span>
              {totalCartCount > 0 && (
                <span className="bg-orange-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="p-3 md:hidden border-t border-slate-100 bg-white">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Cari makanan, minuman, atau stand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-sm pl-10 pr-8 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-amber-50/30 to-slate-50 pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-orange-100/90 border border-orange-200 text-orange-800 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                <span>Khusus Civitas Academica & Mahasiswa</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Pesan Cepat di Kantin,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                  Bebas Antre
                </span>{" "}
                Saat Istirahat Kuliah.
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Pesan makanan favoritmu langsung dari ruang kelas atau perpustakaan. Makanan disiapkan tepat waktu,
                tinggal ambil di loket fast-track kantin tanpa berdesakan.
              </p>

              {/* Value Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    ⚡
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">Hemat 20 Menit</p>
                    <p className="text-[11px] text-slate-500">Tanpa antre di kasir</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                    📱
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">Cashless QRIS</p>
                    <p className="text-[11px] text-slate-500">Bayar instan pakai HP</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                    ⏰
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">Jadwal Ambil</p>
                    <p className="text-[11px] text-slate-500">Atur jam selesai kuliah</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="#menu-catalog"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-md shadow-orange-500/25 transition-all text-sm active:scale-95"
                >
                  <span>Pilih Menu Sekarang</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                <button
                  onClick={() => {
                    setSelectedCategory("paket-hemat");
                    const element = document.getElementById("menu-catalog");
                    element?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold px-5 py-3.5 rounded-xl border border-slate-200 shadow-xs text-sm transition-all"
                >
                  <span>🎓 Lihat Paket Hemat Mahasiswa</span>
                </button>
              </div>
            </div>

            {/* Right Interactive Hero Card (Student Live Order Preview) */}
            <div className="lg:col-span-5">
              <div className="relative max-w-md mx-auto">
                <div className="absolute -top-4 -right-4 w-28 h-28 bg-orange-300 rounded-full blur-2xl opacity-60"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-amber-200 rounded-full blur-2xl opacity-60"></div>

                <div className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        Status Pesanan Live
                      </span>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded">
                      Kode: #KUP-1049
                    </span>
                  </div>

                  {/* Featured Mock Order item */}
                  <div className="flex gap-3.5 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&auto=format&fit=crop&q=80"
                      alt="Paket Geprek"
                      className="w-16 h-16 rounded-xl object-cover shadow-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-500">Stand 01 Mas Radit</p>
                      <h4 className="text-sm font-bold text-slate-800 truncate">
                        Paket Geprek Sambal Korek + Es Teh
                      </h4>
                      <p className="text-xs font-bold text-orange-600">Rp 15.000</p>
                    </div>
                  </div>

                  {/* Progress Tracker */}
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between text-xs font-medium text-slate-600">
                      <span>Makanan Sedang Dimasak</span>
                      <span className="font-bold text-orange-600">Siap 4 mnt lagi</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>11:45 WIB Pesan</span>
                      <span className="text-emerald-600 font-medium">11:55 WIB Ambil</span>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-900">
                    <span className="text-base shrink-0">💡</span>
                    <span>
                      Tunjukkan barcode pesanan di loket <strong>Fast-Track</strong> KantinUP saat nama dipanggil. Langsung bawa pulang!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section id="cara-kerja" className="py-12 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
              Cara Kerja Sederhana
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              3 Langkah Bebas Antre di Kantin Kampus
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 hover:bg-orange-50/40 transition-colors p-6 rounded-2xl border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center text-lg mb-4 shadow-sm shadow-orange-500/20">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Pilih Menu & Waktu Ambil</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pilih menu dari stand favoritmu sebelum jam istirahat. Pilih opsi ambil segera atau jadwalkan saat kelas selesai.
              </p>
            </div>

            <div className="bg-slate-50 hover:bg-orange-50/40 transition-colors p-6 rounded-2xl border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center text-lg mb-4 shadow-sm shadow-orange-500/20">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Bayar Instan Cashless</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Selesaikan transaksi dengan QRIS, GoPay, OVO, atau dompet digital. Tanpa ribet cari uang kembalian receh.
              </p>
            </div>

            <div className="bg-slate-50 hover:bg-orange-50/40 transition-colors p-6 rounded-2xl border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center text-lg mb-4 shadow-sm shadow-orange-500/20">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Ambil di Loket Fast-Track</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Datang ke stand kantin saat ada notifikasi pesanan siap. Tunjukkan kode order dan langsung bawa makananmu!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Filter & Menu Section --- */}
      <section id="menu-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pilihan Menu Kantin Hari Ini
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {filteredItems.length} menu siap dimasak segar sesuai pesananmu
            </p>
          </div>

          {/* Quick Clear Filter if active */}
          {(selectedCategory !== "all" || selectedStall !== "all" || searchQuery !== "") && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedStall("all");
                setSearchQuery("");
              }}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 underline self-start sm:self-auto"
            >
              Reset Semua Filter
            </button>
          )}
        </div>

        {/* --- Stall Selector Bar --- */}
        <div id="stand-kantin" className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Pilih Stand Kantin:
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {STALLS.map((stall) => {
              const isSelected = selectedStall === stall.id;
              return (
                <button
                  key={stall.id}
                  onClick={() => setSelectedStall(stall.id)}
                  className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{stall.icon}</span>
                  <span>{stall.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- Category Tabs --- */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    isSelected
                      ? "bg-orange-500 text-white shadow-sm shadow-orange-500/25"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-800"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- Menu Cards Grid --- */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
            <div className="text-4xl mb-3">🔍</div>
            <h4 className="text-lg font-bold text-slate-800">Menu Tidak Ditemukan</h4>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              Tidak ada menu yang cocok dengan kata kunci atau filter yang kamu pilih.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedStall("all");
                setSearchQuery("");
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
            >
              Tampilkan Semua Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const inCartItem = cart.find((ci) => ci.item.id === item.id);
              const qtyInCart = inCartItem?.quantity || 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
                >
                  {/* Image Container with Badges */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Gradient overlay for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Badge top-left */}
                    {item.badge && (
                      <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wide">
                        {item.badge}
                      </span>
                    )}

                    {/* Prep Time top-right */}
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <svg
                        className="w-3 h-3 text-orange-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {item.prepTimeMinutes} mnt
                    </span>

                    {/* Stall tag bottom-left */}
                    <div className="absolute bottom-2.5 left-3 text-white text-xs">
                      <p className="font-semibold text-white drop-shadow-xs">{item.stall}</p>
                      <p className="text-[10px] text-slate-200 drop-shadow-xs">{item.stallLocation}</p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Rating */}
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-1.5">
                        <span className="text-amber-500 font-bold flex items-center gap-0.5">
                          ★ {item.rating}
                        </span>
                        <span className="text-[11px] text-slate-400">({item.reviewCount})</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                        {item.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Pricing & Add to Cart Action */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        {item.originalPrice && (
                          <span className="block text-[11px] text-slate-400 line-through">
                            {formatIDR(item.originalPrice)}
                          </span>
                        )}
                        <span className="text-base font-black text-slate-900">
                          {formatIDR(item.price)}
                        </span>
                      </div>

                      {/* Add Button or Quantity Controller */}
                      {qtyInCart === 0 ? (
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                          aria-label={`Tambah ${item.name} ke pesanan`}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Pesan</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-white text-orange-700 font-bold flex items-center justify-center hover:bg-orange-100 transition-colors text-sm"
                            aria-label="Kurangi porsi"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-orange-900 min-w-[14px] text-center">
                            {qtyInCart}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-lg bg-orange-500 text-white font-bold flex items-center justify-center hover:bg-orange-600 transition-colors text-sm"
                            aria-label="Tambah porsi"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* --- Student Benefits / Perks Banner --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-xl">
                ⏱️
              </div>
              <h4 className="text-lg font-bold">Waktu Istirahat Lebih Tenang</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Istirahat kuliah cuma 30-45 menit? Jangan habiskan 25 menit cuma buat berdiri menunggu antrean makan siang.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
                💰
              </div>
              <h4 className="text-lg font-bold">Harga Transparan Ramah Kantong</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Harga makanan sama persis dengan yang ada di menu stand kantin, tanpa biaya tambahan aneh-aneh untuk mahasiswa.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
                🔔
              </div>
              <h4 className="text-lg font-bold">Update Status Pesanan Akurat</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Pantau langsung saat makanan sedang disiapkan hingga siap diambil di loket dengan sistem nomor antrean digital.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Floating Bottom Cart Bar (When Items in Cart) --- */}
      {totalCartCount > 0 && !isCartOpen && (
        <aside
          aria-label="Ringkasan Pesanan"
          className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-40 bg-slate-900 text-white rounded-2xl p-3 sm:p-4 shadow-2xl flex items-center justify-between border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-white shadow-xs">
              {totalCartCount}
            </div>
            <div>
              <p className="text-xs text-slate-300">Total {totalCartCount} Pesanan</p>
              <p className="text-base font-black text-white">{formatIDR(totalCartPrice)}</p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <span>Lihat Keranjang</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </aside>
      )}

      {/* --- Cart Drawer / Modal --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Keranjang Makanan</h3>
                <p className="text-xs text-slate-500">{totalCartCount} menu dipilih</p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                aria-label="Tutup keranjang"
              >
                ✕
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-3">🧺</div>
                  <h4 className="font-bold text-slate-800">Keranjang Masih Kosong</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Pilih menu makanan atau minuman favoritmu terlebih dahulu.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Mulai Belanja
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-3">
                    {cart.map((ci) => (
                      <div
                        key={ci.item.id}
                        className="flex gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100"
                      >
                        <img
                          src={ci.item.imageUrl}
                          alt={ci.item.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-slate-400">
                            {ci.item.stall}
                          </p>
                          <h4 className="text-xs font-bold text-slate-800 truncate">
                            {ci.item.name}
                          </h4>
                          <p className="text-xs font-black text-slate-900 mt-0.5">
                            {formatIDR(ci.item.price * ci.quantity)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 self-center">
                          <button
                            onClick={() => updateQuantity(ci.item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs hover:bg-slate-100"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-slate-800 w-4 text-center">
                            {ci.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(ci.item.id, 1)}
                            className="w-6 h-6 rounded-lg bg-orange-500 text-white font-bold flex items-center justify-center text-xs hover:bg-orange-600"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pickup Time Selector */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Pilih Waktu Pengambilan:
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <label
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          pickupTimeOption === "10-15-mnt"
                            ? "border-orange-500 bg-orange-50/50 text-orange-950 font-semibold"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="pickupTime"
                            value="10-15-mnt"
                            checked={pickupTimeOption === "10-15-mnt"}
                            onChange={(e) => setPickupTimeOption(e.target.value)}
                            className="text-orange-500 focus:ring-orange-400"
                          />
                          <span>⚡ Ambil Segera (10 - 15 Menit)</span>
                        </div>
                        <span className="text-[10px] text-slate-500">Paling cepat</span>
                      </label>

                      <label
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          pickupTimeOption === "istirahat-siang"
                            ? "border-orange-500 bg-orange-50/50 text-orange-950 font-semibold"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="pickupTime"
                            value="istirahat-siang"
                            checked={pickupTimeOption === "istirahat-siang"}
                            onChange={(e) => setPickupTimeOption(e.target.value)}
                            className="text-orange-500 focus:ring-orange-400"
                          />
                          <span>🕛 Istirahat Siang (12:00 WIB)</span>
                        </div>
                        <span className="text-[10px] text-slate-500">Pas kuliah selesai</span>
                      </label>

                      <label
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          pickupTimeOption === "istirahat-sore"
                            ? "border-orange-500 bg-orange-50/50 text-orange-950 font-semibold"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="pickupTime"
                            value="istirahat-sore"
                            checked={pickupTimeOption === "istirahat-sore"}
                            onChange={(e) => setPickupTimeOption(e.target.value)}
                            className="text-orange-500 focus:ring-orange-400"
                          />
                          <span>🕒 Istirahat Sore (15:15 WIB)</span>
                        </div>
                        <span className="text-[10px] text-slate-500">Selesai lab/praktikum</span>
                      </label>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Metode Pembayaran:
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("qris")}
                        className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${
                          paymentMethod === "qris"
                            ? "border-orange-500 bg-orange-50 text-orange-900 font-bold"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span>📲 QRIS Instan</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("tunai")}
                        className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${
                          paymentMethod === "tunai"
                            ? "border-orange-500 bg-orange-50 text-orange-900 font-bold"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span>💵 Tunai di Loket</span>
                      </button>
                    </div>
                  </div>

                  {/* Special Note to Stall */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Catatan ke Penjual (Opsional):
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Sambal dipisah, es sedikit, tanpa seledri"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Drawer Footer with Checkout Button */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal Makanan</span>
                    <span>{formatIDR(totalCartPrice)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Biaya Layanan Kampus</span>
                    <span className="text-emerald-600 font-semibold">GRATIS</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                    <span>Total Pembayaran</span>
                    <span className="text-orange-600">{formatIDR(totalCartPrice)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/25 text-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Konfirmasi & Bayar Pesanan</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Order Success / Digital Pickup Ticket Modal --- */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl shadow-xs">
              ✓
            </div>

            <div>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Pesanan Berhasil Masuk!
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">Tiket Pengambilan Kantin</h3>
              <p className="text-xs text-slate-500">
                Stand kantin sedang menyiapkan pesananmu. Tunjukkan tiket ini di loket fast-track.
              </p>
            </div>

            {/* Ticket Card Representation */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">No. Pengambilan</p>
                  <p className="text-2xl font-black text-orange-600 font-mono tracking-wider">
                    {orderSuccess.orderId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Waktu Ambil</p>
                  <p className="text-xs font-bold text-slate-800">{orderSuccess.pickupTime}</p>
                </div>
              </div>

              {/* Items Summary */}
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Rincian Menu:</p>
                <div className="space-y-1">
                  {orderSuccess.items.map((ci) => (
                    <div key={ci.item.id} className="flex justify-between text-xs text-slate-700">
                      <span className="truncate pr-2">
                        {ci.quantity}x {ci.item.name}
                      </span>
                      <span className="font-semibold shrink-0">
                        {formatIDR(ci.item.price * ci.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {orderSuccess.customerNote && (
                <div className="text-xs bg-amber-50 text-amber-800 p-2 rounded-lg border border-amber-200">
                  <span className="font-bold">Catatan:</span> {orderSuccess.customerNote}
                </div>
              )}

              {/* Mock QR / Barcode Visual */}
              <div className="pt-2 border-t border-slate-200 text-center">
                <div className="inline-block bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="w-32 h-10 flex items-center justify-between gap-1 px-1">
                    <div className="w-1.5 h-full bg-slate-900"></div>
                    <div className="w-0.5 h-full bg-slate-900"></div>
                    <div className="w-2 h-full bg-slate-900"></div>
                    <div className="w-1 h-full bg-slate-900"></div>
                    <div className="w-3 h-full bg-slate-900"></div>
                    <div className="w-0.5 h-full bg-slate-900"></div>
                    <div className="w-2 h-full bg-slate-900"></div>
                    <div className="w-1.5 h-full bg-slate-900"></div>
                    <div className="w-0.5 h-full bg-slate-900"></div>
                    <div className="w-2.5 h-full bg-slate-900"></div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">Scan di Loket Stand Kantin</p>
              </div>
            </div>

            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-sm transition-all"
            >
              Tutup & Kembali ke Beranda
            </button>
          </div>
        </div>
      )}

      {/* --- Footer --- */}
      <footer className="mt-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-sm">
                  K
                </div>
                <span className="text-lg font-black tracking-tight text-slate-900">
                  Kantin<span className="text-orange-500">UP</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Platform pemesanan makanan kantin kampus cerdas untuk mahasiswa dan civitas akademika.
                Kurangi antrean, hemat waktu istirahat, nikmati makanan hangat tepat waktu.
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                Lokasi & Jam Operasional
              </h5>
              <ul className="text-xs text-slate-500 space-y-1.5">
                <li>📍 Food Court Lt. 1 & 2 Kampus Utama</li>
                <li>🕒 Senin - Jumat: 07:30 - 17:00 WIB</li>
                <li>🕒 Sabtu: 08:00 - 13:00 WIB</li>
                <li>Minggu / Libur Nasional: Tutup</li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                Bantuan & Kontak
              </h5>
              <ul className="text-xs text-slate-500 space-y-1.5">
                <li>
                  <a href="#" className="hover:text-orange-600 transition-colors">
                    Pusat Bantuan Mahasiswa
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600 transition-colors">
                    Gabung Jadi Mitra Stand
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600 transition-colors">
                    Syarat & Ketentuan Layanan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-600 transition-colors">
                    Kebijakan Privasi
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <p>© {new Date().getFullYear()} KantinUP. Dibuat untuk Kemudahan Mahasiswa Kampus.</p>
            <p>Hemat Waktu • Tanpa Antre • Kuliah Maksimal</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
