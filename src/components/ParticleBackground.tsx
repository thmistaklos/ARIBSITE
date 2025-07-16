import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  size: number; // in px
  color: string; // rgba string
  left: string; // vw
  top: string; // vh
  animationDelay: string; // s
  animationDuration: string; // s
}

const ParticleBackground: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const numParticles = 30; // As per original request

      for (let i = 0; i < numParticles; i++) {
        const size = Math.floor(Math.random() * 96) + 5; // 5px to 100px
        const opacity = Math.random() * 0.5 + 0.2; // 0.2 to 0.7
        const color = `rgba(255, 255, 255, ${opacity})`; // White particles with varying opacity
        const left = `${Math.random() * 100}vw`;
        const top = `${Math.random() * 100}vh`;
        const animationDelay = `-${Math.random() * 10}s`; // Random delay up to 10s
        const animationDuration = `${Math.random() * 10 + 5}s`; // Random duration 5s to 15s

        newParticles.push({
          id: i,
          size,
          color,
          left,
          top,
          animationDelay,
          animationDuration,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            left: p.left,
            top: p.top,
            animation: `particle-float ${p.animationDuration} ease-in-out infinite, fade-in-out ${p.animationDuration} ease-in-out infinite`,
            animationDelay: p.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;