import React, { useState } from "react";

const RouterInformation = ({ onFormSubmit }) => {
  const [ipAddress, setIpAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [router, setRouter] = useState("mango");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Login
      const loginRes = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const loginData = await loginRes.json();

      if (loginRes.status === 401 || !loginData.token) {
        alert("Invalid username or password.");
        return;
      }

      const token = loginData.token;
      localStorage.setItem("token", token); // Save token for future use

      // Step 2: Send router information
      const routerRes = await fetch("http://127.0.0.1:5000/api/send_router_information", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify({
          ip_address: ipAddress,
          router: router,
        }),
      });

      const routerData = await routerRes.json();

      if (routerData.message === "Router info received") {
        localStorage.setItem("isFormSubmitted", "true");
        onFormSubmit(); // Trigger callback
      } else {
        alert("Failed to submit router information.");
      }

    } catch (error) {
      console.error("Error during login or submission:", error);
    }
  };

  // Handlers
  const handleIpChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    if (parts.length <= 4) {
      setIpAddress(parts.join(".").substring(0, 15));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="form-container p-4 bg-white rounded shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4 text-dark">Login & Router Info</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label text-dark">Username:</label>
            <input type="text" id="username" className="form-control" required
              value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label text-dark">Password:</label>
            <input type="password" id="password" className="form-control" required
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="mb-3">
            <label htmlFor="ip_address" className="form-label text-dark">IP Address:</label>
            <input type="text" id="ip_address" className="form-control" required
              value={ipAddress} onChange={handleIpChange} placeholder="000.000.000.000" />
          </div>

          <div className="mb-3">
            <label htmlFor="router" className="form-label text-dark">Choose a router:</label>
            <select id="router" className="form-select" value={router} onChange={(e) => setRouter(e.target.value)}>
              <option value="mango">Mango Router</option>
              <option value="gl i-net">Beryl Router</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default RouterInformation;
