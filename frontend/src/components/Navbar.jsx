import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, Users, Briefcase } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-800 text-white shadow-md px-6 py-4 flex items-center justify-around">
      {/* Project Title */}
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-wide">
        <Briefcase className="w-7 h-7 text-yellow-300" />
        <span>
          AI <span className="text-yellow-300">HireEase</span>
        </span>
      </Link>
      <div></div>
      {/* User Details OR Sign In/Up Buttons */}
      {user ? (
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-gray-200">{user.email}</p>
          </div>
          <img
            src={user.avatar || "https://i.pravatar.cc/40"}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-yellow-300"
          />
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-white hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-all duration-200 bg-transparent"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link to="/signin">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-4 py-2 rounded-lg font-medium">
              Sign In
            </button>
          </Link>
          <Link to="/signup">
            <button className="bg-white hover:bg-gray-100 text-blue-900 px-4 py-2 rounded-lg font-medium">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;