import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // This is a one-time setup endpoint - in production, you'd want to protect this
    const adminData = {
      email: 'admin@tasarpoo.com',
      password: 'admin123', // Change this in production
      name: 'System Administrator',
      role: 'admin'
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 12)

    // Create admin user
    const admin = await db.admin.create({
      data: {
        email: adminData.email,
        password: hashedPassword,
        name: adminData.name,
        role: adminData.role,
      }
    })

    // Create sample announcements
    await db.announcement.createMany({
      data: [
        {
          titleNe: 'नयाँ कृषि तालिम कार्यक्रम',
          titleEn: 'New Agricultural Training Program',
          contentNe: 'हामी आधुनिक कृषि प्रविधिहरूमा तालिम कार्यक्रम आयोजना गर्दैछौं। कृपया सहभागिता गर्नुहोस्।',
          contentEn: 'We are organizing training programs on modern agricultural techniques. Please participate.',
          excerptNe: 'आधुनिक कृषि प्रविधिमा तालिम',
          excerptEn: 'Training on modern farming techniques',
          category: 'Training',
          status: 'published',
          isFeatured: true,
          author: 'Cooperative Management',
          publishedAt: new Date()
        },
        {
          titleNe: 'विशेष कर्जा योजना',
          titleEn: 'Special Loan Scheme',
          contentNe: 'यो सिजनका लागि कम ब्याजदरमा कृषि कर्जा उपलब्ध छ।',
          contentEn: 'Agricultural loans are available at low interest rates for this season.',
          excerptNe: 'कम ब्याजदरमा कृषि कर्जा',
          excerptEn: 'Low interest agricultural loans',
          category: 'Finance',
          status: 'published',
          isFeatured: false,
          author: 'Loan Department',
          publishedAt: new Date()
        }
      ]
    })

    // Create sample training events
    await db.trainingEvent.createMany({
      data: [
        {
          titleNe: 'आधुनिक खेती प्रविधि तालिम',
          titleEn: 'Modern Farming Techniques Training',
          descriptionNe: 'यो तालिममा आधुनिक खेती प्रविधिहरू, प्राकृतिक मल उपयोग, र पानी व्यवस्थापनको बारेमा जानकारी दिइनेछ।',
          descriptionEn: 'This training will cover modern farming techniques, organic fertilizer use, and water management.',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          time: '10:00 AM - 4:00 PM',
          locationNe: 'थाक्रे -४ बहुनस्थन, धादिङ्ग',
          locationEn: 'Thakre-4 Bahunasthan, Dhading',
          topic: 'Modern Farming Techniques',
          instructor: 'Dr. Ram Bahadur Gurung',
          maxParticipants: 30,
          currentParticipants: 12,
          status: 'upcoming',
          isActive: true
        },
        {
          titleNe: 'बाली व्यवस्थापन कार्यशाला',
          titleEn: 'Crop Management Workshop',
          descriptionNe: 'यो कार्यशालामा विभिन्न बालीहरूको उत्पादन, रोग नियन्त्रण, र बजारीको बारेमा छलफल गरिनेछ।',
          descriptionEn: 'This workshop will discuss production of various crops, disease control, and marketing.',
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          time: '11:00 AM - 3:00 PM',
          locationNe: 'थाक्रे -४ बहुनस्थन, धादिङ्ग',
          locationEn: 'Thakre-4 Bahunasthan, Dhading',
          topic: 'Crop Management',
          instructor: 'Ms. Sita Kumari',
          maxParticipants: 25,
          currentParticipants: 8,
          status: 'upcoming',
          isActive: true
        }
      ]
    })

    // Create sample inquiries
    await db.inquiry.createMany({
      data: [
        {
          name: 'Hari Bahadur Magar',
          email: 'hari.magar@email.com',
          phone: '+977-9841234567',
          subject: 'कृषि कर्जाको बारेमा सोध',
          message: 'म माँझो खेतीका लागि कर्जा लिन चाहन्छु। के प्रक्रिया के हो? कति रकम सम्म दिनुहुन्छ?',
          priority: 'normal',
          status: 'pending'
        },
        {
          name: 'Gita Kumari',
          email: 'gita.kumari@email.com',
          phone: '+977-9856789123',
          subject: 'तालिम कार्यक्रममा सहभागिता',
          message: 'म आगामो तालिम कार्यक्रममा सहभागी हुन चाहन्छु। के लागि आवश्यक छ?',
          priority: 'high',
          status: 'read'
        }
      ]
    })

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      admin: {
        email: adminData.email,
        password: adminData.password // Only return this for initial setup
      }
    })

  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}