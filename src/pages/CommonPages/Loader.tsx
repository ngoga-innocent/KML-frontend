import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { loaderService } from "../../components/Loaders/loaderService";


export default function GlobalLoader() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return loaderService.subscribe(setLoading);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center gap-4"
          >
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-secondary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
            </div>

            <p className="text-sm text-gray-600 font-medium">
              Processing...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}