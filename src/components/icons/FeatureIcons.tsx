const iconClass = 'h-12 w-12';

export function CalendarIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="40" height="36" rx="4" fill="#1a365d" opacity="0.1"/>
      <rect x="4" y="8" width="40" height="12" rx="4" fill="#1a365d"/>
      <rect x="12" y="4" width="4" height="8" rx="2" fill="#d69e2e"/>
      <rect x="32" y="4" width="4" height="8" rx="2" fill="#d69e2e"/>
      <circle cx="16" cy="30" r="3" fill="#38a169"/>
      <circle cx="24" cy="30" r="3" fill="#d69e2e"/>
      <circle cx="32" cy="30" r="3" fill="#e53e3e"/>
      <circle cx="16" cy="38" r="3" fill="#38a169"/>
      <circle cx="24" cy="38" r="3" fill="#38a169"/>
    </svg>
  );
}

export function ShieldIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4L40 10V22C40 32 24 44 24 44C24 44 8 32 8 22V10L24 4Z" fill="#1a365d" opacity="0.1" stroke="#1a365d" strokeWidth="2"/>
      <path d="M16 22L22 28L32 18" stroke="#d69e2e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function PropertyIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 44V20L24 4L44 20V44H4Z" fill="#1a365d" opacity="0.1"/>
      <path d="M4 44V20L24 4L44 20V44" stroke="#1a365d" strokeWidth="2" strokeLinejoin="round"/>
      <rect x="18" y="28" width="12" height="16" rx="1" fill="#d69e2e"/>
      <rect x="10" y="22" width="6" height="6" rx="1" fill="#1a365d" opacity="0.3"/>
      <rect x="32" y="22" width="6" height="6" rx="1" fill="#1a365d" opacity="0.3"/>
    </svg>
  );
}

export function MoneyIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" fill="#1a365d" opacity="0.1" stroke="#1a365d" strokeWidth="2"/>
      <text x="24" y="30" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="20" fontWeight="700" fill="#d69e2e">£</text>
    </svg>
  );
}

export function DocumentIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="4" width="32" height="40" rx="4" fill="#1a365d" opacity="0.1" stroke="#1a365d" strokeWidth="2"/>
      <line x1="16" y1="16" x2="32" y2="16" stroke="#1a365d" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="22" x2="32" y2="22" stroke="#1a365d" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="28" x2="28" y2="28" stroke="#1a365d" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 34L22 38L30 30" stroke="#d69e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function TenantIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="16" r="8" fill="#1a365d" opacity="0.2" stroke="#1a365d" strokeWidth="2"/>
      <path d="M8 42C8 34 15 28 24 28C33 28 40 34 40 42" stroke="#1a365d" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="36" cy="36" r="8" fill="#d69e2e"/>
      <path d="M33 36H39M36 33V39" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function DashboardIcon({ className = iconClass }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="18" height="18" rx="4" fill="#1a365d"/>
      <rect x="26" y="4" width="18" height="10" rx="4" fill="#d69e2e"/>
      <rect x="26" y="18" width="18" height="4" rx="2" fill="#1a365d" opacity="0.3"/>
      <rect x="4" y="26" width="18" height="4" rx="2" fill="#1a365d" opacity="0.3"/>
      <rect x="4" y="34" width="40" height="10" rx="4" fill="#1a365d" opacity="0.1" stroke="#1a365d" strokeWidth="2"/>
    </svg>
  );
}
