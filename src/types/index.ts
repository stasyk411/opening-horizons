export interface Task {


export {};  id: number;


export {};  text: string;


export {};  sphere: string;


export {};  startTime?: string;


export {};  endTime?: string;


export {};  date?: string;


export {};  completed: boolean;


export {};  createdAt: string;


export {};}


export {};


export {};export interface Goal {


export {};  id: number;


export {};  text: string;


export {};  steps: GoalStep[];


export {};  createdAt: string;


export {};}


export {};


export {};export export interface GoalStep {


export {};  id: number;


export {};  text: string;


export {};  completed: boolean;


export {};}


export {};


export {};export interface Reflection {


export {};  id: number;


export {};  date: string;


export {};  question1: string;


export {};  question2: string;


export {};  question3: string;


export {};  question4: string;


export {};  question5: string;


export {};  archetype: string;


export {};  createdAt: string;


export {};}


export {};


export {};export interface Settings {


export {};  archetype: string;


export {};  darkTheme: boolean;


export {};  notifications: boolean;


export {};  autoSave: boolean;


export {};  colorScheme: string;


export {};}

