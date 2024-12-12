'use client'

import { useState } from 'react'
import { Question } from '../utils/csvParser'

export default function MemoryCheckTool({ questions }: { questions: Question[] }) {
  const [answers, setAnswers] = useState<{ [key: number]: { B: string; C: string } }>(
    questions.reduce((acc, _, index) => ({ ...acc, [index]: { B: '', C: '' } }), {})
  );
  const [results, setResults] = useState<{ [key: number]: { B: string; C: string } }>({});

  const handleInputChange = (index: number, field: 'B' | 'C', value: string) => {
    setAnswers(prev => ({
      ...prev,
      [index]: { ...prev[index], [field]: value },
    }));
  };

  const checkAnswer = (index: number) => {
    const question = questions[index];
    const userAnswer = answers[index];
    const result = {
      B: getResult(Number(userAnswer.B), question.answerB),
      C: getResult(Number(userAnswer.C), question.answerC),
    };
    setResults(prev => ({ ...prev, [index]: result }));
  };

  const getResult = (userAnswer: number, correctAnswer: number) => {
    if (isNaN(userAnswer)) return 'NG';
    const diff = Math.abs(userAnswer - correctAnswer);
    if (diff === 0) return 'excellent';
    if (diff <= 5) return 'good';
    return 'NG';
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-yellow-600';
      case 'NG': return 'text-red-600';
      default: return '';
    }
  };

  return (
    <div className="space-y-4 p-8">
      {questions.map((question, index) => (
        <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="p-4 grid grid-cols-12 gap-4 items-center">
            <div className="col-span-3">
              <h3 className="text-sm font-medium text-gray-900">{question.condition}</h3>
            </div>
            <div className="col-span-2">
              <input
                type="number"
                value={answers[index].B}
                onChange={(e) => handleInputChange(index, 'B', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Size %"
              />
            </div>
            <div className="col-span-2">
              <input
                type="number"
                value={answers[index].C}
                onChange={(e) => handleInputChange(index, 'C', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Freq %"
              />
            </div>
            <div className="col-span-2">
              <button
                onClick={() => checkAnswer(index)}
                className="w-full px-3 py-1 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Check
              </button>
            </div>
            <div className="col-span-3 text-right">
              {results[index] && (
                <>
                  <p className={`text-xs ${getResultColor(results[index].B)}`}>
                    Size: {results[index].B} (正解: {question.answerB}%)
                  </p>
                  <p className={`text-xs ${getResultColor(results[index].C)}`}>
                    Freq: {results[index].C} (正解: {question.answerC}%)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

