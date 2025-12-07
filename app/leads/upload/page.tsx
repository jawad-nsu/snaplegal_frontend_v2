'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, FileText, CheckCircle, X, AlertCircle, Download, Eye } from 'lucide-react'
import Navbar from '@/components/navbar'

type LeadStage = 'New' | 'Qualified' | 'Proposal' | 'Closed'
type ClosedReason = 'Won' | 'Lost'
type LeadSource = 'Website' | 'Referral' | 'Social Media' | 'Advertisement' | 'Cold Call' | 'Other'
type LeadSubSource = 'Facebook Ads' | 'Google Ads' | 'LinkedIn' | 'Instagram' | 'Word of Mouth' | 'Email Campaign' | 'Other'

interface ParsedRow {
  [key: string]: string | number | null
}

interface ColumnMapping {
  fileColumn: string
  leadField: string
}

interface LeadField {
  value: string
  label: string
  required?: boolean
}

const leadFields: LeadField[] = [
  { value: '', label: '-- Skip Column --' },
  { value: 'clientName', label: 'Client Name', required: true },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'email', label: 'Email' },
  { value: 'profession', label: 'Profession' },
  { value: 'street', label: 'House & Road Number' },
  { value: 'city', label: 'City Corporation' },
  { value: 'thana', label: 'Thana' },
  { value: 'district', label: 'District' },
  { value: 'country', label: 'Country' },
  { value: 'postalCode', label: 'Postal Code' },
  { value: 'desiredService', label: 'Desired Service' },
  { value: 'initialDiscussion', label: 'Initial Discussion' },
  { value: 'stage', label: 'Stage' },
  { value: 'leadSource', label: 'Lead Source' },
  { value: 'leadSubSource', label: 'Lead Sub Source' },
  { value: 'leadOwner', label: 'Lead Owner', required: true },
  { value: 'comment', label: 'Comment' },
]

const stageOptions: LeadStage[] = ['New', 'Qualified', 'Proposal', 'Closed']
const sourceOptions: LeadSource[] = ['Website', 'Referral', 'Social Media', 'Advertisement', 'Cold Call', 'Other']
const subSourceOptions: LeadSubSource[] = ['Facebook Ads', 'Google Ads', 'LinkedIn', 'Instagram', 'Word of Mouth', 'Email Campaign', 'Other']

