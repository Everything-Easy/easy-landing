import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
}

const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 15,
  scale = 1.02,
  glare = true,
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (-mouseY / (rect.height / 2)) * maxTilt;
    const rotateY = (mouseX / (rect.width / 2)) * maxTilt;

    setRotate({ x: rotateX, y: rotateY });

    // Glare position
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlarePosition({ x: 50, y: 50 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
        scale: isHovered ? scale : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="relative w-full h-full preserve-3d">
        {children}

        {/* Glare effect */}
        {glare && isHovered && (
          <div
            className="absolute inset-0 pointer-events-none rounded-card overflow-hidden"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
              transform: 'translateZ(1px)',
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default TiltCard;
