import React from 'react';
import './AnimatedGradient.css';

const AnimatedGradient = ({
  primaryColor,
  gradientColor1,
  gradientColor2,
  isGradientColor1Enabled,
  isGradientColor2Enabled,
  isAnimated,
  direction = '135deg'
}) => {

  // Set CSS variables for the gradient colors
  const style = {
    '--color-primary': primaryColor,
    '--color-grad-1': isGradientColor1Enabled ? gradientColor1 : primaryColor,
    '--color-grad-2': isGradientColor2Enabled ? gradientColor2 : (isGradientColor1Enabled ? gradientColor1 : primaryColor),
    '--gradient-direction': direction,
  };

  // Determine the correct class based on which colors are enabled
  const classNames = [
    'gradient-background',
    isAnimated ? 'animated' : '',
    isGradientColor1Enabled && isGradientColor2Enabled ? 'three-colors' : '',
    (isGradientColor1Enabled && !isGradientColor2Enabled) || (!isGradientColor1Enabled && isGradientColor2Enabled) ? 'two-colors' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} style={style}></div>
  );
};

export default AnimatedGradient;
