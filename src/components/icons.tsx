import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="160" height="40" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M26.9782 13.9C27.6782 11.2 28.3782 8.7 29.3782 6.4C29.6782 5.7 30.0782 5.1 30.6782 4.6C31.2782 4.1 32.0782 3.8 32.8782 3.8C33.1782 3.8 33.5782 3.9 33.8782 4C34.2782 4.1 35.1782 4.5 35.1782 4.5L34.5782 7.5C34.5782 7.5 33.8782 7.2 33.4782 7.1C32.7782 6.9 32.2782 7.1 31.9782 7.6C31.5782 8.3 31.0782 9.8 30.5782 11.7L29.7782 15.1H35.8782V17.9H29.0782L25.9782 30.3L22.9782 29.3L26.3782 15.1H20.4782V12.1H26.5782L26.9782 13.9Z" fill="currentColor"/>
      <text x="45" y="28" fontFamily="Belleza, sans-serif" fontSize="24" fill="currentColor">EHW Lessons</text>
    </svg>
  );
}
