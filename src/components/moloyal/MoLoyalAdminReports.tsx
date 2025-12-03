import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { MoLoyalButton } from './MoLoyalButton';
import { MoLoyalToast } from './MoLoyalToast';
import { FinanceIcons, SecurityIcons } from './MoLoyalIcons';
import { Badge } from '../ui/badge';

interface ReportFilters {
  dateRanges: Array<{ label: string; value: string }>;
  ranks: string[];
  regiments: string[];
  branches: string[];
  reportTypes: Array<{ label: string; value: string }>;
}

interface MoLoyalAdminReportsProps {
  filters: ReportFilters;
}

export function MoLoyalAdminReports({ filters }: MoLoyalAdminReportsProps) {
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedRanks, setSelectedRanks] = useState<string[]>([]);
  const [selectedRegiment, setSelectedRegiment] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    if (!reportType || !dateRange) {
      MoLoyalToast.error('Missing Required Fields', 'Please select report type and date range');
      return;
    }

    setGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setGenerating(false);
      MoLoyalToast.success('Report Generated', `${format.toUpperCase()} report downloaded successfully`);
    }, 2000);
  };

  const toggleRank = (rank: string) => {
    setSelectedRanks(prev => 
      prev.includes(rank) ? prev.filter(r => r !== rank) : [...prev, rank]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Generate and export financial reports with custom filters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>Select report type and filters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Report Type <span className="text-destructive">*</span>
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select report type...</option>
                  {filters.reportTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Date Range <span className="text-destructive">*</span>
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select date range...</option>
                  {filters.dateRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Custom Date Range */}
              {dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Rank Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Rank (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {filters.ranks.map(rank => (
                    <button
                      key={rank}
                      onClick={() => toggleRank(rank)}
                      className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                        selectedRanks.includes(rank)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-background hover:bg-muted'
                      }`}
                    >
                      {rank}
                    </button>
                  ))}
                </div>
              </div>

              {/* Regiment Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Regiment (Optional)</label>
                <select
                  value={selectedRegiment}
                  onChange={(e) => setSelectedRegiment(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">All Regiments</option>
                  {filters.regiments.map(regiment => (
                    <option key={regiment} value={regiment}>{regiment}</option>
                  ))}
                </select>
              </div>

              {/* Branch Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Branch (Optional)</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">All Branches</option>
                  {filters.branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>

              {/* Export Format */}
              <div>
                <label className="text-sm font-medium mb-2 block">Export Format</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFormat('csv')}
                    className={`flex-1 p-3 border rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      format === 'csv'
                        ? 'bg-primary text-white border-primary'
                        : 'bg-background hover:bg-muted'
                    }`}
                  >
                    <FinanceIcons.Download className="h-4 w-4" />
                    CSV
                  </button>
                  <button
                    onClick={() => setFormat('pdf')}
                    className={`flex-1 p-3 border rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      format === 'pdf'
                        ? 'bg-primary text-white border-primary'
                        : 'bg-background hover:bg-muted'
                    }`}
                  >
                    <FinanceIcons.Download className="h-4 w-4" />
                    PDF
                  </button>
                </div>
              </div>

              {/* Generate Button */}
              <MoLoyalButton
                variant="primary"
                size="large"
                fullWidth
                onClick={handleGenerate}
                loading={generating}
                disabled={!reportType || !dateRange}
              >
                <FinanceIcons.Download className="h-4 w-4 mr-2" />
                Generate Report
              </MoLoyalButton>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports & Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Q3 2025 Financial Overview', date: '2025-10-14', format: 'PDF' },
                  { name: 'September Transactions', date: '2025-10-01', format: 'CSV' },
                  { name: 'Allocation Report - All Ranks', date: '2025-09-28', format: 'PDF' }
                ].map((report, idx) => (
                  <div key={idx} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">{report.name}</div>
                        <div className="text-xs text-muted-foreground">{report.date}</div>
                      </div>
                      <Badge variant="secondary" className="text-xs">{report.format}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-2">
                  <SecurityIcons.CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                  <div>Reports are encrypted and audit-logged</div>
                </div>
                <div className="flex gap-2">
                  <SecurityIcons.CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                  <div>CSV format includes raw data for analysis</div>
                </div>
                <div className="flex gap-2">
                  <SecurityIcons.CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                  <div>PDF format includes charts and summaries</div>
                </div>
                <div className="flex gap-2">
                  <SecurityIcons.CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                  <div>Maximum date range: 1 year</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
