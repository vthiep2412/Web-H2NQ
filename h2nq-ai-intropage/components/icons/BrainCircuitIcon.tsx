import React from 'react';

const BrainCircuitIcon: React.FC = () => (
    <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-48 md:w-64 md:h-64 text-slate-300 dark:text-slate-600">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#379eff', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#379eff', stopOpacity: 0.2 }} />
            </linearGradient>
        </defs>
        <path d="M128 28C91.68 28 62 51.2 56.4 84H48C39.2 84 32 91.2 32 100V156C32 164.8 39.2 172 48 172H56.4C62 204.8 91.68 228 128 228C164.32 228 194 204.8 199.6 172H208C216.8 172 224 164.8 224 156V100C224 91.2 216.8 84 208 84H199.6C194 51.2 164.32 28 128 28Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M128 188C159.92 188 186 161.92 186 128C186 94.08 159.92 68 128 68C96.08 68 70 94.08 70 128C70 161.92 96.08 188 128 188Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 8" />
        <circle cx="128" cy="128" r="8" fill="url(#grad1)" />
        <circle cx="128" cy="80" r="6" fill="#379eff" />
        <circle cx="128" cy="176" r="6" fill="#379eff" />
        <circle cx="88" cy="104" r="6" fill="#379eff" />
        <circle cx="168" cy="152" r="6" fill="#379eff" />
        <circle cx="168" cy="104" r="6" fill="#379eff" />
        <circle cx="88" cy="152" r="6" fill="#379eff" />
        <path d="M128 120V86" stroke="#379eff" strokeWidth="2" strokeLinecap="round" />
        <path d="M128 136V170" stroke="#379eff" strokeWidth="2" strokeLinecap="round" />
        <path d="M120 128H94" stroke="#379eff" strokeWidth="2" strokeLinecap="round" />
        <path d="M136 128L162 128" stroke="#379eff" strokeWidth="2" strokeLinecap="round" />
        <path d="M109.25 146.75L94 158" stroke="#379eff" strokeWidth="2" strokeLinecap="round" />
        <path d="M146.75 109.25L158 94" stroke="#379eff" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export default BrainCircuitIcon;