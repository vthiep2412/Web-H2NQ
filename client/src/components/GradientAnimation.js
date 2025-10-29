// Happy coding :D
import React from 'react';
import './GradientAnimation.css';

const hexToRgba = (hex, alpha) => {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    return hex; // Return original if not a valid hex
  }
  let c = hex.substring(1).split('');
  if (c.length === 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  c = '0x' + c.join('');
  return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${alpha})`;
};

const GradientAnimation = ({
  primaryColor,
  gradientColor1,
  gradientColor2,
  isGradientColor1Enabled,
  isGradientColor2Enabled,
  isAnimated,
  direction
}) => {

  const getGradientStyle = () => {
    const colors = [];
    const gentleOpacity = 0.15; // Low opacity for a "gentle" effect

    if (isGradientColor1Enabled) colors.push(hexToRgba(gradientColor1, gentleOpacity));
    if (isGradientColor2Enabled) colors.push(hexToRgba(gradientColor2, gentleOpacity));

    let gradientString;
    if (colors.length === 2) {
      gradientString = `linear-gradient(${direction}, ${colors[0]} 0%, ${colors[1]} 50%, ${primaryColor} 100%)`;
    } else if (colors.length === 1) {
      gradientString = `linear-gradient(${direction}, ${colors[0]} 0%, ${primaryColor} 100%)`;
    } else {
      gradientString = `transparent`;
    }

    return {
      background: gradientString,
      '--gradient-direction': direction, // Keep for potential other uses or debugging
      '--color-primary': primaryColor,
      '--color-grad-1': isGradientColor1Enabled ? colors[0] : primaryColor,
      '--color-grad-2': isGradientColor2Enabled ? colors[1] : (isGradientColor1Enabled ? colors[0] : primaryColor),
    };
  };

  // Determine the correct class based on which colors are enabled
  const classNames = [
    'gradient-background',
    isAnimated ? 'animated' : '',
    isGradientColor1Enabled && isGradientColor2Enabled ? 'three-colors' : '',
    (isGradientColor1Enabled && !isGradientColor2Enabled) || (!isGradientColor1Enabled && isGradientColor2Enabled) ? 'two-colors' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} style={getGradientStyle()}></div>
  );
};

export default GradientAnimation;