import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from './pages/Login'
import Signup from './pages/Signup'
import Vault from './pages/Vault'
import Home from './pages/Home';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to="/Login" />}/>
          <Route path='/Home' element={<Home />}/>
          <Route path='/Vault' element={<Vault />}/>
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
