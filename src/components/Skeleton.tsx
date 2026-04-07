import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-slate-200 animate-pulse rounded-2xl ${className}`} />
);

export default Skeleton;
