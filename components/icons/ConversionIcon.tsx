import React from 'react';

const ConversionIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l.383-1.437M7.5 14.25V5.25A2.25 2.25 0 0 1 9.75 3h4.5A2.25 2.25 0 0 1 16.5 5.25v9M7.5 14.25h-1.138A2.25 2.25 0 0 0 4.11 15.935L3 18m18-3-1.138-2.065A2.25 2.25 0 0 0 18.638 12H16.5" />
  </svg>
);

export default ConversionIcon;
