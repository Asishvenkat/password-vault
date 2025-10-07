'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Key } from 'lucide-react';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use the new API routes: /api/register or /api/login
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const body = requires2FA
        ? { email, password, totpCode }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.requires2FA) {
          setRequires2FA(true);
          setError('Enter your 2FA code to continue');
          setLoading(false);
          return;
        }
        setError(data.message || 'Something went wrong');
        setLoading(false);
        return;
      }

      // Store encryption key in sessionStorage (client-side only)
      sessionStorage.setItem('encryptionKey', password);

      // Reset 2FA state
      setRequires2FA(false);
      setTotpCode('');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    setError('');
    setRequires2FA(false);
    setTotpCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center mb-6">
          <Key className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
          Password Vault
        </h1>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
              minLength={8}
              disabled={loading}
            />
            {!isLogin && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Minimum 8 characters. This will also be your encryption key.
              </p>
            )}
          </div>

          {requires2FA && (
            <div>
              <label htmlFor="totpCode" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                2FA Code
              </label>
              <input
                id="totpCode"
                type="text"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
                placeholder="Enter 6-digit code"
                disabled={loading}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password || (requires2FA && !totpCode)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
          >
            {loading ? 'Processing...' : (requires2FA ? 'Verify & Login' : (isLogin ? 'Login' : 'Sign Up'))}
          </button>
        </form>

        {!requires2FA && (
          <button
            onClick={handleModeSwitch}
            disabled={loading}
            className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:text-gray-400 dark:disabled:text-gray-500"
          >
            {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
          </button>
        )}
      </div>
    </div>
  );
}
