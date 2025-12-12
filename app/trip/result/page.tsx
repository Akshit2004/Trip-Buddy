'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    Calendar,
    Check,
    CreditCard,
    Hotel as HotelIcon,
    Plane,
    Sparkles,
    Utensils,
    Share2,
    Download
} from 'lucide-react';
import Link from 'next/link';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { pointsToRupees } from '@/lib/points';

import { useStore } from '@/store/useStore';
import { useAuth } from '@/context/AuthContext';
import { addUserPoints, saveBooking } from '@/lib/userService';
import { TravelItem, TripPlannerResponse } from '@/types';
import BoardingPass from '@/components/BoardingPass';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);

const OptionCard = ({ 
    item, 
    badge, 
    selected, 
    onSelect 
}: { 
    item: TravelItem; 
    badge: string; 
    selected?: boolean;
    onSelect?: () => void;
}) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
        onClick={onSelect}
        className={`group rounded-3xl border bg-white p-5 shadow-sm transition-all duration-300 cursor-pointer relative overflow-hidden ${
            selected ? 'border-primary ring-2 ring-primary/20' : 'border-border/50'
        }`}
    >
        {selected && (
            <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1.5 rounded-bl-2xl shadow-lg z-10 text-xs font-bold flex items-center gap-1">
                <Check className="w-3 h-3" />
                SELECTED
            </div>
        )}
        <div className="flex items-start gap-5">
            <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-secondary overflow-hidden border border-border/60 shadow-inner">
                    {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/40 bg-primary/5">
                            <Sparkles className="w-8 h-8" />
                        </div>
                    )}
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-border/50 text-primary uppercase shadow-sm whitespace-nowrap">
                    {badge}
                </span>
            </div>

            <div className="flex-1 min-w-0 py-1">
                <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1 opacity-80">
                    {item.subtitle}
                </p>
                <h4 className="text-lg font-bold truncate text-slate-900 group-hover:text-primary transition-colors">
                    {item.title}
                </h4>
                <p className="text-sm text-muted-foreground truncate mt-1">
                    {item.details?.join(' · ')}
                </p>
                
                <div className="flex items-center gap-1 text-xs text-amber-500 mt-2 font-medium bg-amber-50 w-fit px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 fill-amber-500" />
                    {item.rating}/5 Rating
                </div>
            </div>

            <div className="text-right shrink-0 py-1">
                <p className="text-xl font-bold text-slate-900">
                    {formatCurrency(item.price)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">per person</p>
            </div>
        </div>
    </motion.div>
);

