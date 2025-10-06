import React, { useState, useEffect } from "react";
import { Goal } from "../../shared/types";
import { dataManager } from "../../shared/lib/data-manager";
import {
  Plus,
  Target,
  Calendar,
  Check,
  Clock,
  Trash2,
  Edit3,
  Save,
  X,
} from "lucide-react";

export const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});

  const [newGoal, setNewGoal] = useState<Omit<Goal, "id" | "createdAt">>({
    title: "",
    description: "",
    bigSteps: ["", "", ""],
    smallSteps: [""],
  });

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    calculateProgress();
  }, [goals]);

  const loadGoals = async () => {
    const allGoals = await dataManager.getGoals();
    setGoals(allGoals);
    setLoading(false);
  };

  const calculateProgress = async () => {
    const progressMap: Record<string, number> = {};
    for (const goal of goals) {
      const goalProgress = await dataManager.calculateGoalProgress(goal.id);
      progressMap[goal.id] = goalProgress;
    }
    setProgress(progressMap);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title.trim() || newGoal.bigSteps.some((step) => !step.trim()))
      return;

    await dataManager.addGoal(newGoal);
    await loadGoals();
    setShowForm(false);
    resetForm();
  };

  const handleUpdateGoal = async (goal: Goal) => {
    await dataManager.addGoal(goal); // Используем addGoal для обновления (id сохранится)
    await loadGoals();
    setEditingGoal(null);
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (confirm("Вы уверены, что хотите удалить эту цель?")) {
      // Здесь нужно добавить метод удаления в dataManager
      await loadGoals();
    }
  };

  const resetForm = () => {
    setNewGoal({
      title: "",
      description: "",
      bigSteps: ["", "", ""],
      smallSteps: [""],
    });
  };

  const addBigStep = () => {
    if (newGoal.bigSteps.length < 3) {
      setNewGoal((prev) => ({
        ...prev,
        bigSteps: [...prev.bigSteps, ""],
      }));
    }
  };

  const addSmallStep = () => {
    setNewGoal((prev) => ({
      ...prev,
      smallSteps: [...prev.smallSteps, ""],
    }));
  };

  const updateBigStep = (index: number, value: string) => {
    const updatedSteps = [...newGoal.bigSteps];
    updatedSteps[index] = value;
    setNewGoal((prev) => ({ ...prev, bigSteps: updatedSteps }));
  };

  const updateSmallStep = (index: number, value: string) => {
    const updatedSteps = [...newGoal.smallSteps];
    updatedSteps[index] = value;
    setNewGoal((prev) => ({ ...prev, smallSteps: updatedSteps }));
  };

  const removeSmallStep = (index: number) => {
    if (newGoal.smallSteps.length > 1) {
      const updatedSteps = newGoal.smallSteps.filter((_, i) => i !== index);
      setNewGoal((prev) => ({ ...prev, smallSteps: updatedSteps }));
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "from-green-500 to-emerald-500";
    if (percentage >= 50) return "from-yellow-500 to-orange-500";
    if (percentage >= 25) return "from-orange-500 to-red-500";
    return "from-red-500 to-pink-500";
  };

  if (loading) {
    return (
      <div className="min-h-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-gray-600">Загрузка целей...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-3 md:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
            Мои цели
          </h1>
          <p className="text-white/80 text-xs md:text-sm">
            Ставьте цели и отслеживайте прогресс
          </p>
        </div>

        {/* Кнопка добавления цели */}
        {!showForm && !editingGoal && (
          <div className="text-center mb-4 md:mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="bg-white/90 backdrop-blur-sm text-purple-600 py-2 md:py-3 px-4 md:px-6 rounded-lg font-semibold hover:bg-white transition-all duration-200 flex items-center justify-center mx-auto shadow-lg"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Новая цель
            </button>
          </div>
        )}

        {/* Форма создания/редактирования цели */}
        {(showForm || editingGoal) && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-xl border border-white/20 mb-4 md:mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                {editingGoal ? "Редактировать цель" : "Новая цель"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingGoal(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={
                editingGoal
                  ? (e) => {
                      e.preventDefault();
                      handleUpdateGoal(editingGoal);
                    }
                  : handleSubmit
              }
            >
              {/* Основная информация */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Название цели *
                  </label>
                  <input
                    type="text"
                    value={editingGoal ? editingGoal.title : newGoal.title}
                    onChange={(e) =>
                      editingGoal
                        ? setEditingGoal({
                            ...editingGoal,
                            title: e.target.value,
                          })
                        : setNewGoal((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                    }
                    placeholder="Например: Выучить английский язык"
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Описание цели
                  </label>
                  <textarea
                    value={
                      editingGoal
                        ? editingGoal.description
                        : newGoal.description
                    }
                    onChange={(e) =>
                      editingGoal
                        ? setEditingGoal({
                            ...editingGoal,
                            description: e.target.value,
                          })
                        : setNewGoal((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                    }
                    placeholder="Опишите вашу цель более подробно..."
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none text-sm md:text-base"
                    rows={2}
                  />
                </div>
              </div>

              {/* 3 больших шага */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700">
                    3 больших шага *
                  </label>
                  <span className="text-xs text-gray-500">
                    {editingGoal
                      ? editingGoal.bigSteps.filter((s) => s.trim()).length
                      : newGoal.bigSteps.filter((s) => s.trim()).length}
                    /3
                  </span>
                </div>

                {(editingGoal ? editingGoal.bigSteps : newGoal.bigSteps).map(
                  (step, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) =>
                          editingGoal
                            ? setEditingGoal((prev) => {
                                const newSteps = [...prev.bigSteps];
                                newSteps[index] = e.target.value;
                                return { ...prev, bigSteps: newSteps };
                              })
                            : updateBigStep(index, e.target.value)
                        }
                        placeholder={`Большой шаг ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                        required
                      />
                    </div>
                  )
                )}
              </div>

              {/* Маленькие шаги */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700">
                    Маленькие шаги
                  </label>
                  <button
                    type="button"
                    onClick={addSmallStep}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить шаг
                  </button>
                </div>

                {(editingGoal
                  ? editingGoal.smallSteps
                  : newGoal.smallSteps
                ).map((step, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) =>
                        editingGoal
                          ? setEditingGoal((prev) => {
                              const newSteps = [...prev.smallSteps];
                              newSteps[index] = e.target.value;
                              return { ...prev, smallSteps: newSteps };
                            })
                          : updateSmallStep(index, e.target.value)
                      }
                      placeholder={`Маленький шаг ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                    />
                    {(editingGoal ? editingGoal.smallSteps : newGoal.smallSteps)
                      .length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          editingGoal
                            ? setEditingGoal((prev) => ({
                                ...prev,
                                smallSteps: prev.smallSteps.filter(
                                  (_, i) => i !== index
                                ),
                              }))
                            : removeSmallStep(index)
                        }
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Кнопки */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 md:py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center shadow-lg"
                >
                  <Save className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  {editingGoal ? "Сохранить" : "Создать цель"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingGoal(null);
                    resetForm();
                  }}
                  className="px-4 py-2 md:py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Список целей */}
        <div className="space-y-4 md:space-y-6">
          {goals.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 md:p-8 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Нет целей
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Создайте свою первую цель чтобы начать отслеживать прогресс
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Создать цель
              </button>
            </div>
          ) : (
            goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-white/20"
              >
                {/* Заголовок и прогресс */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 space-y-3 md:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <Target className="w-5 h-5 md:w-6 md:h-6 text-purple-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1">
                          {goal.title}
                        </h3>
                        {goal.description && (
                          <p className="text-gray-600 text-sm mb-2">
                            {goal.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(goal.createdAt).toLocaleDateString(
                                "ru-RU"
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              Прогресс: {Math.round(progress[goal.id] || 0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Кнопки действий */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingGoal(goal)}
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      title="Редактировать"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Прогресс бар */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(
                        progress[goal.id] || 0
                      )} transition-all duration-500`}
                      style={{ width: `${progress[goal.id] || 0}%` }}
                    />
                  </div>
                </div>

                {/* Большие шаги */}
                <div className="space-y-3 mb-4">
                  <h4 className="font-semibold text-gray-700 text-sm">
                    Большие шаги:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {goal.bigSteps
                      .filter((step) => step.trim())
                      .map((step, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg border border-purple-100"
                        >
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-sm text-gray-700">{step}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Маленькие шаги */}
                {goal.smallSteps.filter((step) => step.trim()).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700 text-sm">
                      Маленькие шаги:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {goal.smallSteps
                        .filter((step) => step.trim())
                        .map((step, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span className="text-xs text-gray-600">
                              {step}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
