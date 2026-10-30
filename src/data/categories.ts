import { CategoryItem, ComingSoonItem } from './types';

export const CATEGORIES: CategoryItem[] = [
  { id: 'engineering', label: 'Engineering & Technology', labelHindi: 'Engineering और Technology' },
  { id: 'medical', label: 'Medical & Healthcare', labelHindi: 'Medical और Healthcare' },
  { id: 'commerce', label: 'Commerce & Finance', labelHindi: 'Commerce और Finance' },
  { id: 'arts', label: 'Arts, Humanities & Media', labelHindi: 'Arts, Humanities और Media' },
  { id: 'science', label: 'Pure & Applied Sciences', labelHindi: 'Science और Research' },
  { id: 'law', label: 'Law & Legal Studies', labelHindi: 'Law और Legal Studies' },
  { id: 'design', label: 'Design & Creative Arts', labelHindi: 'Design और Creative Arts' },
  { id: 'government', label: 'Civil & Defense Services', labelHindi: 'Civil और Defense Services' },
  { id: 'vocational', label: 'Vocational & Aviation Trades', labelHindi: 'Vocational और Aviation Trades' },
];

export const CATEGORY_ICONS: Record<string, string> = {
  engineering: '⚙️',
  medical: '🩺',
  commerce: '📊',
  arts: '🎭',
  science: '🔬',
  law: '⚖️',
  design: '🎨',
  government: '🏛️',
  vocational: '🛠️',
};

export const COMING_SOON_LIST: ComingSoonItem[] = [
  { id: 'cs-space-tech', title: 'Space Science & Commercial Astronautics', titleHindi: 'Space Science और एस्ट्रोनॉटिक्स', icon: '🚀', category: 'science' },
  { id: 'cs-quantum-computing', title: 'Quantum Hardware & Cryptography', titleHindi: 'क्वांटम कंप्यूटिंग व सुरक्षा', icon: '⚛️', category: 'engineering' },
  { id: 'cs-sports-analytics', title: 'Sports Science & Performance Analytics', titleHindi: 'खेल विज्ञान और प्रदर्शन विश्लेषण', icon: '🏏', category: 'arts' },
  { id: 'cs-sustainable-agritech', title: 'Hydroponics & Precision AgriTech', titleHindi: 'हाइड्रोपोनिक्स व आधुनिक एग्रीटेक', icon: '🌱', category: 'science' },
  { id: 'cs-semiconductor-fab', title: 'Semiconductor Fabrication & Cleanroom Tech', titleHindi: 'सेमीकंडक्टर फैब्रिकेशन', icon: '📟', category: 'engineering' },
];
