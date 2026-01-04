import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Catalogue = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleBuy = (product) => {
        navigate('/order', { state: { product } });
    };

    return (
        <div>
            <h1 className="page-title">Fresh Vegetables & Fruits (Bulk)</h1>
            <div className="grid">
                {products.map((product) => (
                    <div key={product.id} className="card">
                        <img src={product.image || 'https://via.placeholder.com/300'} alt={product.name} className="card-img" />
                        <div className="card-body">
                            <h3 className="card-title">{product.name}</h3>
                            <p className="card-price">${product.price.toFixed(2)} / kg</p>
                            <button className="btn btn-primary btn-block" onClick={() => handleBuy(product)}>
                                Buy Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalogue;
