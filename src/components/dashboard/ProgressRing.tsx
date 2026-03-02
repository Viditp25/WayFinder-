export function ProgressRing({ percentage, size = 120, strokeWidth = 10 }: { percentage: number, size?: number, strokeWidth?: number }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background Circle */}
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    className="text-muted/20"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    className="text-pilot-500 transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold">{Math.round(percentage)}%</span>
            </div>
        </div>
    );
}
