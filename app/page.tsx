'use client';

import { Sidebar } from '@/components/sidebar';
import Link from 'next/link';
import {
  CalendarDays,
  Receipt,
  DollarSign,
  Users,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  {
    title: "Today's Collections",
    value: '₹24,500',
    change: '+12%',
    icon: Receipt,
  },
  {
    title: 'Active Employees',
    value: '9',
    change: '100%',
    icon: Users,
  },
  {
    title: 'This Month Sales',
    value: '₹7,85,000',
    change: '+8%',
    icon: TrendingUp,
  },
  {
    title: 'Pending Salaries',
    value: '₹45,000',
    change: '-5%',
    icon: DollarSign,
  },
];

const quickLinks = [
  {
    title: 'Attendance Sheet',
    description: 'Track daily attendance with date, month, year filters',
    href: '/attendance',
    icon: CalendarDays,
  },
  {
    title: 'Bill Entry',
    description: 'Record vehicle bills with customer details and amounts',
    href: '/bills',
    icon: Receipt,
  },
  {
    title: 'Lube Commission',
    description: 'Manage employee commissions on lubricant sales',
    href: '/commission',
    icon: DollarSign,
  },
  {
    title: 'Salary List',
    description: 'Calculate and manage employee salaries with deductions',
    href: '/salary',
    icon: Users,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome to Pump Manager - Your complete fuel station management solution
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-primary">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Access</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="group cursor-pointer bg-card border-border transition-colors hover:border-primary/50">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <link.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{link.title}</h3>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Bills</h2>
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Vehicle No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-secondary/50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">KL 10 BJ 7572</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">JAMSHEER</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">24/05/26</td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-foreground">₹300</td>
                    </tr>
                    <tr className="hover:bg-secondary/50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">KL 53 D 1019</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">MIRSHAD</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">24/05/26</td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-foreground">₹400</td>
                    </tr>
                    <tr className="hover:bg-secondary/50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">KL 10 BJ 7868</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">SAKARIYA</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">24/05/26</td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-foreground">₹2,800</td>
                    </tr>
                    <tr className="hover:bg-secondary/50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">KL 10 BJ 0691</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">PRABIN</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">24/05/26</td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-foreground">₹2,300</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
