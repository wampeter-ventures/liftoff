import React from 'react';

const DrawerContext = React.createContext();

const Drawer = ({ open, onOpenChange, children }) => {
  return (
    <DrawerContext.Provider value={{ open, onOpenChange }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => onOpenChange(false)}
        />
      )}
    </DrawerContext.Provider>
  );
};

const DrawerContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open } = React.useContext(DrawerContext);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex h-auto flex-col rounded-t-[10px] border bg-background max-h-[90vh]">
      <div
        ref={ref}
        className={`mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted ${className || ''}`}
        {...props}
      />
      <div className="flex flex-col overflow-hidden rounded-t-[10px] bg-background flex-1">
        {children}
      </div>
    </div>
  );
});

const DrawerHeader = ({ className, ...props }) => (
  <div className={`grid gap-1.5 p-4 text-center sm:text-left ${className || ''}`} {...props} />
);

const DrawerFooter = ({ className, ...props }) => (
  <div className={`mt-auto flex flex-col gap-2 p-4 ${className || ''}`} {...props} />
);

const DrawerTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h2
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className || ''}`}
    {...props}
  >
    {children || <span aria-hidden="true"></span>}
  </h2>
));

const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-muted-foreground ${className || ''}`}
    {...props}
  />
));

const DrawerClose = React.forwardRef(({ className, children, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DrawerContext);

  return React.cloneElement(children, {
    ref,
    onClick: () => onOpenChange(false),
    ...props
  });
});

DrawerContent.displayName = 'DrawerContent';
DrawerTitle.displayName = 'DrawerTitle';
DrawerDescription.displayName = 'DrawerDescription';
DrawerClose.displayName = 'DrawerClose';

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
};