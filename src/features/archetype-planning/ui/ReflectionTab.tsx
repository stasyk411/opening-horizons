// ВСТАВЬ ЭТОТ КОД В ReflectionTab.tsx (ЗАМЕНИ ВЕСЬ ФАЙЛ):

import React, { useState, useEffect } from "react";
import { Reflection, Task } from "../../../shared/types";
import { StatisticsSection } from "./StatisticsSection";
import { ReflectionForm } from "./ReflectionForm";
import { InsightsSection } from "./InsightsSection";
import { ReflectionHistory } from "./ReflectionHistory";
import { ReflectionDetails } from "./ReflectionDetails";

interface ReflectionTabProps {
  reflections: Reflection[];
  saveReflections: (reflections: Reflection[]) => void;
  settings: { archetype: string };
  isMobile: boolean;
}

const ReflectionTab: React.FC<ReflectionTabProps> = ({
  reflections,
  saveReflections,
  settings,
  isMobile,
}) => {
  const [currentReflection, setCurrentReflection] = useState<
    Partial<Reflection>
  >({
    date: new Date().toISOString().split("T")[0],
    mood: 5,
    answers: {},
    insights: [],
    rating: 5,
    notes: "",
  });

  const [showHistory, setShowHistory] = useState(false);
  const [selectedReflection, setSelectedReflection] =
    useState<Reflection | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Загрузка задач для статистики
  useEffect(() => {
    const savedTasks = localStorage.getItem("life-wheel-tasks");
    if (savedTasks) {
      try {
        const parsedTasks: Task[] = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    }
  }, []);

  // Обработчики событий
  const handleAnswerChange = (questionKey: string, answer: string) => {
    setCurrentReflection((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionKey]: answer,
      },
    }));
  };

  const handleMoodChange = (mood: number) => {
    setCurrentReflection((prev) => ({ ...prev, mood }));
  };

  const handleRatingChange = (rating: number) => {
    setCurrentReflection((prev) => ({ ...prev, rating }));
  };

  const handleNotesChange = (notes: string) => {
    setCurrentReflection((prev) => ({ ...prev, notes }));
  };

  const handleDateChange = (date: string) => {
    setCurrentReflection((prev) => ({ ...prev, date }));
  };

  const addInsight = () => {
    const insight = prompt(
      `💡 Добавьте ключевое озарение дня\n\nИнсайт - это важное понимание, которое меняет ваш подход.\n\nПримеры:\n• "Утром работаю эффективнее"\n• "Соцсети отнимают много времени"\n• "Короткие перерывы повышают продуктивность"\n\nВаш инсайт:`
    );

    if (insight && insight.trim()) {
      setCurrentReflection((prev) => ({
        ...prev,
        insights: [...(prev.insights || []), insight.trim()],
      }));
    }
  };

  const removeInsight = (index: number) => {
    setCurrentReflection((prev) => ({
      ...prev,
      insights: prev.insights?.filter((_, i) => i !== index) || [],
    }));
  };

  const saveReflection = () => {
    if (
      !currentReflection.answers ||
      Object.keys(currentReflection.answers).length === 0
    ) {
      alert("Пожалуйста, ответьте хотя бы на один вопрос");
      return;
    }

    // Автоматически рассчитываем статистику задач
    const today =
      currentReflection.date || new Date().toISOString().split("T")[0];
    const todayTasks = tasks.filter((task) => task.date === today);
    const completedTasks = todayTasks.filter((task) => task.completed).length;
    const totalTasks = todayTasks.length;
    const productivityScore =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const newReflection: Reflection = {
      id: Date.now().toString(),
      date: currentReflection.date || new Date().toISOString(),
      answers: currentReflection.answers || {},
      mood: currentReflection.mood || 5,
      insights: currentReflection.insights || [],
      createdAt: new Date().toISOString(),
      completedTasks,
      totalTasks,
      productivityScore,
      notes: currentReflection.notes || "",
      rating: currentReflection.rating || 5,
    };

    const updatedReflections = [...reflections, newReflection];
    saveReflections(updatedReflections);

    // Сброс формы
    setCurrentReflection({
      date: new Date().toISOString().split("T")[0],
      mood: 5,
      answers: {},
      insights: [],
      rating: 5,
      notes: "",
    });

    alert("Анализ сохранен! 📝");
  };

  const openReflectionDetails = (reflection: Reflection) => {
    setSelectedReflection(reflection);
  };

  const closeReflectionDetails = () => {
    setSelectedReflection(null);
  };

  // Стили
  const sectionTitleStyle = {
    fontSize: isMobile ? "1.3rem" : "1.8rem",
    marginBottom: isMobile ? "15px" : "25px",
    color: "#8A2BE2",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const containerStyle = {
    background: "white",
    borderRadius: isMobile ? "15px" : "20px",
    padding: isMobile ? "15px" : "30px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  };

  // Модальное окно для просмотра деталей
  if (selectedReflection) {
    return (
      <ReflectionDetails
        selectedReflection={selectedReflection}
        settings={settings}
        isMobile={isMobile}
        onClose={closeReflectionDetails}
      />
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={sectionTitleStyle}>📝 Вечерний Анализ</h2>

      {/* Переключение между формой и историей */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap" as const,
        }}
      >
        <button
          onClick={() => setShowHistory(false)}
          style={{
            padding: "12px 20px",
            background: !showHistory ? "#8A2BE2" : "transparent",
            color: !showHistory ? "white" : "#8A2BE2",
            border: "2px solid #8A2BE2",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            flex: 1,
            minWidth: "120px",
          }}
        >
          📋 Новый анализ
        </button>
        <button
          onClick={() => setShowHistory(true)}
          style={{
            padding: "12px 20px",
            background: showHistory ? "#8A2BE2" : "transparent",
            color: showHistory ? "white" : "#8A2BE2",
            border: "2px solid #8A2BE2",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            flex: 1,
            minWidth: "120px",
          }}
        >
          📊 История ({reflections.length})
        </button>
      </div>

      {!showHistory ? (
        /* ФОРМА АНАЛИЗА */
        <>
          {/* СТАТИСТИКА */}
          <StatisticsSection tasks={tasks} isMobile={isMobile} />

          {/* ОСНОВНАЯ ФОРМА */}
          <ReflectionForm
            currentReflection={currentReflection}
            tasks={tasks}
            settings={settings}
            isMobile={isMobile}
            onAnswerChange={handleAnswerChange}
            onMoodChange={handleMoodChange}
            onRatingChange={handleRatingChange}
            onNotesChange={handleNotesChange}
            onDateChange={handleDateChange}
            onAddInsight={addInsight}
            onRemoveInsight={removeInsight}
            onSave={saveReflection}
          />
        </>
      ) : (
        /* ИСТОРИЯ АНАЛИЗОВ */
        <ReflectionHistory
          reflections={reflections}
          settings={settings}
          isMobile={isMobile}
          onOpenDetails={openReflectionDetails}
        />
      )}
    </div>
  );
};

export { ReflectionTab };
