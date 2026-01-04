import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/admin/orders');
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/admin/orders/${id}`, { status });
            fetchOrders(); // Refresh list
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div>
            <h1 className="page-title">Admin Dashboard - Orders</h1>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Buyer</th>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.buyer_name}</td>
                                <td>{order.product_name}</td>
                                <td>{order.quantity}</td>
                                <td>{order.address}</td>
                                <td>
                                    <span className={`status-badge status-${order.status}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    {order.status === 'Pending' && (
                                        <button
                                            className="btn btn-primary"
                                            style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                                            onClick={() => updateStatus(order.id, 'Delivered')}
                                        >
                                            Mark Delivered
                                        </button>
                                    )}
                                    {order.status === 'Delivered' && (
                                        <span style={{ color: 'gray', fontSize: '0.9rem' }}>Completed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
