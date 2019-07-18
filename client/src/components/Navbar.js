import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = function() {
    return (
        <div className="nav">
            <NavLink to = '/'>Home</NavLink>
            <NavLink to = '/news'>News</NavLink>
        </div>
    )
}

export default Navbar;