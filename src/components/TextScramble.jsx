import React, { useEffect, useState } from 'react';

const TextScramble = ({ texts, className = "", duration = 4000, scrambleDuration = 1500 }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isScrambling, setIsScrambling] = useState(false);
  
  const chars = 'Technologic Dispposing';
  const techChars = '0101001010001001010101';

  const longestTextLength = Math.max(...texts.map(text => text.length));
  const calculatedMinWidth = `${longestTextLength * 1.2}ch`; // Estimate 1.2ch per character

  useEffect(() => {
    if (texts.length === 0) return;
    
    // Initialize with first text
    setDisplayText(texts[currentTextIndex]);
    
    // Start the cycling
    const cycleInterval = setInterval(() => {
      scrambleToNextText();
    }, duration);

    return () => clearInterval(cycleInterval);
  }, [texts, duration, currentTextIndex]); // Adicionando currentTextIndex aqui para garantir que o efeito reaja às mudanças
  
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
      className={`font-mono inline-block transition-all duration-300 ${className}`}
      style={{ 
        letterSpacing: '0.05em',
        minWidth: calculatedMinWidth, 
        textAlign: 'center'
      }}
    >
      {displayText || texts[0]}
    </span>
  );
};

export default TextScramble;
