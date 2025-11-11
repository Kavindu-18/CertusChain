'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Factory, Truck, Package, FileText } from 'lucide-react';
import { factoriesAPI, suppliersAPI, reportsAPI } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    factories: 0,
    suppliers: 0,
    reports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [factoriesRes, suppliersRes, reportsRes] = await Promise.all([
        factoriesAPI.getAll(),
        suppliersAPI.getAll(),
        reportsAPI.getAll(),
      ]);
      
      setStats({
        factories: factoriesRes.data.length,
        suppliers: suppliersRes.data.length,
        reports: reportsRes.data.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Factories',
      value: stats.factories,
      icon: Factory,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Suppliers',
      value: stats.suppliers,
      icon: Truck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'ESG Reports',
      value: stats.reports,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to CertusChain Supply Chain Management
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/dashboard/factories"
              className="block p-3 rounded-md hover:bg-gray-100 transition"
            >
              <div className="flex items-center">
                <Factory className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Manage Factories</p>
                  <p className="text-sm text-muted-foreground">
                    View and manage your production facilities
                  </p>
                </div>
              </div>
            </a>
            <a
              href="/dashboard/traceability"
              className="block p-3 rounded-md hover:bg-gray-100 transition"
            >
              <div className="flex items-center">
                <Package className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Track Supply Chain</p>
                  <p className="text-sm text-muted-foreground">
                    Create and track products through the supply chain
                  </p>
                </div>
              </div>
            </a>
            <a
              href="/dashboard/reports"
              className="block p-3 rounded-md hover:bg-gray-100 transition"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Generate ESG Report</p>
                  <p className="text-sm text-muted-foreground">
                    Create compliance reports with AI
                  </p>
                </div>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div className="ml-3">
                <p className="font-medium">Add Your Factories</p>
                <p className="text-sm text-muted-foreground">
                  Register your manufacturing facilities
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="ml-3">
                <p className="font-medium">Register Suppliers</p>
                <p className="text-sm text-muted-foreground">
                  Add your raw material suppliers
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="ml-3">
                <p className="font-medium">Set Up IoT Devices</p>
                <p className="text-sm text-muted-foreground">
                  Connect sensors for real-time monitoring
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div className="ml-3">
                <p className="font-medium">Track Products</p>
                <p className="text-sm text-muted-foreground">
                  Create production runs and finished goods
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
