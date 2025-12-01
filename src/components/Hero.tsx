// src/components/Hero.tsx
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-slate-900 text-white py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">水球軟體學院</h1>
      <p className="mb-8 text-slate-300">專注於軟體設計與架構的學習平台</p>
      <div className="flex justify-center gap-4">
        <Link href="/courses" className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700">
          開始學習
        </Link>
      </div>
    </section>
  );
}