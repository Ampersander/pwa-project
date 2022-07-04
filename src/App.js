import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Reset from "./Components/Reset/Reset";
import Dashboard from "./Components/Dashboard/Dashboard";
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="app">
      <ToastContainer />
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;