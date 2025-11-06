'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChefHat, Home, User, ShoppingCart, Utensils, Trophy, Clock } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Головна', icon: Home },
  { href: '/recipes', label: 'Рецепти', icon: Utensils },
  { href: '/pantry', label: 'Комора', icon: Clock },
  { href: '/shopping', label: 'Покупки', icon: ShoppingCart },
  { href: '/achievements', label: 'Досягнення', icon: Trophy },
  { href: '/profile', label: 'Профіль', icon: User },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-orange-600 hover:text-orange-700 transition-colors">
            <ChefHat className="w-8 h-8" />
            <span className="hidden sm:inline">AI Recipe Maker</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:inline text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
