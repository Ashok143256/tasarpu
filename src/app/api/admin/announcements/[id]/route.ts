import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET single announcement
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const announcement = await db.announcement.findUnique({
      where: { id: params.id }
    })

    if (!announcement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: announcement
    })

  } catch (error) {
    console.error('Get announcement error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update announcement
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    // Check if announcement exists
    const existingAnnouncement = await db.announcement.findUnique({
      where: { id: params.id }
    })

    if (!existingAnnouncement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
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
    if (data.contentNe !== undefined) updateData.contentNe = data.contentNe
    if (data.contentEn !== undefined) updateData.contentEn = data.contentEn
    if (data.excerptNe !== undefined) updateData.excerptNe = data.excerptNe
    if (data.excerptEn !== undefined) updateData.excerptEn = data.excerptEn
    if (data.category !== undefined) updateData.category = data.category
    if (data.status !== undefined) {
      updateData.status = data.status
      // Set publishedAt when status changes to published
      if (data.status === 'published' && existingAnnouncement.status !== 'published') {
        updateData.publishedAt = new Date()
      }
    }
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured
    if (data.author !== undefined) updateData.author = data.author

    // Update announcement
    const announcement = await db.announcement.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: announcement
    })

  } catch (error) {
    console.error('Update announcement error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE announcement
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if announcement exists
    const existingAnnouncement = await db.announcement.findUnique({
      where: { id: params.id }
    })

    if (!existingAnnouncement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      )
    }

    // Delete announcement
    await db.announcement.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Announcement deleted successfully'
    })

  } catch (error) {
    console.error('Delete announcement error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}