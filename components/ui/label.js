import React from 'react';

const Label = React.forwardRef(({ className, htmlFor, ...props }, ref) => (
  <label
    ref={ref}
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`}
    {...props}
  />
));

Label.displayName = 'Label';

export { Label };