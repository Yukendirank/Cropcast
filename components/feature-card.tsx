'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  link: string;
  badge?: 'Core' | 'New' | 'Beta' | 'Login Required';
  requiresAuth?: boolean;
}

const badgeStyles: Record<string, string> = {
  Core: 'bg-green-100 text-green-800 border border-green-200',
  New: 'bg-blue-100 text-blue-800 border border-blue-200',
  Beta: 'bg-purple-100 text-purple-800 border border-purple-200',
  'Login Required': 'bg-orange-100 text-orange-800 border border-orange-200',
}

export function FeatureCard({ title, description, icon, link, badge, requiresAuth = false }: FeatureCardProps) {
  const router = useRouter();
  const isLocked = requiresAuth && !auth.isAuthenticated();

  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      router.push('/signin');
    }
  };

  return (
    <Link href={link} onClick={handleClick} className="group block h-full">
      <div className={`relative h-full bg-white border rounded-3xl p-6 flex flex-col overflow-hidden
        transition-all duration-300
        hover:shadow-xl hover:-translate-y-2 hover:border-[#0A4D3C]/30
        active:scale-[0.98] active:translate-y-0
        ${isLocked ? 'border-orange-100' : 'border-gray-100'}`}>

        {/* Top accent line on hover */}
        <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[#0A4D3C]/0 via-[#0A4D3C] to-[#0A4D3C]/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-full" />

        {/* Subtle hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Badge */}
          {badge && (
            <div className="mb-4 inline-flex w-fit">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeStyles[badge]}`}>
                {badge}
              </span>
            </div>
          )}

          {/* Icon */}
          <div className="text-5xl mb-4 inline-block group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 origin-bottom-left">
            {icon}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-[#0A4D3C] mb-2 group-hover:text-[#0d5e49] transition-colors">{title}</h3>

          {/* Description */}
          <p className="text-gray-500 text-sm mb-5 flex-grow leading-relaxed">{description}</p>

          {/* Footer row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0A4D3C] group-hover:gap-3 transition-all duration-300">
              <span>{isLocked ? 'Sign in to access' : 'Explore'}</span>
              {isLocked
                ? <Lock className="w-3.5 h-3.5 text-orange-500" />
                : <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              }
            </div>
          </div>

          {/* Auth hint */}
          {isLocked && (
            <div className="mt-3 text-xs text-orange-600 bg-orange-50 border border-orange-100 px-3 py-2 rounded-xl flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 flex-shrink-0" />
              Login to save and access your data
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
