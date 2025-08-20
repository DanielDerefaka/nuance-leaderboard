'use client';

import { useAccountVerification } from '../hooks/useNuanceData';
import { LoadingSpinner } from './LoadingSpinner';

interface VerificationBadgeProps {
  platformType?: string;
  accountId: string;
  username?: string;
  showText?: boolean;
}

export function VerificationBadge({ 
  platformType = 'twitter', 
  accountId, 
  username,
  showText = false 
}: VerificationBadgeProps) {
  const { data: verification, isLoading, error } = useAccountVerification(
    platformType, 
    accountId, 
    Boolean(accountId)
  );

  if (isLoading) {
    return (
      <div className="inline-flex items-center">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (error || !verification) {
    return null;
  }

  if (!verification.is_verified) {
    return showText ? (
      <span className="text-xs text-gray-500">Unverified</span>
    ) : null;
  }

  return (
    <div className="inline-flex items-center space-x-1">
      <div 
        className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
        title={`Verified Nuance Network account${verification.node_hotkey ? ` (${verification.node_hotkey.slice(0, 8)}...)` : ''}`}
      >
        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      {showText && (
        <span className="text-xs text-green-400 font-medium">Verified</span>
      )}
      {verification.node_hotkey && showText && (
        <span className="text-xs text-gray-500">
          Miner: {verification.node_hotkey.slice(0, 8)}...
        </span>
      )}
    </div>
  );
}