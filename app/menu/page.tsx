'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/hooks/use-cart';
import { Plus, ShoppingBag } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
  categoryId: string;
  category: { name: string };
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setError(data.error || 'Failed to load menu items. Please check your database connection.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load menu items.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h2>
        <p className="text-gray-700 max-w-md">{error}</p>
        <p className="text-gray-500 mt-4 text-sm">Make sure DATABASE_URL is set to a valid MongoDB connection string in your environment secrets.</p>
      </div>
    );
  }

  // Group by category
  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category?.name || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">Our Menu</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Carefully curated dishes using the finest seasonal ingredients.</p>
      </div>

      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category} className="mb-16">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8 border-b pb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={item.image || `https://picsum.photos/seed/${item.id}/800/600`}
                    alt={item.name}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {item.tags && item.tags.length > 0 && (
                    <div className="absolute top-4 left-4 flex gap-2">
                      {item.tags.map(tag => (
                        <span key={tag} className="bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-md text-gray-800 uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <span className="text-lg font-bold text-orange-600">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-600 mb-6 flex-grow text-sm">{item.description}</p>
                  <button
                    onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 })}
                    className="w-full py-3 bg-gray-900 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
