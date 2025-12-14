'use client';

import React, { useState } from 'react';
import { Users, Link as LinkIcon, Check, Copy, Crown, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Booking } from '@/types';
import { shareTrip } from '@/lib/collaborationService';
import { useAuth } from '@/context/AuthContext';

interface SquadSyncBarProps {
    booking: Booking;
    onUpdate?: (updatedBooking: Booking) => void;
}

export default function SquadSyncBar({ booking, onUpdate }: SquadSyncBarProps) {
    const { user } = useAuth();
    const [isSharing, setIsSharing] = useState(false);
    const [copied, setCopied] = useState(false);
    
    // Derived state
    const isShared = booking.isShared || false;
    const collaborators = (booking.collaborators as string[]) || [];
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/join/${booking.sharedTripId || ''}` : '';

    const handleInvite = async () => {
        if (!user || !booking) return;
        
        setIsSharing(true);
        try {
            const code = await shareTrip(user.uid, booking);
            // If the parent didn't already have the shared data, the service might have updated it
            // Ideally we'd trigger a reload or callback here, but for now we just show the link
            const url = `${window.location.origin}/join/${code}`;
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSharing(false);
        }
    };

    const copyLink = () => {
        if (!shareUrl) return;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-b border-border sticky top-0 z-40 shadow-sm"
        >
            <div className="container-custom py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                        {/* Current User */}
                        {user && (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-700 relative z-20" title="You">
                                {user.photoURL ? <img src={user.photoURL} className="w-full h-full rounded-full" /> : user.displayName?.charAt(0)}
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                        )}
                        
                        {/* Collaborators */}
                        {collaborators.filter((uid: string) => uid !== user?.uid).map((uid: string, i: number) => (
                            <div key={uid} className="w-8 h-8 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center text-xs font-bold text-pink-700 relative z-10" style={{ zIndex: 10 - i }}>
                                {uid.charAt(0).toUpperCase()}
                            </div>
                        ))}
                        
                        {/* Add Button if empty */}
                        {!isShared && (
                             <button onClick={handleInvite} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:border-slate-400 transition-all z-0">
                                <Users className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-1.5">
                            <Crown className="w-4 h-4 text-indigo-600" />
                            Squad Sync
                        </span>
                        {isShared && (
                            <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Live
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isShared ? (
                         <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                            <span className="text-xs text-muted-foreground px-2 font-mono hidden sm:inline-block max-w-[100px] truncate">
                                {shareUrl.replace('https://', '')}
                            </span>
                            <button
                                onClick={copyLink}
                                className="p-1.5 hover:bg-white rounded-md transition-all shadow-sm border border-transparent hover:border-slate-200"
                                title="Copy Invite Link"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleInvite}
                            disabled={isSharing}
                            className="btn-primary text-sm py-2 px-4 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-indigo-500/20"
                        >
                            {isSharing ? (
                                <span className="animate-spin opacity-50">⏳</span>
                            ) : (
                                <LinkIcon className="w-3.5 h-3.5" />
                            )}
                            Invite Squad
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
