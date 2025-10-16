import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { db } from "./config";
import { Task } from "../../shared/types";

// Коллекция задач в Firestore
const tasksCollection = collection(db, "tasks");

// Добавить задачу
export const addTask = async (task: Omit<Task, "id">): Promise<string> => {
  try {
    const docRef = await addDoc(tasksCollection, {
      ...task,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

// Обновить задачу
export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  try {
    const taskDoc = doc(db, "tasks", taskId);
    await updateDoc(taskDoc, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Удалить задачу
export const deleteTask = async (taskId: string) => {
  try {
    const taskDoc = doc(db, "tasks", taskId);
    await deleteDoc(taskDoc);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// УПРОЩЕННЫЙ ЗАПРОС (без сортировки)
export const subscribeToUserTasks = (
  userId: string, 
  callback: (tasks: Task[]) => void
) => {
  const userTasksQuery = query(
    tasksCollection,
    where("userId", "==", userId)
    // Убрали orderBy чтобы не ждать индекс
  );

  return onSnapshot(userTasksQuery, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];
    
    // Сортируем на клиенте
    const sortedTasks = tasks.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    callback(sortedTasks);
  });
};
