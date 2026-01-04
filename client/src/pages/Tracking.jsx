import React, { useState } from 'react';
import api from '../api';

const Tracking = () => {
    const [searchId, setSearchId] = useState('');
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        setError('');
        setOrder(null);

        try {
            const response = await api.get(`/orders/${searchId}`);
            if (response.data.data) {
                setOrder(response.data.data);
            } else {
                setError('Order not found');
            }
        } catch (err) {
            setError('Error fetching order');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 className="page-title">Track Your Order</h1>
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleTrack} style={{ marginBottom: '20px' }}>
                        <div className="form-group">
                            <label className="form-label">Enter Order ID</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn btn-primary">Track</button>
                            </div>
                        </div>
                    </form>

                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                    {order && (
                        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            <h3 style={{ marginBottom: '15px' }}>Order Details</h3>
                            <p><strong>Order ID:</strong> {order.id}</p>
                            <p><strong>Item:</strong> {order.product_name}</p>
                            <p><strong>Quantity:</strong> {order.quantity}</p>
                            <p><strong>Status:</strong> <span className={`status-badge status-${order.status}`}>{order.status}</span></p>
                            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tracking;
