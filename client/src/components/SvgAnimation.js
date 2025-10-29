// Happy coding :D!
// Happy coding :D
import React from 'react';
import './SvgAnimation.css';

const SvgAnimation = () => {
  return (
    <div className="svg-background">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" 
                xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
            <defs>
                <linearGradient id="bg">
                    <stop offset="0%" style={{stopColor: 'rgba(130, 158, 249, 0.06)'}}></stop>
                    <stop offset="50%" style={{stopColor: 'rgba(76, 190, 255, 0.6)'}}></stop>
                    <stop offset="100%" style={{stopColor: 'rgba(115, 209, 72, 0.2)'}}></stop>
                </linearGradient>
                <path id="wave" fill="url(#bg)" d="M-363.852,502.589c0,0,236.988-41.997,505.475,0s371.981,38.998,575.971,0s293.985-39.278,505.474,5.859s493.475,48.368,716.963-4.995v560.106H-363.852V502.589z" />
            </defs>
            <g style={{ transform: 'scale(1.1)' }}>
                <use xlinkHref="#wave" opacity=".3"> 
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="translate"
                        dur="14s"
                        calcMode="spline"
                        values="-270 230; -330 380; -270 230"
                        keyTimes="0; .5; 1"
                        keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"
                        repeatCount="indefinite" />
                </use>
                <use xlinkHref="#wave" opacity=".6"> 
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="translate"
                        dur="11s"
                        calcMode="spline"
                        values="-370 250; -300 300; -370 250"
                        keyTimes="0; .6; 1"
                        keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"
                        repeatCount="indefinite" />
                </use>
                <use xlinkHref="#wave" opacty=".9"> 
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="translate"
                        dur="8s"
                        calcMode="spline"
                        values="-400 200; -360 300; -400 200"
                        keyTimes="0; .4; 1"
                        keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"
                        repeatCount="indefinite" />
                </use>
            </g>
        </svg>
    </div>
  );
};

export default SvgAnimation;
