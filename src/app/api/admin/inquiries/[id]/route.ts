import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET single inquiry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inquiry = await db.inquiry.findUnique({
      where: { id: params.id }
    })

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: inquiry
    })

  } catch (error) {
    console.error('Get inquiry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update inquiry (status, notes, priority)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    // Check if inquiry exists
    const existingInquiry = await db.inquiry.findUnique({
      where: { id: params.id }
    })

    if (!existingInquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    }

    // Only update fields that are provided
    if (data.status !== undefined) updateData.status = data.status
    if (data.priority !== undefined) updateData.priority = data.priority
    if (data.notes !== undefined) updateData.notes = data.notes

    // Update inquiry
    const inquiry = await db.inquiry.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: inquiry
    })

  } catch (error) {
    console.error('Update inquiry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE inquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if inquiry exists
    const existingInquiry = await db.inquiry.findUnique({
      where: { id: params.id }
    })

    if (!existingInquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      )
    }

    // Delete inquiry
    await db.inquiry.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Inquiry deleted successfully'
    })

  } catch (error) {
    console.error('Delete inquiry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}