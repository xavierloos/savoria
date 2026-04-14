'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/hooks/use-cart';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-24 h-24 text-green-500" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Thank you for your order. We've received it and our chefs will start preparing it shortly.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 hover:bg-orange-600 text-white font-semibold rounded-full transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
