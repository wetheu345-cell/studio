
import type { SVGProps } from 'react';
// This component is no longer used for the main logo but is kept for potential future use.
export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="120"
      height="40"
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
        <text x="10" y="30" fontFamily="Belleza, sans-serif" fontSize="30" fill="currentColor">
            EHW
        </text>
    </svg>
  );
}
