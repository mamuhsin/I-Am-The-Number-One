'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  CalendarDays,
  Receipt,
  DollarSign,
  Users,
  LayoutDashboard,
  Fuel,
  Shield,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/attendance', label: 'Attendance', icon: CalendarDays },
  { href: '/bills', label: 'Bill Entry', icon: Receipt },
  { href: '/commission', label: 'Lube Commission', icon: DollarSign },
  { href: '/salary', label: 'Salary List', icon: Users },
  { href: '/admin', label: 'Admin Panel', icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Fuel className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Pump Manager</h1>
          <p className="text-xs text-muted-foreground">Fuel Station Software</p>
        </div>
      </div>
      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-primary'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
