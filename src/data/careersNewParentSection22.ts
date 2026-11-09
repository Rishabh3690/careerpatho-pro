import { ChildCareer, ParentCareer } from './types';
import { SubstantiveCareerSeed373, buildSubstantiveCareerFromSeed } from './careersExpansion373Part1';

/**
 * NEW COMPLETE PARENT SECTION:
 * Category: 'agriculture' ("Agriculture, Food Tech & Green Sustainability")
 * Parent Hub: 'p-agri-sustainability' ("ICAR Agriculture, Food Technology, Forestry & Green Energy Hub")
 * Contains 22 substantive, non-misleading career pathways with honest statutory/market baselines.
 */
export const agriSustainabilityParents: Record<string, ParentCareer> = {
  'p-agri-sustainability': {
    id: 'p-agri-sustainability',
    isParent: true,
    title: 'Agriculture, Food Technology, Forestry & Green Sustainability Hub (ICAR / NABARD / FSSAI)',
    titleHindi: 'कृषि, फूड टेक्नोलॉजी, वानिकी और हरित ऊर्जा हब (ICAR / NABARD / FSSAI)',
    icon: 'science',
    category: 'agriculture',
    audience: ['Class 12 PCB/PCM/Agri', 'Graduates', 'Rural & Urban Students'],
    tagline:
      '22 real-world careers across ICAR Agricultural Sciences, NABARD/IBPS Rural Banking, FSSAI Food Safety, Dairy & Fisheries, Forestry, and Renewable Sustainability — with honest salary medians and zero false guarantees.',
    taglineHindi:
      'ICAR कृषि विज्ञान, NABARD/IBPS ग्रामीण बैंकिंग, FSSAI खाद्य सुरक्षा, डेयरी, मत्स्य पालन, वानिकी और हरित ऊर्जा में 22 वास्तविक करियर — बिना किसी झूठी वेतन गारंटी के।',
    overview:
      'Agriculture, Food Processing, and Climate Sustainability employ a massive share of India’s workforce and offer dedicated statutory government cadres (IBPS AFO, NABARD Grade-A, FCI Technical Officer, FSSAI Food Safety Officer, State Forest Range Officer, and ICAR ARS Scientist) alongside private agritech, seed, dairy, and ESG careers. Note: Government posts require clearing competitive exams (IBPS/NABARD/PSC), while private farm/processing roles start around ₹2.8–4.5 LPA.',
    overviewHindi:
      'कृषि, खाद्य प्रसंस्करण (Food Processing) और पर्यावरण स्थिरता क्षेत्र में विशेष सरकारी कैडर (IBPS AFO, NABARD ग्रेड-A, FCI तकनीकी अधिकारी, FSSAI खाद्य सुरक्षा अधिकारी, वन रेंज अधिकारी) और प्राइवेट एग्रीटेक, डेयरी व सीड कंपनियों के अवसर शामिल हैं। ध्यान दें: सरकारी पदों के लिए प्रतियोगी परीक्षा पास करना अनिवार्य है, जबकि प्राइवेट सेक्टर में शुरुआती वेतन ₹2.8–4.5 LPA के आसपास होता है।',
    children: [],
    lastVerified: '2026-11-11',
  },
};

