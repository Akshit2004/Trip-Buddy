import LoadingSpinner from '@/components/ui/snow-ball-loading-spinner';

export const metadata = {
  title: 'Spinner Demo - TravelBuddy',
  description: 'Demo of the snow-ball loading spinner',
};

export default function Default() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="p-8">
        <LoadingSpinner />
      </div>
    </div>
  );
}
