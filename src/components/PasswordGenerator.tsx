'use client';

import { useState } from 'react';
import { RefreshCw, Key } from 'lucide-react';

interface PasswordGeneratorProps {
  onGenerate: (password: string) => void;
}

export default function PasswordGenerator({ onGenerate }: PasswordGeneratorProps) {
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookalikes, setExcludeLookalikes] = useState(true);

  const generatePassword = () => {
    let chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '23456789';
    const allNumbers = '0123456789';
    const symbols = '!@#$%^&*-_=+';
    const lookalikes = 'il1Lo0O';

    if (includeNumbers) {
      chars += excludeLookalikes ? numbers : allNumbers;
    }
    if (includeSymbols) {
      chars += symbols;
    }
    if (!excludeLookalikes) {
      chars += lookalikes;
    }

    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      password += chars[array[i] % chars.length];
    }

    onGenerate(password);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
        <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        Password Generator
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Length: <span className="text-blue-600 dark:text-blue-400 font-bold">{length}</span>
          </label>
          <input
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>8</span>
            <span>32</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Include Symbols (!@#$%^&*)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
            <input
              type="checkbox"
              checked={excludeLookalikes}
              onChange={(e) => setExcludeLookalikes(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Exclude Look-alikes (i, l, 1, O, 0)</span>
          </label>
        </div>

        <button
          onClick={generatePassword}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 active:bg-blue-800 flex items-center justify-center gap-2 transition font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Generate Password
        </button>
      </div>
    </div>
  );
}
