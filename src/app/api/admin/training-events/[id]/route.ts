import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET single training event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await db.trainingEvent.findUnique({
      where: { id: params.id }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Training event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: event
    })

  } catch (error) {
    console.error('Get training event error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update training event
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    // Check if event exists
    const existingEvent = await db.trainingEvent.findUnique({
      where: { id: params.id }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Training event not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    }

    // Only update fields that are provided
    if (data.titleNe !== undefined) updateData.titleNe = data.titleNe
    if (data.titleEn !== undefined) updateData.titleEn = data.titleEn
    if (data.descriptionNe !== undefined) updateData.descriptionNe = data.descriptionNe
    if (data.descriptionEn !== undefined) updateData.descriptionEn = data.descriptionEn
    if (data.date !== undefined) {
      const eventDate = new Date(data.date)
      if (isNaN(eventDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        )
      }
      updateData.date = eventDate
    }
    if (data.time !== undefined) updateData.time = data.time
    if (data.locationNe !== undefined) updateData.locationNe = data.locationNe
    if (data.locationEn !== undefined) updateData.locationEn = data.locationEn
    if (data.topic !== undefined) updateData.topic = data.topic
    if (data.instructor !== undefined) updateData.instructor = data.instructor
    if (data.maxParticipants !== undefined) updateData.maxParticipants = data.maxParticipants
    if (data.currentParticipants !== undefined) updateData.currentParticipants = data.currentParticipants
    if (data.status !== undefined) updateData.status = data.status
    if (data.isActive !== undefined) updateData.isActive = data.isActive

    // Update training event
    const event = await db.trainingEvent.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: event
    })

  } catch (error) {
    console.error('Update training event error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE training event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if event exists
    const existingEvent = await db.trainingEvent.findUnique({
      where: { id: params.id }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Training event not found' },
        { status: 404 }
      )
    }

    // Delete training event
    await db.trainingEvent.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Training event deleted successfully'
    })

  } catch (error) {
    console.error('Delete training event error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}