const TimelineCard = ({
    day,
    index
}: {
    day: TripPlannerResponse['itinerary']['dailyPlan'][number];
    index: number;
}) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="relative pl-4 md:pl-8 pb-12 last:pb-0 group"
    >
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 to-transparent group-last:hidden" />
        <div className="absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full bg-white border-2 border-primary ring-4 ring-primary/10 group-hover:scale-125 transition-transform duration-300" />
        
        <div className="rounded-3xl border border-border/50 bg-white p-5 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                <span className="px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider border border-primary/10">
                    {day.day}
                </span>
            </div>
            
            <h4 className="text-lg md:text-xl font-bold mb-2 text-slate-900">{day.title}</h4>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {day.summary}
            </p>

            <div className="space-y-6">
                <div>
                    <h5 className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        Highlights
                    </h5>
                    <div className="grid gap-3">
                        {day.activities?.map((activity, idx) => (
                            <motion.div 
                                key={idx} 
                                whileHover={{ x: 4 }}
                                className="flex items-start gap-3 text-sm bg-slate-50 p-3 rounded-2xl border border-slate-100"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                <span className="text-slate-700">{activity}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {day.dining && day.dining.length > 0 && (
                    <div>
                        <h5 className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-orange-500" />
                            Dining
                        </h5>
                        <div className="flex flex-wrap gap-2">
                            {day.dining.map((spot, idx) => (
                                <span key={idx} className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100 hover:bg-orange-100 transition-colors cursor-default">
                                    {spot}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </motion.div>
);

export default function TripResultPage() {
    const router = useRouter();
    const { user, signInWithGoogle } = useAuth();
    const { generatedTrip, tripSearchParams } = useStore();
    
    const [selectedTransport, setSelectedTransport] = useState<TravelItem | null>(null);
    const [selectedHotel, setSelectedHotel] = useState<TravelItem | null>(null);
    const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
    const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingId, setBookingId] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    // removed redundant state; compute over budget dynamically

    useEffect(() => {
        if (!generatedTrip) {
            router.push('/ai-trip');
            return;
        }

        // Auto-select best options
        const bestTransport = 
            generatedTrip.transportOptions.flights[0] || 
            generatedTrip.transportOptions.trains[0] || 
            generatedTrip.transportOptions.buses[0];
        
        const bestHotel = generatedTrip.hotelOptions[0];

        setSelectedTransport(bestTransport || null);
        setSelectedHotel(bestHotel || null);
        // Check budget summary from server and set overBudget flag
        // We compute budget overrun dynamically using isOverBudget below
    }, [generatedTrip, router]);

    const tripDays = useMemo(() => {
        if (!tripSearchParams?.startDate || !tripSearchParams?.endDate) return 1;
        try {
            const diff = differenceInCalendarDays(parseISO(tripSearchParams.endDate), parseISO(tripSearchParams.startDate)) + 1;
            return diff > 0 ? diff : 1;
        } catch {
            return 1;
        }
    }, [tripSearchParams]);

    const totalPrice = useMemo(() => {
        let total = 0;
        if (selectedTransport && tripSearchParams) total += selectedTransport.price * tripSearchParams.travelers;
        if (selectedHotel) total += selectedHotel.price * (tripDays - 1);
        return total;
    }, [selectedTransport, selectedHotel, tripSearchParams, tripDays]);

    const multiplier = user?.pro ? 3 : 1;
    const pointsToEarn = Math.floor((totalPrice / 100) * multiplier);

    const handleBookTrip = async () => {
        if (!user) {
            signInWithGoogle();
            return;
        }

        if (!selectedTransport || !selectedHotel || !tripSearchParams) {
            setError("Please select both transport and hotel to book.");
            return;
        }

        // Validate final total against declared budget
        if (tripSearchParams && totalPrice > tripSearchParams.budget) {
            setError("Selected options exceed your budget. Please choose cheaper options or adjust your budget.");
            return;
        }
        setBookingLoading(true);
        try {
            // Generate a unique booking ID
            const generatedBookingId = `TB${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
            
            const bookingData = {
                bookingId: generatedBookingId,
                tripName: `Trip to ${tripSearchParams.destination}`,
                origin: tripSearchParams.origin,
                destination: tripSearchParams.destination,
                startDate: tripSearchParams.startDate,
                endDate: tripSearchParams.endDate,
                travelers: tripSearchParams.travelers,
                totalPrice,
                pointsEarned: pointsToEarn,
                transport: selectedTransport,
                hotel: selectedHotel,
                itinerary: generatedTrip?.itinerary
            };

            await saveBooking(user.uid, bookingData);
            await addUserPoints(user.uid, pointsToEarn);
            setBookingId(generatedBookingId);
            setBookingSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error(err);
            setError("Failed to book trip. Please try again.");
        } finally {
            setBookingLoading(false);
        }
    };

    if (!generatedTrip || !tripSearchParams) return null;

    const isOverBudget = Boolean(tripSearchParams && totalPrice > tripSearchParams.budget) || generatedTrip?.budgetSummary?.overBudget;

    const applyCheaperOptions = () => {
        const suggestedTransportId = generatedTrip?.budgetSummary?.suggestedTransportId;
        const suggestedHotelId = generatedTrip?.budgetSummary?.suggestedHotelId;
        if (suggestedTransportId) {
            const t = [
                ...generatedTrip.transportOptions.flights,
                ...generatedTrip.transportOptions.trains,
                ...generatedTrip.transportOptions.buses
            ].find((i) => i.id === suggestedTransportId);
            if (t) setSelectedTransport(t);
        }
        if (suggestedHotelId) {
            const h = generatedTrip.hotelOptions.find((i) => i.id === suggestedHotelId);
            if (h) setSelectedHotel(h);
        }
        // When applied, reset error and budget flag
        setError(null);
        // reset error handled below
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Header / Hero */}
            <div className="bg-slate-900 text-white pb-32 pt-10 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900" />
                
                <div className="container-custom relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                    >
                        <div>
                            <div className="flex items-center gap-2 text-blue-400 font-medium mb-2">
                                <Sparkles className="w-4 h-4" />
                                <span>Your AI Itinerary is Ready</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                                Trip to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">{tripSearchParams.destination}</span>
                            </h1>
                            <p className="text-slate-400 mt-2 max-w-xl text-sm md:text-base">
                                {generatedTrip.itinerary.overview}
                            </p>
                        </div>
                        
                        <div className="flex gap-3">
                            <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container-custom -mt-24 relative z-20">
                {/* Budget Alert */}
                {isOverBudget && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-700 border border-red-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold">This trip exceeds your budget.</p>
                            <p className="text-xs">Your budget: <span className="font-semibold">{formatCurrency(tripSearchParams?.budget ?? 0)}</span>. Estimated cheapest total: <span className="font-semibold">{formatCurrency(generatedTrip?.budgetSummary?.estimatedTotal ?? totalPrice)}</span>.</p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={applyCheaperOptions} className="flex-1 md:flex-none px-3 py-2 rounded-lg bg-white text-red-700 font-bold border border-red-100 text-xs whitespace-nowrap">Cheaper options</button>
                            <button onClick={() => router.push('/ai-trip')} className="flex-1 md:flex-none px-3 py-2 rounded-lg bg-red-100 text-red-700 font-semibold text-xs whitespace-nowrap">Re-plan</button>
                        </div>
                    </div>
                )}
                
                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-8 pb-32 lg:pb-0">
                    {/* Main Itinerary Column */}
                    <div className="space-y-8 order-2 lg:order-1">
                        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h3 className="text-xl md:text-2xl font-bold flex items-center gap-3 mb-8">
                                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                                Day by Day Plan
                            </h3>
                            <div className="relative">
                                {generatedTrip.itinerary.dailyPlan.map((day, index) => (
                                    <TimelineCard key={day.day} day={day} index={index} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Booking Column */}
                    <div className="space-y-6 order-1 lg:order-2 lg:sticky lg:top-8 h-fit">
                        {/* Transport Selection */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-[2rem] p-5 md:p-6 shadow-xl shadow-slate-200/50 border border-slate-100"
                        >
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Plane className="w-5 h-5 text-primary" />
                                    Transport
                                </h3>
                                <button 
                                    onClick={() => setIsTransportModalOpen(!isTransportModalOpen)}
                                    className="text-xs md:text-sm font-bold text-primary hover:bg-primary/5 px-3 py-1 rounded-full transition-colors"
                                >
                                    {isTransportModalOpen ? 'Done' : 'Change'}
                                </button>
                            </div>
                            
                            <AnimatePresence mode="wait">
                                {isTransportModalOpen ? (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-6"
                                    >
                                        {(['flights', 'trains', 'buses'] as const).map((mode) => (
                                            <div key={mode}>
                                                <p className="text-xs font-bold uppercase text-muted-foreground mb-3 pl-1">
                                                    {mode}
                                                </p>
                                                <div className="space-y-3">
                                                    {generatedTrip.transportOptions[mode].length > 0 ? (
                                                        generatedTrip.transportOptions[mode].map((option) => (
                                                            <OptionCard
                                                                key={option.id}
                                                                item={option}
                                                                badge={mode.slice(0, -1)}
                                                                selected={selectedTransport?.id === option.id}
                                                                onSelect={() => {
                                                                    setSelectedTransport(option);
                                                                    setIsTransportModalOpen(false);
                                                                }}
                                                            />
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground italic pl-1">
                                                            No {mode} available
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    selectedTransport ? (
                                        <OptionCard 
                                            item={selectedTransport} 
                                            badge={selectedTransport.type} 
                                            selected 
                                        />
                                    ) : (
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-sm text-muted-foreground">
                                            No transport selected
                                        </div>
                                    )
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Hotel Selection */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-[2rem] p-5 md:p-6 shadow-xl shadow-slate-200/50 border border-slate-100"
                        >
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <HotelIcon className="w-5 h-5 text-primary" />
                                    Stay
                                </h3>
                                <button 
                                    onClick={() => setIsHotelModalOpen(!isHotelModalOpen)}
                                    className="text-xs md:text-sm font-bold text-primary hover:bg-primary/5 px-3 py-1 rounded-full transition-colors"
                                >
                                    {isHotelModalOpen ? 'Done' : 'Change'}
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {isHotelModalOpen ? (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3"
                                    >
                                        {generatedTrip.hotelOptions.length > 0 ? (
                                            generatedTrip.hotelOptions.map((hotel) => (
                                                <OptionCard 
                                                    key={hotel.id} 
                                                    item={hotel} 
                                                    badge="hotel"
                                                    selected={selectedHotel?.id === hotel.id}
                                                    onSelect={() => {
                                                        setSelectedHotel(hotel);
                                                        setIsHotelModalOpen(false);
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic pl-1">
                                                No hotels found
                                            </p>
                                        )}
                                    </motion.div>
                                ) : (
                                    selectedHotel ? (
                                        <OptionCard 
                                            item={selectedHotel} 
                                            badge="hotel" 
                                            selected 
                                        />
                                    ) : (
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-sm text-muted-foreground">
                                            No hotel selected
                                        </div>
                                    )
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Booking Summary (Desktop) */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="hidden lg:block bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
                            
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                                <CreditCard className="w-5 h-5 text-blue-400" />
                                Booking Summary
                            </h3>
                            
                            <div className="space-y-4 mb-8 relative z-10">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Transport ({tripSearchParams.travelers} pax)</span>
                                    <span className="font-semibold">{formatCurrency((selectedTransport?.price || 0) * tripSearchParams.travelers)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Hotel ({tripDays - 1} nights)</span>
                                    <span className="font-semibold">{formatCurrency((selectedHotel?.price || 0) * (tripDays - 1))}</span>
                                </div>
                                <div className="h-px bg-white/10 my-4" />
                                <div className="flex justify-between items-center text-2xl font-bold">
                                    <span>Total</span>
                                    <span>{formatCurrency(totalPrice)}</span>
                                </div>
                            <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-400/10 p-3 rounded-xl justify-center border border-yellow-400/20">
                                <Sparkles className="w-3 h-3" />
                                <span>You&apos;ll earn {pointsToEarn} points <span className="text-yellow-500">(₹{pointsToRupees(pointsToEarn)})</span></span>
                                {multiplier === 3 ? (
                                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">3X PRO</span>
                                ) : (
                                    <Link href="/subscription" className="ml-1 text-[10px] underline decoration-yellow-400/50 hover:text-yellow-300">
                                        Get 3x with Pro
                                    </Link>
                                )}
                            </div>
                        </div>

                            <button
                                onClick={handleBookTrip}
                                disabled={bookingLoading || !selectedTransport || !selectedHotel}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 relative z-10"
                            >
                                {bookingLoading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        {user ? 'Book Entire Trip' : 'Sign in to Book'}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                            
                            {error && (
                                <p className="text-red-400 text-xs text-center mt-3">{error}</p>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
            
            {/* Mobile Fixed Booking Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 lg:hidden shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] pb-safe">
                <div className="container-custom">
                    {error && (
                        <p className="text-red-600 text-xs text-center mb-2 font-medium bg-red-50 p-1.5 rounded-lg border border-red-100">{error}</p>
                    )}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Trip Cost</p>
                            <p className="text-xl font-bold text-slate-900">{formatCurrency(totalPrice)}</p>
                        </div>
                         <button
                            onClick={handleBookTrip}
                            disabled={bookingLoading || !selectedTransport || !selectedHotel}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
                        >
                            {bookingLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Book Now
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Boarding Pass Success Modal */}
            <AnimatePresence>
                {bookingSuccess && (
                    <BoardingPass
                        bookingId={bookingId}
                        tripName={`Trip to ${tripSearchParams.destination}`}
                        origin={tripSearchParams.origin}
                        destination={tripSearchParams.destination}
                        startDate={tripSearchParams.startDate}
                        endDate={tripSearchParams.endDate}
                        travelers={tripSearchParams.travelers}
                        totalPrice={totalPrice}
                        pointsEarned={pointsToEarn}
                        transport={selectedTransport || undefined}
                        hotel={selectedHotel || undefined}
                        passengerName={user?.displayName || 'Guest'}
                        onClose={() => setBookingSuccess(false)}
                        onViewProfile={() => router.push('/profile')}
                        onGoHome={() => router.push('/')}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
