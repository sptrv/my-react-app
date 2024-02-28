import './App.css';
import { Routes, Route } from "react-router-dom";
import { Home } from './pages/Home'; 
import { Login } from './pages/Login'; 
import { Signup } from './pages/Signup'; 
import { AddOrder } from './pages/AddOrder'; 
import { MyOrders } from './pages/MyOrders'; 

function App() {
  return (
    <div className="App">
      <br></br>
      <main className="container main-container">
        <Routes>
          {/* Визначення шляхів маршрутизації */}
          <Route exact path="/" element={<Home />}/> 
          <Route path="/signup" element={<Signup />}/> 
          <Route path="/login" element={<Login />}/> 
          <Route path="/add-order" element={<AddOrder />}/> 
          <Route path="/orders" element={<MyOrders />}/> 
        </Routes>
      </main>
    </div>
  );
}

export default App;

