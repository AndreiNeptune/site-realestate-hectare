"use client";

import { useState, useEffect } from 'react';
import { Menu, MapPin } from 'lucide-react';
import Link from 'next/link';
import AdminSidebar from './AdminSidebar';

interface AdminMobileNavProps {
  user: any;
}

export default function AdminMobileNav({ user }: AdminMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when clicking outside or on escape
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4 sticky top-0 z-40">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 focus:outline-none"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-over Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 w-80 max-w-[80vw] bg-white z-50 md:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar 
          user={user} 
          isMobile={true} 
          onClose={() => setIsOpen(false)} 
        />
      </div>
    </>
  );
}
