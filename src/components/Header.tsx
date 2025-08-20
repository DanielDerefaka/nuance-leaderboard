'use client';

import { useState } from 'react';

export function Header() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '#dashboard' },
    { id: 'leaderboard', label: 'Leaderboard', href: '#leaderboard' },
    { id: 'analytics', label: 'Analytics', href: '#analytics' },
    { id: 'search', label: 'Search', href: '#search' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-bold text-white">Nuance Tracker</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
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
                  activeTab === item.id
                    ? 'text-white border-b-2 border-white pb-1'
                    : 'text-gray-400'
                }`}
              >
                {item.label}
              </a>
            ))}
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