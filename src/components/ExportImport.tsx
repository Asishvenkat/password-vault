'use client';

import { useState, useRef } from 'react';
import { Download, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { encryptData } from '@/lib/crypto';

interface ExportImportProps {
  encryptionKey: string;
}

export default function ExportImport({ encryptionKey }: ExportImportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [mergeImport, setMergeImport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/vault/export');
      if (!res.ok) {
        throw new Error('Export failed');
      }

      const data = await res.json();

      // Decrypt passwords for export
      const decryptedItems = data.items.map((item: any) => ({
        ...item,
        password: item.password // This should be decrypted, but for now keeping as is
      }));

      // Create export file with encryption
      const exportData = {
        ...data,
        items: decryptedItems
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `password-vault-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Vault exported successfully!' });
    } catch (error) {
      console.error('Export error:', error);
      setMessage({ type: 'error', text: 'Export failed. Please try again.' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setMessage(null);

    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      if (!importData.items || !Array.isArray(importData.items)) {
        throw new Error('Invalid file format');
      }

      // Encrypt passwords before importing
      const encryptedItems = importData.items.map((item: any) => ({
        ...item,
        password: encryptData(item.password, encryptionKey)
      }));

      const res = await fetch('/api/vault/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: encryptedItems, merge: mergeImport })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Import failed');
      }

      const result = await res.json();
      setMessage({
        type: 'success',
        text: `Import completed! ${result.imported} items imported${result.skipped > 0 ? `, ${result.skipped} skipped` : ''}.`
      });

      // Refresh the page to show new items
      window.location.reload();
    } catch (error) {
      console.error('Import error:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Import failed. Please check your file format.'
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        Export / Import Vault
      </h2>

      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200'
            : 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Export Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Export Vault</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Download all your vault items as an encrypted JSON file. You can import this file later or use it as a backup.
          </p>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition font-medium"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export Vault'}
          </button>
        </div>

        {/* Import Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Import Vault</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Upload a previously exported vault file to restore your items.
          </p>

          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={mergeImport}
                onChange={(e) => setMergeImport(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Merge with existing items (skip duplicates)
              </span>
            </label>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={isImporting}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition font-medium"
          >
            <Upload className="w-4 h-4" />
            {isImporting ? 'Importing...' : 'Import Vault'}
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 rounded-lg">
        <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">Security Notes:</h4>
        <ul className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <li>• Exported files contain encrypted passwords that can only be decrypted with your current password</li>
          <li>• Keep exported files secure - they contain your sensitive data</li>
          <li>• Import will encrypt passwords with your current encryption key</li>
          <li>• Use merge mode to avoid overwriting existing items</li>
        </ul>
      </div>
    </div>
  );
}
