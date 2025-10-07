"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Not implemented yet');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        <p className="text-sm text-gray-600 mb-6">Change your account settings here. This page is a placeholder UI for now.</p>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border px-3 py-2 rounded" />
          </div>

          <div className="flex items-center gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Change Password</button>
            <button type="button" onClick={() => router.push('/dashboard')} className="text-sm text-gray-600">Back to Dashboard</button>
          </div>

          {message && <p className="text-sm text-green-600">{message}</p>}
        </form>
      </div>
    </div>
  );
}
