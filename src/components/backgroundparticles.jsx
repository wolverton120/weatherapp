import React from 'react';

const BackgroundParticles = React.memo(() => {
  return (
    <div className="particles-container">
      {[...Array(20)].map((_, i) => (
        <div key={i} className={`particle particle-${i + 1}`}></div>
      ))}
    </div>
  );
});

export default BackgroundParticles;