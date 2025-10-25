interface PlanningTabProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const PlanningTab = ({ tasks, setTasks }: PlanningTabProps) => {
