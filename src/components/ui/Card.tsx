import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.19, 1, 0.22, 1],
      }}
      whileHover={hover ? { y: -5 } : {}}
      className={`
        bg-white rounded-card p-8 shadow-card
        ${hover ? 'hover:shadow-card-hover transition-shadow duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;
