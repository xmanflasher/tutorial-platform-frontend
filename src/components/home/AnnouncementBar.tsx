import Link from 'next/link';
import { Announcement } from '@/types';

export default function AnnouncementBar({ data }: { data: Announcement }) {
  return (
    <div className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      <div className="text-slate-200 text-sm md:text-base font-medium text-center md:text-left">
        {data.message}
      </div>
      <Link
        href={data.linkHref}
        className="px-6 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-sm font-bold rounded transition-colors whitespace-nowrap"
      >
        {data.linkText}
      </Link>
    </div>
  );
}