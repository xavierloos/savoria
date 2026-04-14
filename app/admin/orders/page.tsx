'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: any[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setError(data.error || 'Failed to load orders.');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load orders.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-medium text-gray-600">Order ID</th>
              <th className="p-4 font-medium text-gray-600">Customer</th>
              <th className="p-4 font-medium text-gray-600">Date</th>
              <th className="p-4 font-medium text-gray-600">Total</th>
              <th className="p-4 font-medium text-gray-600">Payment</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 text-sm font-mono text-gray-500">{order.id.slice(-6)}</td>
                <td className="p-4">
                  <div className="font-medium text-gray-900">{order.customerName}</div>
                  <div className="text-sm text-gray-500">{order.customerEmail}</div>
                </td>
                <td className="p-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4 font-medium text-gray-900">${order.totalAmount.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
