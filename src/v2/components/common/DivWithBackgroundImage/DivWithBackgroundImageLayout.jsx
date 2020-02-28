import React from 'react';

const DivWithBackgroundImageLayout = ({children, style, className}) => (
  <div
    style={style}
    {...(className ? { className } : {})}
  >
    {children}
  </div>
);

export default DivWithBackgroundImageLayout;
