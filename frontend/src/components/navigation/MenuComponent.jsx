import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MenuComponent = ({ name, path }) => {
  const location = useLocation();

  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`text-[15px] font-semibold px-3 py-2 rounded-md m-1
                ${isActive
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-600 hover:text-blue-500'}`}
    >
      {name}
    </Link>
  );
}

export default MenuComponent;