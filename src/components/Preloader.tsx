import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: '-100%' }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 animate-ping rounded-full bg-teal-500/20 blur-xl"></div>
                            <h1 className="relative bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-5xl font-bold tracking-tighter text-transparent">
                                Omkar Kadam
                            </h1>
                        </div>
                        <div className="w-full h-1 overflow-hidden rounded-full bg-slate-800 relative mt-4 max-w-[200px]">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-amber-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                        </div>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mt-2 animate-pulse">
                            Initializing Portfolio Models
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
