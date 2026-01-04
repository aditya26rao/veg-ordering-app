import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Catalogue from './pages/Catalogue';
import OrderForm from './pages/OrderForm';
import Tracking from './pages/Tracking';
import AdminOrders from './pages/AdminOrders';

function App() {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Catalogue />} />
                        <Route path="/order" element={<OrderForm />} />
                        <Route path="/track" element={<Tracking />} />
                        <Route path="/admin" element={<AdminOrders />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
