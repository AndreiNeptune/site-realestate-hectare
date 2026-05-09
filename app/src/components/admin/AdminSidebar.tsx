"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  LogOut,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  user: any;
  onClose?: () => void;
  isMobile?: boolean;
}

const NAV_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/hectare', label: 'Hectare', icon: MapPin },
  { href: '/admin/leads', label: 'Lead-uri Contact', icon: Users },
];

export default function AdminSidebar({ user, onClose, isMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`flex flex-col h-full bg-white ${isMobile ? '' : 'w-64 border-r border-gray-200'}`}>
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
            <MapPin className="w-4 h-4" />
          </span>
          <span>Hectar<span className="text-blue-600">Expert</span></span>
        </Link>
        {isMobile && (
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-gray-500 hover:text-gray-900 lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
      
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link 
              key={link.href}
              href={link.href} 
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-100">
        <div className="px-3 py-3 rounded-xl bg-gray-50 flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium shrink-0">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
             <p className="text-xs font-medium text-gray-900 truncate">{user?.email}</p>
             <p className="text-[11px] text-gray-500">Admin</p>
          </div>
        </div>
        <form action="/api/auth/signout" method="POST">
           <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all">
             <LogOut className="w-5 h-5" />
             Deconectare
           </button>
        </form>
      </div>
    </div>
  );
}
