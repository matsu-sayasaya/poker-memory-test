'use client'

import { useState } from 'react'

interface Props {
  onUpload: (file: File) => Promise<void>
}

export default function CsvUploader({ onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (file) {
      setUploading(true)
      try {
        await onUpload(file)
      } catch (error) {
        console.error('Upload error:', error)
      } finally {
        setUploading(false)
        setFile(null)
      }
    }
  }

  return (
    <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-2"
        disabled={uploading}
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {uploading ? 'Processing...' : 'Upload CSV'}
      </button>
    </div>
  )
}

