import dynamic from 'next/dynamic';
import TripLoader from '@/components/TripLoader';

const AiTripPlanner = dynamic(() => import('@/components/AiTripPlanner'), { ssr: false, loading: () => <TripLoader /> });

export const metadata = {
  title: 'AI Trip - TravelBuddy',
  description: 'Generate a personalized trip itinerary using AI',
};

export default function AiTripPage() {
  return (
    <div className="min-h-screen bg-secondary/30 py-10">
      <div className="container-custom space-y-10">
        <AiTripPlanner />
      </div>
    </div>
  );
}
