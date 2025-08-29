// src/components/Button.jsx
import React from 'react';

function Button({ children, onClick, type = 'button', disabled = false, fullWidth = false, color = 'bg-indigo-600 hover:bg-indigo-700', size = 'medium' }) {
    const sizeClasses = {
        small: 'px-3 py-1 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                flex justify-center items-center
                border border-transparent rounded-md shadow-sm
                font-medium text-white
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${color}
                ${fullWidth ? 'w-full' : ''}
                ${sizeClasses[size]}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'transition duration-150 ease-in-out'}
            `}
        >
            {children}
        </button>
    );
}

export default Button;