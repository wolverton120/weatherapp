import React from 'react';
import { useUnitContext } from './useunitconversion';

const UnitToggle = React.memo(() => {
  const { unit, setUnit } = useUnitContext();

  return (
    <div className="unit-toggle mb-6">
      <div
        className={`unit-option ${unit === "C" ? "unit-active" : ""}`}
        onClick={() => setUnit("C")}
      >
        °C
      </div>
      <div
        className={`unit-option ${unit === "F" ? "unit-active" : ""}`}
        onClick={() => setUnit("F")}
      >
        °F
      </div>
    </div>
  );
});

export default UnitToggle;