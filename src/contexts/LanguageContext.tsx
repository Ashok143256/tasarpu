'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'ne' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation function
const translations: Record<Language, Record<string, string>> = {
  ne: {
    // Navigation
    'nav.home': 'होमपेज',
    'nav.about': 'हाम्रो बारेमा',
    'nav.services': 'सेवाहरू',
    'nav.news': 'समाचार/सूचना',
    'nav.contact': 'सम्पर्क',
    'nav.calculator': 'कर्जा क्याल्कुलेटर',
    'nav.language': 'भाषा',
    
    // Homepage
    'home.title': 'श्री तसर्पु साना किसान कृषि सहकारी संस्था लि',
    'home.subtitle': 'थाक्रे -४ बहुनस्थन, धादिङ्ग',
    'home.motto': 'साना किसानको सहकारी, समृद्ध कृषिको आधार',
    'home.welcome': 'हामी साना किसानहरूको आर्थिक र कृषि विकासमा समर्पित छौं',
    'home.services.title': 'हाम्रा सेवाहरू',
    'home.services.loans': 'कम ब्याजदरमा कृषि कर्जा',
    'home.services.training': 'आधुनिक कृषि तालिम',
    'home.services.seeds': 'उत्तम बिउ र औजार वितरण',
    'home.cta': 'थप जान्नुहोस्',
    
    // About
    'about.title': 'हाम्रो बारेमा',
    'about.registration': 'दर्ता विवरण',
    'about.registration.date': 'दर्ता मिति: २०६६/१०/१६ बि.स.',
    'about.registration.number': 'दर्ता नं: २०६६/०७/०८५',
    'about.mission': 'हाम्रो उद्देश्य',
    'about.mission.text': 'साना किसानहरूलाई कम ब्याजदरमा कर्जा, आधुनिक कृषि तालिम, र उत्तम बिउ तथा कृषि औजारहरू उपलब्ध गराई कृषि क्षेत्रको समग्र विकास गर्नु।',
    'about.vision': 'हाम्रो दृष्टि',
    'about.vision.text': 'एक समृद्ध कृषि समुदाय बनाउँदै साना किसानहरूको जीवनस्तर सुधार गर्ने।',
    'about.values': 'हाम्रा मूल्यहरू',
    'about.values.transparency': 'पारदर्शिता',
    'about.values.cooperation': 'सहकार्य',
    'about.values.sustainability': 'दिगोपन',
    'about.values.empowerment': 'सशक्तिकरण',
    
    // Services
    'services.title': 'हाम्रा सेवाहरू',
    'services.loans.title': 'कृषि कर्जा',
    'services.loans.description': 'साना किसानहरूका लागि कम ब्याजदरमा कृषि कर्जा उपलब्ध गर्दछौं।',
    'services.loans.features': 'विशेषताहरू',
    'services.loans.feature1': 'न्यूनतम ब्याजदर',
    'services.loans.feature2': 'सजिलो किस्तान्त सुविधा',
    'services.loans.feature3': 'छिटो प्रक्रिया',
    'services.training.title': 'कृषि तालिम',
    'services.training.description': 'आधुनिक कृषि प्रविधि र प्रणालीहरूको बारेमा व्यावहारिक तालिम प्रदान गर्दछौं।',
    'services.training.features': 'तालिम विषयहरू',
    'services.training.feature1': 'आधुनिक खेती प्रविधि',
    'services.training.feature2': 'बाली व्यवस्थापन',
    'services.training.feature3': 'प्राकृतिक खेती',
    'services.seeds.title': 'बिउ र औजार',
    'services.seeds.description': 'उत्तम गुणस्तरका बिउ र आधुनिक कृषि औजारहरू उपलब्ध गराउँदछौं।',
    'services.seeds.features': 'उपलब्ध सामग्रीहरू',
    'services.seeds.feature1': 'उत्तम बिउ',
    'services.seeds.feature2': 'कृषि औजारहरू',
    'services.seeds.feature3': 'मल र कीटनाशक',
    
    // News
    'news.title': 'समाचार र सूचनाहरू',
    'news.no.news': 'हाल कुनै समाचार छैन',
    'news.date': 'मिति',
    'news.read.more': 'थप पढ्नुहोस्',
    
    // Contact
    'contact.title': 'सम्पर्क सूचना',
    'contact.address': 'ठेगाना',
    'contact.email': 'इमेल',
    'contact.phone': 'फोन/व्हाट्सएप',
    'contact.map': 'नक्सा',
    'contact.form.title': 'सम्पर्क फारम',
    'contact.form.name': 'नाम',
    'contact.form.message': 'सन्देश',
    'contact.form.submit': 'पठाउनुहोस्',
    
    // Calculator
    'calculator.title': 'कर्जा क्याल्कुलेटर',
    'calculator.loan.amount': 'कर्जा रकम',
    'calculator.interest.rate': 'ब्याजदर (%)',
    'calculator.loan.term': 'कर्जा अवधि (महिना)',
    'calculator.calculate': 'गणना गर्नुहोस्',
    'calculator.monthly.payment': 'मासिक किस्त',
    'calculator.total.payment': 'जम्मा भुक्तानी',
    'calculator.total.interest': 'जम्मा ब्याज',
    
    // Footer
    'footer.copyright': '© २०२४ श्री तसर्पु साना किसान कृषि सहकारी संस्था लि। सर्वाधिकार सुरक्षित।',
    'footer.address': 'थाक्रे -४ बहुनस्थन, धादिङ्ग, नेपाल',
    
    // Common
    'common.loading': 'लोड हुँदैछ...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.close': 'बन्द गर्नुहोस्',
    'common.save': 'बचत गर्नुहोस्',
    'common.cancel': 'रद्द गर्नुहोस्',
    'common.yes': 'हो',
    'common.no': 'होइन',
    'common.back': 'पछाडि',
    'common.next': 'अर्को',
    'common.search': 'खोज्नुहोस्',
    'common.filter': 'फिल्टर',
    'common.all': 'सबै',
    'common.none': 'कुनै पनि होइन',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.news': 'News/Announcements',
    'nav.contact': 'Contact',
    'nav.calculator': 'Loan Calculator',
    'nav.language': 'Language',
    
    // Homepage
    'home.title': 'Shri Tasarpoo Small Farmers Agricultural Cooperative Ltd.',
    'home.subtitle': 'Thakre-4 Bahunasthan, Dhading',
    'home.motto': 'Cooperation for Small Farmers, Foundation for Prosperous Agriculture',
    'home.welcome': 'We are dedicated to the economic and agricultural development of small farmers',
    'home.services.title': 'Our Services',
    'home.services.loans': 'Agricultural Loans at Low Interest',
    'home.services.training': 'Modern Agricultural Training',
    'home.services.seeds': 'Quality Seeds and Tools Distribution',
    'home.cta': 'Learn More',
    
    // About
    'about.title': 'About Us',
    'about.registration': 'Registration Details',
    'about.registration.date': 'Registration Date: 2066/10/16 B.S.',
    'about.registration.number': 'Registration No: 2066/07/085',
    'about.mission': 'Our Mission',
    'about.mission.text': 'To support small farmers with low-interest loans, modern agricultural training, and quality seeds and tools for overall agricultural development.',
    'about.vision': 'Our Vision',
    'about.vision.text': 'To create a prosperous agricultural community and improve the living standards of small farmers.',
    'about.values': 'Our Values',
    'about.values.transparency': 'Transparency',
    'about.values.cooperation': 'Cooperation',
    'about.values.sustainability': 'Sustainability',
    'about.values.empowerment': 'Empowerment',
    
    // Services
    'services.title': 'Our Services',
    'services.loans.title': 'Agricultural Loans',
    'services.loans.description': 'We provide agricultural loans at low interest rates for small farmers.',
    'services.loans.features': 'Features',
    'services.loans.feature1': 'Minimum Interest Rate',
    'services.loans.feature2': 'Easy Installment Facility',
    'services.loans.feature3': 'Quick Processing',
    'services.training.title': 'Agricultural Training',
    'services.training.description': 'We provide practical training on modern agricultural techniques and systems.',
    'services.training.features': 'Training Topics',
    'services.training.feature1': 'Modern Farming Techniques',
    'services.training.feature2': 'Crop Management',
    'services.training.feature3': 'Organic Farming',
    'services.seeds.title': 'Seeds and Tools',
    'services.seeds.description': 'We provide quality seeds and modern agricultural tools.',
    'services.seeds.features': 'Available Materials',
    'services.seeds.feature1': 'Quality Seeds',
    'services.seeds.feature2': 'Agricultural Tools',
    'services.seeds.feature3': 'Fertilizers and Pesticides',
    
    // News
    'news.title': 'News and Announcements',
    'news.no.news': 'No news available',
    'news.date': 'Date',
    'news.read.more': 'Read More',
    
    // Contact
    'contact.title': 'Contact Information',
    'contact.address': 'Address',
    'contact.email': 'Email',
    'contact.phone': 'Phone/WhatsApp',
    'contact.map': 'Map',
    'contact.form.title': 'Contact Form',
    'contact.form.name': 'Name',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Send',
    
    // Calculator
    'calculator.title': 'Loan Calculator',
    'calculator.loan.amount': 'Loan Amount',
    'calculator.interest.rate': 'Interest Rate (%)',
    'calculator.loan.term': 'Loan Term (Months)',
    'calculator.calculate': 'Calculate',
    'calculator.monthly.payment': 'Monthly Payment',
    'calculator.total.payment': 'Total Payment',
    'calculator.total.interest': 'Total Interest',
    
    // Footer
    'footer.copyright': '© 2024 Shri Tasarpoo Small Farmers Agricultural Cooperative Ltd. All rights reserved.',
    'footer.address': 'Thakre-4 Bahunasthan, Dhading, Nepal',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.none': 'None',
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ne')

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}