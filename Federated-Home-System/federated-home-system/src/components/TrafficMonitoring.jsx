import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Ensures Chart.js is automatically registered

const TrafficMonitoring = ({ theme }) => {
  const [visibleChart, setVisibleChart] = useState('networkTrafficChart');
  const [bandwidthData, setBandwidthData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBandwidthData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token"); // 🔐 Get JWT token

    try {
      const res = await fetch("http://localhost:5000/api/bandwidth", {
        method: "GET",
        headers: {
          "Authorization": token,
        },
      });

      const json = await res.json();
      if (json.status === "Success") {
        setBandwidthData(json.bandwidth);
      }
    } catch (err) {
      console.error("Error fetching bandwidth data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      visibleChart === 'networkTrafficChart' ||
      visibleChart === 'networkUsageChart'
    ) {
      fetchBandwidthData();
    }
  }, [visibleChart]);

  const generateLineChartData = () => {
    const labels = bandwidthData.map(d => d.interface);
    const receive = bandwidthData.map(d => (d.receive_bytes / 1024 / 1024).toFixed(2));
    const transmit = bandwidthData.map(d => (d.transmit_bytes / 1024 / 1024).toFixed(2));

    return {
      labels,
      datasets: [
        {
          label: 'Receive (MB)',
          data: receive,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          tension: 0.3,
        },
        {
          label: 'Transmit (MB)',
          data: transmit,
          borderColor: 'rgba(255,99,132,1)',
          backgroundColor: 'rgba(255,99,132,0.2)',
          tension: 0.3,
        },
      ],
    };
  };

  const generateUsageBarChart = () => {
    const labels = bandwidthData.map(d => d.interface);
    const received = bandwidthData.map(d => (d.receive_bytes / 1024 / 1024).toFixed(2));
    const transmitted = bandwidthData.map(d => (d.transmit_bytes / 1024 / 1024).toFixed(2));

    return {
      labels,
      datasets: [
        {
          label: 'Received (MB)',
          data: received,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Transmitted (MB)',
          data: transmitted,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const barChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Network Usage (MB)',
        data: [120, 150, 180, 170, 200, 230],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const showChart = (chartId) => {
    setVisibleChart(chartId);
  };

  return (
    <div className={`card ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
      <div className={`card-body ${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
        <div className="d-flex gap-1 mb-3 border-bottom border-dark pb-3" role="group" aria-label="Traffic Monitoring Options">
          <h5 className="mt-2 me-3">📈 Network Trafficking: </h5>
          <button
            type="button"
            className={`btn ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'}`}
            onClick={() => showChart('networkTrafficChart')}
          >
            Network Traffic
          </button>
          <button
            type="button"
            className={`btn ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'}`}
            onClick={() => showChart('suspiciousTrafficTable')}
          >
            Suspicious Traffic
          </button>
          <button
            type="button"
            className={`btn ${theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'}`}
            onClick={() => showChart('networkUsageChart')}
          >
            Network Usage
          </button>
        </div>

        <div id="chartContainer" style={{ minHeight: '600px', height: 'auto' }}>
          {visibleChart === 'networkTrafficChart' && (
            <div id="networkTrafficChart">
              {loading ? (
                <p>Loading network traffic...</p>
              ) : (
                <Line data={generateLineChartData()} 
                  options={{
                    plugins: {
                      legend: {
                        labels: {
                          color: theme === 'dark' ? '#fff' : '#000',
                        },
                      },
                    },
                    scales: {
                      x: {
                        ticks: { color: theme === 'dark' ? '#fff' : '#000' },
                        grid: { color: theme === 'dark' ? '#444' : '#ccc' },
                      },
                      y: {
                        ticks: { color: theme === 'dark' ? '#fff' : '#000' },
                        grid: { color: theme === 'dark' ? '#444' : '#ccc' },
                      },
                    },
                  }}
                />
              )}
            </div>
          )}

          {visibleChart === 'networkUsageChart' && (
            <Bar data={barChartData}
              options={{
                plugins: {
                  legend: {
                    labels: {
                      color: theme === 'dark' ? '#fff' : '#000',
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: { color: theme === 'dark' ? '#fff' : '#000' },
                    grid: { color: theme === 'dark' ? '#444' : '#ccc' },
                  },
                  y: {
                    ticks: { color: theme === 'dark' ? '#fff' : '#000' },
                    grid: { color: theme === 'dark' ? '#444' : '#ccc' },
                  },
                },
              }}
            />
          )}

          {visibleChart === 'suspiciousTrafficTable' && (
            <div id="suspiciousTrafficTable">
              <p>Sample data for suspicious traffic (replace with your actual table):</p>
              <table className={`table table-striped ${theme === 'dark' ? 'table-dark' : ''}`}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>IP Address</th>
                    <th>Time Detected</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>192.168.0.10</td>
                    <td>2024-11-05 14:32</td>
                    <td>Suspicious Data Spike</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>10.0.0.15</td>
                    <td>2024-11-05 15:20</td>
                    <td>Unusual Port Activity</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrafficMonitoring;
