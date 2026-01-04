import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, User } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    FreshBulk
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">
                        <ShoppingBag size={20} style={{ marginRight: '5px', verticalAlign: 'bottom' }} />
                        Catalogue
                    </Link>
                    <Link to="/track" className="nav-link">
                        <Truck size={20} style={{ marginRight: '5px', verticalAlign: 'bottom' }} />
                        Track Order
                    </Link>
                    <Link to="/admin" className="nav-link">
                        <User size={20} style={{ marginRight: '5px', verticalAlign: 'bottom' }} />
                        Admin
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
