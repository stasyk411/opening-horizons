const LifeWheelApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<
    "planning" | "goals" | "reflection" | "settings"
  >("planning");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [settings, setSettings] = useState<Settings>({
    archetype: "balanced",
    darkTheme: false,
    notifications: true,
    autoSave: true,
    colorScheme: "purple",
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentGoalId, setCurrentGoalId] = useState<number | null>(null);
  const [stepText, setStepText] = useState("");
  const [showStepForm, setShowStepForm] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);

  // Определение мобильного устройства
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Загрузка данных
  useEffect(() => {
    const savedTasks = localStorage.getItem("life-wheel-tasks");
    const savedGoals = localStorage.getItem("life-wheel-goals");
    const savedReflections = localStorage.getItem("life-wheel-reflections");
    const savedSettings = localStorage.getItem("life-wheel-settings");

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedReflections) setReflections(JSON.parse(savedReflections));
    if (savedSettings)
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
  }, []);

  // Сохранение данных
  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem("life-wheel-tasks", JSON.stringify(newTasks));
  };

  const saveGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    localStorage.setItem("life-wheel-goals", JSON.stringify(newGoals));
  };

  const saveReflections = (newReflections: Reflection[]) => {
    setReflections(newReflections);
    localStorage.setItem(
      "life-wheel-reflections",
      JSON.stringify(newReflections)
    );
  };

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem("life-wheel-settings", JSON.stringify(newSettings));
  };

  // Вспомогательные функции
  const getSphereName = (sphere: string) => {
    const spheres: { [key: string]: string } = {
      health: "Здоровье",
      career: "Карьера",
      family: "Семья",
      finance: "Финансы",
      development: "Развитие",
      hobby: "Хобби",
    };
    return spheres[sphere] || sphere;
  };

