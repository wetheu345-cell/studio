import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="60" cy="60" r="58" stroke="currentColor" strokeWidth="3" />
      <path
        d="M60.12,39.2c-1.38-0.96-3.83-2.1-5.83-2.1c-2.31,0-4.63,1.07-5.7,3.31c-0.64,1.33,0.04,2.83,1.3,3.76 c1.18,0.88,3.2,2.05,5.13,2.05c2.42,0,5.2-1.3,6.4-3.56C62.58,40.9,61.9,39.9,60.12,39.2z"
        fill="currentColor"
      />
      <path
        d="M71.5,23.16c0,0-7.39,2.44-12.33,12.33c-3.73,7.47-3.41,10.7,0.24,14.35c2.93,2.93,6.38,2.7,11.08-1.16 C74.2,45.23,79.5,39,79.5,39"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        id="circlePath"
        d="M 20,60 A 40,40 0 1,1 100,60 A 40,40 0 1,1 20,60"
        fill="transparent"
      />
      <text
        fill="currentColor"
        style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: '15px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        <textPath href="#circlePath">
          <tspan dx="5">★</tspan>
          <tspan dx="5">E B O N Y</tspan>
          <tspan dx="10">★</tspan>
          <tspan dx="5">H O R S E W O M E N ,</tspan>
          <tspan dx="10">I N C .</tspan>
        </textPath>
      </text>
      <path
        d="M89.3,58.5c0,0-1.88-9.04-4.12-12.04c-2.25-3-5.25-3.38-5.25-3.38s-2.62,0.38-4.5,2.62 c-1.88,2.25-1.5,4.5-1.5,4.5s0,2.62,1.88,4.12c1.88,1.5,4.12,1.5,4.12,1.5s7.12-1.88,9.38-4.5S89.3,58.5,89.3,58.5z M79.1,49.2 c1.12-1.5,2.62-2.25,4.12-1.88c1.5,0.38,2.62,1.5,3.38,3c0.75,1.5,0.75,3,0.38,4.5c-0.38,1.5-1.5,2.62-3,3.38 c-1.5,0.75-3,0.75-4.5,0.38c-1.5-0.38-2.62-1.5-3.38-3C75.4,54,75.4,52.5,76.1,51C76.9,49.5,78,49.5,79.1,49.2z"
        fill="currentColor"
      />
      <path
        d="M84,65.88c-16.5-3.38-30.38-12-30.38-12s-3,10.12-3,16.12c0,6,2.25,12.75,12.38,18.38 c7.37,4.1,17.25-2.25,23.25-3.75C92.25,83.13,85.12,71.25,84,65.88z"
        fill="currentColor"
      />
      <path
        d="M45.03,81.38c0,0-0.37-6.37,3.38-9.75c3.75-3.38,8.62-3.38,8.62-3.38v-5.25c0,0-7.13,0-12.38,5.25 c-5.25,5.25-5.62,13.12-5.62,13.12s1.88,9,9,12.38c7.12,3.38,13.12-0.38,13.12-0.38s-10.12-5.25-10.5-14.25 C50.78,79.13,46.15,80.63,45.03,81.38z"
        fill="currentColor"
      />
    </svg>
  );
}
