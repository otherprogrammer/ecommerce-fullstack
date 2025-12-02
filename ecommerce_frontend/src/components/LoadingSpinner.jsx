import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Cargando...' }) => {
    const sizeClasses = {
        small: 'w-6 h-6',
        medium: 'w-10 h-10',
        large: 'w-16 h-16'
    };

    return (
        <div className="flex flex-col justify-center items-center py-12">
            <div className="relative">
                {/* Outer ring */}
                <div className={`${sizeClasses[size]} border-4 border-light-background rounded-full animate-pulse`}></div>
                {/* Spinning ring */}
                <div className={`${sizeClasses[size]} border-4 border-transparent border-t-primary-blue rounded-full animate-spin absolute top-0 left-0`}></div>
            </div>
            {text && (
                <p className="mt-4 text-medium-text-gray font-medium animate-pulse">{text}</p>
            )}
        </div>
    );
};

export default LoadingSpinner;
