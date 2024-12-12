'use client'

import { Suspense, useState } from 'react'
import MemoryCheckTool from '../components/MemoryCheckTool'
import CsvUploader from '../components/CsvUploader'
import { Question } from '../utils/csvParser'

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([])

  const handleQuestionsLoaded = (loadedQuestions: Question[]) => {
    setQuestions(loadedQuestions)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
          Poker Memory Test
        </h1>
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <CsvUploader onQuestionsLoaded={handleQuestionsLoaded} />
            {questions.length > 0 ? (
              <MemoryCheckTool questions={questions} />
            ) : (
              <p className="text-center text-gray-600 p-8">
                Please upload a CSV file to start the memory check.
              </p>
            )}
          </Suspense>
        </div>
      </div>
    </main>
  )
}

