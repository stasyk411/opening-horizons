import React, { useState } from 'react';
import { Reflection } from '../../types';

interface ReflectionTabProps {
  reflections: Reflection[];
  saveReflections: (reflections: Reflection[]) => void;
  settings: { archetype: string };
  isMobile: boolean;
}
const ReflectionTab = () => {
    const [answers, setAnswers] = useState({
      question1: "",
      question2: "",
      question3: "",
      question4: "",
      question5: "",
    });

    const saveReflection = () => {
      if (!answers.question1.trim()) {
        alert("Пожалуйста, ответьте хотя бы на первый вопрос");
        return;
      }

      const newReflection: Reflection = {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        ...answers,
        archetype: settings.archetype,
        createdAt: new Date().toISOString(),
      };

      saveReflections([...reflections, newReflection]);
      setAnswers({
        question1: "",
        question2: "",
        question3: "",
        question4: "",
        question5: "",
      });
      alert("? Анализ сохранен!");
    };

