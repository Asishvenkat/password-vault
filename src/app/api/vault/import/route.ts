import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, merge = false } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid import data' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const vaultItems = db.collection('vaultitems');

    let importedCount = 0;
    let skippedCount = 0;

    for (const item of items) {
      // Validate required fields
      if (!item.title || !item.password) {
        skippedCount++;
        continue;
      }

      // Check for duplicates if not merging
      if (!merge) {
        const existing = await vaultItems.findOne({
          userId: user.userId,
          title: item.title,
          username: item.username || '',
          url: item.url || ''
        });
        if (existing) {
          skippedCount++;
          continue;
        }
      }

      // Create new item
      const newItem = {
        userId: user.userId,
        title: item.title,
        username: item.username || '',
        password: item.password, // Already encrypted
        url: item.url || '',
        notes: item.notes || '',
        tags: Array.isArray(item.tags) ? item.tags : [],
        folder: item.folder || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await vaultItems.insertOne(newItem);
      importedCount++;
    }

    return NextResponse.json({
      message: 'Import completed',
      imported: importedCount,
      skipped: skippedCount
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}
