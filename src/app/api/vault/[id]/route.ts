import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { getUserFromToken } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function PUT(req: Request) {
  try {
    const user = await getUserFromToken()
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const vaultItems = db.collection('vaultitems')

    const id = req.url.split('/').pop()
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
    }

    const body = await req.json()
    const { title, username, password, url, notes } = body

    if (!title || !password) {
      return NextResponse.json({ message: 'Title and password are required' }, { status: 400 })
    }

    const existingItem = await vaultItems.findOne({ _id: new ObjectId(id), userId: user.userId })
    if (!existingItem) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 })
    }

    const updatedItem = {
      title,
      username: username || '',
      password,
      url: url || '',
      notes: notes || '',
      updatedAt: new Date()
    }

    await vaultItems.updateOne(
      { _id: new ObjectId(id), userId: user.userId },
      { $set: updatedItem }
    )

    return NextResponse.json({ message: 'Item updated successfully' })
  } catch (error) {
    console.error('PUT vault error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getUserFromToken()
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const vaultItems = db.collection('vaultitems')

    const id = req.url.split('/').pop()
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
    }

    const existingItem = await vaultItems.findOne({ _id: new ObjectId(id), userId: user.userId })
    if (!existingItem) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 })
    }

    await vaultItems.deleteOne({ _id: new ObjectId(id), userId: user.userId })

    return NextResponse.json({ message: 'Item deleted successfully' })
  } catch (error) {
    console.error('DELETE vault error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
