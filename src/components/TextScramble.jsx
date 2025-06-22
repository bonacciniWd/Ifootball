import React, { useEffect, useState } from 'react';

const TextScramble = ({ texts, className = "", duration = 4000, scrambleDuration = 1500 }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isScrambling, setIsScrambling] = useState(false);
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  const techChars = '█▉▊▋▌▍▎▏▐░▒▓';
  useEffect(() => {
    if (texts.length === 0) return;
    
    // Initialize with first text
    setDisplayText(texts[0]);
    
    // Start the cycling
    const cycleInterval = setInterval(() => {
      scrambleToNextText();
    }, duration);

    return () => clearInterval(cycleInterval);
  }, [texts, duration]); // Removendo currentTextIndex daqui para evitar loop

  useEffect(() => {
    // Separate effect for cycling through texts
    if (texts.length <= 1) return;
    
    const cycleTimeout = setTimeout(() => {
      if (!isScrambling) {
        scrambleToNextText();
      }
    }, duration);

    return () => clearTimeout(cycleTimeout);
  }, [currentTextIndex, isScrambling, duration]);

  const scrambleToNextText = () => {
    if (isScrambling) return;
    
    setIsScrambling(true);
    const nextIndex = (currentTextIndex + 1) % texts.length;
    const targetText = texts[nextIndex];
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / scrambleDuration, 1);
      
      if (progress < 1) {
        let result = '';
        
        for (let i = 0; i < targetText.length; i++) {
          const charProgress = Math.max(0, Math.min(1, (progress * 2) - (i / targetText.length)));
          
          if (charProgress >= 0.8) {
            result += targetText[i];
          } else if (charProgress > 0.2) {
            // Character is transitioning
            if (Math.random() > charProgress) {
              result += techChars[Math.floor(Math.random() * techChars.length)];
            } else {
              result += targetText[i];
            }
          } else {
            // Still scrambling
            result += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        
        setDisplayText(result);
        requestAnimationFrame(animate);
      } else {
        // Animation complete
        setDisplayText(targetText);
        setCurrentTextIndex(nextIndex);
        setIsScrambling(false);
      }
    };
    
    requestAnimationFrame(animate);
  };

  if (!texts.length) return null;

  return (
    <span 
      className={`font-mono inline-block transition-all duration-100 ${className}`}
      style={{ 
        letterSpacing: '0.05em',
        textShadow: '0 0 10px rgba(255,255,255,0.6',
        minWidth: '600px', // Prevent layout shift
        textAlign: 'center'
      }}
    >
      {displayText || texts[0]}
    </span>
  );
};

export default TextScramble;
