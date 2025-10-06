'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Key, Search, Plus, LogOut } from 'lucide-react';
import PasswordGenerator from '@/components/PasswordGenerator';
import VaultItem from '@/components/VaultItem';
import VaultForm from '@/components/VaultForm';
import DarkModeToggle from '@/components/DarkModeToggle';
import ExportImport from '@/components/ExportImport';
import { encryptData } from '@/lib/crypto';

export default function Dashboard() {
  const router = useRouter();
  const [vaultItems, setVaultItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get encryption key from sessionStorage
    const key = sessionStorage.getItem('encryptionKey');
    if (!key) {
      router.push('/');
      return;
    }
    setEncryptionKey(key);
    fetchVaultItems();
  }, [router]);

  const fetchVaultItems = async () => {
    try {
      const res = await fetch('/api/vault');
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/');
          return;
        }
        throw new Error('Failed to fetch vault items');
      }
      const data = await res.json();
      setVaultItems(data.items);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async (itemData: any) => {
    try {
      // Encrypt password before sending to server
      const encryptedPassword = encryptData(itemData.password, encryptionKey);
      const payload = { ...itemData, password: encryptedPassword };

      if (editingItem) {
        // Update existing item
        const res = await fetch(`/api/vault/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Failed to update item');
      } else {
        // Create new item
        const res = await fetch('/api/vault', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Failed to create item');
      }

      // Refresh vault items
      fetchVaultItems();

      // Reset form
      setShowForm(false);
      setEditingItem(null);
      setGeneratedPassword('');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save item. Please try again.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/vault/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete item');

      // Refresh vault items
      fetchVaultItems();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
    setGeneratedPassword('');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      sessionStorage.removeItem('encryptionKey');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const filteredItems = (Array.isArray(vaultItems) ? vaultItems : []).filter(item => {
    const title = (item?.title || '').toString();
    const username = (item?.username || '').toString();
    const url = (item?.url || '').toString();
    const folder = (item?.folder || '').toString();
    const tags = Array.isArray(item?.tags) ? item.tags : [];
    const q = searchQuery.toLowerCase();
    return (
      title.toLowerCase().includes(q) ||
      username.toLowerCase().includes(q) ||
      url.toLowerCase().includes(q) ||
      folder.toLowerCase().includes(q) ||
      tags.some((tag: string) => tag.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <Key className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Password Vault
          </h1>
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Generator & Form */}
          <div>
            <PasswordGenerator
              onGenerate={(pwd) => {
                setGeneratedPassword(pwd);
                setShowForm(true);
                setEditingItem(null);
              }}
            />

            <ExportImport encryptionKey={encryptionKey} />

            {generatedPassword && showForm && !editingItem && (
              <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800 dark:text-green-200 mb-2 font-semibold">
                  ✓ Generated Password:
                </p>
                <code className="block bg-white dark:bg-gray-800 p-3 rounded font-mono text-sm break-all border border-green-300 dark:border-green-600">
                  {generatedPassword}
                </code>
                <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                  Fill in the details below to save this password to your vault.
                </p>
              </div>
            )}

            {(showForm || editingItem) && (
              <VaultForm
                item={editingItem}
                onSave={handleSaveItem}
                onCancel={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  setGeneratedPassword('');
                }}
                initialPassword={editingItem ? editingItem.password : generatedPassword}
              />
            )}
          </div>

          {/* Right Column - Vault Items */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vault..."
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-10 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <button
                  onClick={() => {
                    setShowForm(true);
                    setEditingItem(null);
                    setGeneratedPassword('');
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 transition font-medium"
                  title="Add new item"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Vault Items List */}
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Key className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                      {searchQuery
                        ? 'No items found matching your search'
                        : 'No vault items yet'}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      {!searchQuery && 'Generate a password to get started!'}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                      {searchQuery && ' found'}
                    </p>
                    {filteredItems.map(item => (
                      <VaultItem
                        key={item._id}
                        item={item}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                        encryptionKey={encryptionKey}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
