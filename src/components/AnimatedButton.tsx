import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { useSound } from '@/hooks/use-sound';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  soundOnClick?: string; // Path to click sound file
  soundOnHover?: string; // Path to hover sound file
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  soundOnClick,
  soundOnHover,
  className, // Destructure className here
  ...props
}) => {
  const { play: playClickSound } = useSound(soundOnClick || '/sounds/click.mp3', { volume: 0.5 });
  const { play: playHoverSound } = useSound(soundOnHover || '/sounds/hover.mp3', { volume: 0.3 });

  const handleClick = () => {
    if (soundOnClick) {
      playClickSound();
    }
    onClick?.();
  };

  const handleMouseEnter = () => {
    if (soundOnHover) {
      playHoverSound();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={handleMouseEnter}
      className="inline-block" // Keep this for the motion.div wrapper
    >
      <Button onClick={handleClick} className={className} {...props}> {/* Pass className to Button */}
        {children}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;