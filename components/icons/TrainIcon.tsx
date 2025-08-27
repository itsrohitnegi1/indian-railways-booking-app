
import React from 'react';

export const TrainIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M21 13c0 -3.87 -3.37 -7 -7.5 -7h-6.5a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10l5 -5z" />
    <path d="M5 18l0 .01" />
    <path d="M19 18l0 .01" />
    <path d="M8 12l0 4" />
    <path d="M11 12l0 4" />
    <path d="M14 12l0 4" />
    <path d="M3 13h1" />
  </svg>
);
