import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedGradientProps {
  className?: string;
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Blob 1 */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-black/5 blur-[100px]"
        style={{ top: '-20%', right: '-10%' }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Blob 2 */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-gray-400/10 blur-[100px]"
        style={{ bottom: '-10%', left: '-5%' }}
        animate={{
          x: [0, -30, 0],
          y: [0, -40, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Blob 3 */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-gray-600/8 blur-[80px]"
        style={{ top: '40%', left: '30%' }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </div>
  );
};

export default AnimatedGradient;
