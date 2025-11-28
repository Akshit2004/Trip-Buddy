'use client';

import LoadingSpinner from '@/components/ui/snow-ball-loading-spinner';

export default function TripLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white">
      <LoadingSpinner />
    </div>
  );
}
