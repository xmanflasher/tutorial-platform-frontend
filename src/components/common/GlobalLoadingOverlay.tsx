'use client';

import React from 'react';
import LoadingRunner from '@/components/ui/LoadingRunner';
import { useLoading } from '@/context/LoadingContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalLoadingOverlay() {
  const { isLoading } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/60 backdrop-blur-[2px]"
        >
          <div className="scale-125">
            <LoadingRunner />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
