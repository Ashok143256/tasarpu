import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all announcements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }
    if (category && category !== 'all') {
      where.category = category
    }

    // Get announcements
    const announcements = await db.announcement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })

    // Get total count
    const total = await db.announcement.count({ where })

    return NextResponse.json({
      success: true,
      data: announcements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get announcements error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create announcement
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = ['titleNe', 'titleEn', 'contentNe', 'contentEn', 'category', 'author']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Create announcement
    const announcement = await db.announcement.create({
      data: {
        titleNe: data.titleNe,
        titleEn: data.titleEn,
        contentNe: data.contentNe,
        contentEn: data.contentEn,
        excerptNe: data.excerptNe || null,
        excerptEn: data.excerptEn || null,
        category: data.category,
        status: data.status || 'draft',
        isFeatured: data.isFeatured || false,
        author: data.author,
        publishedAt: data.status === 'published' ? new Date() : null,
      }
    })

    return NextResponse.json({
      success: true,
      data: announcement
    })

  } catch (error) {
    console.error('Create announcement error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}