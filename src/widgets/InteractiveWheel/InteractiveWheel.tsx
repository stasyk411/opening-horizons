import React, { useState, useEffect } from "react";
import { LifeSphere } from "../../shared/types";
import {
  Heart,
  Brain,
  DollarSign,
  Palette,
  Users,
  Briefcase,
} from "lucide-react";

interface InteractiveWheelProps {
  onSphereSelect: (sphere: LifeSphere) => void;
}

const SPHERES: LifeSphere[] = [
  "health",
  "development",
  "finance",
  "hobby",
  "family",
  "career",
];

const SPHERE_CONFIG: Record<
  LifeSphere,
  {
    label: string;
    gradient: string;
    color: string;
    icon: React.ReactNode;
  }
> = {
  health: {
    label: "Здоровье",
    gradient: "from-red-500 to-pink-500",
    color: "linear-gradient(135deg, #ef4444, #ec4899)",
    icon: <Heart className="w-4 h-4 md:w-5 md:h-5" />,
  },
  development: {
    label: "Развитие",
    gradient: "from-purple-500 to-violet-500",
    color: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    icon: <Brain className="w-4 h-4 md:w-5 md:h-5" />,
  },
  finance: {
    label: "Финансы",
    gradient: "from-yellow-500 to-orange-500",
    color: "linear-gradient(135deg, #eab308, #f59e0b)",
    icon: <DollarSign className="w-4 h-4 md:w-5 md:h-5" />,
  },
  hobby: {
    label: "Хобби",
    gradient: "from-pink-500 to-rose-500",
    color: "linear-gradient(135deg, #ec4899, #f43f5e)",
    icon: <Palette className="w-4 h-4 md:w-5 md:h-5" />,
  },
  family: {
    label: "Семья",
    gradient: "from-green-500 to-emerald-500",
    color: "linear-gradient(135deg, #22c55e, #10b981)",
    icon: <Users className="w-4 h-4 md:w-5 md:h-5" />,
  },
  career: {
    label: "Карьера",
    gradient: "from-blue-500 to-indigo-500",
    color: "linear-gradient(135deg, #3b82f6, #6366f1)",
    icon: <Briefcase className="w-4 h-4 md:w-5 md:h-5" />,
  },
};

