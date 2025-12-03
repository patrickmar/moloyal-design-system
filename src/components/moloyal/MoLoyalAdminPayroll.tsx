import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { FinanceIcons, SecurityIcons, UIIcons } from './MoLoyalIcons';
import { MoLoyalButton } from './MoLoyalButton';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { MoLoyalToast } from './MoLoyalToast';
import { formatCurrency } from './data';

interface PayrollRecord {
  service_no: string;
  name?: string;
  rank_code: string;
  amount: number;
  error?: string;
  warning?: string;
}

interface ValidationError {
  row: number;
  serviceNumber: string;
  error: string;
  suggestion: string;
}

interface MoLoyalAdminPayrollProps {
  onUploadComplete: (summary: any) => void;
}

export function MoLoyalAdminPayroll({ onUploadComplete }: MoLoyalAdminPayrollProps) {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'processing' | 'complete'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [columnMapping, setColumnMapping] = useState({
    service_no: '',
    rank_code: '',
    amount: ''
  });
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulated CSV columns
  const [availableColumns] = useState(['ServiceNumber', 'RankCode', 'PayrollAmount', 'PersonnelName', 'Department']);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      if (uploadedFile.type !== 'text/csv' && !uploadedFile.name.endsWith('.csv')) {
        MoLoyalToast.error('Invalid File', 'Please upload a CSV file');
        return;
      }
      setFile(uploadedFile);
      setStep('mapping');
      MoLoyalToast.success('File Loaded', `${uploadedFile.name} ready for mapping`);
    }
  };

  const handleColumnMapping = () => {
    if (!columnMapping.service_no || !columnMapping.rank_code || !columnMapping.amount) {
      MoLoyalToast.error('Mapping Required', 'Please map all required fields');
      return;
    }

    // Simulate parsing CSV with demo data
    const demoRecords: PayrollRecord[] = [
      { service_no: 'NA-12345', rank_code: 'R3', amount: 18000 },
      { service_no: 'NA-22345', rank_code: 'R2', amount: 12000 },
      { service_no: 'NA-33456', rank_code: 'R4', amount: 25000 },
      { service_no: 'NA-44567', rank_code: 'R1', amount: 8000 },
      { service_no: 'NA-55678', rank_code: 'R2', amount: 12000 },
      // Add error cases
      { service_no: 'NA-15678', rank_code: 'R3', amount: 18000, error: 'Invalid service number format' },
      { service_no: 'NA-30245', rank_code: 'X7', amount: 12000, error: 'Rank code not found in system' },
      { service_no: 'NA-10240', rank_code: 'R2', amount: 25000, error: 'Amount exceeds maximum for rank' }
    ];

    setRecords(demoRecords);
    
    // Set validation errors
    const errors: ValidationError[] = demoRecords
      .map((rec, idx) => rec.error ? {
        row: idx + 1,
        serviceNumber: rec.service_no,
        error: rec.error,
        suggestion: getSuggestion(rec.error)
      } : null)
      .filter(Boolean) as ValidationError[];
    
    setValidationErrors(errors);
    setStep('preview');
    MoLoyalToast.success('Preview Ready', `${demoRecords.length} records loaded`);
  };

  const getSuggestion = (error: string): string => {
    if (error.includes('format')) return 'Service number should match pattern NA-XXXXX';
    if (error.includes('Rank code')) return 'Valid rank codes: R1 (Private), R2 (Corporal), R3 (Sergeant), R4 (Lieutenant)';
    if (error.includes('exceeds')) return 'Check rank allocation limits in policy settings';
    return 'Please review the data and try again';
  };

  const handleValidationFix = (row: number) => {
    MoLoyalToast.info('Edit Record', `Edit functionality would open modal for row ${row}`);
  };

  const handleProcess = () => {
    const validRecords = records.filter(r => !r.error);
    if (validRecords.length === 0) {
      MoLoyalToast.error('No Valid Records', 'All records have errors. Please fix them before processing.');
      return;
    }

    setStep('processing');
    setProcessing(true);
    setProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setProcessing(false);
            setStep('complete');
            const summary = {
              totalRecords: records.length,
              successful: validRecords.length,
              failed: validationErrors.length,
              totalAmount: validRecords.reduce((sum, r) => sum + r.amount, 0)
            };
            onUploadComplete(summary);
            MoLoyalToast.success('Processing Complete', `${validRecords.length} records processed successfully`);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleDownloadErrors = () => {
    MoLoyalToast.success('Download Started', 'Downloading error report as CSV');
  };

  const handleStartNew = () => {
    setStep('upload');
    setFile(null);
    setRecords([]);
    setColumnMapping({ service_no: '', rank_code: '', amount: '' });
    setValidationErrors([]);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Payroll Upload</h1>
        <p className="text-muted-foreground">
          Upload CSV or API integration for batch payroll processing
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {['Upload', 'Map Fields', 'Preview & Validate', 'Process'].map((label, idx) => {
              const stepIndex = ['upload', 'mapping', 'preview', 'processing', 'complete'].indexOf(step);
              const isActive = idx <= stepIndex;
              const isCurrent = idx === stepIndex;
              
              return (
                <div key={label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                      isActive ? 'bg-primary border-primary text-white' : 'border-border bg-muted text-muted-foreground'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className={`text-sm mt-2 ${isCurrent ? 'font-semibold' : 'text-muted-foreground'}`}>
                      {label}
                    </div>
                  </div>
                  {idx < 3 && (
                    <div className={`h-0.5 flex-1 ${isActive ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Payroll File</CardTitle>
            <CardDescription>Upload CSV file with personnel payroll data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FinanceIcons.ArrowUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="text-lg font-medium mb-2">Drop CSV file here or click to browse</div>
                <div className="text-sm text-muted-foreground">Supports CSV files up to 50MB</div>
              </label>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="font-medium">File Requirements:</div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• CSV format with header row</li>
                <li>• Must include columns for: Service Number, Rank Code, Amount</li>
                <li>• Maximum 100,000 records per file</li>
                <li>• Service numbers must match format: NA-XXXXX</li>
                <li>• Rank codes: R1 (Private), R2 (Corporal), R3 (Sergeant), R4 (Lieutenant)</li>
              </ul>
            </div>

            <div className="pt-4">
              <button
                className="text-primary hover:underline text-sm flex items-center gap-2"
                onClick={() => MoLoyalToast.info('Download', 'Template CSV download started')}
              >
                <FinanceIcons.Download className="h-4 w-4" />
                Download CSV Template
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'mapping' && (
        <Card>
          <CardHeader>
            <CardTitle>Map CSV Columns</CardTitle>
            <CardDescription>Map your CSV columns to MoLoyal fields</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Service Number <span className="text-destructive">*</span>
                </label>
                <select
                  value={columnMapping.service_no}
                  onChange={(e) => setColumnMapping({ ...columnMapping, service_no: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select column...</option>
                  {availableColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Rank Code <span className="text-destructive">*</span>
                </label>
                <select
                  value={columnMapping.rank_code}
                  onChange={(e) => setColumnMapping({ ...columnMapping, rank_code: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select column...</option>
                  {availableColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Amount <span className="text-destructive">*</span>
                </label>
                <select
                  value={columnMapping.amount}
                  onChange={(e) => setColumnMapping({ ...columnMapping, amount: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select column...</option>
                  {availableColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <MoLoyalButton variant="ghost" onClick={() => setStep('upload')}>
                <UIIcons.ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </MoLoyalButton>
              <MoLoyalButton variant="primary" onClick={handleColumnMapping}>
                Continue to Preview
                <UIIcons.ArrowRight className="h-4 w-4 ml-2" />
              </MoLoyalButton>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'preview' && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Validation Summary</CardTitle>
              <CardDescription>Review records before processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Total Records</div>
                  <div className="text-2xl font-bold">{records.length}</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600 mb-1">Valid Records</div>
                  <div className="text-2xl font-bold text-green-700">{records.filter(r => !r.error).length}</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-sm text-red-600 mb-1">Errors Found</div>
                  <div className="text-2xl font-bold text-red-700">{validationErrors.length}</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-600 mb-1">Total Amount</div>
                  <div className="text-xl font-bold text-blue-700">
                    {formatCurrency(records.filter(r => !r.error).reduce((sum, r) => sum + r.amount, 0))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Errors List */}
          {validationErrors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SecurityIcons.AlertTriangle className="h-5 w-5 text-destructive" />
                  Validation Errors
                </CardTitle>
                <CardDescription>The following records have errors and will be skipped</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {validationErrors.map((error, idx) => (
                    <div key={idx} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="destructive">Row {error.row}</Badge>
                            <span className="font-mono text-sm">{error.serviceNumber}</span>
                          </div>
                          <div className="text-sm text-red-700 mb-1">{error.error}</div>
                          <div className="text-xs text-red-600">{error.suggestion}</div>
                        </div>
                        <MoLoyalButton size="small" variant="ghost" onClick={() => handleValidationFix(error.row)}>
                          Fix
                        </MoLoyalButton>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <MoLoyalButton variant="secondary" onClick={handleDownloadErrors}>
                    <FinanceIcons.Download className="h-4 w-4 mr-2" />
                    Download Error Report
                  </MoLoyalButton>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sample Records Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Records Preview</CardTitle>
              <CardDescription>Showing first 5 valid records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 text-sm font-medium">Service No.</th>
                      <th className="text-left p-2 text-sm font-medium">Rank Code</th>
                      <th className="text-right p-2 text-sm font-medium">Amount</th>
                      <th className="text-center p-2 text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.filter(r => !r.error).slice(0, 5).map((record, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-mono text-sm">{record.service_no}</td>
                        <td className="p-2 text-sm">{record.rank_code}</td>
                        <td className="p-2 text-sm text-right">{formatCurrency(record.amount)}</td>
                        <td className="p-2 text-center">
                          <Badge variant="secondary" className="bg-green-50 text-green-700">Valid</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <MoLoyalButton variant="ghost" onClick={() => setStep('mapping')}>
              <UIIcons.ArrowLeft className="h-4 w-4 mr-2" />
              Back to Mapping
            </MoLoyalButton>
            <MoLoyalButton 
              variant="primary" 
              onClick={handleProcess}
              disabled={records.filter(r => !r.error).length === 0}
            >
              <SecurityIcons.CheckCircle className="h-4 w-4 mr-2" />
              Process {records.filter(r => !r.error).length} Records
            </MoLoyalButton>
          </div>
        </div>
      )}

      {step === 'processing' && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Payroll</CardTitle>
            <CardDescription>Please wait while we process the payroll batch...</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-primary/10 rounded-full mb-4 animate-pulse">
                <FinanceIcons.Calculator className="h-8 w-8 text-primary" />
              </div>
              <div className="text-lg font-medium mb-2">Processing records...</div>
              <div className="text-sm text-muted-foreground mb-6">
                {progress}% complete
              </div>
              <Progress value={progress} className="max-w-md mx-auto" />
            </div>

            <div className="space-y-2 max-w-md mx-auto text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Validating records</span>
                <SecurityIcons.CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span>Processing payments</span>
                {progress > 50 ? (
                  <SecurityIcons.CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Updating accounts</span>
                {progress === 100 ? (
                  <SecurityIcons.CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 border-2 border-muted-foreground/30 rounded-full" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'complete' && (
        <Card>
          <CardHeader>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-green-50 rounded-full mb-4">
                <SecurityIcons.CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Processing Complete!</CardTitle>
              <CardDescription>Payroll batch has been successfully processed</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <div className="text-sm text-muted-foreground mb-1">Total Records</div>
                <div className="text-2xl font-bold">{records.length}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                <div className="text-sm text-green-600 mb-1">Successful</div>
                <div className="text-2xl font-bold text-green-700">{records.filter(r => !r.error).length}</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
                <div className="text-sm text-red-600 mb-1">Failed</div>
                <div className="text-2xl font-bold text-red-700">{validationErrors.length}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                <div className="text-sm text-blue-600 mb-1">Total Processed</div>
                <div className="text-lg font-bold text-blue-700">
                  {formatCurrency(records.filter(r => !r.error).reduce((sum, r) => sum + r.amount, 0))}
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="font-medium">Processing Details:</div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Reference: PU-{Date.now().toString().slice(-6)}</div>
                <div>• Processed by: Col. Ibrahim Hassan</div>
                <div>• Completion time: {new Date().toLocaleString()}</div>
                <div>• Accounts updated: {records.filter(r => !r.error).length}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <MoLoyalButton variant="secondary" onClick={handleDownloadErrors}>
                <FinanceIcons.Download className="h-4 w-4 mr-2" />
                Download Report
              </MoLoyalButton>
              <MoLoyalButton variant="primary" onClick={handleStartNew}>
                Upload Another Batch
              </MoLoyalButton>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
