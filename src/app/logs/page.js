"use client"; // This makes the component a client-side component

import { useState, useEffect } from 'react';

export default function LogsPage() {
  const [selectedService, setSelectedService] = useState('');
  const [logFiles, setLogFiles] = useState([]);
  const [selectedLog, setSelectedLog] = useState('');
  const [logContent, setLogContent] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for authentication (for simplicity, we're using localStorage)
  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      setIsAuthenticated(true); // If credentials exist, mark the user as authenticated
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Fetch log files for the selected service
  const fetchLogFiles = async (service) => {
    const auth = localStorage.getItem('auth');
    try {
      const response = await fetch(`/api/logs/${service}`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setLogFiles(data.logFiles);
        setError('');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch log files');
    }
  };

  // Fetch content of a selected log file
  const fetchLogContent = async (service, logFile) => {
    const auth = localStorage.getItem('auth');
    try {
      const response = await fetch(`/api/logs/${service}/${logFile}`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      const content = await response.text();
      if (response.ok) {
        setLogContent(content);
        setError('');
      } else {
        setError('Failed to fetch log content');
      }
    } catch (err) {
      setError('Failed to fetch log content');
    }
  };

  // If user is not authenticated, redirect to login or handle login logic
  if (!isAuthenticated) {
    return <p>Please login to view the logs.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Log Viewer</h1>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Select a Service:</label>
          <select
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value);
              fetchLogFiles(e.target.value);
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Service --</option>
            <option value="mc-collect">MC Collect</option>
            <option value="mc-app">MC App</option>
            <option value="mc-integrations">MC Integrations</option>
          </select>
        </div>

        {/* Log Files List */}
        {selectedService && logFiles.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Log Files for {selectedService}</h3>
            <ul className="space-y-2">
              {logFiles.map((logFile) => (
                <li key={logFile}>
                  <button
                    onClick={() => setSelectedLog(logFile)}
                    className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg w-full text-left"
                  >
                    {logFile}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Log Content */}
        {selectedLog && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Viewing {selectedLog}</h3>
            <button
              onClick={() => fetchLogContent(selectedService, selectedLog)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 mb-4"
            >
              Load Log Content
            </button>

            {logContent && (
              <pre className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap">
                {logContent}
              </pre>
            )}
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
