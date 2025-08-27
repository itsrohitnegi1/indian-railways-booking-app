
import React from 'react';
import { TrainIcon } from './icons/TrainIcon';
import { UserIcon } from './icons/UserIcon';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onNavigate: (page: 'home' | 'dashboard') => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onNavigate, onLoginClick, onLogoutClick }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <TrainIcon className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-800">
              RailConnect <span className="text-blue-600">AI</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Dashboard
                </button>
                <div className="flex items-center space-x-2">
                    <UserIcon className="h-6 w-6 text-gray-700"/>
                    <span className="font-medium text-gray-700 hidden sm:block">{user.name}</span>
                </div>
                <button
                  onClick={onLogoutClick}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login / Signup
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
