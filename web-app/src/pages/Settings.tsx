import { useState } from 'react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings & Preferences</h1>
      <div className="card p-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              className="checkbox-modern"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="text-sm text-gray-700">Enable dark mode (coming soon)</span>
          </label>
        </section>
      </div>
    </div>
  );
} 