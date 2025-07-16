import React from 'react';

const StarfallBackground: React.FC = () => {
  const stars = Array.from({ length: 40 }, (_, i) => (
    <div key={i} className="falling-star"></div>
  ));

  return (
    <div className="starfall">
      {stars}
    </div>
  );
};

export default StarfallBackground;