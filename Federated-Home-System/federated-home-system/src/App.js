// App.js
import React, {useState, useEffect}  from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './styles/styles.css'; // Import your custom CSS
import Navbar from './components/Navbar';
import SecurityCard from './components/SecurityCard';
import DeviceList from './components/DeviceList';
import TrafficMonitoring from './components/TrafficMonitoring';
import DevicesAtRisk from './components/BandwidthUsage';
import ConsoleOutput from './components/console';
import FetchDataButton from "./components/fetchData";
import SystemData from './components/systemData';
import RouterInformation from './components/RouterInformation';
import RouterDisplay from './components/RouterDisplay';


function App() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
    applyTheme(storedTheme);

    const storedStatus = localStorage.getItem("isFormSubmitted");
    if (storedStatus === "true") {
      setFormSubmitted(true);
      }
    }, []);

    const applyTheme = (mode) => {
      document.body.classList.remove('bg-light', 'bg-dark', 'text-light', 'text-dark');
      document.body.classList.add(`bg-${mode}`);
      document.body.classList.add(mode === 'dark' ? 'text-light' : 'text-dark');
    };
  
    const toggleTheme = (mode) => {
      setTheme(mode);
      localStorage.setItem('theme', mode);
      applyTheme(mode);
    };

  return (

    !formSubmitted ? 
      (
        <div>
          <RouterInformation onFormSubmit = {() => setFormSubmitted(true)}/>
        </div>
      ) : (

      <div>
      <Navbar toggleTheme = {toggleTheme} theme={theme}/>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <h3 className="mb-4">🛡️ Network & Device Security</h3>
            <SecurityCard theme={theme}/>
            <DevicesAtRisk theme = {theme}/>
          </div>
          <div className="col-md-8">
            <TrafficMonitoring theme={theme}/>
          </div>
          <div>
            <DeviceList theme={theme}/> 
            <RouterDisplay theme={theme}/>
          </div>
          <h3 className='mt-4 mb-3'>🖳 System Console</h3>
            <ConsoleOutput  theme={theme}/>
          <SystemData theme={theme}/>
        </div>
      </div>
      </div>
      )

  );
}

export default App;