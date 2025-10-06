import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { getUserFromToken } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserFromToken()
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const vaultItems = db.collection('vaultitems')

    const items = await vaultItems.find({ userId: user.userId }).toArray()

    return NextResponse.json({ items })
  } catch (error) {
    console.error('GET vault error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken()
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, username, password, url, notes, tags, folder } = body

    if (!title || !password) {
      return NextResponse.json({ message: 'Title and password are required' }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const vaultItems = db.collection('vaultitems')

    const newItem = {
      userId: user.userId,
      title,
      username: username || '',
      password,
      url: url || '',
      notes: notes || '',
      tags: Array.isArray(tags) ? tags : [],
      folder: folder || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await vaultItems.insertOne(newItem)

    return NextResponse.json({
      message: 'Item created successfully',
      item: { ...newItem, _id: result.insertedId }
    })
  } catch (error) {
    console.error('POST vault error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
