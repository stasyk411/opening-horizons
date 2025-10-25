import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  text: string;
  sphere: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  completed: boolean;
  createdAt: string;
}

interface PlanningTabProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}


const validateTime = (time: string) => {
  if (!time) return true;
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

const sphereOptions = [
  'health', 'career', 'finance', 'family', 'development', 'friends', 'hobbies', 'spirit'
];

const timeOptions = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

  const PlanningTab = ({ tasks, setTasks }: PlanningTabProps) => {
    const [taskText, setTaskText] = useState("");
    const [taskSphere, setTaskSphere] = useState("health");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [taskDate, setTaskDate] = useState(
      new Date().toISOString().split("T")[0]
    );

    const addTask = (withDate: boolean = true) => {
      if (!taskText.trim()) {
        alert("Введите текст задачи!");
        return;
      }

      // ИСПРАВЛЕНА ВАЛИДАЦИЯ ВРЕМЕНИ
      if (startTime && !validateTime(startTime)) {
        alert("Пожалуйста, введите корректное время начала в формате ЧЧ:MM");
        return;
      }

      if (endTime && !validateTime(endTime)) {
        alert("Пожалуйста, введите корректное время окончания в формате ЧЧ:MM");
        return;
      }

      const newTask: Task = {
        id: Date.now(),
        text: taskText,
        sphere: taskSphere,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        date: withDate ? taskDate : undefined,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      saveTasks([...tasks, newTask]);
      setTaskText("");
      setStartTime("");
      setEndTime("");

      alert("? Задача добавлена!");
    };

    const toggleTaskCompletion = (taskId: number) => {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      saveTasks(updatedTasks);
    };

    const deleteTask = (taskId: number) => {
      if (confirm("Удалить задачу?")) {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        saveTasks(updatedTasks);
      }
    };

    const today = new Date().toISOString().split("T")[0];
    const todayTasks = tasks.filter(
      (task) => task.date === today && !task.completed
    );
    const futureTasks = tasks.filter(
      (task) => task.date && task.date > today && !task.completed
    );
    const noDateTasks = tasks.filter((task) => !task.date && !task.completed);

    return (
      <div
        style={{
          padding: isMobile ? "15px" : "20px",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <h2
          style={{
            color: "#8A2BE2",
            marginBottom: "20px",
            fontSize: isMobile ? "1.5em" : "2em",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          Планирование Дня
        </h2>

        {/* Выбор архетипа */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: isMobile ? "1.2em" : "1.5em" }}>
            Выберите тип дня
          </h3>
          <div
            style={{
              display: "flex",
              gap: isMobile ? "8px" : "15px",
              marginTop: "15px",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            {[
              {
                key: "productive",
                name: "ПРОДУКТИВНЫЙ",
                icon: "??",
                desc: "Сфокусируйтесь на важных задачах",
              },
              {
                key: "balanced",
                name: "СБАЛАНСИРОВАННЫЙ",
                icon: "??",
                desc: "Равномерное распределение энергии",
              },
              {
                key: "recovery",
                name: "ВОССТАНАВЛИВАЮЩИЙ",
                icon: "??",
                desc: "День для отдыха и восстановления",
              },
            ].map((arch) => (
              <div
                key={arch.key}
                onClick={() =>
                  saveSettings({ ...settings, archetype: arch.key })
                }
                style={{
                  flex: 1,
                  padding: isMobile ? "15px" : "20px",
                  background:
                    settings.archetype === arch.key ? "#8A2BE2" : "#f8f8ff",
                  color: settings.archetype === arch.key ? "white" : "#333",
                  borderRadius: "12px",
                  textAlign: "center",
                  cursor: "pointer",
                  border: "2px solid #8A2BE2",
                  minHeight: isMobile ? "auto" : "120px",
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? "1.5em" : "2em",
                    marginBottom: "8px",
                  }}
                >
                  {arch.icon}
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "5px",
                    fontSize: isMobile ? "12px" : "14px",
                  }}
                >
                  {arch.name}
                </div>
                {!isMobile && (
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>
                    {arch.desc}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Форма добавления задачи */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Опишите вашу задачу..."
            style={{
              flex: 1,
              padding: "12px",
              border: "2px solid #8A2BE2",
              borderRadius: "8px",
              fontSize: "16px",
              background: "white",
              color: "#333",
            }}
          />
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexDirection: isMobile ? "row" : "column",
            }}
          >
            <button
              onClick={() => addTask(true)}
              style={{
                padding: "12px 16px",
                background: "#8A2BE2",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
            >
              ? Добавить
            </button>
            <button
              onClick={() => addTask(false)}
              style={{
                padding: "12px 16px",
                background: "#6A0DAD",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
            >
              ? Без даты
            </button>
          </div>
        </div>

        {/* Опции задачи */}
        <div
          style={{
            display: "grid",
            gap: "15px",
            marginBottom: "20px",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "5px",
                fontSize: "14px",
              }}
            >
              Сфера жизни
            </div>
            <select
              value={taskSphere}
              onChange={(e) => setTaskSphere(e.target.value)}
              style={{
                padding: "10px",
                border: "2px solid #8A2BE2",
                borderRadius: "6px",
                width: "100%",
                fontSize: "14px",
                background: "white",
                color: "#333",
              }}
            >
              <option value="health">Здоровье</option>
              <option value="career">Карьера</option>
              <option value="family">Семья</option>
              <option value="finance">Финансы</option>
              <option value="development">Развитие</option>
              <option value="hobby">Хобби</option>
            </select>
          </div>

          <div>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "5px",
                fontSize: "14px",
              }}
            >
              Время выполнения
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(formatTimeInput(e.target.value))}
                placeholder="09:00"
                maxLength={5}
                style={{
                  padding: "10px",
                  border: "2px solid #8A2BE2",
                  borderRadius: "6px",
                  width: isMobile ? "70px" : "80px",
                  textAlign: "center",
                  fontSize: "14px",
                  background: "white",
                  color: "#333",
                }}
              />
              <span style={{ fontSize: "14px" }}>—</span>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(formatTimeInput(e.target.value))}
                placeholder="10:30"
                maxLength={5}
                style={{
                  padding: "10px",
                  border: "2px solid #8A2BE2",
                  borderRadius: "6px",
                  width: isMobile ? "70px" : "80px",
                  textAlign: "center",
                  fontSize: "14px",
                  background: "white",
                  color: "#333",
                }}
              />
            </div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
              Формат: ЧЧ:MM (24-часовой)
            </div>
          </div>

          <div>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "5px",
                fontSize: "14px",
              }}
            >
              Дата выполнения
            </div>
            <input
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              style={{
                padding: "10px",
                border: "2px solid #8A2BE2",
                borderRadius: "6px",
                width: "100%",
                fontSize: "14px",
                background: "white",
                color: "#333",
              }}
            />
          </div>
        </div>

        {/* Списки задач */}
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          <div>
            <h3 style={{ fontSize: isMobile ? "1.1em" : "1.3em" }}>
              ?? Сегодня ({todayTasks.length})
            </h3>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {todayTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskCompletion}
                  onDelete={deleteTask}
                  isMobile={isMobile}
                />
              ))}
              {todayTasks.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#666",
                    background: "#f8f8ff",
                    borderRadius: "8px",
                  }}
                >
                  Задачи отсутствуют
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: isMobile ? "1.1em" : "1.3em" }}>
              ?? Будущие ({futureTasks.length})
            </h3>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {futureTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskCompletion}
                  onDelete={deleteTask}
                  isMobile={isMobile}
                />
              ))}
              {futureTasks.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#666",
                    background: "#f8f8ff",
                    borderRadius: "8px",
                  }}
                >
                  Задачи отсутствуют
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: isMobile ? "1.1em" : "1.3em" }}>
              ? Без даты ({noDateTasks.length})
            </h3>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {noDateTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskCompletion}
                  onDelete={deleteTask}
                  isMobile={isMobile}
                />
              ))}
              {noDateTasks.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#666",
                    background: "#f8f8ff",
                    borderRadius: "8px",
                  }}
                >
                  Задачи отсутствуют
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };


export { PlanningTab };
