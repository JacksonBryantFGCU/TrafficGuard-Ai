import React, { useState, useEffect } from 'react';

const ConsoleOutput = ({ theme }) => {
  const [logs, setLogs] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem("token"); // 🔐 Get JWT token

      try {
        const response = await fetch('http://127.0.0.1:5000/api/logs', {
          method: "GET",
          headers: {
            "Authorization": token,
          },
        });

        const data = await response.json();

        if (data.status === 'Success') {
          setLogs(data.logs);
        } else {
          console.error('Error fetching logs:', data.error);
          setLogs('Error fetching logs. Please try again later.');
        }
      } catch (error) {
        console.error('Error:', error);
        setLogs('Failed to fetch logs. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <p>Loading logs...</p>;
  }

  return (
    <div className={`card mb-4 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`} 
      style={{ maxHeight: '300px', overflowY: 'auto' }}>
      <div
        style={{
          backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f8f9fa',
          border: `1px solid ${theme === 'dark' ? '#444' : '#dee2e6'}`,
          color: theme === 'dark' ? '#f1f1f1' : '#212529',
          padding: '10px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          height: '100%',
        }}
      >
        {logs}
      </div>
    </div>
  );
};

export default ConsoleOutput;
