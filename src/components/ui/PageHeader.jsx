import React from "react";

export const PageHeader = ({
  title,
  description,
  icon: Icon,
  category,
  actions,
  children,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-4 border-b border-white/[0.08] pb-5 mb-6 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          {category && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold tracking-widest text-zinc-400 uppercase">
                {category}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white shadow-sm shrink-0">
                <Icon size={18} className="text-zinc-200" />
              </div>
            )}
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {title}
            </h1>
          </div>
          {description && (
            <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {children && <div className="pt-2">{children}</div>}
    </div>
  );
};

export default PageHeader;
