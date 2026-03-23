import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  href?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled = false,
  href,
  onClick,
  type = 'button',
}) => {
  const baseStyles = 'rounded-button font-semibold transition-all duration-300 ease-smooth flex items-center justify-center gap-2 cursor-pointer';

  const variants: Record<string, string> = {
    primary: 'bg-black text-white hover:bg-gray-800 shadow-button hover:shadow-lg',
    secondary: 'bg-gray-100 text-black hover:bg-gray-200',
    ghost: 'bg-transparent text-black hover:bg-gray-100',
    outlined: 'bg-transparent border-2 border-black text-black hover:bg-black hover:text-white',
  };

  const sizes: Record<string, string> = {
    sm: 'px-5 py-2 text-sm',
    md: 'px-7 py-3 text-base',
    lg: 'px-9 py-4 text-lg',
  };

  const classes = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </>
  );

  const motionProps = {
    whileHover: !disabled ? { scale: 1.02 } : {},
    whileTap: !disabled ? { scale: 0.98 } : {},
    transition: { duration: 0.15 },
  };

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        {...motionProps}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
};

export default Button;
