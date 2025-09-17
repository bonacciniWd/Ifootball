import React from 'react';
import { motion } from 'framer-motion';

const ToggleSwitch = ({ isChecked, onChange, leftLabel, rightLabel }) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {/* Left Label */}
      <span className={`text-sm font-medium ${isChecked ? 'text-muted-foreground' : 'text-foreground'}`}>
        {leftLabel}
      </span>
      
      {/* Toggle Button */}
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={() => onChange(!isChecked)}
        className={`
          relative inline-flex h-8 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
          ${isChecked ? 'bg-primary' : 'bg-input'}
        `}
      >
        <span className="sr-only">{isChecked ? rightLabel : leftLabel}</span>
        <motion.span
          layout
          className={`
            pointer-events-none inline-block h-7 w-7 transform rounded-full bg-background shadow-lg
            ring-0 transition duration-200 ease-in-out
          `}
          animate={{
            x: isChecked ? 32 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      </button>
      
      {/* Right Label */}
      <span className={`text-sm font-medium ${isChecked ? 'text-foreground' : 'text-muted-foreground'}`}>
        {rightLabel}
      </span>
    </div>
  );
};

export default ToggleSwitch;
