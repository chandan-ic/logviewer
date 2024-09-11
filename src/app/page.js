"use client"; // Add this to ensure the component runs on the client-side

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for useRouter in App Router

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter(); // Initialize the Next.js router

  // Check for existing credentials in localStorage
  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      setIsAuthenticated(true);
      router.push('/dashboard'); // Redirect to the dashboard if already authenticated
    }
  }, [router]);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    const base64Credentials = btoa(`${username}:${password}`);
    
    try {
      const res = await fetch('/api/logs/mc-collect', {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      });

      if (res.ok) {
        localStorage.setItem('auth', base64Credentials);
        setIsAuthenticated(true);
        setError('');
        router.push('/dashboard'); // Redirect to the dashboard after successful login
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Log Viewer</h1>

        {!isAuthenticated ? (
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Login
              </button>
            </form>
          </div>
        ) : (
          <p>Redirecting to dashboard...</p> // Add a message while redirecting
        )}
      </div>
    </div>
  );
}
