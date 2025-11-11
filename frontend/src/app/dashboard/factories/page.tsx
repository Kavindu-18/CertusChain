'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, MapPin, Factory as FactoryIcon } from 'lucide-react';
import { factoriesAPI } from '@/lib/api';

interface Factory {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
}

export default function FactoriesPage() {
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: 'Sri Lanka',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
  });

  useEffect(() => {
    loadFactories();
  }, []);

  const loadFactories = async () => {
    try {
      const response = await factoriesAPI.getAll();
      setFactories(response.data);
    } catch (error) {
      console.error('Failed to load factories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await factoriesAPI.update(editingId, formData);
      } else {
        await factoriesAPI.create(formData);
      }
      loadFactories();
      resetForm();
    } catch (error) {
      console.error('Failed to save factory:', error);
      alert('Failed to save factory');
    }
  };

  const handleEdit = (factory: Factory) => {
    setFormData({
      name: factory.name,
      address: factory.address,
      city: factory.city,
      country: factory.country,
      contact_person: factory.contact_person,
      contact_email: factory.contact_email,
      contact_phone: factory.contact_phone || '',
    });
    setEditingId(factory.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this factory?')) return;
    try {
      await factoriesAPI.delete(id);
      loadFactories();
    } catch (error) {
      console.error('Failed to delete factory:', error);
      alert('Failed to delete factory');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      country: 'Sri Lanka',
      contact_person: '',
      contact_email: '',
      contact_phone: '',
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
          <h1 className="text-3xl font-bold">Factories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your manufacturing facilities
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Factory
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Factory' : 'Add New Factory'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Factory Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Factory 1 - Colombo"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">City *</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    placeholder="Colombo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Address *</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Person *</label>
                  <Input
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Email *</label>
                  <Input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    required
                    placeholder="john@factory.lk"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Phone</label>
                  <Input
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+94771234567"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingId ? 'Update' : 'Create'} Factory
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
        {factories.map((factory) => (
          <Card key={factory.id}>
            <CardHeader>
              <CardTitle className="text-lg">{factory.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start text-sm">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p>{factory.address}</p>
                  <p className="text-muted-foreground">{factory.city}, {factory.country}</p>
                </div>
              </div>
              <div className="text-sm">
                <p className="font-medium">{factory.contact_person}</p>
                <p className="text-muted-foreground">{factory.contact_email}</p>
                {factory.contact_phone && (
                  <p className="text-muted-foreground">{factory.contact_phone}</p>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(factory)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(factory.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {factories.length === 0 && !showForm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FactoryIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No factories yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your first factory to start tracking your supply chain
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Factory
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
