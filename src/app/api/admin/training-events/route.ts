import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET all training events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }

    // Get training events
    const events = await db.trainingEvent.findMany({
      where,
      orderBy: { date: 'asc' },
      skip,
      take: limit,
    })

    // Get total count
    const total = await db.trainingEvent.count({ where })

    return NextResponse.json({
      success: true,
      data: events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get training events error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create training event
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = [
      'titleNe', 'titleEn', 'descriptionNe', 'descriptionEn',
      'date', 'time', 'locationNe', 'locationEn', 'topic', 'instructor'
    ]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Parse date
    const eventDate = new Date(data.date)
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Create training event
    const event = await db.trainingEvent.create({
      data: {
        titleNe: data.titleNe,
        titleEn: data.titleEn,
        descriptionNe: data.descriptionNe,
        descriptionEn: data.descriptionEn,
        date: eventDate,
        time: data.time,
        locationNe: data.locationNe,
        locationEn: data.locationEn,
        topic: data.topic,
        instructor: data.instructor,
        maxParticipants: data.maxParticipants || null,
        currentParticipants: 0,
        status: data.status || 'upcoming',
        isActive: data.isActive !== undefined ? data.isActive : true,
      }
    })

    return NextResponse.json({
      success: true,
      data: event
    })

  } catch (error) {
    console.error('Create training event error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}