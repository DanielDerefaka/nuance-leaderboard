'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const pathname = usePathname();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/', isPage: true },
    { id: 'miners', label: 'All Miners', href: '/miners', isPage: true },
    { id: 'leaderboard', label: 'Leaderboard', href: '#leaderboard', isPage: false },
    { id: 'analytics', label: 'Analytics', href: '#analytics', isPage: false },
    { id: 'search', label: 'Search', href: '#search', isPage: false },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center p-2">
              <img 
                src="/headIcon-B2sizE47.svg" 
                alt="Nuance Network Logo" 
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white">Nuance Tracker</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isCurrentPage = item.isPage && pathname === item.href;
              const isActiveSection = !item.isPage && activeTab === item.id;
              const isActive = isCurrentPage || isActiveSection;

              if (item.isPage) {
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-white ${
                      isActive
                        ? 'text-white border-b-2 border-white pb-1'
                        : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              } else {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(item.id);
                      document.querySelector(item.href)?.scrollIntoView({ 
                        behavior: 'smooth' 
                      });
                    }}
                    className={`text-sm font-medium transition-colors hover:text-white ${
                      isActive
                        ? 'text-white border-b-2 border-white pb-1'
                        : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              }
            })}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-gray-400 hover:text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}