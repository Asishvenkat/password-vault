'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Copy, Edit2, Trash2, Check, ExternalLink } from 'lucide-react';
import { decryptData } from '@/lib/crypto';

interface VaultItemProps {
  item: any;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  encryptionKey: string;
}

export default function VaultItem({ item, onEdit, onDelete, encryptionKey }: VaultItemProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [decryptedPassword, setDecryptedPassword] = useState('');

  useEffect(() => {
    const decrypted = decryptData(item.password, encryptionKey);
    setDecryptedPassword(decrypted);
  }, [item.password, encryptionKey]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(decryptedPassword);
      setCopied(true);
      // Auto-clear after 15 seconds
      setTimeout(() => setCopied(false), 15000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEdit = () => {
    // Decrypt password before editing
    onEdit({
      ...item,
      password: decryptedPassword
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition p-4 mb-3 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{item.title}</h3>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all flex items-center gap-1 mt-1"
            >
              {item.url}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {item.folder && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
              Folder: {item.folder}
            </div>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.tags.map((tag: string) => (
                <span key={tag} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition p-1 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition p-1 hover:bg-red-50 dark:hover:bg-red-900 rounded"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {item.username && (
        <div className="text-sm mb-2 bg-gray-50 dark:bg-gray-700 p-2 rounded">
          <span className="text-gray-600 dark:text-gray-400 font-medium">Username: </span>
          <span className="font-mono text-gray-800 dark:text-gray-200">{item.username}</span>
        </div>
      )}

      <div className="flex items-center gap-2 mb-2 bg-gray-50 dark:bg-gray-700 p-2 rounded">
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Password: </span>
        <code className="flex-1 font-mono text-sm text-gray-800 dark:text-gray-200">
          {showPassword ? decryptedPassword : '••••••••••'}
        </code>
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        <button
          onClick={copyToClipboard}
          className={`transition p-1 rounded ${
            copied
              ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900'
              : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900'
          }`}
          title={copied ? 'Copied! (auto-clears in 15s)' : 'Copy password'}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {copied && (
        <p className="text-xs text-green-600 dark:text-green-400 mb-2">
          ✓ Copied! Will auto-clear in 15 seconds
        </p>
      )}

      {item.notes && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 p-2 rounded">
          <span className="font-medium text-amber-900 dark:text-amber-200">Note: </span>
          {item.notes}
        </div>
      )}
    </div>
  );
}
