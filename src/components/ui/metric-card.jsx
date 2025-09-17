import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  change,
  changeType = "neutral",
  color = "text-primary", 
  unit = "",
  delay = 0,
  className = ""
}) => {
  const changeColors = {
    positive: "text-emerald-400",
    negative: "text-red-400", 
    neutral: "text-slate-400"
  };

  const changeSymbol = changeType === "positive" ? "+" : changeType === "negative" ? "-" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      <Card className={cn(
        "border-none hover:border-primary/70 transition-all duration-300",
        "relative overflow-hidden group"
      )}>
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white group-hover:text-green-400 transition-colors">
            {title}
          </CardTitle>
          <motion.div
            initial={{ rotate: 0, scale: 1 }}
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {React.cloneElement(icon, { 
              className: `h-5 w-5 ${color} group-hover:text-primary transition-colors duration-300` 
            })}
          </motion.div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: delay + 0.2,
                ease: "easeOut"
              }}
              className={`text-3xl font-bold text-white group-hover:text-green-400 transition-colors duration-300`}
            >
              {value}{unit}
            </motion.div>
            
            {change && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: delay + 0.4 
                }}
                className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  changeColors[changeType]
                )}
              >
                <span>{changeSymbol}{change}%</span>
                <span className="text-slate-500">vs last period</span>
              </motion.div>
            )}
          </div>
        </CardContent>
        
        {/* Animated border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: delay + 0.6 }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent origin-center"
        />
      </Card>
    </motion.div>
  );
};

export default MetricCard;
