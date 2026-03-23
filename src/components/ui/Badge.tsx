import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const variants: Record<string, string> = {
    primary: 'bg-gray-100 text-black',
    secondary: 'bg-black/5 text-black',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
  };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
