import React from "react";

interface WelcomeMessageProps {
  onDismiss: () => void;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  onDismiss,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Анимированные бабочки с улучшенными анимациями */}
        <div className="relative mb-8">
          <div className="text-5xl mb-4 animate-float">🦋</div>
          <div className="text-3xl absolute top-2 left-1/4 animate-bounce">
            🦋
          </div>
          <div className="text-4xl absolute top-6 right-1/4 animate-pulse">
            🦋
          </div>
        </div>

        {/* Основной текст */}
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-amber-100 animate-glow">
          <h1 className="text-3xl font-bold text-amber-800 mb-6">
            Opening Horizons
          </h1>

          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p className="italic border-l-4 border-amber-400 pl-4 py-2">
              "Если ты будешь гоняться за бабочками — они улетят."
            </p>

            <p className="italic border-l-4 border-amber-400 pl-4 py-2">
              "Но если ты потратишь время на то, чтобы вырастить свой сад —
              бабочки прилетят сами."
            </p>

            <p className="font-semibold text-amber-700 text-xl mt-8 mb-6">
              Когда ты сфокусируешься на самосовершенствовании, то всё что нужно
              приходит само.
            </p>
          </div>

          <div className="text-sm text-amber-600 mb-8 mt-6">
            Начни свой путь осознанного роста сегодня
          </div>

          <button
            onClick={onDismiss}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-12 rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 animate-float"
          >
            Начать расти 🌱
          </button>
        </div>

        {/* Декоративные элементы с анимациями */}
        <div className="mt-10 flex justify-center space-x-6 text-3xl">
          <span className="animate-spin-slow">🌻</span>
          <span className="animate-bounce">🍃</span>
          <span className="animate-pulse">🌸</span>
          <span className="animate-spin-slow">🌿</span>
          <span className="animate-bounce">🌼</span>
        </div>

        {/* Подпись */}
        <div className="mt-8 text-sm text-amber-400">
          Фокус на росте → Результаты приходят
        </div>
      </div>
    </div>
  );
};
