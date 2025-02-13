import React, { createContext, useContext, useState } from 'react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  setLoadingMessage: (message: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);
  const setLoadingMessage = (msg: string) => setMessage(msg);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading, setLoadingMessage }}>
      {children}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-purple-900/90 border border-purple-800/50 rounded-lg p-8 backdrop-blur-sm">
              <LoadingSpinner size="lg" className="mb-4" />
              {message && (
                <p className="text-center text-gray-300">{message}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}