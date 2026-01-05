/**
 * Componente de loading circular minimalista com efeito trail/fade
 * Spinner verde com rastro desvanecendo - estilo premium
 */
export function CircularLoader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      {/* Container do spinner */}
      <div className="relative w-16 h-16">
        {/* SVG com gradiente para efeito de trail/fade */}
        <svg
          className="w-full h-full animate-spin"
          style={{ 
            animationDuration: '1s', 
            animationTimingFunction: 'linear' 
          }}
          viewBox="0 0 64 64"
        >
          <defs>
            {/* Gradiente que cria o efeito de fade/trail */}
            <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
              <stop offset="50%" stopColor="#22c55e" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="1" />
            </linearGradient>
          </defs>
          
          {/* Círculo de fundo (cinza muito claro) */}
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#F3F4F6"
            strokeWidth="3"
          />
          
          {/* Círculo com gradiente - cria o efeito trail */}
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="url(#spinnerGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="132 44"
            transform="rotate(-90 32 32)"
          />
        </svg>
      </div>
    </div>
  );
}
