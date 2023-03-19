import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className='navbar'>
            <Link to='/'>Group Chat</Link>
        </div>
    );
};

export default Navbar;