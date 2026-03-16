export function LandlordShieldLogo({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 4L20 2L32 4V20C32 28 20 36 20 36C20 36 8 28 8 20V4Z" fill="#1a365d" stroke="#d69e2e" strokeWidth="2"/>
      <path d="M14 18L18 22L26 14" stroke="#d69e2e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="40" y="16" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="700" fill="#1a365d">Landlord</text>
      <text x="40" y="32" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="700" fill="#d69e2e">Shield</text>
    </svg>
  );
}
