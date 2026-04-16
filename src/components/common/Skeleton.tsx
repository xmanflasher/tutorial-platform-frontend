import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export default function Skeleton({ className = '', variant = 'rect' }: SkeletonProps) {
  const baseClass = "animate-pulse bg-slate-700/50";
  const variantClass = 
    variant === 'text' ? 'h-4 w-full rounded' :
    variant === 'circle' ? 'rounded-full' :
    'rounded-lg';

  return (
    <div className={`${baseClass} ${variantClass} ${className}`} />
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="bg-card border border-border-ui rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      <Skeleton className="aspect-video w-full" />
      <div className="p-5 flex flex-col flex-1 gap-4">
        <Skeleton variant="text" className="w-3/4 h-6" />
        <Skeleton variant="text" className="w-1/2 h-4" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="w-16 h-6 rounded-full" />
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
        <div className="mt-auto pt-4 flex gap-3">
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="flex-1 h-10" />
        </div>
      </div>
    </div>
  );
}

export function ResourceCardSkeleton() {
  return (
    <div className="bg-card border border-border-ui rounded-xl p-6 flex flex-col gap-4 shadow-lg">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="w-10 h-10" />
        <Skeleton variant="text" className="w-1/2 h-6" />
      </div>
      <Skeleton variant="text" className="w-full h-16" />
      <div className="flex gap-3">
        <Skeleton className="w-24 h-9" />
        <Skeleton className="w-24 h-9" />
      </div>
    </div>
  );
}
