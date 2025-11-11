'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, QrCode, Search } from 'lucide-react';
import { traceabilityAPI } from '@/lib/api';

export default function TraceabilityPage() {
  const [qrCode, setQrCode] = useState('');
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCode.trim()) return;

    setLoading(true);
    try {
      const response = await traceabilityAPI.lookupQR(qrCode);
      setLookupResult(response.data);
    } catch (error: any) {
      alert(error.response?.data?.message || 'QR Code not found');
      setLookupResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Supply Chain Traceability</h1>
        <p className="text-muted-foreground mt-1">
          Track products through the complete supply chain
        </p>
      </div>

      <Tabs defaultValue="lookup" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="lookup">QR Lookup</TabsTrigger>
          <TabsTrigger value="create">Create Product</TabsTrigger>
        </TabsList>

        <TabsContent value="lookup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lookup Product by QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLookup} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter QR Code (e.g., CC-Ab3xY9Zk7Mn2)"
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={loading}>
                    <Search className="mr-2 h-4 w-4" />
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </form>

              {lookupResult && (
                <div className="mt-6 space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold text-lg">Finished Product</h3>
                    <p className="text-2xl font-bold mt-1">
                      {lookupResult.finished_good.product_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      QR Code: {lookupResult.finished_good.qr_code_id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {lookupResult.finished_good.quantity} {lookupResult.finished_good.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Production Date: {new Date(lookupResult.finished_good.production_date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold">Production Run</h3>
                    <p className="text-lg font-medium mt-1">
                      {lookupResult.production_run.run_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Product Type: {lookupResult.production_run.product_type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Factory: {lookupResult.production_run.factory.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Location: {lookupResult.production_run.factory.city}, {lookupResult.production_run.factory.country}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Period: {new Date(lookupResult.production_run.start_date).toLocaleDateString()} - {new Date(lookupResult.production_run.end_date).toLocaleDateString()}
                    </p>
                  </div>

                  {lookupResult.raw_materials && lookupResult.raw_materials.length > 0 && (
                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-semibold">Raw Materials Used</h3>
                      <div className="mt-2 space-y-2">
                        {lookupResult.raw_materials.map((material: any, index: number) => (
                          <div key={index} className="bg-gray-50 p-3 rounded">
                            <p className="font-medium">{material.material_name}</p>
                            <p className="text-sm text-muted-foreground">
                              Batch: {material.batch_number}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Quantity Used: {material.quantity_used} {material.unit}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Supplier: {material.supplier.name} ({material.supplier.country})
                            </p>
                            {material.supplier.certifications && (
                              <p className="text-sm text-primary font-medium">
                                Certifications: {material.supplier.certifications}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  To create products with full traceability, follow these steps:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Register Raw Materials</p>
                      <p className="text-sm text-muted-foreground">
                        Add raw material batches from your suppliers with certifications
                      </p>
                      <Button size="sm" variant="outline" className="mt-2" asChild>
                        <a href="/api">View API Docs → POST /trace/raw-material</a>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Create Production Run</p>
                      <p className="text-sm text-muted-foreground">
                        Link raw materials to production runs at your factories
                      </p>
                      <Button size="sm" variant="outline" className="mt-2" asChild>
                        <a href="/api">View API Docs → POST /trace/production-run</a>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Generate Finished Goods</p>
                      <p className="text-sm text-muted-foreground">
                        Create finished goods from production runs and get QR codes
                      </p>
                      <Button size="sm" variant="outline" className="mt-2" asChild>
                        <a href="/api">View API Docs → POST /trace/finished-good</a>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">
                    💡 Use the Swagger API documentation for detailed instructions
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Access the complete API reference at{' '}
                    <a href="http://localhost:3000/api" target="_blank" rel="noopener noreferrer" className="underline">
                      http://localhost:3000/api
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
