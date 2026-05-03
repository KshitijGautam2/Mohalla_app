import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, Users, User } from 'lucide-react';

export default function Navbar({ active = 'home' }) {
  const navigate = useNavigate();

  const items = [
    { id: 'home', icon: Home, label: 'Home', path: '/home' },
    { id: 'communities', icon: Users, label: 'My Groups', path: '/communities' },
    { id: 'market', icon: ShoppingBag, label: 'Market', path: '/marketplace' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-8 py-3 flex justify-between items-center z-50 max-w-md mx-auto shadow-lg">
      {items.map(({ id, icon: Icon, label, path }) => (
        <button
          key={id}
          onClick={() => navigate(path)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            active === id ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Icon size={22} />
          <span className="text-xs">{label}</span>
        </button>
      ))}
    </div>
  );
}