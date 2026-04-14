import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://picsum.photos/seed/restaurant/1920/1080"
            alt="Restaurant interior"
            fill
            className="object-cover brightness-50"
            priority
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            A Culinary Journey Awaits
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 drop-shadow-md">
            Experience the finest ingredients crafted with passion. Order online or join us for an unforgettable evening.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/menu" 
              className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Order Online <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="#book" 
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold rounded-full transition-all flex items-center justify-center"
            >
              Book a Table
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Our Specialties</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover the dishes that made us famous, prepared fresh daily by our master chefs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Truffle Pasta', desc: 'Handmade pasta with black truffle shavings', img: 'pasta' },
              { name: 'Wagyu Steak', desc: 'A5 grade wagyu with seasonal vegetables', img: 'steak' },
              { name: 'Artisan Pizza', desc: 'Wood-fired sourdough with fresh burrata', img: 'pizza' }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={`https://picsum.photos/seed/${item.img}/800/600`}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
