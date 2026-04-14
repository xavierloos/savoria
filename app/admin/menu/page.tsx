'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Edit2, Plus, Trash2 } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  image: string;
  category: { name: string };
}

export default function AdminMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/menu')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setError(data.error || 'Failed to load menu items.');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load menu items.');
        setLoading(false);
      });
  }, []);

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isAvailable: !currentStatus }),
      });
      if (res.ok) {
        setItems(items.map(item => item.id === id ? { ...item, isAvailable: !currentStatus } : item));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading menu items...</div>;
  if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
        <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-medium text-gray-600">Item</th>
              <th className="p-4 font-medium text-gray-600">Category</th>
              <th className="p-4 font-medium text-gray-600">Price</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
              <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image src={item.image || `https://picsum.photos/seed/${item.id}/100/100`} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className="font-medium text-gray-900">{item.name}</span>
                </td>
                <td className="p-4 text-gray-600">{item.category?.name || 'Uncategorized'}</td>
                <td className="p-4 font-medium text-gray-900">${item.price.toFixed(2)}</td>
                <td className="p-4">
                  <button 
                    onClick={() => toggleAvailability(item.id, item.isAvailable)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      item.isAvailable ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {item.isAvailable ? 'Available' : 'Hidden'}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
