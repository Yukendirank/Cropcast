export function LogoIcon() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-8 w-8"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle */}
      <circle cx="50" cy="50" r="48" fill="#0A4D3C" />

      {/* Sun */}
      <circle cx="30" cy="30" r="8" fill="#F59E0B" />

      {/* Leaf */}
      <path
        d="M50 30 C40 50, 40 65, 50 80 C60 65, 60 50, 50 30"
        fill="#4CAF50"
      />

      {/* Stem */}
      <line
        x1="50"
        y1="40"
        x2="50"
        y2="75"
        stroke="#065F46"
        strokeWidth="2"
      />

      {/* Ground */}
      <path
        d="M20 75 Q50 60 80 75"
        stroke="#22C55E"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}
