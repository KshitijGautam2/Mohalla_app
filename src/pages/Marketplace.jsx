import React, { useState } from 'react';
import { Search, MapPin, Store, ChevronRight, Star, Package, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const SHOPS = [
  {
    id: 's1',
    name: 'Sharma General Store',
    type: 'General Store',
    emoji: '🏪',
    locality: 'Block A Market',
    distance: '0.3 km',
    distanceNum: 0.3,
    rating: 4.2,
    open: true,
    phone: '98XXXXXX01',
    inventory: [
      { item: 'Aashirvaad Atta 5kg', price: 265, unit: 'bag', inStock: true },
      { item: 'Tata Salt 1kg', price: 22, unit: 'pack', inStock: true },
      { item: 'Fortune Sunflower Oil 1L', price: 145, unit: 'bottle', inStock: true },
      { item: 'Amul Butter 500g', price: 280, unit: 'pack', inStock: true },
      { item: 'Surf Excel 1kg', price: 195, unit: 'pack', inStock: true },
      { item: 'Maggi 12-pack', price: 144, unit: 'pack', inStock: false },
      { item: 'Basmati Rice 5kg', price: 420, unit: 'bag', inStock: true },
      { item: 'Dettol Soap 3-pack', price: 85, unit: 'pack', inStock: true },
    ]
  },
  {
    id: 's2',
    name: 'Ramesh Vegetables & Fruits',
    type: 'Sabzi Mandi',
    emoji: '🥦',
    locality: 'Main Market',
    distance: '0.5 km',
    distanceNum: 0.5,
    rating: 4.5,
    open: true,
    phone: '98XXXXXX02',
    inventory: [
      { item: 'Tomatoes', price: 40, unit: 'kg', inStock: true },
      { item: 'Onions', price: 35, unit: 'kg', inStock: true },
      { item: 'Potatoes', price: 28, unit: 'kg', inStock: true },
      { item: 'Spinach (Palak)', price: 20, unit: 'bunch', inStock: true },
      { item: 'Capsicum', price: 60, unit: 'kg', inStock: true },
      { item: 'Apples (Shimla)', price: 180, unit: 'kg', inStock: true },
      { item: 'Bananas', price: 50, unit: 'dozen', inStock: true },
      { item: 'Garlic', price: 80, unit: 'kg', inStock: false },
    ]
  },
  {
    id: 's3',
    name: 'Gupta Medical & Pharmacy',
    type: 'Medical Store',
    emoji: '💊',
    locality: 'Block C',
    distance: '0.7 km',
    distanceNum: 0.7,
    rating: 4.7,
    open: true,
    phone: '98XXXXXX03',
    inventory: [
      { item: 'Paracetamol 500mg (10 tabs)', price: 18, unit: 'strip', inStock: true },
      { item: 'Dettol Antiseptic 100ml', price: 85, unit: 'bottle', inStock: true },
      { item: 'Band-Aid Box', price: 65, unit: 'box', inStock: true },
      { item: 'Vicks VapoRub', price: 75, unit: 'jar', inStock: true },
      { item: 'ORS Sachet', price: 8, unit: 'sachet', inStock: true },
      { item: 'Vitamin C 500mg (30 tabs)', price: 145, unit: 'strip', inStock: true },
      { item: 'Azithromycin 500mg', price: 85, unit: 'strip', inStock: false },
    ]
  },
  {
    id: 's4',
    name: 'Kapoor Electronics',
    type: 'Electronics',
    emoji: '📱',
    locality: 'Sector 4 Market',
    distance: '1.1 km',
    distanceNum: 1.1,
    rating: 4.0,
    open: false,
    phone: '98XXXXXX04',
    inventory: [
      { item: 'USB-C Cable 1m', price: 150, unit: 'piece', inStock: true },
      { item: 'Phone Cover (Universal)', price: 99, unit: 'piece', inStock: true },
      { item: 'Earphones (wired)', price: 249, unit: 'piece', inStock: true },
      { item: 'Power Bank 10000mAh', price: 899, unit: 'piece', inStock: true },
      { item: 'Screen Protector', price: 79, unit: 'piece', inStock: true },
      { item: 'WiFi Router (basic)', price: 1299, unit: 'piece', inStock: false },
    ]
  },
  {
    id: 's5',
    name: 'Soni Dairy & Sweets',
    type: 'Dairy Shop',
    emoji: '🥛',
    locality: 'Near Park',
    distance: '0.4 km',
    distanceNum: 0.4,
    rating: 4.6,
    open: true,
    phone: '98XXXXXX05',
    inventory: [
      { item: 'Full Cream Milk 1L', price: 65, unit: 'packet', inStock: true },
      { item: 'Paneer 200g', price: 95, unit: 'pack', inStock: true },
      { item: 'Dahi 400g', price: 48, unit: 'cup', inStock: true },
      { item: 'Lassi 300ml', price: 30, unit: 'glass', inStock: true },
      { item: 'Amul Cheese Slice 10pc', price: 120, unit: 'pack', inStock: true },
      { item: 'Gulab Jamun (500g)', price: 160, unit: 'box', inStock: true },
    ]
  },
  {
    id: 's6',
    name: 'Bhatia Stationery & Books',
    type: 'Stationery',
    emoji: '📚',
    locality: 'School Road',
    distance: '1.4 km',
    distanceNum: 1.4,
    rating: 3.9,
    open: true,
    phone: '98XXXXXX06',
    inventory: [
      { item: 'Classmate Notebook 200pg', price: 55, unit: 'piece', inStock: true },
      { item: 'Reynolds Pen (10-pack)', price: 70, unit: 'pack', inStock: true },
      { item: 'Geometry Box', price: 120, unit: 'piece', inStock: true },
      { item: 'A4 Paper Ream', price: 280, unit: 'ream', inStock: true },
      { item: 'Stapler', price: 95, unit: 'piece', inStock: true },
      { item: 'Fevicol 50g', price: 35, unit: 'tube', inStock: true },
    ]
  },
];

const CATEGORIES = [
  { id: 'all', label: '🛍️ All' },
  { id: 'grocery', label: '🏪 Grocery' },
  { id: 'vegetables', label: '🥦 Sabzi' },
  { id: 'dairy', label: '🥛 Dairy' },
  { id: 'medical', label: '💊 Medical' },
  { id: 'electronics', label: '📱 Electronics' },
  { id: 'stationery', label: '📚 Stationery' },
];

const CATEGORY_MAP = {
  grocery: ['s1'],
  vegetables: ['s2'],
  dairy: ['s5'],
  medical: ['s3'],
  electronics: ['s4'],
  stationery: ['s6'],
};

export default function Marketplace() {
  const user = JSON.parse(localStorage.getItem('mohalla_user') || '{}');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedShop, setSelectedShop] = useState(null);
  const [aiSummary, setAiSummary] = useState('');

  const getFilteredShops = () => {
    if (activeCategory === 'all') return SHOPS;
    const ids = CATEGORY_MAP[activeCategory] || [];
    return SHOPS.filter(s => ids.includes(s.id));
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSearchResults(null);
    setAiSummary('');

    // Search through all inventory
    const q = query.toLowerCase();
    const results = [];

    SHOPS.forEach(shop => {
      shop.inventory.forEach(item => {
        if (
          item.item.toLowerCase().includes(q) ||
          shop.type.toLowerCase().includes(q) ||
          shop.name.toLowerCase().includes(q)
        ) {
          results.push({
            shopId: shop.id,
            shopName: shop.name,
            shopEmoji: shop.emoji,
            shopType: shop.type,
            shopLocality: shop.locality,
            shopDistance: shop.distance,
            shopDistanceNum: shop.distanceNum,
            shopRating: shop.rating,
            shopOpen: shop.open,
            item: item.item,
            price: item.price,
            unit: item.unit,
            inStock: item.inStock,
          });
        }
      });
    });

    // Sort by distance
    results.sort((a, b) => a.shopDistanceNum - b.shopDistanceNum);
    setSearchResults(results);

    // Generate AI summary if results found
    if (results.length > 0) {
      const inStock = results.filter(r => r.inStock);
      const prices = inStock.map(r => r.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const cheapest = inStock.find(r => r.price === minPrice);

      setAiSummary(
        `Found "${query}" in ${results.length} nearby shop${results.length > 1 ? 's' : ''}. ` +
        `Price range: ₹${minPrice}–₹${maxPrice} per ${cheapest?.unit}. ` +
        `Best deal: ${cheapest?.shopName} at ₹${minPrice} (${cheapest?.shopDistance} away).`
      );
    }

    setSearching(false);
  };

  // Shop detail view
  if (selectedShop) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
        <div className="bg-white px-4 pt-10 pb-4 sticky top-0 z-40 border-b border-gray-100">
          <button
            onClick={() => setSelectedShop(null)}
            className="flex items-center gap-2 text-gray-600 mb-3"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className="flex items-center gap-3">
            <div className="text-4xl">{selectedShop.emoji}</div>
            <div>
              <h2 className="font-bold text-gray-900">{selectedShop.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <MapPin size={11} className="text-orange-500" />
                <span className="text-xs text-gray-500">{selectedShop.locality} · {selectedShop.distance}</span>
                <span className={`text-xs font-medium ${selectedShop.open ? 'text-green-600' : 'text-red-500'}`}>
                  · {selectedShop.open ? 'Open' : 'Closed'}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={11} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-500">{selectedShop.rating}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 pb-28">
          <h3 className="font-semibold text-gray-700 mb-3 text-sm">📦 Available Inventory</h3>
          <div className="space-y-2">
            {selectedShop.inventory.map((item, i) => (
              <div key={i} className={`bg-white rounded-xl px-4 py-3 flex items-center justify-between border ${item.inStock ? 'border-gray-100' : 'border-gray-100 opacity-50'}`}>
                <div className="flex items-center gap-3">
                  <Package size={16} className={item.inStock ? 'text-orange-400' : 'text-gray-300'} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.item}</p>
                    <p className="text-xs text-gray-400">per {item.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600 text-sm">₹{item.price}</p>
                  <p className={`text-xs ${item.inStock ? 'text-green-600' : 'text-red-400'}`}>
                    {item.inStock ? 'In stock' : 'Out of stock'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Navbar active="market" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">

      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4 sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">🛒 Local Market</h1>
            <div className="flex items-center gap-1">
              <MapPin size={11} className="text-orange-500" />
              <p className="text-xs text-gray-500">
                {user.locality || user.city || 'Your area'} · Simulated local shops
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search atta, milk, medicine..."
              className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!query.trim() || searching}
            className={`px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
              query.trim()
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {searching ? '...' : 'Search'}
          </button>
        </div>
      </div>

      <div className="px-4 py-4 pb-28">

        {/* Search Results */}
        {searchResults !== null && (
          <div className="mb-6">
            {/* AI Summary */}
            {aiSummary && (
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-4">
                <p className="text-xs font-semibold text-orange-600 mb-1">🤖 AI Summary</p>
                <p className="text-sm text-orange-800">{aiSummary}</p>
              </div>
            )}

            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900">
                Results for "{query}"
              </h2>
              <button
                onClick={() => { setSearchResults(null); setQuery(''); setAiSummary(''); }}
                className="text-xs text-orange-500 font-medium"
              >
                Clear
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-gray-700">Not found nearby</p>
                <p className="text-sm text-gray-500 mt-1">No shops in your area carry "{query}" right now</p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((result, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedShop(SHOPS.find(s => s.id === result.shopId))}
                    className={`bg-white rounded-2xl p-4 border shadow-sm cursor-pointer hover:border-orange-200 transition-all ${
                      !result.inStock ? 'opacity-60' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{result.shopEmoji}</div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{result.item}</p>
                          <p className="text-xs text-gray-500">{result.shopName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <MapPin size={10} className="text-orange-400" />
                              <span className="text-xs text-gray-500">{result.shopDistance}</span>
                            </div>
                            <span className={`text-xs font-medium ${result.shopOpen ? 'text-green-600' : 'text-red-500'}`}>
                              · {result.shopOpen ? 'Open now' : 'Closed'}
                            </span>
                            <div className="flex items-center gap-0.5">
                              <Star size={10} className="text-yellow-400 fill-yellow-400" />
                              <span className="text-xs text-gray-500">{result.shopRating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">₹{result.price}</p>
                        <p className="text-xs text-gray-400">/{result.unit}</p>
                        <p className={`text-xs mt-1 font-medium ${result.inStock ? 'text-green-600' : 'text-red-400'}`}>
                          {result.inStock ? '✓ In stock' : '✗ Out of stock'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Default view — shop listing */}
        {searchResults === null && (
          <>
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Popular searches */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">🔥 Popular searches</p>
              <div className="flex gap-2 flex-wrap">
                {['Atta', 'Milk', 'Tomatoes', 'Paracetamol', 'Paneer', 'Rice'].map(term => (
                  <button
                    key={term}
                    onClick={() => { setQuery(term); }}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-600 hover:border-orange-300 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Shop Cards */}
            <div>
              <h2 className="font-bold text-gray-900 mb-3">
                🏪 Shops near {user.locality || user.city || 'you'}
              </h2>
              <div className="space-y-3">
                {getFilteredShops().map(shop => (
                  <div
                    key={shop.id}
                    onClick={() => setSelectedShop(shop)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:border-orange-200 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{shop.emoji}</div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm">{shop.name}</h3>
                          <p className="text-xs text-gray-500">{shop.type}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <MapPin size={10} className="text-orange-400" />
                              <span className="text-xs text-gray-500">{shop.distance}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Star size={10} className="text-yellow-400 fill-yellow-400" />
                              <span className="text-xs text-gray-500">{shop.rating}</span>
                            </div>
                            <span className={`text-xs font-medium ${shop.open ? 'text-green-600' : 'text-red-500'}`}>
                              {shop.open ? '● Open' : '● Closed'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-gray-400">{shop.inventory.length} items</span>
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Navbar active="market" />
    </div>
  );
}