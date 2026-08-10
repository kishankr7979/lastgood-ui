import React from "react";

export const PageContainer = ({
  children,
  className = "",
  maxWidth = "max-w-[1400px]",
}) => {
  return (
    <div className={`flex flex-col min-h-full ${maxWidth} w-full mx-auto px-4 md:px-8 py-6 text-foreground font-sans ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