export default function BulkUploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileColumns, setFileColumns] = useState<string[]>([])
  const [parsedData, setParsedData] = useState<ParsedRow[]>([])
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({})
  const [previewData, setPreviewData] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [importResults, setImportResults] = useState<{ success: number; errors: string[] } | null>(null)
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'preview' | 'results'>('upload')

  // Parse CSV file
  const parseCSV = (text: string): { columns: string[]; data: ParsedRow[] } => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length === 0) return { columns: [], data: [] }

    // Try to detect delimiter
    const firstLine = lines[0]
    const delimiter = firstLine.includes(',') ? ',' : (firstLine.includes('\t') ? '\t' : ',')

    // Parse header
    const headers = firstLine.split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''))
    
    // Parse data rows
    const data: ParsedRow[] = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''))
      const row: ParsedRow = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || null
      })
      if (Object.values(row).some(v => v !== null && v !== '')) {
        data.push(row)
      }
    }

    return { columns: headers, data }
  }

  // Parse Excel file (using xlsx library)
  const parseExcel = async (file: File): Promise<{ columns: string[]; data: ParsedRow[] }> => {
    try {
      // Dynamic import of xlsx library
      // Note: Install xlsx library with: npm install xlsx
      const XLSX = await import('xlsx')
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
      
      if (jsonData.length === 0) return { columns: [], data: [] }

      const headers = jsonData[0].map((h: any) => String(h || '').trim())
      const dataRows: ParsedRow[] = []

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i]
        const rowData: ParsedRow = {}
        headers.forEach((header: string, index: number) => {
          rowData[header] = row[index] !== undefined ? String(row[index] || '').trim() : null
        })
        if (Object.values(rowData).some(v => v !== null && v !== '')) {
          dataRows.push(rowData)
        }
      }

      return { columns: headers, data: dataRows }
    } catch (error: any) {
      console.error('Error parsing Excel:', error)
      if (error.message?.includes('Cannot find module') || error.code === 'MODULE_NOT_FOUND') {
        throw new Error('Excel support requires xlsx library. Please install it with: npm install xlsx. For now, please use CSV files.')
      }
      throw new Error('Failed to parse Excel file. Please ensure the file is valid.')
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setIsProcessing(true)

    try {
      let result: { columns: string[]; data: ParsedRow[] }

      if (file.name.endsWith('.csv')) {
        const text = await file.text()
        result = parseCSV(text)
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        result = await parseExcel(file)
      } else {
        alert('Unsupported file format. Please upload a CSV or Excel file.')
        setSelectedFile(null)
        setIsProcessing(false)
        return
      }

      setFileColumns(result.columns)
      setParsedData(result.data)
      
      // Auto-map columns based on name matching
      const autoMappings: Record<string, string> = {}
      result.columns.forEach(col => {
        const lowerCol = col.toLowerCase().trim()
        const matchedField = leadFields.find(field => {
          if (!field.value) return false
          const fieldLabel = field.label.toLowerCase()
          return lowerCol.includes(fieldLabel) || fieldLabel.includes(lowerCol) ||
                 lowerCol === field.value.toLowerCase() ||
                 lowerCol.replace(/\s+/g, '') === field.value.toLowerCase()
        })
        if (matchedField && matchedField.value) {
          autoMappings[col] = matchedField.value
        }
      })
      setColumnMappings(autoMappings)
      
      setCurrentStep('mapping')
    } catch (error) {
      console.error('Error parsing file:', error)
      alert('Error parsing file. Please check the file format and try again.')
      setSelectedFile(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMappingChange = (fileColumn: string, leadField: string) => {
    setColumnMappings(prev => ({
      ...prev,
      [fileColumn]: leadField
    }))
  }

  const generatePreview = () => {
    const preview: any[] = []
    const maxPreviewRows = 5

    parsedData.slice(0, maxPreviewRows).forEach((row, index) => {
      const mappedRow: any = {}
      Object.entries(columnMappings).forEach(([fileCol, leadField]) => {
        if (leadField && row[fileCol] !== undefined && row[fileCol] !== null) {
          mappedRow[leadField] = String(row[fileCol])
        }
      })
      preview.push(mappedRow)
    })

    setPreviewData(preview)
    setCurrentStep('preview')
  }

  const validateMappings = (): string[] => {
    const errors: string[] = []
    const requiredFields = leadFields.filter(f => f.required).map(f => f.value)
    
    requiredFields.forEach(field => {
      const isMapped = Object.values(columnMappings).includes(field)
      if (!isMapped) {
        const fieldLabel = leadFields.find(f => f.value === field)?.label || field
        errors.push(`Required field "${fieldLabel}" is not mapped`)
      }
    })

    return errors
  }

  const handleImport = async () => {
    const validationErrors = validateMappings()
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n' + validationErrors.join('\n'))
      return
    }

    setIsProcessing(true)
    const errors: string[] = []
    let successCount = 0

    try {
      // Process each row
      for (let i = 0; i < parsedData.length; i++) {
        const row = parsedData[i]
        const leadData: any = {
          id: `import-${Date.now()}-${i}`,
          createdAt: new Date().toISOString().split('T')[0],
        }

        // Map columns to lead fields
        Object.entries(columnMappings).forEach(([fileCol, leadField]) => {
          if (leadField && row[fileCol] !== undefined && row[fileCol] !== null) {
            const value = String(row[fileCol]).trim()
            if (value) {
              leadData[leadField] = value
            }
          }
        })

        // Validate required fields
        if (!leadData.clientName || !leadData.leadOwner) {
          errors.push(`Row ${i + 2}: Missing required fields (Client Name or Lead Owner)`)
          continue
        }

        // Set defaults
        if (!leadData.stage) leadData.stage = 'Lead'
        if (!leadData.leadSource) leadData.leadSource = 'Website'

        // In a real app, you would make an API call here
        // For now, we'll just simulate success
        successCount++
      }

      setImportResults({ success: successCount, errors })
      setCurrentStep('results')
    } catch (error) {
      console.error('Error importing:', error)
      alert('Error importing leads. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setFileColumns([])
    setParsedData([])
    setColumnMappings({})
    setPreviewData([])
    setImportResults(null)
    setCurrentStep('upload')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[var(--color-primary)]">
              Home
            </Link>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
            <Link href="/leads" className="hover:text-[var(--color-primary)]">
              Leads
            </Link>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
            <span className="text-gray-900">Bulk Upload</span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bulk Upload Leads</h1>
              <p className="text-gray-600 mt-1">Upload CSV or Excel file to import multiple leads at once</p>
            </div>
            <Link
              href="/leads"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Leads
            </Link>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {['upload', 'mapping', 'preview', 'results'].map((step, index) => {
              const stepLabels = ['Upload File', 'Map Columns', 'Preview', 'Results']
              const isActive = currentStep === step
              const isCompleted = ['upload', 'mapping', 'preview', 'results'].indexOf(currentStep) > index
              
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      isActive ? 'bg-[var(--color-primary)] text-white' :
                      isCompleted ? 'bg-green-100 text-green-700' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-6 h-6" /> : index + 1}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${
                      isActive ? 'text-[var(--color-primary)]' :
                      isCompleted ? 'text-green-700' :
                      'text-gray-500'
                    }`}>
                      {stepLabels[index]}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step 1: Upload File */}
        {currentStep === 'upload' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select File</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[var(--color-primary)] transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  CSV or Excel files only (max 10MB)
                </p>
                {selectedFile && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                    <FileText className="w-5 h-5" />
                    <span>{selectedFile.name}</span>
                    <span className="text-gray-500">({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                  </div>
                )}
              </label>
            </div>

            {isProcessing && (
              <div className="mt-4 text-center text-gray-600">
                Processing file...
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">File Format Requirements:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>First row must contain column headers</li>
                <li>Supported formats: CSV (.csv), Excel (.xlsx, .xls)</li>
                <li>Required columns: Client Name, Lead Owner</li>
                <li>Maximum file size: 10MB</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 2: Column Mapping */}
        {currentStep === 'mapping' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Map Columns</h2>
              <button
                onClick={handleReset}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Start Over
              </button>
            </div>

            <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Required fields must be mapped:</p>
                  <p>Client Name, Lead Owner</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">File Column</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Sample Data</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Map To Lead Field</th>
                  </tr>
                </thead>
                <tbody>
                  {fileColumns.map((column, index) => {
                    const sampleValue = parsedData[0]?.[column] || '(empty)'
                    const mappedField = columnMappings[column] || ''
                    const fieldInfo = leadFields.find(f => f.value === mappedField)
                    
                    return (
                      <tr key={column} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{column}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                          {String(sampleValue)}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={mappedField}
                            onChange={(e) => handleMappingChange(column, e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                              fieldInfo?.required && !mappedField ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            {leadFields.map(field => (
                              <option key={field.value} value={field.value}>
                                {field.label} {field.required ? '*' : ''}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setCurrentStep('upload')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={generatePreview}
                className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90"
              >
                Preview Data
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {currentStep === 'preview' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Preview Data</h2>
              <button
                onClick={handleReset}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Start Over
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Showing preview of first 5 rows. Total rows to import: {parsedData.length}
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {Object.keys(previewData[0] || {}).map(key => (
                      <th key={key} className="text-left py-2 px-3 font-semibold text-gray-900">
                        {leadFields.find(f => f.value === key)?.label || key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      {Object.entries(row).map(([key, value]) => (
                        <td key={key} className="py-2 px-3 text-gray-700">
                          {String(value || '-')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setCurrentStep('mapping')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Back to Mapping
              </button>
              <button
                onClick={handleImport}
                disabled={isProcessing}
                className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Importing...' : `Import ${parsedData.length} Leads`}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {currentStep === 'results' && importResults && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Import Results</h2>

            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-lg font-semibold text-green-900">
                  Successfully imported {importResults.success} leads
                </span>
              </div>
            </div>

            {importResults.errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <span className="text-lg font-semibold text-red-900">
                    {importResults.errors.length} errors encountered
                  </span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-red-800">
                  {importResults.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Upload Another File
              </button>
              <Link
                href="/leads"
                className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90"
              >
                View Leads
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

