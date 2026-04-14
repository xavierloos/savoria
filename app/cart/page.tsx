'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/hooks/use-cart';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);
    setError('');

    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          items: items.map(i => ({ menuItemId: i.id, quantity: i.quantity }))
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message);
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-6">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added any delicious items yet.</p>
        <Link href="/menu" className="inline-flex items-center justify-center px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-all">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-gray-900 mb-10">Your Order</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={item.image || `https://picsum.photos/seed/${item.id}/200/200`} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                <p className="text-orange-600 font-medium">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-white rounded-md transition-colors">
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-white rounded-md transition-colors">
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (10%)</span>
                <span>${(getTotal() * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${(getTotal() * 1.1).toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-600 focus:border-transparent outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button 
                type="submit" 
                disabled={isCheckingOut}
                className="w-full py-4 bg-gray-900 hover:bg-orange-600 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-70"
              >
                {isCheckingOut ? 'Processing...' : 'Pay Now'} <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
