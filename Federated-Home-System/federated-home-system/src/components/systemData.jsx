import React, { useState, useEffect } from 'react';

const SystemData = ({ theme }) => {
  const [data, setData] = useState({
    cpuMemory: null,
    wirelessClients: null,
    firewallRules: null,
    uptimeLoad: null,
    networkConfig: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async (endpoint) => {
    const token = localStorage.getItem("token"); // 🔐 Retrieve JWT token

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/${endpoint}`, {
        method: "GET",
        headers: {
          "Authorization": token,
        },
      });

      const result = await response.json();
      if (result.status === 'Success') {
        return result;
      } else {
        console.error(`Error fetching ${endpoint}:`, result.error);
        return { error: result.error };
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return { error: error.message };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const cpuMemory = await fetchData('cpu_memory');
      const wirelessClients = await fetchData('wireless_clients');
      const firewallRules = await fetchData('firewall_rules');
      const uptimeLoad = await fetchData('uptime_load');
      const networkConfig = await fetchData('network_config');

      setData({
        cpuMemory,
        wirelessClients,
        firewallRules,
        uptimeLoad,
        networkConfig,
      });
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return <p>Loading system data...</p>;
  }

  const boxStyle = {
    backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f8f9fa',
    border: `1px solid ${theme === 'dark' ? '#444' : '#dee2e6'}`,
    color: theme === 'dark' ? '#f1f1f1' : '#212529',
    padding: '10px',
  };

  return (
    <div>
      {/* CPU and Memory Usage Section */}
      <div className={`card mb-3 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
        <div className="card-body">
          <h5>CPU Usage</h5>
          <table className={`table table-striped ${theme === 'dark' ? 'table-dark' : ''}`}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {data.cpuMemory?.cpu &&
                Object.entries(data.cpuMemory.cpu).map(([key, value], index) => (
                  <tr key={index}>
                    <td>{key}</td>
                    <td>{value}%</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <h5 className="mt-4">Memory Usage</h5>
          <table className={`table table-striped ${theme === 'dark' ? 'table-dark' : ''}`}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Value (KB)</th>
              </tr>
            </thead>
            <tbody>
              {data.cpuMemory?.memory &&
                Object.entries(data.cpuMemory.memory).map(([key, value], index) => (
                  <tr key={index}>
                    <td>{key}</td>
                    <td>{parseInt(value).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wireless Clients Section */}
      <div className={`card mb-3 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
        <div className="card-body">
          <h5>📡 Wireless Clients</h5>
          <hr />
          <pre style={boxStyle}>
            {data.wirelessClients?.wireless_clients || 'N/A'}
          </pre>
        </div>
      </div>

      {/* Firewall Rules Section */}
      <div className={`card mb-3 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
        <div className="card-body">
          <h5>🛡️ Firewall Rules</h5>
          <hr />
          <div style={{ ...boxStyle, maxHeight: '200px', overflowY: 'auto' }}>
            <pre>{data.firewallRules?.firewall_rules || 'N/A'}</pre>
          </div>
        </div>
      </div>

      {/* Uptime and Load Section */}
      <div className={`card mb-3 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
        <div className="card-body">
          <h5>⏳ Uptime and Load</h5>
          <hr />
          <pre style={boxStyle}>
            {data.uptimeLoad?.uptime_load || 'N/A'}
          </pre>
        </div>
      </div>

      {/* Network Configuration Section */}
      <div className={`card mb-3 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
        <div className="card-body">
          <h5>🌐 Network Configuration</h5>
          <hr />
          <div style={{ ...boxStyle, maxHeight: '200px', overflowY: 'auto' }}>
            <pre>{data.networkConfig?.network_config || 'N/A'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemData;
