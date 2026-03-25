'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { auth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  link: string;
  badge?: 'Core' | 'New' | 'Beta' | 'Login Required';
  requiresAuth?: boolean;
}

export function FeatureCard({
  title,
  description,
  icon,
  link,
  badge,
  requiresAuth = false,
}: FeatureCardProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (requiresAuth && !auth.isAuthenticated()) {
      e.preventDefault();
      router.push('/signin');
    }
  };

  const cardContent = (
    <div className="h-full bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-[#0A4D3C] transition-all duration-300 hover:scale-105 cursor-pointer flex flex-col">
      {/* Badge */}
      {badge && (
        <div className="mb-4 inline-flex w-fit">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              badge === 'Core'
                ? 'bg-green-100 text-green-800'
                : badge === 'New'
                  ? 'bg-blue-100 text-blue-800'
                  : badge === 'Beta'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-orange-100 text-orange-800'
            }`}
          >
            {badge}
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="text-5xl mb-4">{icon}</div>

      {/* Title */}
      <h3 className="text-xl font-bold text-[#0A4D3C] mb-2">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>

      {/* Explore Button */}
      <div className="flex items-center gap-2 text-[#0A4D3C] font-semibold hover:gap-3 transition-all">
        <span>Explore</span>
        <span>→</span>
      </div>

      {/* Auth Required Tooltip */}
      {requiresAuth && !auth.isAuthenticated() && (
        <div className="mt-3 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 100-2 1 1 0 000 2zm3 1a1 1 0 11-2 0 1 1 0 012 0zm3-1a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          Login to save your data
        </div>
      )}
    </div>
  );

  return (
    <Link href={link} onClick={handleClick}>
      {cardContent}
    </Link>
  );
}
