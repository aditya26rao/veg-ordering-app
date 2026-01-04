import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';

const OrderForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const preSelectedProduct = location.state?.product;

    const [formData, setFormData] = useState({
        buyer_name: '',
        address: '',
        product_name: preSelectedProduct?.name || '',
        quantity: 1
    });
    const [orderId, setOrderId] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/orders', formData);
            setOrderId(response.data.orderId);
        } catch (err) {
            setError('Failed to place order. Please try again.');
        }
    };

    if (orderId) {
        return (
            <div className="card" style={{ maxWidth: '600px', margin: '50px auto' }}>
                <div className="card-body" style={{ textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--success)' }}>Order Placed Successfully!</h2>
                    <p>Your Order ID is: <strong>{orderId}</strong></p>
                    <p>Please save this ID to track your order.</p>
                    <div style={{ marginTop: '20px' }}>
                        <button className="btn btn-primary" onClick={() => navigate('/track')}>Track Order</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 className="page-title">Place Bulk Order</h1>
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

                        <div className="form-group">
                            <label className="form-label">Buyer Name</label>
                            <input
                                type="text"
                                name="buyer_name"
                                className="form-control"
                                value={formData.buyer_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Delivery Address</label>
                            <textarea
                                name="address"
                                className="form-control"
                                rows="3"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Product Name</label>
                            <input
                                type="text"
                                name="product_name"
                                className="form-control"
                                value={formData.product_name}
                                onChange={handleChange}
                                required
                                readOnly={!!preSelectedProduct} // Read-only if passed from catalogue
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Quantity (kg/units)</label>
                            <input
                                type="number"
                                name="quantity"
                                className="form-control"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">Confirm Order</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
