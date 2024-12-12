'use client'

import { useState } from 'react';
import { Question } from '../../utils/csvParser';

interface Props {
  questions: Question[];
}

export default function MemoryCheckTool({ questions }: Props) {
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
    <div className="space-y-6">
      {questions.map((question, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">{question.condition}</h3>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size[%]</label>
                <input
                  type="number"
                  value={answers[index].B}
                  onChange={(e) => handleInputChange(index, 'B', e.target.value)}
                  className="border rounded px-3 py-1.5 w-24"
                  placeholder="Size"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Freq[%]</label>
                <input
                  type="number"
                  value={answers[index].C}
                  onChange={(e) => handleInputChange(index, 'C', e.target.value)}
                  className="border rounded px-3 py-1.5 w-24"
                  placeholder="Freq"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => checkAnswer(index)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Check
              </button>
              {results[index] && (
                <div className="flex flex-col gap-1">
                  <div className={getResultColor(results[index].B)}>
                    Size: {results[index].B} (正解: {question.answerB}%)
                  </div>
                  <div className={getResultColor(results[index].C)}>
                    Freq: {results[index].C} (正解: {question.answerC}%)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

