import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Instead of saving the file, we'll just return a success message
    // The actual parsing will be done on the client side
    return NextResponse.json({ message: 'File received successfully' })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: `Failed to process upload: ${error.message}` }, { status: 500 })
  }
}

