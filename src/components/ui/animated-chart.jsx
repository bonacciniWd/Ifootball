import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const AnimatedChart = ({ 
  data = [], 
  className = "",
  height = 200,
  showGrid = true,
  animate = true 
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className={cn("relative w-full", className)} style={{ height }}>
      {/* Grid Background */}
      {showGrid && (
        <div 
          className="absolute inset-0 bg-grid-slate-700/20 dark:bg-grid-slate-300/20"
          style={{
            backgroundSize: '20px 20px',
            opacity: 0.5
          }}
        />
      )}
      
      {/* Chart Container */}
      <div className="relative h-full flex items-end justify-between px-4 py-2">
        {data.map((item, index) => {
          const heightPercentage = (item.value / maxValue) * 100;
          
          return (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              {/* Bar */}
              <motion.div
                initial={animate ? { height: 0 } : { height: `${heightPercentage}%` }}
                animate={{ height: `${heightPercentage}%` }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  ease: "easeOut" 
                }}
                className={cn(
                  "w-8 bg-gradient-to-t rounded-t-md relative overflow-hidden",
                  item.color || "from-primary/80 to-primary"
                )}
              >
                {/* Shimmer effect */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: index * 0.1,
                    ease: "linear"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              </motion.div>
              
              {/* Value */}
              <motion.span
                initial={animate ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1 + 0.3 
                }}
                className="text-xs font-medium text-slate-400"
              >
                {item.value}
              </motion.span>
              
              {/* Label */}
              <motion.span
                initial={animate ? { opacity: 0, y: 5 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1 + 0.4 
                }}
                className="text-xs text-slate-500 text-center max-w-12 truncate"
              >
                {item.label}
              </motion.span>
            </div>
          );
        })}
      </div>
      
      {/* Animated border */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50 origin-left"
      />
    </div>
  );
};

export default AnimatedChart;
