
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const horseImageUrl = 'https://firebasestorage.googleapis.com/v0/b/culture-rally.firebasestorage.app/o/480922068_1031444842339712_749367612273874635_n.jpg?alt=media&token=369aded1-fddf-4ed5-8264-ae4edc5e9bab'; // REPLACE with your actual Firebase storage URL

interface HorseIntroAnimationProps {
  onComplete: () => void;
}

export function HorseIntroAnimation({ onComplete }: HorseIntroAnimationProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={{ duration: 3, times: [0, 0.85, 1] }}
        onAnimationComplete={onComplete}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      >
        <motion.div
          initial={{ scale: 0.2, y: 100, opacity: 0 }}
          animate={{ scale: [0.2, 1.5], y: [100, 0], opacity: [0, 1, 1] }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
          className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
        >
          <Image
            src={horseImageUrl}
            alt="Running Horse"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
