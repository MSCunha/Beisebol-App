'use client';
import Image from 'next/image';

export default function Loading({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-[#5dc0fd] flex items-center justify-center z-50">
      <div className="animate-pulse">
        <Image src="/logoslzbeisebol.png" alt="SLZ" width={120} height={120} priority />
      </div>
    </div>
  );
}