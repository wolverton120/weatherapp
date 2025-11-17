import React from 'react';
import { useDateTime } from './usedatetime';

const Header = React.memo(() => {
  const dateTime = useDateTime();

  return (
    <>
      <h1 className="text-5xl font-extrabold text-center mb-2">
        <span className="text-neonPink">Weather</span> Dashboard
      </h1>

      <p className="text-center opacity-80 text-lg -mt-1 mb-6">
        {dateTime}
      </p>
    </>
  );
});

export default Header;