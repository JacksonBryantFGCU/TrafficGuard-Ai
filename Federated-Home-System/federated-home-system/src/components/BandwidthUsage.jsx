import React, { useState, useEffect } from 'react';

const BandwidthUsage = ({ theme }) => {
  const [bandwidthData, setBandwidthData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBandwidth = async () => {
      const token = localStorage.getItem("token"); // 🔐 Retrieve JWT token

      try {
        const response = await fetch("http://127.0.0.1:5000/api/bandwidth", {
          method: "GET",
          headers: {
            "Authorization": token, // Include token in header
          },
        });

        const data = await response.json();

        if (data.status === "Success") {
          setBandwidthData(data.bandwidth);
        } else {
          console.error("Error fetching bandwidth data:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBandwidth();
  }, []);

  return (
    <div className={`mt-4 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <div className={`card mt-4 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
        <div className="card-body">
          <h3>📡 Bandwidth Usage</h3>
          {loading ? (
            <p>Loading bandwidth data...</p>
          ) : (
            <div>
              <table className={`table table-striped ${theme === 'dark' ? 'table-dark' : ''}`}>
                <thead>
                  <tr>
                    <th>Interface</th>
                    <th>Received Data (Bytes)</th>
                    <th>Transmitted Data (Bytes)</th>
                  </tr>
                </thead>
                <tbody>
                  {bandwidthData.map((data, index) => (
                    <tr key={index}>
                      <td>{data.interface}</td>
                      <td>{data.receive_bytes.toLocaleString()}</td>
                      <td>{data.transmit_bytes.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BandwidthUsage;
