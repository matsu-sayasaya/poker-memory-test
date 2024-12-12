'use client'

import { useState } from 'react'
import { parseCSV, Question } from '../utils/csvParser'

interface Props {
  onQuestionsLoaded: (questions: Question[]) => void
}

export default function CsvUploader({ onQuestionsLoaded }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (file) {
      try {
        const questions = await parseCSV(file)
        onQuestionsLoaded(questions)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      }
    }
  }

  return (
    <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
      <div className="max-w-md mx-auto">
        <label
          htmlFor="file-upload"
          className="block w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
        >
          <span>Select CSV file</span>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            accept=".csv"
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>
        <p className="mt-2 text-sm text-gray-500">
          {file ? file.name : 'No file selected'}
        </p>
        <button
          onClick={handleUpload}
          disabled={!file}
          className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload CSV
        </button>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}

