import Link from 'next/link';
import { ResourceCard } from '@/types';
import { BookOpen, FileText, Users, Award, ArrowRight } from 'lucide-react';

// Icon 對照表
const iconMap = {
  BookOpen,
  FileText,
  Users,
  Award,
};

export default function ResourceGrid({ cards }: { cards: ResourceCard[] }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {cards.map((card) => {
        const Icon = iconMap[card.iconName];
        return (
          <div key={card.id} className="bg-card border border-border-ui rounded-xl p-6 flex flex-col transition-colors duration-300 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="text-white" size={24} />
              <h3 className="text-xl font-bold text-white">{card.title}</h3>
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1">
              {card.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={card.primaryAction.href}
                className="inline-flex items-center gap-2 px-5 py-2 bg-primary hover:opacity-90 text-black font-bold rounded text-sm transition-colors"
              >
                {card.primaryAction.text}
                <ArrowRight size={16} />
              </Link>

              {card.secondaryAction && (
                <Link
                  href={card.secondaryAction.href}
                  className="inline-flex items-center gap-2 px-5 py-2 border border-primary text-primary hover:bg-primary/10 font-bold rounded text-sm transition-colors"
                >
                  {card.secondaryAction.text}
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}