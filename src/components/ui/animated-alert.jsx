"use client";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CircleDollarSign, AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown } from "lucide-react";

const AnimatedAlert = ({ 
  title, 
  description, 
  value, 
  type = "info", 
  className = "",
  delay = 0 
}) => {  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-card",
      ringColor: "ring-primary/20",
      textColor: "text-foreground",
      valueColor: "text-primary",
      descColor: "text-muted-foreground",
      borderColor: "border-primary/30",
      iconColor: "text-primary",
      valueBg: "bg-primary/10",
      blurBg: "bg-primary/10"
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-card",
      ringColor: "ring-accent/20",
      textColor: "text-foreground",
      valueColor: "text-accent-foreground",
      descColor: "text-muted-foreground",
      borderColor: "border-accent/30",
      iconColor: "text-accent",
      valueBg: "bg-accent/10",
      blurBg: "bg-accent/10"
    },
    error: {
      icon: TrendingDown,
      bgColor: "bg-card",
      ringColor: "ring-destructive/20",
      textColor: "text-foreground",
      valueColor: "text-destructive",
      descColor: "text-muted-foreground",
      borderColor: "border-destructive/30",
      iconColor: "text-destructive",
      valueBg: "bg-destructive/10",
      blurBg: "bg-destructive/10"
    },
    info: {
      icon: Info,
      bgColor: "bg-card",
      ringColor: "ring-secondary/20",
      textColor: "text-foreground",
      valueColor: "text-secondary",
      descColor: "text-muted-foreground",
      borderColor: "border-secondary/30",
      iconColor: "text-secondary",
      valueBg: "bg-secondary/10",
      blurBg: "bg-secondary/10"
    },
    trending: {
      icon: TrendingUp,
      bgColor: "bg-card",
      ringColor: "ring-accent/20",
      textColor: "text-foreground",
      valueColor: "text-accent-foreground",
      descColor: "text-muted-foreground",
      borderColor: "border-accent/30",
      iconColor: "text-accent",
      valueBg: "bg-accent/10",
      blurBg: "bg-accent/10"
    }
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn("w-full", className)}
    >      <Alert
        className={cn(
          "relative overflow-hidden",
          "bg-card border-border",
          "shadow-sm",
          "p-4 rounded-xl",
        )}
      >
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.1 }}
            className="flex-shrink-0"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full",
                config.bgColor,
                "flex items-center justify-center",
                config.ringColor,
                "ring-8"
              )}
            >
              <IconComponent className={cn("h-5 w-5", config.iconColor)} />
            </div>
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.2 }}
              className="space-y-1"
            >
              <div className="flex items-center gap-2">
                <h3 className={cn("text-base font-medium", config.textColor)}>
                  {title}
                </h3>
                {value && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-md text-xs font-medium",
                    config.valueBg,
                    config.valueColor
                  )}>
                    {value}
                  </span>
                )}
              </div>
              <p className={cn("text-sm", config.descColor)}>
                {description}
              </p>
            </motion.div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className={cn(
            "absolute -left-2 -top-2 w-24 h-24 rounded-full blur-2xl opacity-50",
            config.blurBg
          )} />
          <div className={cn(
            "absolute -right-2 -bottom-2 w-24 h-24 rounded-full blur-2xl opacity-50",
            config.blurBg
          )} />
        </div>
      </Alert>
    </motion.div>
  );
};

export default AnimatedAlert;
