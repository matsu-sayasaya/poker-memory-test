'use client'

import { useState } from 'react'
import { parseCSV, Question } from '../utils/csvParser'
import MemoryCheckTool from './components/MemoryCheckTool'
import CsvUploader from './components/CsvUploader'

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    setError(null)
    setQuestions([])
    try {
      const uploadedQuestions = await parseCSV(file)
      setQuestions(uploadedQuestions)
    } catch (error) {
      console.error('Error parsing CSV:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred while parsing the CSV file')
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Memory Check Tool</h1>
      <CsvUploader onUpload={handleUpload} />
      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}
      {questions.length > 0 ? (
        <MemoryCheckTool questions={questions} />
      ) : (
        <p className="text-center text-gray-600">
          {error ? 'Please fix the CSV file and try uploading again.' : 'Please upload a CSV file to start the memory check.'}
        </p>
      )}
    </main>
  )
}

