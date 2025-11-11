'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Radio, MapPin } from 'lucide-react';
import { devicesAPI, factoriesAPI } from '@/lib/api';

interface Device {
  id: string;
  device_name: string;
  device_id: string;
  device_type: string;
  location: string;
  factory: {
    name: string;
  };
}

interface Factory {
  id: string;
  name: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    factory_id: '',
    device_name: '',
    device_id: '',
    device_type: 'ENERGY',
    location: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [devicesRes, factoriesRes] = await Promise.all([
        devicesAPI.getAll(),
        factoriesAPI.getAll(),
      ]);
      setDevices(devicesRes.data);
      setFactories(factoriesRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await devicesAPI.create(formData);
      await loadData();
      resetForm();
      alert('Device registered successfully!');
    } catch (error: any) {
      console.error('Failed to create device:', error);
      alert(error.response?.data?.message || 'Failed to create device');
    }
  };

  const resetForm = () => {
    setFormData({
      factory_id: '',
      device_name: '',
      device_id: '',
      device_type: 'ENERGY',
      location: '',
    });
    setShowForm(false);
  };

  const getDeviceTypeColor = (type: string) => {
    switch (type) {
      case 'ENERGY':
        return 'bg-yellow-100 text-yellow-800';
      case 'WATER':
        return 'bg-blue-100 text-blue-800';
      case 'WASTE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">IoT Devices</h1>
          <p className="text-muted-foreground mt-1">
            Manage IoT sensors for real-time monitoring
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Register Device
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Register New IoT Device</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Factory *</label>
                  <select
                    className="w-full h-10 px-3 py-2 text-sm border border-input rounded-md bg-background"
                    value={formData.factory_id}
                    onChange={(e) => setFormData({ ...formData, factory_id: e.target.value })}
                    required
                  >
                    <option value="">Select Factory</option>
                    {factories.map((factory) => (
                      <option key={factory.id} value={factory.id}>
                        {factory.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Device Type *</label>
                  <select
                    className="w-full h-10 px-3 py-2 text-sm border border-input rounded-md bg-background"
                    value={formData.device_type}
                    onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                    required
                  >
                    <option value="ENERGY">Energy Meter</option>
                    <option value="WATER">Water Flow Meter</option>
                    <option value="WASTE">Waste Tracker</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Device Name *</label>
                  <Input
                    value={formData.device_name}
                    onChange={(e) => setFormData({ ...formData, device_name: e.target.value })}
                    required
                    placeholder="Energy Meter 1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Device ID *</label>
                  <Input
                    value={formData.device_id}
                    onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                    required
                    placeholder="DEVICE-ENERGY-001"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location *</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  placeholder="Production Floor A"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Register Device</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices.map((device) => (
          <Card key={device.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{device.device_name}</CardTitle>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getDeviceTypeColor(device.device_type)}`}>
                  {device.device_type}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm">
                <Radio className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-mono text-xs">{device.device_id}</span>
              </div>
              <div className="flex items-start text-sm">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p>{device.location}</p>
                  <p className="text-muted-foreground">{device.factory.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {devices.length === 0 && !showForm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Radio className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No IoT devices yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Register your first IoT device for real-time monitoring
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Register Device
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
