'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, MapPin, Award } from 'lucide-react';
import { suppliersAPI } from '@/lib/api';

interface Supplier {
  id: string;
  name: string;
  address: string;
  country: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  certifications?: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    country: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    certifications: '',
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await suppliersAPI.getAll();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Failed to load suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await suppliersAPI.update(editingId, formData);
      } else {
        await suppliersAPI.create(formData);
      }
      loadSuppliers();
      resetForm();
    } catch (error) {
      console.error('Failed to save supplier:', error);
      alert('Failed to save supplier');
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setFormData({
      name: supplier.name,
      address: supplier.address,
      country: supplier.country,
      contact_person: supplier.contact_person,
      contact_email: supplier.contact_email,
      contact_phone: supplier.contact_phone || '',
      certifications: supplier.certifications || '',
    });
    setEditingId(supplier.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    try {
      await suppliersAPI.delete(id);
      loadSuppliers();
    } catch (error) {
      console.error('Failed to delete supplier:', error);
      alert('Failed to delete supplier');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      country: '',
      contact_person: '',
      contact_email: '',
      contact_phone: '',
      certifications: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your raw material suppliers
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Supplier' : 'Add New Supplier'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Supplier Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Eco Cotton Suppliers"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Country *</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                    placeholder="India"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Address *</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  placeholder="456 Supplier Road"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Person *</label>
                  <Input
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    required
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Email *</label>
                  <Input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    required
                    placeholder="jane@supplier.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Phone</label>
                  <Input
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+91-9876543210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Certifications</label>
                <Input
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  placeholder="GOTS, OEKO-TEX, Fair Trade"
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of certifications
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Update' : 'Create'} Supplier
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier) => (
          <Card key={supplier.id}>
            <CardHeader>
              <CardTitle className="text-lg">{supplier.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start text-sm">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p>{supplier.address}</p>
                  <p className="text-muted-foreground">{supplier.country}</p>
                </div>
              </div>
              <div className="text-sm">
                <p className="font-medium">{supplier.contact_person}</p>
                <p className="text-muted-foreground">{supplier.contact_email}</p>
                {supplier.contact_phone && (
                  <p className="text-muted-foreground">{supplier.contact_phone}</p>
                )}
              </div>
              {supplier.certifications && (
                <div className="flex items-start text-sm">
                  <Award className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <p className="text-muted-foreground">{supplier.certifications}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(supplier)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(supplier.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {suppliers.length === 0 && !showForm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No suppliers yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your first supplier to start tracking raw materials
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