const NEW_PARENT_SECTION_22_SEEDS: SubstantiveCareerSeed373[] = [
  {
    id: 'agri-icar-bsc-hons',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'B.Sc (Hons) Agriculture & Agronomy Specialist (ICAR Track)',
    titleHindi: 'बी.एससी (ऑनर्स) कृषि और एग्रोनॉमी विशेषज्ञ (ICAR ट्रैक)',
    stream: 'PCB / PCM / Agriculture (Class 12 with 50% marks)',
    minMarks: 50,
    duration: '4 Years (8 Semesters including RAWE Rural Agricultural Work Experience)',
    cost: 'Govt Agricultural Univ: ₹30,000 – ₹1.4 Lakhs · Private: ₹3.0 – ₹6.5 Lakhs',
    entryLpa: 'Private Agri ₹3.0–4.8 LPA · Govt ADO / IBPS AFO ₹7.5–11.5 LPA (Not Guaranteed)',
    midLpa: '₹7.5–15 LPA',
    seniorLpa: '₹16–28+ LPA',
    exams: ['CUET-UG (ICAR 20% All-India Quota)', 'State Agriculture Entrance (MHT-CET / KCET / UPCATET / JET)', 'IBPS SO (AFO) after graduation'],
    officialUrl: 'https://icar.org.in',
    statutoryBody: 'Indian Council of Agricultural Research (ICAR), Ministry of Agriculture & Farmers Welfare',
    shortDesc:
      'Four-year professional degree required for IBPS Agriculture Field Officer (AFO), State Agriculture Development Officer (ADO), FCI, and seed/crop industry roles.',
    shortDescHindi:
      'IBPS एग्रीकल्चर फील्ड ऑफिसर (AFO), राज्य कृषि विकास अधिकारी (ADO), FCI और सीड/एग्री कंपनियों के लिए 4-वर्षीय प्रोफेशनल डिग्री।',
    substantiveContextEn:
      'B.Sc (Hons) Agriculture accredited by ICAR is the mandatory eligibility qualification for reserved government agricultural posts such as IBPS Agriculture Field Officer (Scale-I Officer in nationalized banks), State PSC Agriculture Development Officer (ADO), and National Seeds Corporation trainees. Realistic check: Only ICAR-accredited colleges qualify for several statutory exams; unplaced private graduates typically begin in field sales or crop advisory at ₹25,000–35,000/month.',
    substantiveContextHi:
      'ICAR से मान्यता प्राप्त 4-वर्षीय B.Sc (Hons) Agriculture डिग्री सरकारी बैंकों में IBPS AFO, राज्य कृषि अधिकारी (ADO) और FCI पदों के लिए अनिवार्य योग्यता है। वास्तविकता: किसी भी प्राइवेट कॉलेज में प्रवेश लेने से पहले उसकी ICAR मान्यता अवश्य जांचें।',
    skills: ['Agronomy & Crop Science', 'Soil Fertility Management', 'Plant Pathology & Pest Control', 'Agricultural Economics', 'Rural Extension (RAWE)'],
    workEnvironments: ['Public Sector Banks (IBPS AFO)', 'State Agriculture Departments', 'Seed & Crop Protection MNCs (Bayer, Syngenta, UPL)'],
  },
  {
    id: 'agri-nabard-grade-a',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'NABARD Grade-A Assistant Manager (Rural & Agri Development Officer)',
    titleHindi: 'NABARD ग्रेड-A असिस्टेंट मैनेजर (ग्रामीण एवं कृषि विकास अधिकारी)',
    stream: 'Any Stream (General Discipline) or Agriculture/Allied Degree (Specialist Discipline) with 60% in Graduation',
    minMarks: 60,
    duration: '3–4 Years Graduation + Competitive Exam (Prelims, Mains & Interview)',
    cost: 'Exam Application Fee: ₹150 – ₹850 (Official NABARD Notification)',
    entryLpa: 'NABARD Grade-A Gross ~₹16–18 LPA (~₹1.0 Lakh/mo In-Hand + Perks · Exam Competitive <1% Selection)',
    midLpa: '₹22–30 LPA (Grade-B / Grade-C Manager)',
    seniorLpa: '₹35–50+ LPA (General Manager / CGM)',
    exams: ['NABARD Grade-A RDBS (Phase-I Prelims, Phase-II Descriptive/Objective Mains & Phase-III Interview)'],
    officialUrl: 'https://www.nabard.org',
    statutoryBody: 'National Bank for Agriculture and Rural Development (NABARD)',
    shortDesc:
      'Apex statutory development bank officer financing rural infrastructure, FPOs, climate resilience, and cooperative banks across India.',
    shortDescHindi:
      'ग्रामीण बुनियादी ढांचे, किसान उत्पादक संगठनों (FPO) और सहकारी बैंकों के वित्तपोषण हेतु शीर्ष वैधानिक विकास बैंक अधिकारी।',
    substantiveContextEn:
      'NABARD Grade-A (Rural Development Banking Service) is one of India’s premier regulatory-level public sector roles alongside RBI Grade-B. Officers appraise state rural infrastructure projects (RIDF), supervise Regional Rural Banks (RRBs), and lead watershed and climate-finance projects. Reality check: Selection ratio is below 1% across India; always maintain a parallel career or corporate backup while preparing.',
    substantiveContextHi:
      'NABARD ग्रेड-A भारत के सबसे प्रतिष्ठित सार्वजनिक क्षेत्र के पदों में से एक है। अधिकारी ग्रामीण बुनियादी ढांचा परियोजनाओं (RIDF) और क्षेत्रीय ग्रामीण बैंकों (RRB) का पर्यवेक्षण करते हैं। वास्तविकता: इसमें चयन दर 1% से भी कम है, इसलिए तैयारी के साथ बैकअप करियर विकल्प अवश्य रखें।',
    skills: ['Agriculture & Rural Development (ARD)', 'Economic & Social Issues (ESI)', 'Financial Project Appraisal', 'Rural Banking Supervision', 'Descriptive Policy Writing'],
    workEnvironments: ['NABARD Head Office Mumbai & State Regional Offices', 'District Development Manager (DDM) Postings', 'Rural Infrastructure & Climate Funds'],
  },
  {
    id: 'agri-ibps-afo',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'IBPS Agriculture Field Officer (AFO Scale-I — Public Sector Banks)',
    titleHindi: 'IBPS एग्रीकल्चर फील्ड ऑफिसर (AFO स्केल-I — सरकारी बैंक अधिकारी)',
    stream: '4-Year Degree in Agriculture, Horticulture, Dairy, Vet, Fisheries, Forestry, or Agri Engineering',
    minMarks: 50,
    duration: '4 Years UG Degree + IBPS SO Exam Cycle (Nov–Mar annually)',
    cost: 'Exam Fee: ₹175 – ₹850 (IBPS Official Portal)',
    entryLpa: 'IBA Scale-I Bank Officer Gross ₹8.5–11.5 LPA (~₹58,000–68,000/mo In-Hand + Leased Accommodation)',
    midLpa: '₹13–18 LPA (Scale-II / Scale-III Manager)',
    seniorLpa: '₹22–32+ LPA (Chief Manager / AGM)',
    exams: ['IBPS SO (Specialist Officer — Prelims, Professional Knowledge Mains & Interview)'],
    officialUrl: 'https://www.ibps.in',
    statutoryBody: 'Institute of Banking Personnel Selection (IBPS) & Public Sector Banks',
    shortDesc:
      'Specialist Scale-I Officer in nationalized banks appraising Kisan Credit Cards (KCC), cold-storage loans, and commercial farm credit.',
    shortDescHindi:
      'सरकारी बैंकों में किसान क्रेडिट कार्ड (KCC), कोल्ड-स्टोरेज लोन और कृषि परियोजनाओं का मूल्यांकन करने वाले विशेषज्ञ स्केल-I अधिकारी।',
    substantiveContextEn:
      'Every year, public sector banks (PNB, Bank of Baroda, Canara Bank, Union Bank, etc.) recruit hundreds of 4-year agriculture/allied graduates directly as Specialist Scale-I Officers via IBPS SO. Because only 4-year agri/allied graduates are eligible, competition is significantly more focused than general bank PO exams.',
    substantiveContextHi:
      'प्रत्येक वर्ष सरकारी बैंक (PNB, बैंक ऑफ बड़ौदा, केनरा बैंक आदि) 4-वर्षीय कृषि/संबद्ध स्नातकों को IBPS SO के माध्यम से सीधे स्केल-I अधिकारी के रूप में नियुक्त करते हैं।',
    skills: ['Priority Sector Lending (PSL) Norms', 'Crop Loan & KCC Appraisal', 'Agronomy & Allied Sector Knowledge', 'NABARD Subsidy Schemes', 'Rural Credit Risk Assessment'],
    workEnvironments: ['Nationalized Bank Rural & Semi-Urban Branches', 'Regional Agri-Business Credit Cells', 'Zonal Priority Sector Departments'],
  },
  {
    id: 'agri-fci-technical',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'Food Corporation of India (FCI) Technical Officer & Quality Controller',
    titleHindi: 'भारतीय खाद्य निगम (FCI) तकनीकी अधिकारी और गुणवत्ता नियंत्रक',
    stream: 'B.Sc Agriculture / Botany / Zoology / Bio-Tech / Food Science / B.Tech Food Eng',
    minMarks: 50,
    duration: '3–4 Years Graduation + FCI Category-II / Category-III Recruitment Exam',
    cost: 'Govt College Degree: ₹25,000 – ₹1.2 Lakhs · FCI Exam Fee: ₹500',
    entryLpa: 'FCI AG-III (Technical) ₹5.5–7.2 LPA · FCI Manager (Technical) ₹10–13 LPA (IDA Pay Scale)',
    midLpa: '₹9.5–16 LPA',
    seniorLpa: '₹18–28+ LPA (AGM / DGM Quality Control)',
    exams: ['FCI Category-III (AG-III Technical Phase-I & II)', 'FCI Category-II (Manager Technical)', 'CWC (Central Warehousing Corp) Junior Technical Assistant'],
    officialUrl: 'https://fci.gov.in',
    statutoryBody: 'Food Corporation of India (FCI), Ministry of Consumer Affairs, Food & Public Distribution',
    shortDesc:
      'Safeguard India’s national foodgrain buffer stocks, scientific silo storage, moisture/pest testing, and PDS quality compliance.',
    shortDescHindi:
      'भारत के राष्ट्रीय खाद्यान्न भंडार, वैज्ञानिक साइलो स्टोरेज, नमी/कीट परीक्षण और सार्वजनिक वितरण प्रणाली (PDS) की गुणवत्ता सुनिश्चित करना।',
    substantiveContextEn:
      'FCI Technical Officers and Central Warehousing Corporation (CWC) Technical Assistants inspect procured wheat and paddy against Fair Average Quality (FAQ) norms, manage fumigation and scientific silo preservation, and prevent post-harvest storage losses across India. Recruitment is notification-based (not every calendar year), so candidates also target state warehousing corporations.',
    substantiveContextHi:
      'FCI तकनीकी अधिकारी और केंद्रीय भंडारण निगम (CWC) के अधिकारी गेहूं और धान की गुणवत्ता जांच (FAQ मानक), वैज्ञानिक साइलो संरक्षण और कीट नियंत्रण का प्रबंधन करते हैं।',
    skills: ['Grain Quality Grading (FAQ Norms)', 'Storage Entomology & Fumigation', 'Moisture & Mycotoxin Testing', 'Silo & Warehouse Logistics', 'Food Safety Standards'],
    workEnvironments: ['FCI Depots & Modern Grain Silos', 'Central Warehousing Corporation (CWC)', 'Regional Quality Control Laboratories'],
  },
  {
    id: 'agri-fssai-food-safety',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'Food Safety Officer (CFSO / State FSO) & Regulatory Compliance Auditor',
    titleHindi: 'खाद्य सुरक्षा अधिकारी (FSSAI CFSO / राज्य FSO) और फूड क्वालिटी ऑडिटर',
    stream: 'PCB / PCM (Degree in Food Technology, Dairy Tech, Biotech, Biochemistry, Microbiology, Agri, or Chemistry)',
    minMarks: 50,
    duration: '3–4 Years UG Degree + FSSAI / State PSC Food Safety Officer Exam',
    cost: '₹40,000 – ₹3.5 Lakhs (Degree Tuition)',
    entryLpa: 'Private QA/QC ₹3.0–5.0 LPA · Govt State FSO / FSSAI CFSO (Level-6/7) ₹6.8–10.5 LPA (Not Guaranteed)',
    midLpa: '₹8.5–15 LPA',
    seniorLpa: '₹16–28+ LPA (Designated Officer / Head of Regulatory Affairs)',
    exams: ['FSSAI Direct Recruitment (Central Food Safety Officer & Technical Officer)', 'State PSC Food Safety Officer (FSO) Exams'],
    officialUrl: 'https://www.fssai.gov.in',
    statutoryBody: 'Food Safety and Standards Authority of India (FSSAI), Ministry of Health & Family Welfare',
    shortDesc:
      'Enforce the Food Safety and Standards Act, inspect commercial food plants, test for adulteration, and manage ISO 22000 / HACCP compliance.',
    shortDescHindi:
      'खाद्य सुरक्षा अधिनियम लागू करना, फूड फैक्ट्रियों का निरीक्षण, मिलावट की जांच और ISO 22000 / HACCP मानकों का ऑडिट करना।',
    substantiveContextEn:
      'Food Safety Officers exercise statutory powers under the FSS Act, 2006 to sample food products, audit manufacturing hygiene, and prosecute adulteration. In the private sector, graduates work as Quality Assurance (QA), HACCP/FSMS auditors, and regulatory labeling specialists for FMCG companies (Nestlé, ITC, Britannia, Haldiram’s, Amul).',
    substantiveContextHi:
      'खाद्य सुरक्षा अधिकारी (FSO) खाद्य सुरक्षा और मानक अधिनियम, 2006 के तहत खाद्य नमूनों की जांच और मिलावट रोकने का वैधानिक कार्य करते हैं। प्राइवेट सेक्टर में FMCG कंपनियों में क्वालिटी एश्योरेंस (QA) के पद मिलते हैं।',
    skills: ['FSS Act 2006 &Codex Alimentarius', 'Food Microbiology & Adulteration Testing', 'HACCP & ISO 22000 Auditing', 'Nutritional Labeling Compliance', 'GC-MS / HPLC Lab Analysis'],
    workEnvironments: ['FSSAI Regional Offices & Ports', 'State Food & Drug Administrations (FDA)', 'FMCG & Export Food Processing Plants'],
  },
  {
    id: 'agri-dairy-tech-ndri',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'B.Tech Dairy Technology & Cooperative Plant Engineer (NDRI / Amul Track)',
    titleHindi: 'बी.टेक डेयरी टेक्नोलॉजी और कोऑपरेटिव प्लांट इंजीनियर (NDRI / अमूल ट्रैक)',
    stream: 'PCM (Class 12 with Physics, Chemistry, Mathematics — min 50% marks)',
    minMarks: 50,
    duration: '4 Years (B.Tech Dairy Technology including In-Plant Dairy Training)',
    cost: 'Govt / ICAR-NDRI: ₹45,000 – ₹1.8 Lakhs · Private: ₹3.5 – ₹6.0 Lakhs',
    entryLpa: 'Dairy Plant Entry ₹3.6–6.5 LPA · Cooperative Federation (GCMMF/Amul, NDDB, Mother Dairy) ₹6.5–10.5 LPA',
    midLpa: '₹9.0–16 LPA (Plant Manager / QA Head)',
    seniorLpa: '₹18–32+ LPA (General Manager Dairy Operations)',
    exams: ['CUET-UG (ICAR AIEEA for NDRI Karnal & SMC Anand)', 'State CETs (MHT-CET / KCET / WBJEE / KEAM)'],
    officialUrl: 'https://ndri.res.in',
    statutoryBody: 'ICAR-National Dairy Research Institute (NDRI) & National Dairy Development Board (NDDB)',
    shortDesc:
      'Engineer automated pasteurization, UHT milk processing, cheese/whey biochemistry, and cold-chain plants for India’s giant dairy sector.',
    shortDescHindi:
      'अमूल, मदर डेयरी, NDDB और आधुनिक डेयरी प्लांट्स में पाश्चुरीकरण, UHT मिल्क प्रोसेसिंग और कोल्ड-चेन इंजीनियरिंग का संचालन।',
    substantiveContextEn:
      'India is the world’s largest milk producer. B.Tech Dairy Technology graduates from premier institutes like ICAR-NDRI Karnal and SMC College of Dairy Science Anand manage continuous pasteurizers, spray dryers, probiotic fermentation, and cold-chain logistics at GCMMF (Amul), NDDB, Mother Dairy, Nandini, Verka, and Nestlé. Note: Requires readiness for rotational shift operations in processing plants.',
    substantiveContextHi:
      'भारत विश्व का सबसे बड़ा दुग्ध उत्पादक देश है। ICAR-NDRI करनाल और आनंद कृषि विश्वविद्यालय जैसे संस्थानों से B.Tech डेयरी टेक्नोलॉजी स्नातक अमूल (GCMMF), NDDB, मदर डेयरी और नेस्ले में प्लांट ऑपरेशंस संभालते हैं।',
    skills: ['Dairy Engineering & Pasteurization', 'Dairy Microbiology & Starter Cultures', 'Spray Drying & Cheese Technology', 'CIP Automation & Plant Hygiene', 'Cold-Chain Supply Management'],
    workEnvironments: ['Cooperative Milk Unions (Amul, Mother Dairy, Nandini, Sudha)', 'National Dairy Development Board (NDDB)', 'FMCG Nutraceutical & Infant Nutrition Plants'],
  },
  {
    id: 'agri-horticulture-floriculture',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'B.Sc (Hons) Horticulture, Polyhouse & High-Value Crop Specialist',
    titleHindi: 'बी.एससी (ऑनर्स) हॉर्टिकल्चर (बागवानी), पॉलीहाउस और फ्लोरीकल्चर विशेषज्ञ',
    stream: 'PCB / PCM / Agriculture (Class 12 with 50% marks)',
    minMarks: 50,
    duration: '4 Years (8 Semesters with Commercial Nursery & Polyhouse Internship)',
    cost: 'Govt Horticulture Univ: ₹35,000 – ₹1.5 Lakhs · Private: ₹3.0 – ₹5.5 Lakhs',
    entryLpa: 'Private Nursery/Agri ₹2.8–4.5 LPA · Govt Horticulture Officer / NHB / IBPS AFO ₹6.5–11 LPA',
    midLpa: '₹6.5–13 LPA',
    seniorLpa: '₹14–24+ LPA',
    exams: ['CUET-UG (ICAR Quota)', 'State Agriculture & Horticulture University Entrances'],
    officialUrl: 'https://nhb.gov.in',
    statutoryBody: 'National Horticulture Board (NHB) & Indian Council of Agricultural Research (ICAR)',
    shortDesc:
      'Manage fruit orchards, climate-controlled polyhouses, export floriculture, spice plantations, and urban landscaping projects.',
    shortDescHindi:
      'फलों के बागान, क्लाइमेट-कंट्रोल्ड पॉलीहाउस, फूलों की खेती (फ्लोरीकल्चर), मसाला बागान और अर्बन लैंडस्केपिंग का प्रबंधन।',
    substantiveContextEn:
      'Horticulture graduates specialize in high-value crops (fruits, vegetables, medicinal plants, cut flowers, and spices), protected polyhouse cultivation, tissue culture propagation, and post-harvest grading for APEDA export markets. Graduates are eligible for State Horticulture Officer (SHO) exams, National Horticulture Board (NHB) posts, and IBPS AFO.',
    substantiveContextHi:
      'हॉर्टिकल्चर स्नातक उच्च मूल्य वाली फसलों (फल, सब्जियां, औषधीय पौधे, फूल और मसाले), पॉलीहाउस खेती और टिश्यू कल्चर में विशेषज्ञता रखते हैं तथा राज्य बागवानी अधिकारी (SHO) व IBPS AFO के लिए पात्र होते हैं।',
    skills: ['Protected Polyhouse Cultivation', 'Plant Tissue Culture & Grafting', 'Orchard & Vineyard Management', 'Post-Harvest Grading & Packaging', 'Landscape Architecture Basics'],
    workEnvironments: ['State Departments of Horticulture', 'National Horticulture Board (NHB)', 'Commercial Polyhouse & Export Floriculture Estates'],
  },
  {
    id: 'agri-fisheries-bfsc',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'Bachelor of Fisheries Science (B.F.Sc) & Aquaculture Officer',
    titleHindi: 'बैचलर ऑफ फिशरीज साइंस (B.F.Sc) और एक्वाकल्चर विकास अधिकारी',
    stream: 'PCB (Class 12 with Physics, Chemistry, Biology — min 50% marks)',
    minMarks: 50,
    duration: '4 Years (Professional Degree accredited by ICAR)',
    cost: 'Govt Fisheries College: ₹25,000 – ₹1.1 Lakhs total',
    entryLpa: 'Aquaculture/Seafood Export ₹3.2–5.2 LPA · State Fisheries Officer / MPEDA / IBPS AFO ₹6.5–11 LPA',
    midLpa: '₹7.0–14 LPA',
    seniorLpa: '₹15–25+ LPA',
    exams: ['CUET-UG (ICAR Quota)', 'State Veterinary & Fisheries University Entrance Exams'],
    officialUrl: 'https://dof.gov.in',
    statutoryBody: 'Department of Fisheries (PMMSY), ICAR-CIFE Mumbai & MPEDA',
    shortDesc:
      'Lead inland biofloc aquaculture, marine fishery management, seafood export quality (MPEDA), and State Fisheries Extension.',
    shortDescHindi:
      'बायोफ्लॉक मछली पालन, समुद्री मत्स्य प्रबंधन, सीफूड एक्सपोर्ट (MPEDA) और राज्य मत्स्य विकास अधिकारी के रूप में करियर।',
    substantiveContextEn:
      'Because very few colleges in India offer ICAR-accredited B.F.Sc degrees compared to general science degrees, graduates face lower competition for specialized State Fisheries Development Officer (FDO) posts, Marine Products Export Development Authority (MPEDA) quality roles, NABARD/IBPS AFO recruitment, and commercial shrimp/fish feed MNCs.',
    substantiveContextHi:
      'भारत में B.F.Sc कॉलेजों की संख्या सीमित होने के कारण इसके स्नातकों को राज्य मत्स्य विकास अधिकारी (FDO), MPEDA एक्सपोर्ट क्वालिटी, IBPS AFO और एक्वाकल्चर कंपनियों में विशेष अवसर मिलते हैं।',
    skills: ['Inland & Biofloc Aquaculture', 'Fish Nutrition & Pathology', 'Seafood Processing & HACCP', 'Marine Ecology & Hatchery Ops', 'PMMSY Subsidy Project Formulation'],
    workEnvironments: ['State Fisheries Departments', 'MPEDA & Seafood Export Units', 'ICAR-CIFE & Commercial Aqua Feed Companies (CP Foods, Avanti)'],
  },
  {
    id: 'agri-forestry-wildlife',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'B.Sc (Hons) Forestry, Silviculture & Forest Range Officer (FRO Track)',
    titleHindi: 'बी.एससी (ऑनर्स) फॉरेस्ट्री (वानिकी) और वन रेंज अधिकारी (FRO ट्रैक)',
    stream: 'PCB / PCM (Class 12 with Science — min 50% marks)',
    minMarks: 50,
    duration: '4 Years (8 Semesters with Forest Working Plan & Field Camp)',
    cost: 'Govt Forestry College: ₹30,000 – ₹1.4 Lakhs total',
    entryLpa: 'Private Timber/ESG ₹3.2–5.0 LPA · State Forest Range Officer (FRO) / ACF ₹7.0–12 LPA (Via PSC Exam)',
    midLpa: '₹9.0–16 LPA',
    seniorLpa: '₹18–30+ LPA (Divisional Forest Officer / Head of ESG Forestry)',
    exams: ['CUET-UG (ICAR Forestry)', 'State PSC Forest Range Officer (FRO) & Assistant Conservator of Forests (ACF)', 'UPSC Indian Forest Service (IFoS)'],
    officialUrl: 'https://icfre.gov.in',
    statutoryBody: 'Indian Council of Forestry Research and Education (ICFRE), Ministry of Environment, Forest & Climate Change',
    shortDesc:
      'Conserve forest ecosystems, manage agroforestry carbon sinks, and qualify for reserved/preferential quotas in State Forest Service exams.',
    shortDescHindi:
      'वन संरक्षण, एग्रोफॉरेस्ट्री कार्बन सिंक प्रबंधन और राज्य वन सेवा (FRO / ACF) परीक्षाओं में विशेष वरीयता।',
    substantiveContextEn:
      'Several Indian states provide either exclusive eligibility or bonus marks/reserved quotas for 4-year B.Sc Forestry graduates in State PSC Forest Range Officer (FRO) and Assistant Conservator of Forests (ACF) recruitments. In the private sector, graduates work with paper/pulp plantations (ITC PSPD, JK Paper), GIS forest mapping firms, and carbon-offset project developers.',
    substantiveContextHi:
      'कई राज्यों में राज्य लोक सेवा आयोग (PSC) की वन रेंज अधिकारी (FRO) और सहायक वन संरक्षक (ACF) भर्ती में 4-वर्षीय B.Sc Forestry स्नातकों को विशेष आरक्षण या वरीयता मिलती है।',
    skills: ['Silviculture & Forest Mensuration', 'Agroforestry & Carbon Sequestration', 'GIS & Remote Sensing in Forestry', 'Wildlife Habitat Management', 'Forest Laws & Working Plans'],
    workEnvironments: ['State Forest Departments & Tiger Reserves', 'ICFRE Research Institutes (FRI Dehradun)', 'Paper/Agroforestry Corporations & Carbon Credit Agencies'],
  },
  {
    id: 'agri-btech-agricultural-eng',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'B.Tech Agricultural Engineering (Farm Machinery, Irrigation & Food Process Eng)',
    titleHindi: 'बी.टेक एग्रीकल्चरल इंजीनियरिंग (फार्म मशीनरी, सिंचाई और फूड प्रोसेसिंग)',
    stream: 'PCM (Class 12 with Physics, Chemistry, Mathematics — min 50% marks)',
    minMarks: 50,
    duration: '4 Years (B.Tech Degree)',
    cost: 'Govt / IIT Kharagpur / Pantnagar: ₹45,000 – ₹4.5 Lakhs · Private: ₹3.5 – ₹7.0 Lakhs',
    entryLpa: 'Core Tractor/Irrigation ₹3.8–6.8 LPA · IIT/Pantnagar & Govt Asst. Agri Engineer ₹7.5–14 LPA',
    midLpa: '₹9.0–17 LPA',
    seniorLpa: '₹18–32+ LPA',
    exams: ['JEE Main / JEE Advanced (for IIT Kharagpur)', 'CUET-UG (ICAR B.Tech Agri Eng)', 'GATE (AG Paper) for M.Tech & PSUs'],
    officialUrl: 'https://ciae.icar.gov.in',
    statutoryBody: 'ICAR-Central Institute of Agricultural Engineering (CIAE) & AICTE',
    shortDesc:
      'Design tractors, combine harvesters, solar drip-irrigation networks, watershed structures, and automated food-processing machinery.',
    shortDescHindi:
      'ट्रैक्टर, हार्वेस्टर, सोलर ड्रिप-सिंचाई नेटवर्क, वाटरशेड संरचनाएं और ऑटोमेटेड फूड-प्रोसेसिंग मशीनरी का डिजाइन व निर्माण।',
    substantiveContextEn:
      'B.Tech Agricultural Engineering bridges mechanical, civil/water-resources, and food-process engineering. Graduates are recruited by tractor and farm equipment leaders (Mahindra Farm Equipment, John Deere, TAFE, Escorts Kubota, Sonalika), micro-irrigation firms (Jain Irrigation, Netafim), and State Assistant Agricultural Engineer (AAE) cadres.',
    substantiveContextHi:
      'B.Tech एग्रीकल्चरल इंजीनियरिंग में मैकेनिकल, सिंचाई (जल संसाधन) और फूड प्रोसेसिंग इंजीनियरिंग का संगम होता है। स्नातकों को महिंद्रा, जॉन डियर, टैफे (TAFE), जैन इरिगेशन और राज्य सहायक कृषि अभियंता (AAE) पदों पर अवसर मिलते हैं।',
    skills: ['Tractor & Farm Power Machinery Design', 'Drip & Sprinkler Micro-Irrigation', 'Soil & Water Conservation Structures', 'Food & Grain Process Engineering', 'GATE (AG) Technical Core'],
    workEnvironments: ['Tractor & Harvester R&D Plants (John Deere, Mahindra, TAFE)', 'State Agricultural Engineering Departments', 'Micro-Irrigation & Watershed Projects'],
  },
  {
    id: 'agri-abm-iim-manage',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'Agri-Business Management (MBA / PGDM-ABM — IIM-A, IIM-L, MANAGE, IRMA)',
    titleHindi: 'एग्री-बिजनेस मैनेजमेंट (MBA / PGDM-ABM — IIM, MANAGE और IRMA)',
    stream: 'Any Graduate (Agri/Allied graduates receive strong academic diversity weightage)',
    minMarks: 50,
    duration: '2 Years Post-Graduation (After 3–4 Year UG Degree)',
    cost: 'MANAGE / IRMA / NIAM: ₹8 – ₹16 Lakhs · IIM-A / IIM-L FABM/ABM: ₹18 – ₹25 Lakhs',
    entryLpa: 'State Univ MBA-ABM ₹4.5–7.5 LPA · Premier IIM-A/IIM-L/MANAGE/IRMA NIRF Median ₹14–22 LPA',
    midLpa: '₹16–28 LPA',
    seniorLpa: '₹30–55+ LPA (VP — Agri Commodities, FMCG Supply Chain, Rural FinTech)',
    exams: ['CAT (for IIM Ahmedabad FABM, IIM Lucknow ABM, MANAGE Hyderabad, IRMA Anand, NIAM Jaipur)', 'CMAT / CUET-PG (for BHU & State Agri Universities)'],
    officialUrl: 'https://www.manage.gov.in',
    statutoryBody: 'National Institute of Agricultural Extension Management (MANAGE), Ministry of Agriculture & AICTE',
    shortDesc:
      'Lead FMCG rural supply chains, commodity trading desks, microfinance/agritech strategy, and global food retail operations.',
    shortDescHindi:
      'FMCG ग्रामीण सप्लाई चेन, कमोडिटी ट्रेडिंग, माइक्रोफाइनेंस/एग्रीटेक रणनीति और ग्लोबल फूड रिटेल संचालन का नेतृत्व।',
    substantiveContextEn:
      'India’s premier Agri-Business Management programs (IIM Ahmedabad PGP-FABM, IIM Lucknow PGP-ABM, MANAGE Hyderabad, IRMA Anand, and CCS NIAM Jaipur) place graduates into FMCG giants (ITC, HUL, Nestlé, Godrej Agrovet), global commodity houses (Olam, Cargill, Louis Dreyfus), and rural banking/fintech leadership. Warning: Only top CAT/CUET-PG institutes command ₹14+ LPA medians; tier-3 private ABM programs average ₹4–6 LPA.',
    substantiveContextHi:
      'शीर्ष संस्थानों (IIM अहमदाबाद FABM, IIM लखनऊ ABM, MANAGE हैदराबाद, IRMA आनंद, NIAM जयपुर) से MBA/PGDM-ABM करने पर ITC, HUL, नेस्ले, गोदरेज एग्रोवेट और कारगिल जैसी कंपनियों में लीडरशिप पद मिलते हैं।',
    skills: ['Agri-Input & Rural Marketing', 'Commodity Futures & Procurement', 'Cold-Chain & FMCG Supply Chain', 'Microfinance & FPO Business Models', 'Data-Driven Demand Forecasting'],
    workEnvironments: ['FMCG & Food Corporations (ITC, Nestlé, Britannia, Godrej)', 'Global Agri-Commodity Traders (Cargill, Olam, ADM)', 'AgriTech & Rural FinTech Ventures (DeHaat, Ninjacart, Samunnati)'],
  },
  {
    id: 'agri-seed-technology',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'Seed Technology, Plant Breeding & Genetics Specialist (NSC / ICAR)',
    titleHindi: 'सीड टेक्नोलॉजी (बीज प्रौद्योगिकी), प्लांट ब्रीडिंग और जेनेटिक्स विशेषज्ञ',
    stream: 'PCB / Agriculture (B.Sc Agriculture + M.Sc Seed Science / Plant Breeding & Genetics)',
    minMarks: 55,
    duration: '4 Years B.Sc Agri (+2 Years M.Sc for Senior R&D Breeder Roles)',
    cost: 'Govt Agri Univ: ₹40,000 – ₹1.8 Lakhs',
    entryLpa: 'Seed QA/Production ₹3.5–5.5 LPA · National Seeds Corp (NSC) / MNC R&D Breeder ₹6.5–12 LPA',
    midLpa: '₹8.5–16 LPA',
    seniorLpa: '₹18–30+ LPA (Head of Hybrid Breeding / Seed Regulatory Affairs)',
    exams: ['ICAR AIEEA (PG) for M.Sc Plant Breeding & Seed Science', 'National Seeds Corporation (NSC) Management Trainee / Senior Trainee Exam'],
    officialUrl: 'https://www.indiaseeds.com',
    statutoryBody: 'National Seeds Corporation (NSC) & Protection of Plant Varieties and Farmers Rights Authority (PPV&FRA)',
    shortDesc:
      'Develop climate-resilient hybrid seeds, certify genetic purity in seed testing labs, and manage breeder-to-foundation seed chains.',
    shortDescHindi:
      'जलवायु-सहिष्णु हाइब्रिड बीज विकसित करना, बीज परीक्षण प्रयोगशालाओं में आनुवंशिक शुद्धता प्रमाणित करना और NSC में कार्य करना।',
    substantiveContextEn:
      'Seed Technologists and Plant Breeders develop drought-tolerant, pest-resistant crop hybrids and enforce the Seeds Act quality standards (germination percentage, genetic purity, and phytosanitary health). Employers include the public-sector National Seeds Corporation (NSC), State Seed Certification Agencies, and private seed R&D leaders (Mahyco, Kaveri Seeds, Nuziveedu, Corteva, Bayer).',
    substantiveContextHi:
      'सीड टेक्नोलॉजिस्ट और प्लांट ब्रीडर सूखा-रोधी और उच्च उपज वाले हाइब्रिड बीज विकसित करते हैं तथा राष्ट्रीय बीज निगम (NSC), राज्य बीज प्रमाणीकरण एजेंसियों और प्राइवेट सीड R&D कंपनियों में कार्य करते हैं।',
    skills: ['Hybridization & Marker-Assisted Selection', 'Seed Germination & Vigour Testing', 'Genetic Purity (GOT) & Certification', 'PPV&FRA Varietal Registration', 'Commercial Seed Production'],
    workEnvironments: ['National Seeds Corporation (NSC) Farms & Labs', 'State Seed Certification Agencies', 'MNC Plant Breeding Stations (Corteva, Bayer, Kaveri Seeds)'],
  },
  {
    id: 'agri-soil-science-testing',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'Soil Science, Agricultural Chemistry & Fertilizer Quality Analyst',
    titleHindi: 'मृदा विज्ञान (Soil Science), कृषि रसायन और उर्वरक गुणवत्ता विश्लेषक',
    stream: 'PCB / PCM / Agriculture (B.Sc Agriculture or B.Sc Chemistry + M.Sc Soil Science)',
    minMarks: 50,
    duration: '4 Years B.Sc Agri (+2 Years M.Sc Soil Science for Scientist/Chemist posts)',
    cost: 'Govt University: ₹35,000 – ₹1.5 Lakhs',
    entryLpa: 'Soil Testing Lab ₹3.0–4.8 LPA · IFFCO / KRIBHCO / NFL / Govt Soil Conservation Officer ₹6.5–11.5 LPA',
    midLpa: '₹8.0–15 LPA',
    seniorLpa: '₹16–26+ LPA',
    exams: ['IFFCO / KRIBHCO / NFL Agriculture Graduate Trainee (AGT) Recruitment', 'ICAR AIEEA PG', 'State PSC Soil Conservation Officer'],
    officialUrl: 'https://soilhealth.dac.gov.in',
    statutoryBody: 'Department of Agriculture & Farmers Welfare (Soil Health Card Mission) & ICAR-IISS Bhopal',
    shortDesc:
      'Analyze soil micronutrients, manage Fertilizer Control Order (FCO) compliance, and work with IFFCO, KRIBHCO, NFL, and Soil Conservation departments.',
    shortDescHindi:
      'मिट्टी के सूक्ष्म पोषक तत्वों का परीक्षण, उर्वरक गुणवत्ता नियंत्रण और IFFCO, KRIBHCO, NFL व मृदा संरक्षण विभाग में करियर।',
    substantiveContextEn:
      'Soil Scientists and Agricultural Chemists run atomic absorption spectrophotometry (AAS) and ICP testing across India’s Soil Health Card laboratories, formulate nano-fertilizers and bio-stimulants, and lead watershed soil-conservation schemes. Fertilizer cooperatives and PSUs (IFFCO, KRIBHCO, National Fertilizers Limited, Rashtriya Chemicals & Fertilizers) regularly recruit Agriculture Graduate Trainees (AGT) with attractive pay scales.',
    substantiveContextHi:
      'मृदा वैज्ञानिक (Soil Scientists) मृदा स्वास्थ्य कार्ड प्रयोगशालाओं, नैनो-उर्वरक निर्माण और वाटरशेड मृदा संरक्षण में कार्य करते हैं। IFFCO, KRIBHCO, NFL और RCF जैसी उर्वरक संस्थाएं एग्रीकल्चर ग्रेजुएट ट्रेनी (AGT) की भर्ती करती हैं।',
    skills: ['Soil Micronutrient & AAS Analysis', 'Fertilizer Control Order (FCO) Compliance', 'Saline/Alkali Soil Reclamation', 'Bio-Fertilizer & Nano-Urea Formulation', 'Watershed Soil Conservation'],
    workEnvironments: ['IFFCO, KRIBHCO, NFL & RCF Fertilizer Plants/Field Offices', 'State Soil Testing & Fertilizer Quality Labs', 'ICAR-Indian Institute of Soil Science (IISS)'],
  },
  {
    id: 'agri-plant-pathology-entomology',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'Plant Protection, Entomology & Phytosanitary Quarantine Officer (DPPQS)',
    titleHindi: 'पौध संरक्षण (Plant Protection), कीट विज्ञान और फाइटोसैनिटरी क्वारंटाइन अधिकारी',
    stream: 'PCB / Agriculture (B.Sc Agriculture / Botany / Zoology + M.Sc Entomology / Plant Pathology)',
    minMarks: 50,
    duration: '4 Years UG (+2 Years M.Sc for Central Quarantine & R&D Scientist tracks)',
    cost: 'Govt University: ₹35,000 – ₹1.6 Lakhs',
    entryLpa: 'Crop Protection Industry ₹3.5–5.5 LPA · Govt DPPQS Plant Protection Officer (Level-6/7) ₹6.5–10.5 LPA',
    midLpa: '₹8.0–15 LPA',
    seniorLpa: '₹16–28+ LPA',
    exams: ['SSC Selection Posts (for Directorate of Plant Protection, Quarantine & Storage — DPPQS)', 'ICAR AIEEA PG / ARS NET'],
    officialUrl: 'https://ppqs.gov.in',
    statutoryBody: 'Directorate of Plant Protection, Quarantine & Storage (DPPQS) & Central Insecticides Board (CIBRC)',
    shortDesc:
      'Inspect international agricultural imports/exports at seaports and airports, manage locust/pest outbreaks, and evaluate crop protection molecules.',
    shortDescHindi:
      'बंदरगाहों और हवाई अड्डों पर कृषि आयात-निर्यात का फाइटोसैनिटरी निरीक्षण, कीट नियंत्रण और क्रॉप प्रोटेक्शन R&D।',
    substantiveContextEn:
      'Plant Protection Officers under DPPQS (Faridabad) man Plant Quarantine Stations at major Indian seaports, airports, and land borders to prevent invasive foreign pests from entering India and issue Phytosanitary Certificates for Indian agricultural exports. In the private sector, entomologists and pathologists lead field bio-efficacy trials and CIBRC registration for agrochemical and biological pest-control companies.',
    substantiveContextHi:
      'पौध संरक्षण निदेशालय (DPPQS) के अधिकारी बंदरगाहों और हवाई अड्डों पर कृषि आयात-निर्यात की जांच करते हैं और फाइटोसैनिटरी प्रमाणपत्र जारी करते हैं।',
    skills: ['Integrated Pest Management (IPM)', 'Phytosanitary Export/Import Inspection', 'Fungal, Viral & Bacterial Plant Diagnostics', 'CIBRC Agrochemical Registration', 'Biological Control Agents'],
    workEnvironments: ['Plant Quarantine Stations at Airports & Seaports (DPPQS)', 'Central Insecticides Board & Registration Committee (CIBRC)', 'Agrochemical & Bio-Pesticide R&D Centers'],
  },
  {
    id: 'agri-precision-drone-kisan',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'Kisan Drone Pilot, GIS Crop Mapping & Precision AgriTech Specialist',
    titleHindi: 'किसान ड्रोन पायलट, GIS क्रॉप मैपिंग और प्रिसिजन एग्रीटेक विशेषज्ञ',
    stream: 'Any Stream (Class 10/12 + DGCA Remote Pilot Certificate for Drone Track; B.Sc Agri/B.Tech for GIS Analytics)',
    minMarks: 45,
    duration: '3–6 Months (DGCA RPTO Certification) or 3–4 Years Degree + GIS/UAV Specialization',
    cost: 'DGCA RPTO Training: ₹45,000 – ₹75,000 (Subsidized under Govt Namo Drone Didi / Agri Mechanization schemes)',
    entryLpa: 'Field UAV Operator ₹2.4–4.2 LPA · GIS Multispectral Agronomist ₹4.5–8.0 LPA (Market Estimate — Unverified)',
    midLpa: '₹6.5–12 LPA',
    seniorLpa: '₹13–22+ LPA (Fleet Operations Manager / Precision Agri Head)',
    exams: ['DGCA Approved Remote Pilot Training Organization (RPTO) Assessment', 'Direct Skill & GIS Portfolio Hiring'],
    officialUrl: 'https://digitalsky.dgca.gov.in',
    statutoryBody: 'Directorate General of Civil Aviation (DGCA DigitalSky) & Sub-Mission on Agricultural Mechanization (SMAM)',
    shortDesc:
      'Operate DGCA-certified agricultural spraying drones and analyze multispectral NDVI satellite/drone imagery for crop health and insurance.',
    shortDescHindi:
      'DGCA-प्रमाणित कृषि ड्रोन संचालन और सैटेलाइट/ड्रोन इमेजरी (NDVI) द्वारा फसल स्वास्थ्य व बीमा सर्वेक्षण।',
    substantiveContextEn:
      'Under the Ministry of Agriculture’s Sub-Mission on Agricultural Mechanization (SMAM) and custom hiring centers (CHCs), licensed Kisan Drone pilots conduct precision nano-urea and pesticide spraying, saving 90% water and protecting farmers from chemical exposure. Candidates combining a B.Sc Agriculture/B.Tech degree with QGIS and multispectral NDVI crop analytics work with crop insurance companies (PMFBY) and agritech startups.',
    substantiveContextHi:
      'कृषि यंत्रीकरण उप-मिशन (SMAM) और कस्टम हायरिंग सेंटरों (CHC) के तहत DGCA लाइसेंस प्राप्त किसान ड्रोन पायलट नैनो-यूरिया छिड़काव और फसल बीमा (PMFBY) के लिए GIS मैपिंग का कार्य करते हैं।',
    skills: ['DGCA Medium-Class UAV Flight Operations', 'Multispectral & NDVI Crop Health Mapping', 'Autonomous Flight Path & Spray Calibration', 'LiPo Battery & Drone Maintenance', 'QGIS & PMFBY Crop Loss Assessment'],
    workEnvironments: ['Agri-Drone Manufacturers (Garuda Aerospace, IoTechWorld, Marut Drones)', 'IFFCO / Custom Hiring Centers (CHCs)', 'Crop Insurance (PMFBY) & Satellite Analytics Firms'],
  },
  {
    id: 'agri-organic-certification',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'Organic Farming Auditor, NPOP Inspector & APEDA Export Quality Specialist',
    titleHindi: 'ऑर्गेनिक फार्मिंग ऑडिटर, NPOP निरीक्षक और APEDA एक्सपोर्ट क्वालिटी विशेषज्ञ',
    stream: 'PCB / Agriculture (B.Sc Agriculture / Horticulture / Food Science / Life Sciences)',
    minMarks: 50,
    duration: '4 Years B.Sc Agri/Food Science + NPOP / ISO Lead Auditor Training',
    cost: '₹40,000 – ₹2.0 Lakhs',
    entryLpa: 'Organic Certification Inspector ₹3.0–5.0 LPA · APEDA / Export House QA Manager ₹6.0–10.5 LPA (Market Estimate)',
    midLpa: '₹7.5–14 LPA',
    seniorLpa: '₹15–26+ LPA',
    exams: ['APEDA Assistant Manager Recruitment', 'Accredited Certification Body (Ecocert, Control Union, OneCert, State Organic Agencies) Recruitment'],
    officialUrl: 'https://apeda.gov.in',
    statutoryBody: 'Agricultural and Processed Food Products Export Development Authority (APEDA), Ministry of Commerce',
    shortDesc:
      'Audit organic farm clusters, verify zero-pesticide residue traceability (Tracenet), and certify Indian organic exports to the EU, US, and Japan.',
    shortDescHindi:
      'ऑर्गेनिक फार्म क्लस्टर्स का ऑडिट, कीटनाशक-मुक्त ट्रेसबिलिटी (Tracenet) सत्यापन और यूरोप/अमेरिका के लिए जैविक निर्यात प्रमाणीकरण।',
    substantiveContextEn:
      'To export organic spices, basmati rice, tea, coffee, or superfoods from India, farms and processing units must pass strict annual audits under the National Programme for Organic Production (NPOP) managed by APEDA. Organic Inspectors visit farmer producer organizations (FPOs), check soil transition records, sample crops for LC-MS/MS pesticide residue limits (MRLs), and issue scope certificates.',
    substantiveContextHi:
      'भारत से जैविक मसाले, बासमती चावल, चाय और सुपरफूड निर्यात करने के लिए APEDA के राष्ट्रीय जैविक उत्पादन कार्यक्रम (NPOP) के तहत ऑडिट अनिवार्य है। ऑर्गेनिक ऑडिटर फार्म क्लस्टर्स की जांच और प्रमाणन करते हैं।',
    skills: ['NPOP & EU/USDA Organic Standards', 'APEDA Tracenet Digital Traceability', 'Internal Control System (ICS) Farm Audits', 'Maximum Residue Limit (MRL) Sampling', 'regenerative & Natural Farming Protocols'],
    workEnvironments: ['Accredited Certification Bodies (Ecocert, Control Union, SGS, State Organic Cert Agencies)', 'APEDA & Spice/Tea Export Houses', 'Organic FMCG Brands (Organic India, Tata Consumer, 24 Mantra)'],
  },
  {
    id: 'agri-cold-chain-postharvest',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'Post-Harvest Technology, Cold-Chain Logistics & Warehouse Receipt Specialist',
    titleHindi: 'पोस्ट-हार्वेस्ट टेक्नोलॉजी, कोल्ड-चेन लॉजिस्टिक्स और वेयरहाउस विशेषज्ञ',
    stream: 'PCM / PCB / Commerce (B.Tech Food/Agri/Mechanical or B.Sc Agri + Supply Chain)',
    minMarks: 50,
    duration: '4 Years UG Degree',
    cost: '₹45,000 – ₹3.5 Lakhs',
    entryLpa: 'Cold-Chain/Warehouse Ops ₹3.2–5.5 LPA · WDRA / Quick-Commerce Fresh Supply Chain ₹6.0–11 LPA (Market Estimate)',
    midLpa: '₹8.5–16 LPA',
    seniorLpa: '₹18–30+ LPA',
    exams: ['CUET-UG / State CETs', 'ICAR-CIPHET / NIFTEM Kundli & Thanjavur Admissions'],
    officialUrl: 'https://niftem.ac.in',
    statutoryBody: 'National Institute of Food Technology Entrepreneurship and Management (NIFTEM) & WDRA',
    shortDesc:
      'Eliminate crop wastage using controlled-atmosphere (CA) cold stores, ripening chambers, e-NWR warehouse receipts, and quick-commerce supply chains.',
    shortDescHindi:
      'कंट्रोल्ड-एटमॉस्फियर (CA) कोल्ड स्टोरेज, राइपनिंग चैंबर और ई-वेयरहाउस रसीद (e-NWR) द्वारा फसल की बर्बादी रोकना।',
    substantiveContextEn:
      'Post-harvest specialists manage pre-cooling, modified atmosphere packaging (MAP), solar cold rooms, and negotiable warehouse receipts (e-NWR under WDRA) so farmers do not have to distress-sell perishable produce. Rapid growth in quick-commerce grocery networks (Blinkit, Zepto, Swiggy Instamart, BigBasket, Reliance Retail) has created strong private demand for fresh-produce quality and cold-chain operations leads.',
    substantiveContextHi:
      'पोस्ट-हार्वेस्ट विशेषज्ञ प्री-कूलिंग, कोल्ड स्टोरेज और क्विक-कॉमर्स (Blinkit, Zepto, BigBasket, रिलायंस रिटेल) की ताजा फल-सब्जी सप्लाई चेन का प्रबंधन करते हैं।',
    skills: ['Controlled Atmosphere (CA) Cold Storage', 'Modified Atmosphere Packaging (MAP)', 'Reefer Fleet & IoT Temperature Telemetry', 'WDRA Electronic Negotiable Warehouse Receipts', 'Perishable Shrinkage Reduction'],
    workEnvironments: ['NIFTEM & Integrated Mega Food Parks', 'Quick-Commerce & Modern Retail Cold Chains', 'Agri-Warehousing & Collateral Management Firms (Arya.ag, StarAgri, NCML)'],
  },
  {
    id: 'agri-tea-coffee-plantation',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'Tea, Coffee & Spice Plantation Estate Manager & Professional Taster',
    titleHindi: 'चाय, कॉफी और मसाला बागान (Plantation) मैनेजर व प्रोफेशनल टेस्टर',
    stream: 'PCB / PCM / Any Stream (B.Sc Agriculture / Horticulture / Botany + PG Diploma in Plantation Management / Tea Tasting)',
    minMarks: 50,
    duration: '3–4 Years UG + 1 Year PG Diploma (IIPM Bengaluru / Coffee Board / NITM Darjeeling / Tocklai)',
    cost: '₹60,000 – ₹3.5 Lakhs',
    entryLpa: 'Assistant Estate Manager / Trainee Taster ₹3.5–6.0 LPA (Plus Estate Bungalow & Allowances · Market Estimate)',
    midLpa: '₹8.0–15 LPA (Estate Manager / Senior Blender & Auction Buyer)',
    seniorLpa: '₹16–30+ LPA (Visiting Agent / Head of Global Beverage Procurement)',
    exams: ['Indian Institute of Plantation Management (IIPM Bengaluru) Admissions', 'Coffee Board of India PG Diploma in Coffee Quality Management'],
    officialUrl: 'https://iipmb.edu.in',
    statutoryBody: 'Indian Institute of Plantation Management (IIPM), Tea Board, Coffee Board & Spices Board (Ministry of Commerce)',
    shortDesc:
      'Manage sprawling tea/coffee/spice estates in Assam, Darjeeling, Nilgiris, Coorg, and Munnar, or work as an auction taster and global buyer.',
    shortDescHindi:
      'असम, दार्जिलिंग, नीलगिरि, कूर्ग और मुन्नार के चाय/कॉफी/मसाला बागानों का प्रबंधन या ऑक्शन टेस्टर व एक्सपोर्ट बायर बनना।',
    substantiveContextEn:
      'Plantation Management and Sensory Evaluation (Tea Sommelier / Q-Grader Coffee Taster) combine estate agronomy, factory processing (CTC/Orthodox tea curing, specialty coffee roasting), labor welfare, and international commodity auctions. While estate life provides scenic bungalow accommodation in hill regions, candidates must be comfortable living in remote plantation districts.',
    substantiveContextHi:
      'प्लांटेशन मैनेजमेंट और टी/कॉफी टेस्टिंग में बागान प्रबंधन, फैक्ट्री प्रोसेसिंग और अंतरराष्ट्रीय नीलामी (Auction) शामिल है। इसमें बागान में आवास की सुविधा मिलती है, लेकिन दूरदराज के क्षेत्रों में रहने के लिए तैयार रहना चाहिए।',
    skills: ['Plantation Agronomy & Shade Management', 'Sensory Cupping, Grading & Blending', 'Orthodox/CTC Tea & Specialty Coffee Processing', 'Rainforest Alliance & Fairtrade Audits', 'Commodity Auction Trading'],
    workEnvironments: ['Tea & Coffee Estates (Tata Consumer, McLeod Russel, Goodricke, Tata Coffee)', 'Tea Board, Coffee Board & Spices Board of India', 'Specialty Coffee Roasters & Global Beverage Exporters'],
  },
  {
    id: 'agri-sericulture-silk',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'Sericulture & Silk Technology Officer (Central Silk Board Track)',
    titleHindi: 'सेरीकल्चर (रेशम उत्पादन) और सिल्क टेक्नोलॉजी अधिकारी (केंद्रीय रेशम बोर्ड)',
    stream: 'PCB / Agriculture (B.Sc Sericulture / Agriculture / Zoology / Botany)',
    minMarks: 50,
    duration: '4 Years B.Sc Sericulture/Agri or 3 Years B.Sc + PG Diploma in Sericulture (CSB)',
    cost: 'Govt College / CSB Institute: ₹20,000 – ₹1.0 Lakh',
    entryLpa: 'Private Silk/Textile ₹2.8–4.5 LPA · Central Silk Board (CSB) Scientist-B / Field Officer ₹6.5–11 LPA (Via Exam)',
    midLpa: '₹7.5–14 LPA',
    seniorLpa: '₹15–24+ LPA',
    exams: ['Central Silk Board (CSB) Direct Recruitment (Scientist-B, Assistant Superintendent Technical, Field Assistant)', 'State Sericulture Inspector Exams'],
    officialUrl: 'https://csb.gov.in',
    statutoryBody: 'Central Silk Board (CSB), Ministry of Textiles, Government of India',
    shortDesc:
      'Manage mulberry, tasar, eri, and muga silkworm rearing, disease-free layings (DFL) grainages, and automated silk reeling units.',
    shortDescHindi:
      'शहतूत (Mulberry), तसर, एरी और मूगा रेशम कीट पालन, बीज कोया (Grainage) और केंद्रीय रेशम बोर्ड (CSB) में तकनीकी करियर।',
    substantiveContextEn:
      'India is the only country producing all four commercial varieties of natural silk (Mulberry, Tasar, Eri, and Muga). The Central Silk Board (CSB, Ministry of Textiles) and State Directorates of Sericulture (especially in Karnataka, Assam, West Bengal, Tamil Nadu, J&K, and Jharkhand) recruit Sericulture and Agriculture graduates as Scientist-B, Technical Assistants, and Sericulture Extension Officers.',
    substantiveContextHi:
      'भारत विश्व का एकमात्र देश है जो प्राकृतिक रेशम की चारों व्यावसायिक किस्मों (मलवरी, तसर, एरी और मूगा) का उत्पादन करता है। केंद्रीय रेशम बोर्ड (CSB) और राज्य रेशम विभागों में वैज्ञानिक और तकनीकी अधिकारियों की भर्ती होती है।',
    skills: ['Moriculture (Mulberry Cultivation)', 'Silkworm Rearing & Disease Management', 'Seed Cocoon Grainage Operations', 'Multi-End Silk Reeling & Testing', 'Vanya (Tasar/Eri/Muga) Silk Conservation'],
    workEnvironments: ['Central Silk Board Research Institutes (CSR&TI Mysuru, Berhampore, Pampore)', 'State Directorates of Sericulture', 'Silk Mark Organization & Export Silk Mills'],
  },
  {
    id: 'agri-solar-wind-rural-energy',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'Solar Agro-Photovoltaics (PM-KUSUM), Bio-CNG & Rural Renewable Energy Engineer',
    titleHindi: 'सोलर कृषि पंप (PM-KUSUM), बायो-CNG और ग्रामीण नवीकरणीय ऊर्जा इंजीनियर',
    stream: 'PCM (B.Tech Electrical / Mechanical / Agricultural / Renewable Energy or Polytechnic Diploma)',
    minMarks: 50,
    duration: '3 Years Polytechnic Diploma or 4 Years B.Tech',
    cost: 'Govt College: ₹30,000 – ₹2.5 Lakhs · Private: ₹3.0 – ₹6.5 Lakhs',
    entryLpa: 'Field Solar/Biogas Engineer ₹3.2–5.5 LPA · PSU / MNRE / SECI / Bio-CNG EPC ₹6.5–12 LPA (Market Estimate)',
    midLpa: '₹8.5–16 LPA',
    seniorLpa: '₹18–32+ LPA',
    exams: ['JEE Main / State CETs / GATE', 'Suryamitra Skill Certification (NISE — Ministry of New and Renewable Energy)'],
    officialUrl: 'https://mnre.gov.in',
    statutoryBody: 'Ministry of New and Renewable Energy (MNRE) & National Institute of Solar Energy (NISE)',
    shortDesc:
      'Commission solar water pumps (PM-KUSUM), compressed biogas (CBG) plants from crop stubble, and decentralized rural microgrids.',
    shortDescHindi:
      'पीएम-कुसुम (PM-KUSUM) सोलर वाटर पंप, पराली/कृषि अपशिष्ट से बायो-CNG (CBG) प्लांट और ग्रामीण सोलर माइक्रोग्रिड की स्थापना।',
    substantiveContextEn:
      'Under PM-KUSUM (solarizing millions of farm irrigation pumps) and the SATAT Compressed Biogas (CBG) scheme (converting paddy straw, pressmud, and cattle dung into Bio-CNG), renewable energy EPC firms, oil marketing PSUs, and dairy cooperatives hire electrical, mechanical, and agricultural engineers to design, install, and maintain decentralized clean-energy plants across rural and semi-urban India.',
    substantiveContextHi:
      'PM-KUSUM (सोलर पंप योजना) और SATAT कंप्रेस्ड बायोगैस (बायो-CNG) योजना के तहत ग्रामीण भारत में सोलर माइक्रोग्रिड और बायो-एनर्जी प्लांट लगाने के लिए इलेक्ट्रिकल, मैकेनिकल और एग्रीकल्चर इंजीनियरों की भारी मांग है।',
    skills: ['Solar PV & PM-KUSUM Pump Commissioning', 'Anaerobic Digestion & Bio-CNG (CBG) Process', 'PVsyst & Microgrid Load Sizing', 'Biomass Supply Chain Logistics', 'Grid-Connected Feeder Solarization'],
    workEnvironments: ['Solar & Renewable EPC Firms (Tata Power Solar, Adani Green, Shakti Pumps)', 'Compressed Biogas (CBG) Plants (Verbio, Reliance Bio-Energy, IndianOil)', 'State Renewable Energy Development Agencies (SREDAs)'],
  },
  {
    id: 'agri-esg-carbon-credit',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'Climate Sustainability, Carbon Credit Verification & ESG Analyst',
    titleHindi: 'क्लाइमेट सस्टेनेबिलिटी, कार्बन क्रेडिट सत्यापन और ESG एनालिस्ट',
    stream: 'PCM / PCB / Commerce / Arts (Degree in Environmental Science, Forestry, Agriculture, Engineering, or Economics)',
    minMarks: 55,
    duration: '4 Years UG or 3 Years UG + 2 Years M.Sc Environmental / Climate / Sustainability Management',
    cost: 'Govt Univ / IIFM Bhopal / TERI SAS: ₹60,000 – ₹8.5 Lakhs',
    entryLpa: 'Junior Sustainability Associate ₹4.0–7.0 LPA · Big-4 / IIFM Bhopal / Corporate ESG ₹8.0–14 LPA (Market Estimate)',
    midLpa: '₹12–22 LPA',
    seniorLpa: '₹24–45+ LPA (Chief Sustainability Officer / Director of Carbon Markets)',
    exams: ['CAT / XAT / CUET-PG (for IIFM Bhopal PGDFM/PGDSM, TERI SAS, TISS)', 'UGC-NET (Environmental Sciences)'],
    officialUrl: 'https://iifm.ac.in',
    statutoryBody: 'Indian Institute of Forest Management (IIFM Bhopal, MoEFCC) & Bureau of Energy Efficiency (CCTS Carbon Market)',
    shortDesc:
      'Audit SEBI BRSR corporate sustainability disclosures, verify nature-based agroforestry carbon credits (Verra/Gold Standard/CCTS), and model climate risk.',
    shortDescHindi:
      'SEBI BRSR कॉर्पोरेट सस्टेनेबिलिटी ऑडिट, एग्रोफॉरेस्ट्री कार्बन क्रेडिट सत्यापन और जलवायु जोखिम विश्लेषण।',
    substantiveContextEn:
      'SEBI mandates Business Responsibility and Sustainability Reporting (BRSR) for India’s top 1,000 listed companies, and the Government of India has launched the Carbon Credit Trading Scheme (CCTS). Graduates from institutes like IIFM Bhopal, TERI School of Advanced Studies, and NITIE/IIM Mumbai work with Big-4 consulting firms (EY, PwC, Deloitte, KPMG), carbon registries, and manufacturing conglomerates on GHG Scope 1/2/3 accounting and nature-based carbon offset audits.',
    substantiveContextHi:
      'SEBI द्वारा शीर्ष 1,000 सूचीबद्ध कंपनियों के लिए BRSR रिपोर्टिंग अनिवार्य करने और भारतीय कार्बन मार्केट (CCTS) शुरू होने से IIFM भोपाल, TERI और पर्यावरण/कृषि स्नातकों के लिए ESG और कार्बन ऑडिटिंग में मजबूत करियर उपलब्ध हैं।',
    skills: ['GHG Accounting (Scope 1, 2 & 3)', 'SEBI BRSR & GRI Sustainability Reporting', 'Carbon Credit MRV (Verra / Gold Standard / CCTS)', 'Life Cycle Assessment (LCA)', 'Climate Risk & GIS Remote Sensing'],
    workEnvironments: ['Big-4 ESG & Climate Advisory Practices', 'Indian Institute of Forest Management (IIFM) & Carbon Project Developers', 'Corporate Sustainability Offices (Tata, Mahindra, ITC, JSW)'],
  },
  {
    id: 'agri-veterinary-livestock-ext',
    parentId: 'p-agri-sustainability',
    category: 'agriculture',
    directoryCategory: 'Agriculture & Environment',
    title: 'Veterinary & Livestock Extension Officer / Animal Nutritionist (VCI / NDDB Track)',
    titleHindi: 'पशु चिकित्सा विस्तार अधिकारी (Veterinary & Livestock Officer) और पशु पोषण विशेषज्ञ',
    stream: 'PCB (Class 12 with Physics, Chemistry, Biology — NEET-UG / State Vet Entrance for B.V.Sc & A.H.; or 2-Year Diploma for Paravet/LSA)',
    minMarks: 50,
    duration: '5.5 Years (B.V.Sc & A.H. including 1-Year Internship) or 2 Years (Livestock Supervisor Diploma)',
    cost: 'Govt Veterinary College: ₹40,000 – ₹1.8 Lakhs total',
    entryLpa: 'Livestock Assistant Diploma ₹2.6–4.2 LPA · B.V.Sc Govt Veterinary Surgeon (Level-9/10) ₹7.5–12.5 LPA',
    midLpa: '₹10–18 LPA',
    seniorLpa: '₹20–34+ LPA (Joint Director Animal Husbandry / Pet Hospital Founder)',
    exams: ['NEET-UG (15% VCI All-India Quota for B.V.Sc & A.H.)', 'State Veterinary University Entrance Exams', 'State PSC Veterinary Assistant Surgeon (VAS)'],
    officialUrl: 'https://vci.dahd.gov.in',
    statutoryBody: 'Veterinary Council of India (VCI), Department of Animal Husbandry & Dairying (DAHD)',
    shortDesc:
      'Practice clinical veterinary medicine and surgery, lead State Animal Husbandry hospitals, or manage dairy cooperative and companion-animal clinics.',
    shortDescHindi:
      'पशु चिकित्सा और सर्जरी, राजकीय पशु चिकित्सालयों में राजपत्रित अधिकारी (VAS), डेयरी संघ और पेट क्लिनिक में करियर।',
    substantiveContextEn:
      'B.V.Sc & A.H. (Bachelor of Veterinary Science and Animal Husbandry) is a statutory 5.5-year clinical degree regulated by the Veterinary Council of India (VCI). For PCB students who miss an MBBS government seat by a small margin, Govt B.V.Sc offers Class-I Gazetted State Veterinary Assistant Surgeon (VAS) posts, Remount Veterinary Corps (RVC) commissioned officer entry in the Indian Army, NDDB/Amul veterinary positions, and booming urban companion-animal (pet) surgery practices.',
    substantiveContextHi:
      'B.V.Sc & A.H. भारतीय पशु चिकित्सा परिषद (VCI) द्वारा विनियमित 5.5-वर्षीय क्लिनिकल डिग्री है। इसके स्नातकों को राज्य सरकार में क्लास-1 राजपत्रित पशु चिकित्सा अधिकारी (VAS), भारतीय सेना की रिमाउंट वेटरनरी कोर (RVC), अमूल/NDDB और शहरी पेट क्लिनिक में उत्कृष्ट अवसर मिलते हैं।',
    skills: ['Clinical Veterinary Medicine & Surgery', 'Zoonotic Disease & Vaccine Epidemiology', 'Bovine Reproductive & AI Technology', 'Feed Formulation & Animal Nutrition', 'Small Animal (Pet) Diagnostics'],
    workEnvironments: ['State Government Veterinary Hospitals (Gazetted VAS)', 'Indian Army Remount Veterinary Corps (RVC)', 'Dairy Cooperatives (Amul/NDDB) & Urban Pet Hospitals'],
  },
];

export const careersNewParentSection22Children: Record<string, ChildCareer> = Object.fromEntries(
  NEW_PARENT_SECTION_22_SEEDS.map((seed) => [seed.id, buildSubstantiveCareerFromSeed(seed)])
);

export const careersNewParentSection22List: ChildCareer[] = Object.values(careersNewParentSection22Children);
