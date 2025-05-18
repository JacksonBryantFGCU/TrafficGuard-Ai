import React, { useEffect, useState } from 'react';

function RouterDisplay({ theme }) {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchRouterInfo = async () => {
      const token = localStorage.getItem("token"); // 🔐 Get JWT token

      try {
        const response = await fetch('http://127.0.0.1:5000/api/router-info', {
          method: "GET",
          headers: {
            "Authorization": token,
          },
        });

        const data = await response.json();

        if (data.message === "Success") {
          setInfo(data);
        } else {
          console.error("Failed to fetch router info:", data.message);
        }
      } catch (error) {
        console.error("Error fetching router info:", error);
      }
    };

    fetchRouterInfo();
  }, []);

  const darkClass = theme === 'dark' ? 'bg-dark text-white' : '';

  return (
    <div className={`card mt-4 ${darkClass}`}>
      <div className={`card-body ${darkClass}`}>
        <h5 className="card-title">📡 Router Information</h5>
        {info ? (
          <ul className="list-group list-group-flush">
            <li className={`list-group-item ${darkClass}`}>
              <strong>Router Model:</strong> {info.router_name}
            </li>
            <li className={`list-group-item ${darkClass}`}>
              <strong>Router IP:</strong> {info.router_ip}
            </li>
          </ul>
        ) : (
          <p>Loading router info...</p>
        )}
      </div>
    </div>
  );
}

export default RouterDisplay;