export const InteractiveWheel: React.FC<InteractiveWheelProps> = ({
  onSphereSelect,
}) => {
  const [selectedSphere, setSelectedSphere] = useState<LifeSphere | null>(null);

  const handleSphereClick = (sphere: LifeSphere) => {
    setSelectedSphere(sphere);
    setTimeout(() => onSphereSelect(sphere), 200);
  };

  const createSectorPath = (
    index: number,
    radius: number,
    innerRadius: number = 0
  ) => {
    const angle = (2 * Math.PI) / SPHERES.length;
    const startAngle = index * angle - Math.PI / 2;
    const endAngle = (index + 1) * angle - Math.PI / 2;

    const x1 = 50 + innerRadius * Math.cos(startAngle);
    const y1 = 50 + innerRadius * Math.sin(startAngle);
    const x2 = 50 + radius * Math.cos(startAngle);
    const y2 = 50 + radius * Math.sin(startAngle);
    const x3 = 50 + radius * Math.cos(endAngle);
    const y3 = 50 + radius * Math.sin(endAngle);
    const x4 = 50 + innerRadius * Math.cos(endAngle);
    const y4 = 50 + innerRadius * Math.sin(endAngle);

    return `M ${x1} ${y1} L ${x2} ${y2} A ${radius} ${radius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`;
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full px-2 md:px-4">
      {/* Адаптивное колесо */}
      <div className="relative w-full max-w-[280px] md:max-w-[400px] lg:max-w-[500px] aspect-square">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
          <defs>
            <linearGradient
              id="health-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient
              id="development-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <linearGradient
              id="finance-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient
              id="hobby-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
            <linearGradient
              id="family-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient
              id="career-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>

          {SPHERES.map((sphere, index) => {
            const config = SPHERE_CONFIG[sphere];

            return (
              <g key={sphere} className="group cursor-pointer">
                <path
                  d={createSectorPath(index, 45)}
                  fill={`url(#${sphere}-gradient)`}
                  className={`opacity-90 cursor-pointer 
                    group-hover:opacity-100 group-hover:scale-105 
                    transition-all duration-200 transform origin-center
                    ${
                      selectedSphere === sphere
                        ? "opacity-100 scale-105 animate-pulse"
                        : ""
                    }`}
                  onClick={() => handleSphereClick(sphere)}
                />

                {/* Адаптивные иконки */}
                <foreignObject
                  x={
                    50 +
                    15 *
                      Math.cos(
                        index * ((2 * Math.PI) / SPHERES.length) +
                          Math.PI / SPHERES.length -
                          Math.PI / 2
                      ) -
                    2.5
                  }
                  y={
                    50 +
                    15 *
                      Math.sin(
                        index * ((2 * Math.PI) / SPHERES.length) +
                          Math.PI / SPHERES.length -
                          Math.PI / 2
                      ) -
                    2.5
                  }
                  width="5"
                  height="5"
                >
                  <div
                    className={`flex items-center justify-center w-full h-full 
                    ${selectedSphere === sphere ? "scale-110" : "scale-100"} 
                    transition-transform duration-200`}
                  >
                    {React.cloneElement(config.icon as React.ReactElement)}
                  </div>
                </foreignObject>

                {/* Адаптивный текст */}
                <text
                  x={
                    50 +
                    30 *
                      Math.cos(
                        index * ((2 * Math.PI) / SPHERES.length) +
                          Math.PI / SPHERES.length -
                          Math.PI / 2
                      )
                  }
                  y={
                    52 +
                    30 *
                      Math.sin(
                        index * ((2 * Math.PI) / SPHERES.length) +
                          Math.PI / SPHERES.length -
                          Math.PI / 2
                      )
                  }
                  textAnchor="middle"
                  className="text-[2.5px] md:text-[3px] font-bold fill-white pointer-events-none drop-shadow-lg"
                >
                  {config.label}
                </text>
              </g>
            );
          })}

          <circle
            cx="50"
            cy="50"
            r="8"
            className="fill-white/90 backdrop-blur-sm stroke-2 stroke-white/60 drop-shadow-lg"
          />
          <text
            x="50"
            y="51"
            textAnchor="middle"
            className="text-[2px] md:text-[2.5px] font-bold fill-gray-700"
          >
            BALANCE
          </text>
        </svg>

        {/* Адаптивная подсказка */}
        {selectedSphere && (
          <div
            className="absolute top-2 md:top-4 left-1/2 transform -translate-x-1/2 
                         bg-white/95 backdrop-blur-sm rounded-lg p-3 md:p-4 shadow-xl border border-white/20
                         animate-pulse min-w-[160px] md:min-w-[200px] text-center"
          >
            <div className="flex items-center justify-center space-x-2 mb-1 md:mb-2">
              <div
                style={{
                  background: SPHERE_CONFIG[selectedSphere].color,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {React.cloneElement(
                  SPHERE_CONFIG[selectedSphere].icon as React.ReactElement,
                  {
                    className: "w-4 h-4 md:w-5 md:h-5",
                  }
                )}
              </div>
              <span className="text-sm md:text-lg font-semibold text-gray-800">
                {SPHERE_CONFIG[selectedSphere].label}
              </span>
            </div>
            <div className="text-xs md:text-sm text-gray-600">
              Нажмите для планирования
            </div>
          </div>
        )}
      </div>

      {/* Адаптивная инструкция */}
      <div className="text-center text-white/90 mt-4 md:mt-6 px-2">
        <p className="text-sm md:text-base mb-2 transition-all duration-200">
          🎯 <strong>Кликните на сектор колеса</strong> для создания задачи
        </p>
        <p className="text-white/70 text-xs md:text-sm">
          Каждая иконка представляет ключевую область вашего развития
        </p>
      </div>
    </div>
  );
};
