import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#001640]">
      <Image
        src="/background.jpeg"
        alt="Background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[#001640]/55" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-black/25 backdrop-blur-xl p-8 sm:p-10 text-center shadow-2xl">
          <div
            style={{
              fontFamily:
                "'Times New Roman Condensed', 'Times New Roman', Times, serif",
            }}
            className="text-[#F8F8FF] text-7xl sm:text-8xl leading-none"
          >
            404
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-semibold text-[#F8F8FF]">
            Page not found
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#F8F8FF]/80">
            The page you’re looking for doesn’t exist or was moved.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-[#F8F8FF] text-[#001640] hover:bg-[#F8F8FF]/90">
              <Link href="/">Go home</Link>
            </Button>
          
          </div>
        </div>
      </div>
    </main>
  );
}
