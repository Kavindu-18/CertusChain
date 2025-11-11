'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText, Download, Plus, Calendar } from 'lucide-react';
import { reportsAPI } from '@/lib/api';

interface Report {
  id: string;
  report_type: string;
  start_date: string;
  end_date: string;
  created_at: string;
  report_content: string;
  metrics?: any;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    report_type: 'GRI',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await reportsAPI.getAll();
      setReports(response.data);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await reportsAPI.generate(formData);
      await loadReports();
      setShowForm(false);
      setFormData({ report_type: 'GRI', start_date: '', end_date: '' });
      alert('Report generated successfully!');
    } catch (error: any) {
      console.error('Failed to generate report:', error);
      alert(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (report: Report) => {
    const blob = new Blob([report.report_content], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.report_type}_Report_${report.id}.md`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ESG Compliance Reports</h1>
          <p className="text-muted-foreground mt-1">
            Generate AI-powered sustainability reports
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Generate New ESG Report</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type *</label>
                <select
                  className="w-full h-10 px-3 py-2 text-sm border border-input rounded-md bg-background"
                  value={formData.report_type}
                  onChange={(e) => setFormData({ ...formData, report_type: e.target.value })}
                  required
                >
                  <option value="GRI">GRI (Global Reporting Initiative)</option>
                  <option value="CSDDD">CSDDD (Corporate Sustainability Due Diligence)</option>
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date *</label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date *</label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                <p className="text-sm font-medium text-blue-900">
                  ℹ️ AI-Powered Report Generation
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  This will aggregate data from your factories IoT devices and use AI to generate
                  a comprehensive ESG compliance report with metrics and narrative.
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={generating}>
                  {generating ? 'Generating...' : 'Generate Report'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">
                      {report.report_type} ESG Report
                    </h3>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Period: {new Date(report.start_date).toLocaleDateString()} -{' '}
                        {new Date(report.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <p>
                      Generated: {new Date(report.created_at).toLocaleString()}
                    </p>
                  </div>

                  {report.metrics && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-muted-foreground">Total Energy</p>
                        <p className="text-lg font-semibold">
                          {report.metrics.total_energy_kwh?.toFixed(2)} kWh
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-muted-foreground">Total Water</p>
                        <p className="text-lg font-semibold">
                          {report.metrics.total_water_liters?.toFixed(2)} L
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-muted-foreground">Carbon Footprint</p>
                        <p className="text-lg font-semibold">
                          {report.metrics.carbon_footprint_estimate?.toFixed(2)} kg CO₂
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-xs text-muted-foreground">Waste Recycled</p>
                        <p className="text-lg font-semibold">
                          {report.metrics.waste_recycled_percentage?.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(report)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reports.length === 0 && !showForm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No reports yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Generate your first ESG compliance report powered by AI
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
