import { motion } from 'framer-motion';
import { images } from '../../config/images';

interface Props {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({ message = 'Memuat halaman...', fullScreen = true }: Props) {
  return (
    <div className={`relative grid place-items-center overflow-hidden bg-slate-900 ${fullScreen ? 'min-h-screen' : 'min-h-[60vh]'}`}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${images.loadingBackground}")` }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/85 via-brand-800/80 to-emerald-900/85" />
      {/* Topo pattern */}
      <div className="absolute inset-0 bg-topo-pattern opacity-30" />
      {/* Decorative blobs */}
      <div className="blob h-72 w-72 -top-10 -left-10 bg-brand-400/30" />
      <div className="blob h-80 w-80 -bottom-20 -right-10 bg-emerald-400/30" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center text-white">
        {/* Animated logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative"
        >
          {/* Pulsing rings */}
          <motion.span
            className="absolute inset-0 rounded-3xl bg-white/20"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.span
            className="absolute inset-0 rounded-3xl bg-white/15"
            animate={{ scale: [1, 1.7, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          />

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-brand-400 to-emerald-300 shadow-2xl"
          >
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-white drop-shadow-md" fill="currentColor">
              <path d="M12 3 L21 12 L18.5 12 L18.5 21 L14 21 L14 15 L10 15 L10 21 L5.5 21 L5.5 12 L3 12 Z" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Brand */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6"
        >
          <h1 className="text-3xl font-extrabold tracking-tight">
            Akses<span className="text-brand-300">Desa</span>
          </h1>
          <p className="mt-1 text-sm text-white/70">Portal Digital Desa Modern</p>
        </motion.div>

        {/* Progress dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex items-center gap-1.5"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-brand-300"
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-sm font-medium text-white/80"
        >
          {message}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 max-w-xs text-xs italic text-white/60"
        >
          "Semua layanan desa, kini dalam satu akses."
        </motion.p>
      </div>
    </div>
  );
}

/**
 * Versi compact untuk inline loading (tidak full screen).
 * Cocok untuk transisi antar route yang cepat.
 */
export function InlineLoading({ message = 'Memuat...' }: { message?: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <motion.span
            className="absolute inset-0 rounded-2xl bg-brand-200"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-700 to-emerald-500 shadow-soft">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
              <path d="M12 3 L21 12 L18.5 12 L18.5 21 L14 21 L14 15 L10 15 L10 21 L5.5 21 L5.5 12 L3 12 Z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-brand-500"
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        <p className="text-sm font-medium text-slate-600">{message}</p>
      </div>
    </div>
  );
}
