// src/components/Hero.tsx
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-background text-foreground py-20 text-center transition-colors duration-300">
      <h1 className="text-4xl font-bold mb-4">Σ-Codeatl</h1>
      <p className="mb-8 text-slate-300">軟體技術實戰學習地圖</p>
      <div className="flex justify-center gap-4">
        <Link href="/courses" className="bg-primary px-6 py-2 rounded hover:opacity-90 text-black font-bold">
          開始學習
        </Link>
      </div>
    </section>
  );
}