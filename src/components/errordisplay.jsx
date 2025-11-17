import React from 'react';

const ErrorDisplay = React.memo(({ error }) => {
  if (!error) return null;
  
  return (
    <p className="text-center font-semibold mb-5">
      {error}
    </p>
  );
});

export default ErrorDisplay;