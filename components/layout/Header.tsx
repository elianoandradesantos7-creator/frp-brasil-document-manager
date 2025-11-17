
import React, { useState } from 'react';
import { User } from '../../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b md:px-6 border-frp-cinza">
      <div className="flex items-center">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="search"
            placeholder="Busca avançada..."
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-full md:w-64 lg:w-96 bg-frp-cinza-light border-frp-cinza focus:outline-none focus:ring-2 focus:ring-frp-brasil"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-frp-brasil">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </button>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="hidden text-right md:block">
              <div className="font-semibold">{user.name}</div>
              <div className="text-xs text-gray-500">{user.role}</div>
            </div>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 w-48 mt-2 overflow-hidden bg-white rounded-md shadow-lg">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meu Perfil</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Configurações</a>
              <button onClick={onLogout} className="block w-full px-4 py-2 text-sm text-left text-red-700 hover:bg-red-50">Sair</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;