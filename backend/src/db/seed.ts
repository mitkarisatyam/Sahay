import { v4 as uuidv4 } from 'uuid';
import { db, initDatabase } from './database.js';

export interface SchemeSeedData {
  id: string;
  slug: string;
  name_en: string;
  name_mr: string;
  name_hi: string;
  department: string;
  government_level: string;
  category: string;
  description_en: string;
  description_mr: string;
  description_hi: string;
  benefits_summary: string;
  max_benefit_amount: string;
  target_beneficiaries: string;
  application_mode: string;
  official_portal_url: string;
  official_guideline_url: string;
  source_name: string;
  source_verified_date: string;
  criteria: {
    min_age?: number;
    max_age?: number;
    gender: string;
    caste_categories: string[];
    max_income?: number;
    min_income?: number;
    required_occupation: string;
    required_education_status: string;
    maharashtra_domicile_required: boolean;
    additional_conditions_en: string;
    additional_conditions_mr: string;
    additional_conditions_hi: string;
  };
  documents: Array<{
    document_name_en: string;
    document_name_mr: string;
    document_name_hi: string;
    is_mandatory: boolean;
    purpose_en: string;
    purpose_mr: string;
    purpose_hi: string;
    alternative_documents?: string;
  }>;
  chunks: Array<{
    chunk_type: string;
    chunk_text: string;
    language: string;
    keywords: string;
  }>;
}

export const VERIFIED_SCHEMES: SchemeSeedData[] = [
  {
    id: 'ladki-bahin-yojana',
    slug: 'mukhyamantri-majhi-ladki-bahin-yojana',
    name_en: 'Mukhyamantri Majhi Ladki Bahin Yojana',
    name_mr: 'मुख्यमंत्री माझी लाडकी बहीण योजना',
    name_hi: 'मुख्यमंत्री माझी लाड़की बहिन योजना',
    department: 'Women and Child Development Department, Government of Maharashtra',
    government_level: 'State (Maharashtra)',
    category: 'Women & Child Development',
    description_en: 'Provides direct financial assistance of ₹1,500 per month to eligible women in Maharashtra to foster economic independence, improve health and nutrition, and strengthen their role in the family.',
    description_mr: 'महाराष्ट्रातील पात्र महिलांना आर्थिक स्वातंत्र्य, पोषण व आरोग्य सुधारण्यासाठी आणि कुटुंबातील निर्णयप्रक्रियेत बळ देण्यासाठी दरमहा ₹१,५०० ची थेट आर्थिक मदत दिली जाते.',
    description_hi: 'महाराष्ट्र की पात्र महिलाओं को आर्थिक आत्मनिर्भरता, पोषण व स्वास्थ्य सुधार और परिवार में सशक्तिकरण हेतु प्रति माह ₹१,५०० की प्रत्यक्ष वित्तीय सहायता प्रदान की जाती है।',
    benefits_summary: '₹1,500 monthly direct bank transfer (DBT) (₹18,000 annually)',
    max_benefit_amount: '₹18,000 / year',
    target_beneficiaries: 'Married, widowed, divorced, abandoned, and destitute women aged 21 to 65 years',
    application_mode: 'Online (Nari Shakti Doot App / Official Portal) and Anganwadi / CSC Centers',
    official_portal_url: 'https://ladakibahin.maharashtra.gov.in',
    official_guideline_url: 'https://womenchild.maharashtra.gov.in',
    source_name: 'Government of Maharashtra GR No. WCD-2024/CR-142/Desk-2',
    source_verified_date: '2026-01-15',
    criteria: {
      min_age: 21,
      max_age: 65,
      gender: 'Female',
      caste_categories: ['All'],
      max_income: 250000,
      required_occupation: 'All',
      required_education_status: 'Any',
      maharashtra_domicile_required: true,
      additional_conditions_en: 'Annual family income must not exceed ₹2.5 Lakhs. Family must not own a 4-wheeler (excluding tractors). Family members must not be income tax payees or regular government employees.',
      additional_conditions_mr: 'कुटुंबाचे वार्षिक उत्पन्न ₹२.५० लाखांपेक्षा जास्त नसावे. कुटुंबात चारचाकी वाहन (ट्रॅक्टर वगळून) नसावे. कुटुंबातील कोणीही आयकरदाता किंवा शासकीय नोकरदार नसावा.',
      additional_conditions_hi: 'पारिवारिक वार्षिक आय ₹२.५० लाख से अधिक न हो। परिवार के पास चार पहिया वाहन (ट्रैक्टर छोड़कर) न हो और परिवार में कोई आयकर दाता या सरकारी कर्मचारी न हो।'
    },
    documents: [
      {
        document_name_en: 'Aadhaar Card',
        document_name_mr: 'आधार कार्ड',
        document_name_hi: 'आधार कार्ड',
        is_mandatory: true,
        purpose_en: 'Verification of identity and age of the applicant woman.',
        purpose_mr: 'अर्जदार महिलेची ओळख व वय सिद्ध करण्यासाठी.',
        purpose_hi: 'आवेदक महिला की पहचान और आयु सत्यापन हेतु।'
      },
      {
        document_name_en: 'Maharashtra Domicile Certificate / School Leaving Certificate',
        document_name_mr: 'अधिवास प्रमाणपत्र (Domicile) / शाळा सोडल्याचा दाखला',
        document_name_hi: 'अधिवास प्रमाण पत्र (Domicile) / स्कूल लीविंग सर्टिफिकेट',
        is_mandatory: true,
        purpose_en: 'Proof of continuous residence in Maharashtra state.',
        purpose_mr: 'महाराष्ट्र राज्याचे रहिवासी असल्याचे सिद्ध करण्यासाठी.',
        purpose_hi: 'महाराष्ट्र राज्य का निवासी होने के प्रमाण के रूप में।'
      },
      {
        document_name_en: 'Income Certificate (Under ₹2.5 Lakh) or Yellow/Orange Ration Card',
        document_name_mr: 'उत्पन्नाचा दाखला (२.५ लाखांच्या आत) किंवा पिवळे/केशरी रेशन कार्ड',
        document_name_hi: 'आय प्रमाण पत्र (२.५ लाख के भीतर) या पीला/केसरी राशन कार्ड',
        is_mandatory: true,
        purpose_en: 'Proof of annual family income below ₹2.5 Lakhs.',
        purpose_mr: 'वार्षिक उत्पन्न मर्यादेच्या आत असल्याचे सिद्ध करण्यासाठी.',
        purpose_hi: 'वार्षिक पारिवारिक आय पात्रता की पुष्टि के लिए।'
      },
      {
        document_name_en: 'Aadhaar-Linked Bank Account Passbook',
        document_name_mr: 'आधार संलग्न बँक खाते पासबुक',
        document_name_hi: 'आधार लिंक्ड बैंक खाता पासबुक',
        is_mandatory: true,
        purpose_en: 'For direct benefit transfer (DBT) payments.',
        purpose_mr: 'थेट बँक खात्यात अनुदान जमा होण्यासाठी (DBT).',
        purpose_hi: 'प्रत्यक्ष लाभ अंतरण (DBT) के लिए।'
      },
      {
        document_name_en: 'Hamipatra (Self-Declaration Form)',
        document_name_mr: 'हमीपत्र (स्वयंघोषणा पत्र)',
        document_name_hi: 'हमीपत्र (स्वघोषणा पत्र)',
        is_mandatory: true,
        purpose_en: 'Affirming that no family member is a government employee or income tax payer.',
        purpose_mr: 'कुटुंबात सरकारी नोकरदार किंवा आयकरदाता नसल्याबाबत हमी.',
        purpose_hi: 'परिवार में कोई आयकर दाता या सरकारी कर्मी न होने का शपथ पत्र।'
      }
    ],
    chunks: [
      {
        chunk_type: 'overview',
        chunk_text: 'Mukhyamantri Majhi Ladki Bahin Yojana provides ₹1,500 per month to eligible women in Maharashtra aged 21 to 65 years. The scheme aims to empower women economically and ensure nutritional security.',
        language: 'en',
        keywords: 'ladki bahin, women allowance, 1500 monthly, maharashtra women scheme'
      },
      {
        chunk_type: 'eligibility',
        chunk_text: 'Eligibility for Ladki Bahin Yojana: Age between 21 and 65 years, resident of Maharashtra with Domicile Certificate, annual family income less than ₹2.5 Lakhs, bank account must be seeded with Aadhaar for DBT. Ineligible: Income tax payers, owners of four-wheelers (tractors exempt), and regular government employees.',
        language: 'en',
        keywords: 'ladki bahin eligibility, income limit 2.5 lakh, age 21 to 65'
      },
      {
        chunk_type: 'overview',
        chunk_text: 'मुख्यमंत्री माझी लाडकी बहीण योजनेअंतर्गत महाराष्ट्रातील २१ ते ६५ वयोगटातील पात्र महिलांना दरमहा ₹१,५०० थेट बँक खात्यात दिले जातात. यासाठी वार्षिक उत्पन्न २.५ लाखांपेक्षा कमी असणे आवश्यक आहे.',
        language: 'mr',
        keywords: 'लाडकी बहीण योजना, दरमहा १५००, पात्रता, महिला योजना'
      }
    ]
  },
  {
    id: 'namo-shetkari-yojana',
    slug: 'namo-shetkari-mahasanman-nidhi-yojana',
    name_en: 'Namo Shetkari Mahasanman Nidhi Yojana',
    name_mr: 'नमो शेतकरी महासन्मान निधी योजना',
    name_hi: 'नमो शेतकरी महासम्मान निधि योजना',
    department: 'Department of Agriculture, Government of Maharashtra',
    government_level: 'State (Maharashtra)',
    category: 'Agriculture & Farmers',
    description_en: 'Maharashtra State scheme providing an additional ₹6,000 per year to farmers on top of the central PM-KISAN scheme, taking the combined annual support to ₹12,000 across 3 installments.',
    description_mr: 'केंद्राच्या PM-KISAN योजनेच्या ₹६,००० शिवाय महाराष्ट्र शासनाकडून अतिरिक्त ₹६,००० प्रतिवर्ष थेट शेतकऱ्यांच्या खात्यात दिले जातात, म्हणजेच एकूण ₹१२,००० वार्षिक मदत मिळते.',
    description_hi: 'केंद्र की PM-KISAN योजना के ₹६,००० के अतिरिक्त महाराष्ट्र शासन द्वारा किसानों को ₹६,००० प्रति वर्ष प्रदान किए जाते हैं, जिससे कुल सहायता ₹१२,००० प्रति वर्ष हो जाती है।',
    benefits_summary: '₹6,000 per year in 3 equal installments of ₹2,000 directly via DBT',
    max_benefit_amount: '₹6,000 / year (State) + ₹6,000 (Central) = ₹12,000',
    target_beneficiaries: 'Small, marginal, and all landholding farmers registered under PM-KISAN in Maharashtra',
    application_mode: 'Online (Auto-integrated with PM-KISAN Portal)',
    official_portal_url: 'https://krishi.maharashtra.gov.in',
    official_guideline_url: 'https://pmkisan.gov.in',
    source_name: 'Department of Agriculture GR No. Mahasanman-2023/CR-104/11-A',
    source_verified_date: '2026-02-10',
    criteria: {
      min_age: 18,
      gender: 'All',
      caste_categories: ['All'],
      required_occupation: 'Farmer',
      required_education_status: 'Any',
      maharashtra_domicile_required: true,
      additional_conditions_en: 'Beneficiary must be registered and approved under PM-KISAN in Maharashtra, possess cultivable land holding documented in 7/12 land records, have completed e-KYC, and linked Aadhaar with their bank account.',
      additional_conditions_mr: 'लाभार्थी PM-KISAN अंतर्गत नोंदणीकृत असावा, शेतीची ७/१२ नोंद असावी, e-KYC पूर्ण असावे आणि बँक खाते आधारशी जोडलेले असावे.',
      additional_conditions_hi: 'किसान PM-KISAN योजना में पंजीकृत होना चाहिए, 7/12 भू-अभिलेख में नाम हो, e-KYC पूर्ण हो और आधार बैंक से लिंक हो।'
    },
    documents: [
      {
        document_name_en: '7/12 Land Records Extract (Satbara Utara) and 8-A Extract',
        document_name_mr: '७/१२ आणि ८-अ चा उतारा',
        document_name_hi: '७/१२ और ८-अ भू-अभिलेख उद्धरण',
        is_mandatory: true,
        purpose_en: 'Proof of agricultural land ownership in Maharashtra.',
        purpose_mr: 'महाराष्ट्रात शेतीजमीन मालकी सिद्ध करण्यासाठी.',
        purpose_hi: 'कृषि भूमि के स्वामित्व की पुष्टि हेतु।'
      },
      {
        document_name_en: 'Aadhaar Card (e-KYC verified)',
        document_name_mr: 'आधार कार्ड (e-KYC पूर्ण)',
        document_name_hi: 'आधार कार्ड (e-KYC सत्यापित)',
        is_mandatory: true,
        purpose_en: 'Biometric and identity verification under PM-KISAN & Namo Shetkari.',
        purpose_mr: 'ओळख पडताळणी आणि e-KYC साठी.',
        purpose_hi: 'पहचान और बायोमेट्रिक e-KYC हेतु।'
      },
      {
        document_name_en: 'Active Bank Account linked to Aadhaar (NPCI mapped)',
        document_name_mr: 'आधार संलग्न बँक खाते (NPCI मॅप केलेले)',
        document_name_hi: 'आधार से जुड़ा बैंक खाता (NPCI मैप्ड)',
        is_mandatory: true,
        purpose_en: 'Direct Benefit Transfer of installment amounts.',
        purpose_mr: 'अनुदानाचे हप्ते थेट जमा होण्यासाठी.',
        purpose_hi: 'किस्त सीधे खाते में अंतरित करने हेतु।'
      }
    ],
    chunks: [
      {
        chunk_type: 'overview',
        chunk_text: 'Namo Shetkari Mahasanman Nidhi Yojana gives Maharashtra farmers ₹6,000 per year in 3 installments of ₹2,000, mirroring the central PM-KISAN scheme to provide total assistance of ₹12,000 annually.',
        language: 'en',
        keywords: 'namo shetkari, farmer scheme, 6000 annual, pm kisan maharashtra'
      },
      {
        chunk_type: 'eligibility',
        chunk_text: 'To receive Namo Shetkari Yojana payments: Must be a registered beneficiary of PM-KISAN in Maharashtra, own cultivable agricultural land verified by 7/12 records, have Aadhaar seeded with bank account and NPCI mapped, and have completed biometric or OTP e-KYC.',
        language: 'en',
        keywords: 'namo shetkari eligibility, 7 12 land record, e-kyc, npci mapping'
      }
    ]
  },
  {
    id: 'mjpjay-health',
    slug: 'mahatma-jyotirao-phule-jan-arogya-yojana',
    name_en: 'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)',
    name_mr: 'महात्मा ज्योतिराव फुले जन आरोग्य योजना',
    name_hi: 'महात्मा ज्योतिराव फुले जन आरोग्य योजना',
    department: 'Public Health Department, Government of Maharashtra',
    government_level: 'State (Maharashtra)',
    category: 'Healthcare',
    description_en: 'Flagship health insurance scheme providing cashless hospitalization and surgical treatment up to ₹5,00,000 per family per year across 1,356 identified medical procedures in empanelled network hospitals.',
    description_mr: 'कुटुंबाला दरवर्षी ₹५ लाखांपर्यंत मोफत व कॅशलेस उपचार व शस्त्रक्रिया पुरवणारी आरोग्य विमा योजना. १३५६ आजारांवर मान्यताप्राप्त रुग्णालयांमध्ये मोफत उपचार उपलब्ध.',
    description_hi: 'प्रति परिवार प्रति वर्ष ₹५ लाख तक कैशलेस चिकित्सा और शल्य चिकित्सा उपचार प्रदान करने वाली प्रमुख स्वास्थ्य बीमा योजना। १३५६ सूचीबद्ध बीमारियों पर अनुबंधित अस्पतालों में मुफ्त इलाज।',
    benefits_summary: 'Cashless medical treatment up to ₹5,00,000 per family per year',
    max_benefit_amount: '₹5,00,000 / family / year',
    target_beneficiaries: 'Universal coverage for all families in Maharashtra holding valid ration cards',
    application_mode: 'At Empanelled Hospitals via Arogyamitra Helpdesk',
    official_portal_url: 'https://www.mjpjay.gov.in',
    official_guideline_url: 'https://arogya.maharashtra.gov.in',
    source_name: 'State Health Assurance Society, Maharashtra',
    source_verified_date: '2026-01-20',
    criteria: {
      gender: 'All',
      caste_categories: ['All'],
      required_occupation: 'All',
      required_education_status: 'Any',
      maharashtra_domicile_required: true,
      additional_conditions_en: 'Valid Yellow, Orange, or White Ration card issued by Government of Maharashtra, or Annapurna/Antyodaya card. Patient must seek treatment at an empanelled government or private hospital through the on-duty Arogyamitra.',
      additional_conditions_mr: 'महाराष्ट्र शासनाने जारी केलेले पिवळे, केशरी किंवा पांढरे रेशन कार्ड किंवा अंत्योदय कार्ड. मान्यताप्राप्त रुग्णालयात आरोग्यमित्राद्वारे नोंदणी आवश्यक.',
      additional_conditions_hi: 'महाराष्ट्र शासन द्वारा जारी पीला, केसरी अथवा सफेद राशन कार्ड होना आवश्यक है। अनुबंधित अस्पताल में आरोग्यमित्र के माध्यम से उपचार प्राप्त किया जा सकता है।'
    },
    documents: [
      {
        document_name_en: 'Valid Ration Card (Yellow / Orange / White / Antyodaya)',
        document_name_mr: 'रेशन कार्ड (पिवळे / केशरी / पांढरे / अंत्योदय)',
        document_name_hi: 'वैध राशन कार्ड (पीला / केसरी / सफेद / अंत्योदय)',
        is_mandatory: true,
        purpose_en: 'Primary family identity and residential entitlement document.',
        purpose_mr: 'कुटुंबाची ओळख आणि लाभ मिळवण्यासाठी मूळ पुरावा.',
        purpose_hi: 'पारिवारिक पहचान और पात्रता सत्यापन हेतु प्राथमिक दस्तावेज।'
      },
      {
        document_name_en: 'Aadhaar Card / Voter ID of the patient',
        document_name_mr: 'रुग्णाचे आधार कार्ड / मतदार ओळखपत्र',
        document_name_hi: 'मरीज का आधार कार्ड / मतदाता पहचान पत्र',
        is_mandatory: true,
        purpose_en: 'Individual identity verification of the hospitalized family member.',
        purpose_mr: 'उपचार घेणाऱ्या व्यक्तीची ओळख निश्चित करण्यासाठी.',
        purpose_hi: 'मरीज की व्यक्तिगत पहचान सुनिश्चित करने हेतु।'
      }
    ],
    chunks: [
      {
        chunk_type: 'overview',
        chunk_text: 'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY) gives cashless health cover up to ₹5 Lakhs per family per year across 1,356 secondary and tertiary procedures in empanelled network hospitals in Maharashtra.',
        language: 'en',
        keywords: 'mjpjay, 5 lakh cashless health, hospital treatment, maharashtra medical scheme'
      },
      {
        chunk_type: 'eligibility',
        chunk_text: 'MJPJAY now covers all ration card holders (Yellow, Orange, and White) in Maharashtra. Citizens can walk into any empanelled hospital with their Ration Card and Aadhaar card and meet the Arogyamitra at the helpdesk to initiate cashless admission.',
        language: 'en',
        keywords: 'mjpjay eligibility, ration card yellow orange white, arogyamitra helpdesk'
      }
    ]
  },
  {
    id: 'shahu-maharaj-scholarship',
    slug: 'rajarshi-shahu-maharaj-shikshan-shulkh-yojana',
    name_en: 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna',
    name_mr: 'राजर्षी छत्रपती शाहू महाराज शिक्षण शुल्क शिष्यवृत्ती योजना',
    name_hi: 'राजर्षी छत्रपति शाहू महाराज शिक्षण शुल्क छात्रवृत्ति योजना',
    department: 'Higher & Technical Education Department, Government of Maharashtra',
    government_level: 'State (Maharashtra)',
    category: 'Education & Scholarships',
    description_en: 'Reimbursement of 50% tuition fees and examination fees for Economically Weaker Section (EWS/SEBC/Open) students enrolled in approved professional degree and diploma courses through the centralized admission process (CAP).',
    description_mr: 'केंद्रीभूत प्रवेश प्रक्रियेद्वारे (CAP) व्यावसायिक पदवी व पदविका अभ्यासक्रमांना प्रवेश घेतलेल्या आर्थिकदृष्ट्या दुर्बल घटकातील (EWS/SEBC/खुला प्रवर्ग) विद्यार्थ्यांना ५०% शिक्षण शुल्क आणि परीक्षा शुल्क परतावा मिळतो.',
    description_hi: 'केंद्रीय प्रवेश प्रक्रिया (CAP) के माध्यम से अनुमोदित व्यावसायिक डिग्री और डिप्लोमा पाठ्यक्रमों में प्रवेशित ईडब्ल्यूएस/एसईबीसी/ओपन श्रेणी के छात्रों को ५०% शिक्षण शुल्क और परीक्षा शुल्क प्रतिपूर्ति प्रदान की जाती है।',
    benefits_summary: '50% tuition fee and exam fee waiver in professional higher education courses',
    max_benefit_amount: '50% of approved tuition fee',
    target_beneficiaries: 'Undergraduate and postgraduate students in engineering, medicine, pharmacy, architecture, MBA, etc.',
    application_mode: 'Online via MahaDBT Portal',
    official_portal_url: 'https://mahadbt.maharashtra.gov.in',
    official_guideline_url: 'https://dtemaharashtra.gov.in',
    source_name: 'Directorate of Technical Education, Maharashtra',
    source_verified_date: '2026-01-30',
    criteria: {
      gender: 'All',
      caste_categories: ['General', 'EWS', 'SEBC', 'OBC'],
      max_income: 800000,
      required_occupation: 'Student',
      required_education_status: 'Higher Education / CAP admitted',
      maharashtra_domicile_required: true,
      additional_conditions_en: 'Family annual income must be up to ₹8,00,000. Candidate must have taken admission through CAP into a government, aided, or un-aided private recognized college. Maximum 2 children from the family can avail this benefit.',
      additional_conditions_mr: 'कुटुंबाचे वार्षिक उत्पन्न ₹८ लाखांपर्यंत असावे. प्रवेश शासकीय, अनुदानित किंवा विनाअनुदानित मान्यताप्राप्त महाविद्यालयात CAP द्वारे झालेला असावा. एका कुटुंबातील जास्तीत जास्त दोन पाल्यांना लाभ मिळतो.',
      additional_conditions_hi: 'वार्षिक पारिवारिक आय ₹८ लाख तक हो। प्रवेश CAP राउंड के माध्यम से होना अनिवार्य है। एक परिवार के अधिकतम दो बच्चों को लाभ।'
    },
    documents: [
      {
        document_name_en: 'Maharashtra Domicile Certificate',
        document_name_mr: 'महाराष्ट्र अधिवास प्रमाणपत्र (Domicile)',
        document_name_hi: 'महाराष्ट्र अधिवास प्रमाण पत्र',
        is_mandatory: true,
        purpose_en: 'To prove residence and domicile in Maharashtra.',
        purpose_mr: 'महाराष्ट्र राज्याचे अधिवासी असल्याचे प्रमाणपत्र.',
        purpose_hi: 'महाराष्ट्र का मूल निवासी होने का प्रमाण।'
      },
      {
        document_name_en: 'Current Year Income Certificate issued by Tahsildar (Up to ₹8 Lakhs)',
        document_name_mr: 'तहसीलदारांनी दिलेला चालू आर्थिक वर्षाचा उत्पन्नाचा दाखला (८ लाखांच्या आत)',
        document_name_hi: 'तहसीलदार द्वारा जारी चालू वित्तीय वर्ष का आय प्रमाण पत्र (८ लाख तक)',
        is_mandatory: true,
        purpose_en: 'Verification of family income limit.',
        purpose_mr: 'कुटुंबाची वार्षिक उत्पन्न मर्यादा तपासण्यासाठी.',
        purpose_hi: 'पारिवारिक वार्षिक आय की पुष्टि हेतु।'
      },
      {
        document_name_en: 'CAP Allotment Letter',
        document_name_mr: 'कॅप (CAP) वाटप पत्र',
        document_name_hi: 'कॅप (CAP) आवंटन पत्र',
        is_mandatory: true,
        purpose_en: 'Proof of merit-based admission through Centralized Admission Process.',
        purpose_mr: 'प्रवेश गुणवत्तेनुसार अधिकृत CAP द्वारे झाल्याचा पुरावा.',
        purpose_hi: 'केंद्रीय प्रवेश प्रक्रिया के तहत प्रवेश का आधिकारिक प्रमाण।'
      },
      {
        document_name_en: 'College Fee Receipt & Previous Examination Marksheets',
        document_name_mr: 'महाविद्यालयीन फी पावती आणि मागील वर्षाचे गुणपत्रक',
        document_name_hi: 'कॉलेज शुल्क रसीद और पिछली परीक्षा की अंकतालिका',
        is_mandatory: true,
        purpose_en: 'Proof of fee payment and academic continuation.',
        purpose_mr: 'फी भरल्याचा आणि अभ्यासक्रम चालू असल्याचा पुरावा.',
        purpose_hi: 'शुल्क भुगतान और अध्ययनरत होने का साक्ष्य।'
      }
    ],
    chunks: [
      {
        chunk_type: 'overview',
        chunk_text: 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna waives 50% of tuition and examination fees for students with family income under ₹8 Lakhs admitted via CAP rounds in professional courses.',
        language: 'en',
        keywords: 'shahu maharaj scholarship, mahadbt, 50% tuition waiver, cap admission, 8 lakh income'
      },
      {
        chunk_type: 'eligibility',
        chunk_text: 'Eligibility for Shahu Maharaj Scholarship: Maharashtra domicile, annual income up to ₹8 Lakhs, admission through CAP round into engineering, medical, pharmacy, polytechnic, or management courses. Applied via MahaDBT portal.',
        language: 'en',
        keywords: 'shahu maharaj eligibility, mahadbt portal, cap round, income certificate'
      }
    ]
  },
  {
    id: 'swadhar-yojana',
    slug: 'dr-babasaheb-ambedkar-swadhar-yojana',
    name_en: 'Dr. Babasaheb Ambedkar Swadhar Yojana',
    name_mr: 'डॉ. बाबासाहेब आंबेडकर स्वाधार योजना',
    name_hi: 'डॉ. बाबासाहेब आंबेडकर स्वाधार योजना',
    department: 'Social Justice and Special Assistance Department, Government of Maharashtra',
    government_level: 'State (Maharashtra)',
    category: 'Social Welfare & Assistance',
    description_en: 'Provides financial allowance for lodging, boarding, food, and study materials ranging from ₹48,000 to ₹60,000 per year directly to Scheduled Caste (SC) and Neo-Buddhist students who could not get admission to government hostels.',
    description_mr: 'शासकीय वसतिगृहात प्रवेश न मिळालेल्या अनुसूचित जाती व नवबौद्ध प्रवर्गातील विद्यार्थ्यांना भोजन, निवास व शैक्षणिक साहित्यासाठी दरवर्षी ₹४८,००० ते ₹६०,००० थेट खात्यात दिले जातात.',
    description_hi: 'सरकारी छात्रावास में प्रवेश न पाने वाले अनुसूचित जाति (SC) और नव-बौद्ध छात्रों को भोजन, आवास और शैक्षिक सामग्री के लिए प्रति वर्ष ₹४८,००० से ₹६०,००० की प्रत्यक्ष वित्तीय सहायता दी जाती है।',
    benefits_summary: 'Annual stipend of ₹48,000 to ₹60,000 for hostel, food, and books',
    max_benefit_amount: '₹60,000 / year',
    target_beneficiaries: 'SC and Neo-Buddhist students admitted to post-matric professional courses outside their native town',
    application_mode: 'Online (MahaDBT / Social Justice Assistant Commissioner Office)',
    official_portal_url: 'https://sjsa.maharashtra.gov.in',
    official_guideline_url: 'https://mahadbt.maharashtra.gov.in',
    source_name: 'Social Justice Department GR No. EBC-2016/CR-221/Edu-2',
    source_verified_date: '2026-02-01',
    criteria: {
      gender: 'All',
      caste_categories: ['SC', 'Neo-Buddhist'],
      max_income: 250000,
      required_occupation: 'Student',
      required_education_status: 'Post-Matric (11th, Diploma, Degree, PG)',
      maharashtra_domicile_required: true,
      additional_conditions_en: 'Belonging to SC/Neo-Buddhist category. Annual family income must not exceed ₹2.5 Lakhs. Minimum 50% marks in the qualifying examination (40% for disabled students). Student must be studying in an institute outside their native taluka/municipality.',
      additional_conditions_mr: 'अनुसूचित जाती किंवा नवबौद्ध प्रवर्ग, कौटुंबिक वार्षिक उत्पन्न ₹२.५० लाखांपेक्षा कमी, मागील परीक्षेत किमान ५०% गुण (दिव्यांगांसाठी ४०%), आणि मूळ तालुक्याबाहेर शिक्षण घेत असावा.',
      additional_conditions_hi: 'अनुसूचित जाति/नव-बौद्ध वर्ग, पारिवारिक आय ₹२.५० लाख से कम, पिछली परीक्षा में न्यूनतम ५०% अंक (दिव्यांगों हेतु ४०%) और गृह तहसील से बाहर अध्ययनरत होना चाहिए।'
    },
    documents: [
      {
        document_name_en: 'Caste Certificate & Caste Validity Certificate',
        document_name_mr: 'जात प्रमाणपत्र आणि जात पडताळणी प्रमाणपत्र',
        document_name_hi: 'जाति प्रमाण पत्र एवं जाति वैधता प्रमाण पत्र',
        is_mandatory: true,
        purpose_en: 'Proof of Scheduled Caste or Neo-Buddhist status.',
        purpose_mr: 'अनुसूचित जाती / नवबौद्ध प्रवर्गाचा पुरावा.',
        purpose_hi: 'आरक्षित वर्ग की प्रामाणिकता हेतु।'
      },
      {
        document_name_en: 'Hostel Non-Admission Certificate / Rejection Proof',
        document_name_mr: 'शासकीय वसतिगृहात प्रवेश न मिळाल्याचा दाखला',
        document_name_hi: 'सरकारी छात्रावास में प्रवेश न मिलने का प्रमाण',
        is_mandatory: true,
        purpose_en: 'Proof that student applied for government hostel and was not accommodated.',
        purpose_mr: 'शासकीय वसतिगृहात जागा न मिळाल्याचे प्रमाणपत्र.',
        purpose_hi: 'सरकारी हॉस्टल में सीट न मिलने का प्रमाण।'
      },
      {
        document_name_en: 'Rental Agreement / PG Residence Certificate',
        document_name_mr: 'भाडे करारनामा / खाजगी निवास पुरावा',
        document_name_hi: 'किराया अनुबंध / निजी आवास साक्ष्य',
        is_mandatory: true,
        purpose_en: 'Proof of living in private rental accommodation or paying guest setup.',
        purpose_mr: 'खाजगी जागेत भाड्याने राहत असल्याचा पुरावा.',
        purpose_hi: 'किराए पर रहने का वैध प्रमाण पत्र।'
      },
      {
        document_name_en: 'Income Certificate (Under ₹2.5 Lakh) & Marksheets',
        document_name_mr: 'उत्पन्न दाखला (२.५ लाखांपर्यंत) आणि गुणपत्रिका',
        document_name_hi: 'आय प्रमाण पत्र (२.५ लाख के भीतर) एवं अंकतालिका',
        is_mandatory: true,
        purpose_en: 'Income verification and academic merit (minimum 50% marks).',
        purpose_mr: 'उत्पन्न व शैक्षणिक गुणवत्तेची खात्री करण्यासाठी.',
        purpose_hi: 'आय और शैक्षणिक योग्यता की पुष्टि हेतु।'
      }
    ],
    chunks: [
      {
        chunk_type: 'overview',
        chunk_text: 'Dr. Babasaheb Ambedkar Swadhar Yojana provides ₹48,000 to ₹60,000 per year directly to SC/Neo-Buddhist students studying in professional and post-matric courses who did not secure a seat in government hostels.',
        language: 'en',
        keywords: 'swadhar yojana, sc students, hostel allowance, 60000 stipend'
      },
      {
        chunk_type: 'eligibility',
        chunk_text: 'Eligibility for Swadhar: SC or Neo-Buddhist student in Maharashtra, family income under ₹2.5 Lakhs, enrolled in recognized post-matric course, min 50% marks, studying outside native taluka, not admitted to government hostel.',
        language: 'en',
        keywords: 'swadhar eligibility, sc category, rental agreement, 2.5 lakh income limit'
      }
    ]
  },
  {
    id: 'sanjay-gandhi-niradhar',
    slug: 'sanjay-gandhi-niradhar-anudan-yojana',
    name_en: 'Sanjay Gandhi Niradhar Anudan Yojana',
    name_mr: 'संजय गांधी निराधार अनुदान योजना',
    name_hi: 'संजय गांधी निराधार अनुदान योजना',
    department: 'Social Assistance Division, Revenue and Forest Department, Maharashtra',
    government_level: 'State (Maharashtra)',
    category: 'Social Welfare & Assistance',
    description_en: 'Provides a monthly pension of ₹1,500 to destitute persons, widows, divorced women, deserted wives, severely disabled individuals, transgender persons, and patients suffering from major debilitating illnesses.',
    description_mr: 'निराधार व्यक्ती, विधवा, घटस्फोटित व परित्यक्ता महिला, ४०% पेक्षा जास्त दिव्यांग व्यक्ती, तृतीयपंथी आणि दुर्धर आजाराने ग्रस्त रुग्णांना दरमहा ₹१,५०० चे मासिक निवृत्तिवेतन दिले जाते.',
    description_hi: 'निराधार व्यक्तियों, विधवाओं, तलाकशुदा व परित्यक्त महिलाओं, ४०% से अधिक दिव्यांगजनों, उभयलिंगी व्यक्तियों और गंभीर बीमारी से पीड़ित रोगियों को प्रति माह ₹१,५०० की पेंशन दी जाती है।',
    benefits_summary: 'Monthly pension of ₹1,500 per month directly deposited to bank account',
    max_benefit_amount: '₹1,500 / month (₹18,000 / year)',
    target_beneficiaries: 'Destitute elderly, persons with disabilities, widows, and deserted women without breadwinners',
    application_mode: 'Offline at Tahsildar / Taluk Office or Online via Aaple Sarkar Portal',
    official_portal_url: 'https://aaplesarkar.mahaonline.gov.in',
    official_guideline_url: 'https://revenue.maharashtra.gov.in',
    source_name: 'Revenue & Forest Department GR No. SGN-2023/CR-19/Desk-33',
    source_verified_date: '2026-01-10',
    criteria: {
      min_age: 18,
      max_age: 65,
      gender: 'All',
      caste_categories: ['All'],
      max_income: 21000,
      required_occupation: 'Destitute',
      required_education_status: 'Any',
      maharashtra_domicile_required: true,
      additional_conditions_en: 'Annual family income must not exceed ₹21,000. Beneficiary must have resided in Maharashtra for at least 15 continuous years. Must have no adult earning son or other source of livelihood.',
      additional_conditions_mr: 'वार्षिक कौटुंबिक उत्पन्न ₹२१,००० पेक्षा जास्त नसावे. महाराष्ट्रात किमान १५ वर्षे सलग वास्तव्य असावे. कमावता मुलगा किंवा उदरनिर्वाहाचे साधन नसावे.',
      additional_conditions_hi: 'वार्षिक पारिवारिक आय ₹२१,००० से अधिक न हो। महाराष्ट्र में कम से कम १५ वर्षों का निवास अनिवार्य। कोई कमाने वाला वयस्क पुत्र न हो।'
    },
    documents: [
      {
        document_name_en: '15 Years Maharashtra Domicile / Residence Certificate',
        document_name_mr: 'महाराष्ट्रातील १५ वर्षांचे वास्तव्याचे प्रमाणपत्र (Domicile)',
        document_name_hi: 'महाराष्ट्र में १५ वर्ष निवास का प्रमाण पत्र (Domicile)',
        is_mandatory: true,
        purpose_en: 'Mandatory 15-year state residency proof.',
        purpose_mr: 'किमान १५ वर्षे महाराष्ट्रात वास्तव्याचा पुरावा.',
        purpose_hi: 'राज्य में निरंतर १५ वर्ष निवास का प्रमाण।'
      },
      {
        document_name_en: 'Income Certificate (Under ₹21,000 per year)',
        document_name_mr: 'तहसीलदारांचा उत्पन्नाचा दाखला (वार्षिक ₹२१,००० च्या आत)',
        document_name_hi: 'तहसीलदार का आय प्रमाण पत्र (वार्षिक ₹२१,००० के भीतर)',
        is_mandatory: true,
        purpose_en: 'Proof of destitution and extreme economic hardship.',
        purpose_mr: 'अतिशय दुर्बल आर्थिक स्थिती व निराधार असल्याचे प्रमाणपत्र.',
        purpose_hi: 'अत्यंत निर्धनता और निराधार होने का आधिकारिक साक्ष्य।'
      },
      {
        document_name_en: 'Disability Certificate (Civil Surgeon) / Husband Death Certificate (for widows)',
        document_name_mr: 'दिव्यांग प्रमाणपत्र (सिव्हिल सर्जन) / पतीचे मृत्यू प्रमाणपत्र (विधवांसाठी)',
        document_name_hi: 'दिव्यांगता प्रमाण पत्र (सिविल सर्जन) / पति का मृत्यु प्रमाण पत्र (विधवाओं हेतु)',
        is_mandatory: true,
        purpose_en: 'Specific category condition proof (e.g. 40%+ disability, widowhood).',
        purpose_mr: 'विशिष्ट प्रवर्गातील पात्रता सिद्ध करण्यासाठी (दिव्यांगत्व किंवा विधवात्व).',
        purpose_hi: 'संबंधित श्रेणी (दिव्यांगता अथवा वैधव्य) की पुष्टि हेतु।'
      }
    ],
    chunks: [
      {
        chunk_type: 'overview',
        chunk_text: 'Sanjay Gandhi Niradhar Anudan Yojana grants a monthly pension of ₹1,500 to destitute individuals, widows, and persons with disabilities in Maharashtra who have no substantial source of income.',
        language: 'en',
        keywords: 'sanjay gandhi niradhar, monthly pension 1500, destitute widow disabled'
      },
      {
        chunk_type: 'eligibility',
        chunk_text: 'Criteria for Sanjay Gandhi Niradhar Yojana: Resident of Maharashtra for 15+ years, family annual income under ₹21,000, no adult earning children. Applies to destitute persons, widows, and persons with certified disability of 40% or more.',
        language: 'en',
        keywords: 'sanjay gandhi eligibility, 15 years domicile, 21000 income limit, disability certificate'
      }
    ]
  },
  {
    id: 'baliraja-vij-yojana',
    slug: 'mukhyamantri-baliraja-vij-savalat-yojana',
    name_en: 'Mukhyamantri Baliraja Vij Savalat Yojana',
    name_mr: 'मुख्यमंत्री बळीराजा मोफत वीज सवलत योजना',
    name_hi: 'मुख्यमंत्री बलिराजा मुफ्त बिजली रियायत योजना',
    department: 'Energy Department & MSEDCL, Government of Maharashtra',
    government_level: 'State (Maharashtra)',
    category: 'Agriculture & Energy',
    description_en: 'Provides complete waiver of electricity bills (free electricity) for agricultural water pump consumers with connected loads up to 7.5 Horsepower (HP) across Maharashtra.',
    description_mr: 'महाराष्ट्रातील ७.५ अश्वशक्ती (HP) पर्यंतच्या शेतीपंपांना संपूर्ण वीज बिल माफी (मोफत वीज) देणारी योजना. सुमारे ४४ लाख शेतकऱ्यांना याचा थेट लाभ मिळतो.',
    description_hi: 'महाराष्ट्र के ७.५ हॉर्सपावर (HP) तक के कृषि पंप उपभोक्ताओं को बिजली बिल में १००% छूट (मुफ्त बिजली) प्रदान करने वाली योजना।',
    benefits_summary: '100% free electricity on agricultural pumps up to 7.5 HP capacity',
    max_benefit_amount: 'Complete waiver of agricultural electricity bills',
    target_beneficiaries: 'Agricultural power consumers using electric pumps up to 7.5 HP in Maharashtra',
    application_mode: 'Automatic benefit through MSEDCL billing system',
    official_portal_url: 'https://www.mahadiscom.in',
    official_guideline_url: 'https://urja.maharashtra.gov.in',
    source_name: 'Energy Department GR No. MSEDCL-2024/CR-78/Energy-5',
    source_verified_date: '2026-02-15',
    criteria: {
      gender: 'All',
      caste_categories: ['All'],
      required_occupation: 'Farmer',
      required_education_status: 'Any',
      maharashtra_domicile_required: true,
      additional_conditions_en: 'Must have an official agricultural electricity pump connection with MSEDCL (Mahavitaran) with sanction capacity up to 7.5 HP. Connection must be in the name of the landholder or verified cultivator.',
      additional_conditions_mr: 'महावितरणकडे ७.५ HP पर्यंतचा अधिकृत शेतीपंप वीज ग्राहक क्रमांक असावा. वीज जोडणी जमीनधारक किंवा शेतकऱ्याच्या नावावर असावी.',
      additional_conditions_hi: 'महावितरण में ७.५ हॉर्सपावर तक का अधिकृत कृषि पंप विद्युत कनेक्शन होना चाहिए।'
    },
    documents: [
      {
        document_name_en: 'MSEDCL Electricity Consumer Number / Latest Bill',
        document_name_mr: 'महावितरण वीज ग्राहक क्रमांक / चालू वीज बिल',
        document_name_hi: 'महावितरण विद्युत उपभोक्ता संख्या / नवीनतम बिल',
        is_mandatory: true,
        purpose_en: 'To verify agricultural connection and sanctioned HP capacity.',
        purpose_mr: 'शेतीपंप जोडणी आणि HP क्षमता तपासण्यासाठी.',
        purpose_hi: 'कृषि कनेक्शन और क्षमता सत्यापन हेतु।'
      },
      {
        document_name_en: '7/12 Land Records Extract showing agricultural well/pump',
        document_name_mr: '७/१२ उतारा (विहीर/बोरवेल आणि पंप नोंद)',
        document_name_hi: '७/१२ भू-अभिलेख उद्धरण (कुआं/पंप विवरण)',
        is_mandatory: true,
        purpose_en: 'Proof of agricultural land and water source.',
        purpose_mr: 'शेतजमीन व पाण्याच्या स्रोताची नोंद तपासण्यासाठी.',
        purpose_hi: 'कृषि भूमि और जल स्रोत की पुष्टि हेतु।'
      }
    ],
    chunks: [
      {
        chunk_type: 'overview',
        chunk_text: 'Mukhyamantri Baliraja Vij Savalat Yojana provides 100% free electricity to Maharashtra farmers for agricultural water pumps up to 7.5 HP. Bills are waived automatically by MSEDCL.',
        language: 'en',
        keywords: 'baliraja vij yojana, free electricity farmers, 7.5 hp pump, msedcl mahavitaran'
      }
    ]
  },
  {
    id: 'shabari-gharkul-yojana',
    slug: 'shabari-adivasi-gharkul-yojana',
    name_en: 'Shabari Adivasi Gharkul Yojana',
    name_mr: 'शबरी आदिवासी घरकुल योजना',
    name_hi: 'शबरी आदिवासी घरकुल योजना',
    department: 'Tribal Development Department, Government of Maharashtra',
    government_level: 'State (Maharashtra)',
    category: 'Housing & Tribal Welfare',
    description_en: 'Provides financial housing assistance of ₹1.20 Lakhs to ₹1.50 Lakhs for constructing permanent pucca houses for homeless Scheduled Tribe (ST) families living in rural and urban areas of Maharashtra.',
    description_mr: 'महाराष्ट्रातील ग्रामीण व शहरी भागातील बेघर किंवा कच्च्या घरात राहणाऱ्या अनुसूचित जमातीतील (ST) बांधवांना पक्के घर बांधण्यासाठी ₹१.२० लाख ते ₹१.५० लाखांची आर्थिक मदत दिली जाते.',
    description_hi: 'महाराष्ट्र के ग्रामीण और शहरी क्षेत्रों में बेघर अथवा कच्चे मकानों में रहने वाले अनुसूचित जनजाति (ST) परिवारों को पक्का मकान बनाने हेतु ₹१.२० लाख से ₹१.५० लाख की वित्तीय सहायता प्रदान की जाती है।',
    benefits_summary: 'Financial grant of ₹1,20,000 (rural) or ₹1,50,000 (urban) for house construction',
    max_benefit_amount: '₹1,50,000',
    target_beneficiaries: 'Homeless or kuccha-house owning Scheduled Tribe (ST) families in Maharashtra',
    application_mode: 'Through Project Officer, Integrated Tribal Development Project (ITDP)',
    official_portal_url: 'https://tribal.maharashtra.gov.in',
    official_guideline_url: 'https://mahaawaas.gov.in',
    source_name: 'Tribal Development Department, Government of Maharashtra',
    source_verified_date: '2026-01-25',
    criteria: {
      gender: 'All',
      caste_categories: ['ST'],
      max_income: 150000,
      required_occupation: 'All',
      required_education_status: 'Any',
      maharashtra_domicile_required: true,
      additional_conditions_en: 'Must belong to Scheduled Tribe (ST). Annual income limit is ₹1,00,000 for rural areas and ₹1,50,000 for municipal/urban areas. Must not own any pucca house anywhere in India. Must own residential land or have Gram Panchayat plot allotment.',
      additional_conditions_mr: 'अनुसूचित जमाती (ST) प्रवर्गातील असावा. वार्षिक उत्पन्न मर्यादा ग्रामीण भागात ₹१ लाख आणि शहरी भागात ₹१.५० लाख. स्वतःचे पक्के घर नसावे. जागेचा मालकी हक्क किंवा ग्रामपंचायत नमुना ८ असावा.',
      additional_conditions_hi: 'अनुसूचित जनजाति (ST) वर्ग का होना अनिवार्य। ग्रामीण क्षेत्र में आय ₹१ लाख और शहरी क्षेत्र में ₹१.५० लाख तक। देश में कहीं भी पक्का मकान न हो।'
    },
    documents: [
      {
        document_name_en: 'Scheduled Tribe (ST) Caste Certificate',
        document_name_mr: 'अनुसूचित जमाती (ST) जात प्रमाणपत्र',
        document_name_hi: 'अनुसूचित जनजाति (ST) जाति प्रमाण पत्र',
        is_mandatory: true,
        purpose_en: 'Verification of ST status.',
        purpose_mr: 'अनुसूचित जमातीचे असल्याचे सिद्ध करण्यासाठी.',
        purpose_hi: 'अनुसूचित जनजाति श्रेणी सत्यापन हेतु।'
      },
      {
        document_name_en: 'Gram Panchayat Namuna 8 / Land Ownership Certificate',
        document_name_mr: 'ग्रामपंचायत नमुना ८ / जागेचा मालकी हक्क उतारा',
        document_name_hi: 'ग्राम पंचायत नमूना ८ / भूमि स्वामित्व प्रमाण पत्र',
        is_mandatory: true,
        purpose_en: 'Proof that the applicant has a legitimate plot to construct the house.',
        purpose_mr: 'घर बांधण्यासाठी अधिकृत जागा असल्याचा पुरावा.',
        purpose_hi: 'मकान निर्माण हेतु अधिकृत भूमि का साक्ष्य।'
      },
      {
        document_name_en: 'Income Certificate and Certificate of No Pucca House',
        document_name_mr: 'उत्पन्न दाखला आणि पक्के घर नसल्याचे स्वयंघोषणा पत्र',
        document_name_hi: 'आय प्रमाण पत्र एवं पक्का मकान न होने का प्रमाण',
        is_mandatory: true,
        purpose_en: 'Proof of income limit and homeless/kuccha house status.',
        purpose_mr: 'उत्पन्न मर्यादा आणि बेघर असल्याचे सिद्ध करण्यासाठी.',
        purpose_hi: 'आय सीमा और बेघर होने की पुष्टि हेतु।'
      }
    ],
    chunks: [
      {
        chunk_type: 'overview',
        chunk_text: 'Shabari Adivasi Gharkul Yojana funds construction of permanent pucca houses for Scheduled Tribe (ST) families in Maharashtra, granting up to ₹1.5 Lakhs for construction in phased stages.',
        language: 'en',
        keywords: 'shabari gharkul, tribal housing, st housing grant, maharashtra tribal'
      }
    ]
  },
  {
    id: 'ramai-awas-yojana',
    slug: 'ramai-awas-gharkul-yojana',
    name_en: 'Ramai Awas Yojana',
    name_mr: 'रमाई आवास घरकुल योजना',
    name_hi: 'रमाई आवास घरकुल योजना',
    department: 'Social Justice and Special Assistance Department, Maharashtra',
    government_level: 'State (Maharashtra)',
    category: 'Housing & Social Justice',
    description_en: 'Provides housing construction grants of ₹1.20 Lakhs to ₹2.50 Lakhs to Scheduled Caste (SC) and Nav-Buddha families living in poverty or without permanent shelter across rural and urban Maharashtra.',
    description_mr: 'महाराष्ट्रातील अनुसूचित जाती (SC) व नवबौद्ध घटकातील बेघर व कच्च्या घरात राहणाऱ्या कुटुंबांना हक्काचे पक्के घर बांधण्यासाठी ₹१.२० लाख ते ₹२.५० लाखांची मदत दिली जाते.',
    description_hi: 'महाराष्ट्र के अनुसूचित जाति (SC) और नव-बौद्ध वर्ग के बेघर और कच्चे घरों में रहने वाले परिवारों को पक्का मकान बनाने हेतु ₹१.२० लाख से ₹२.५० लाख का अनुदान दिया जाता है।',
    benefits_summary: 'Grant of ₹1,20,000 (rural) to ₹2,50,000 (urban) in stages for pucca house construction',
    max_benefit_amount: '₹2,50,000',
    target_beneficiaries: 'SC and Nav-Buddha families without permanent houses in Maharashtra',
    application_mode: 'Through MahaAwaas Portal or Block Development Officer (BDO)',
    official_portal_url: 'https://sjsa.maharashtra.gov.in',
    official_guideline_url: 'https://mahaawaas.gov.in',
    source_name: 'Social Justice Department, Government of Maharashtra',
    source_verified_date: '2026-01-18',
    criteria: {
      gender: 'All',
      caste_categories: ['SC', 'Neo-Buddhist'],
      max_income: 300000,
      required_occupation: 'All',
      required_education_status: 'Any',
      maharashtra_domicile_required: true,
      additional_conditions_en: 'Must belong to Scheduled Caste (SC) or Neo-Buddhist community, resident of Maharashtra for at least 15 years, family annual income under ₹1,00,000 (rural) or ₹3,00,000 (urban), and applicant must possess suitable land or kuccha house plot.',
      additional_conditions_mr: 'अनुसूचित जाती किंवा नवबौद्ध प्रवर्गातील, महाराष्ट्रात १५ वर्षे वास्तव्याचा पुरावा, उत्पन्न ग्रामीण भागात ₹१ लाख व शहरी भागात ₹३ लाखांपर्यंत, आणि स्वतःची जागा उपलब्ध असावी.',
      additional_conditions_hi: 'अनुसूचित जाति अथवा नव-बौद्ध वर्ग, १५ वर्ष का निवास, ग्रामीण में ₹१ लाख और शहरी में ₹३ लाख तक आय, और स्वयं की भूखंड उपलब्धता।'
    },
    documents: [
      {
        document_name_en: 'SC / Neo-Buddhist Caste Certificate',
        document_name_mr: 'अनुसूचित जाती / नवबौद्ध जात प्रमाणपत्र',
        document_name_hi: 'अनुसूचित जाति / नव-बौद्ध जाति प्रमाण पत्र',
        is_mandatory: true,
        purpose_en: 'Verification of caste reservation eligibility.',
        purpose_mr: 'आरक्षित प्रवर्गाची पात्रता पडताळणी.',
        purpose_hi: 'आरक्षित श्रेणी सत्यापन हेतु।'
      },
      {
        document_name_en: 'Proof of Land Ownership (Gram Panchayat 8-A / Property Card)',
        document_name_mr: 'जागेचा मालकी हक्क (नमुना ८-अ किंवा मालमत्ता पत्रक)',
        document_name_hi: 'भूमि स्वामित्व साक्ष्य (नमूना ८-अ या संपत्ति कार्ड)',
        is_mandatory: true,
        purpose_en: 'Proof that the applicant has rights to construct on the site.',
        purpose_mr: 'घर बांधणीसाठी जागा उपलब्ध असल्याचा पुरावा.',
        purpose_hi: 'निर्माण हेतु भूमि स्वामित्व का साक्ष्य।'
      },
      {
        document_name_en: 'Income Certificate and 15 Years Residence Certificate',
        document_name_mr: 'तहसीलदार उत्पन्न दाखला आणि १५ वर्षांचे रहिवासी प्रमाणपत्र',
        document_name_hi: 'तहसीलदार आय प्रमाण पत्र एवं १५ वर्ष का निवास प्रमाण पत्र',
        is_mandatory: true,
        purpose_en: 'Income and residency criteria verification.',
        purpose_mr: 'उत्पन्न व वास्तव्य अटींची पूर्तता तपासण्यासाठी.',
        purpose_hi: 'आय व निवास योग्यता सत्यापन हेतु।'
      }
    ],
    chunks: [
      {
        chunk_type: 'overview',
        chunk_text: 'Ramai Awas Yojana provides financial assistance up to ₹2.5 Lakhs for constructing permanent houses for Scheduled Caste and Nav-Buddha families in Maharashtra who are homeless or living in kuccha houses.',
        language: 'en',
        keywords: 'ramai awas, sc housing, gharkul yojana, maharashtra social justice'
      }
    ]
  },
  {
    id: 'msrtc-student-concession',
    slug: 'msrtc-student-bus-concession-scheme',
    name_en: 'Maharashtra Student Bus Concession Scheme (MSRTC)',
    name_mr: 'महाराष्ट्र राज्य परिवहन (एस.टी.) विद्यार्थी प्रवास सवलत योजना',
    name_hi: 'महाराष्ट्र राज्य परिवहन (एस.टी.) छात्र यात्रा रियायत योजना',
    department: 'Transport Department & MSRTC, Government of Maharashtra',
    government_level: 'State (Maharashtra)',
    category: 'Education & Transport',
    description_en: 'Provides subsidized monthly bus passes with 66.67% concession for bonafide students traveling between their home and educational institutions. Under the Ahilyabai Holkar Scheme, girl students from Class 5 to Class 12 receive 100% free bus travel.',
    description_mr: 'विद्यार्थ्यांना घरापासून शाळा/महाविद्यालयापर्यंत प्रवासासाठी ६६.६७% सवलतीत मासिक एसटी पास मिळतो. तसेच पुण्यश्लोक अहिल्याबाई होळकर योजनेअंतर्गत इयत्ता ५ वी ते १२ वी पर्यंतच्या विद्यार्थिनींना १००% मोफत एसटी प्रवास मिळतो.',
    description_hi: 'घर से विद्यालय/कॉलेज तक यात्रा के लिए छात्रों को ६६.६७% की रियायत पर मासिक एसटी बस पास। अहिल्याबाई होल्कर योजना के तहत ५वीं से १२वीं तक की छात्राओं को १००% मुफ्त बस यात्रा।',
    benefits_summary: 'Up to 66.67% bus pass concession for all students; 100% free travel for schoolgirls (5th-12th standard)',
    max_benefit_amount: '66.67% to 100% bus travel concession',
    target_beneficiaries: 'School and college students up to post-graduation commuting up to 50 km in Maharashtra',
    application_mode: 'Through School/College Principal to nearest MSRTC Bus Depot',
    official_portal_url: 'https://msrtc.maharashtra.gov.in',
    official_guideline_url: 'https://transport.maharashtra.gov.in',
    source_name: 'Maharashtra State Road Transport Corporation (MSRTC)',
    source_verified_date: '2026-02-05',
    criteria: {
      max_age: 28,
      gender: 'All',
      caste_categories: ['All'],
      required_occupation: 'Student',
      required_education_status: 'School or College Student',
      maharashtra_domicile_required: true,
      additional_conditions_en: 'Must be a bonafide student in a recognized school, junior college, degree college, or ITI in Maharashtra. Maximum travel distance up to 50 km one way.',
      additional_conditions_mr: 'मान्यताप्राप्त शाळा, कनिष्ठ महाविद्यालय, पदवी कॉलेज किंवा आयटीआयचा नियमित विद्यार्थी असावा. एका बाजूचे अंतर ५० किलोमीटरपर्यंत ग्राह्य धरले जाते.',
      additional_conditions_hi: 'मान्यता प्राप्त विद्यालय, कॉलेज अथवा आईटीआई का नियमित छात्र होना चाहिए। अधिकतम ५० किमी तक की दूरी अनुमन्य।'
    },
    documents: [
      {
        document_name_en: 'Bonafide Student Certificate with Principal signature & seal',
        document_name_mr: 'मुख्याध्यापक / प्राचार्य यांची स्वाक्षरी असलेले बोनाफाईड प्रमाणपत्र',
        document_name_hi: 'प्राचार्य/मुख्याध्यापक के हस्ताक्षर युक्त बोनाफाइड प्रमाण पत्र',
        is_mandatory: true,
        purpose_en: 'Proof of regular enrollment in recognized educational institution.',
        purpose_mr: 'विद्यार्थी नियमित शिक्षण घेत असल्याचा अधिकृत पुरावा.',
        purpose_hi: 'नियमित विद्यार्थी होने का आधिकारिक साक्ष्य।'
      },
      {
        document_name_en: 'Current Academic Year Fee Receipt & Student ID Card',
        document_name_mr: 'चालू शैक्षणिक वर्षाची फी पावती व ओळखपत्र',
        document_name_hi: 'चालू शैक्षणिक सत्र की शुल्क रसीद व पहचान पत्र',
        is_mandatory: true,
        purpose_en: 'Proof of active student status and route of commute.',
        purpose_mr: 'सध्याच्या वर्षात प्रवेश निश्चित असल्याचा पुरावा.',
        purpose_hi: 'सक्रिय छात्र स्थिति की पुष्टि हेतु।'
      },
      {
        document_name_en: 'Passport Size Photographs (2 Copies)',
        document_name_mr: 'पासपोर्ट आकाराचे फोटो (२ प्रती)',
        document_name_hi: 'पासपोर्ट साइज फोटो (२ प्रतियां)',
        is_mandatory: true,
        purpose_en: 'For issuance of official MSRTC pass holder smart card/booklet.',
        purpose_mr: 'एसटी पास ओळखपत्रावर लावण्यासाठी.',
        purpose_hi: 'एसटी पास पहचान पत्र जारी करने हेतु।'
      }
    ],
    chunks: [
      {
        chunk_type: 'overview',
        chunk_text: 'Maharashtra MSRTC Student Bus Concession provides 66.67% discount on bus passes for school and college students, and 100% free travel for girl students from 5th to 12th standard under Ahilyabai Holkar Scheme.',
        language: 'en',
        keywords: 'msrtc student pass, bus concession maharashtra, ahilyabai holkar free bus, school college travel'
      }
    ]
  }
];

export function seedDatabase() {
  initDatabase();

  const insertScheme = db.prepare(`
    INSERT OR REPLACE INTO schemes (
      id, slug, name_en, name_mr, name_hi, department, government_level,
      category, description_en, description_mr, description_hi, benefits_summary,
      max_benefit_amount, target_beneficiaries, application_mode,
      official_portal_url, official_guideline_url, source_name,
      source_verified_date, active, updated_at
    ) VALUES (
      @id, @slug, @name_en, @name_mr, @name_hi, @department, @government_level,
      @category, @description_en, @description_mr, @description_hi, @benefits_summary,
      @max_benefit_amount, @target_beneficiaries, @application_mode,
      @official_portal_url, @official_guideline_url, @source_name,
      @source_verified_date, 1, CURRENT_TIMESTAMP
    )
  `);

  const insertCriteria = db.prepare(`
    INSERT OR REPLACE INTO eligibility_criteria (
      id, scheme_id, min_age, max_age, gender, caste_categories,
      max_income, min_income, required_occupation, required_education_status,
      maharashtra_domicile_required, additional_conditions_en,
      additional_conditions_mr, additional_conditions_hi
    ) VALUES (
      @id, @scheme_id, @min_age, @max_age, @gender, @caste_categories,
      @max_income, @min_income, @required_occupation, @required_education_status,
      @maharashtra_domicile_required, @additional_conditions_en,
      @additional_conditions_mr, @additional_conditions_hi
    )
  `);

  const insertDoc = db.prepare(`
    INSERT OR REPLACE INTO scheme_documents (
      id, scheme_id, document_name_en, document_name_mr, document_name_hi,
      is_mandatory, purpose_en, purpose_mr, purpose_hi, alternative_documents
    ) VALUES (
      @id, @scheme_id, @document_name_en, @document_name_mr, @document_name_hi,
      @is_mandatory, @purpose_en, @purpose_mr, @purpose_hi, @alternative_documents
    )
  `);

  const insertChunk = db.prepare(`
    INSERT OR REPLACE INTO scheme_chunks (
      id, scheme_id, chunk_type, chunk_text, language, keywords
    ) VALUES (
      @id, @scheme_id, @chunk_type, @chunk_text, @language, @keywords
    )
  `);

  const deleteExistingForScheme = db.transaction((schemeId: string) => {
    db.prepare('DELETE FROM eligibility_criteria WHERE scheme_id = ?').run(schemeId);
    db.prepare('DELETE FROM scheme_documents WHERE scheme_id = ?').run(schemeId);
    db.prepare('DELETE FROM scheme_chunks WHERE scheme_id = ?').run(schemeId);
  });

  const transaction = db.transaction(() => {
    for (const scheme of VERIFIED_SCHEMES) {
      deleteExistingForScheme(scheme.id);

      insertScheme.run({
        id: scheme.id,
        slug: scheme.slug,
        name_en: scheme.name_en,
        name_mr: scheme.name_mr,
        name_hi: scheme.name_hi,
        department: scheme.department,
        government_level: scheme.government_level,
        category: scheme.category,
        description_en: scheme.description_en,
        description_mr: scheme.description_mr,
        description_hi: scheme.description_hi,
        benefits_summary: scheme.benefits_summary,
        max_benefit_amount: scheme.max_benefit_amount,
        target_beneficiaries: scheme.target_beneficiaries,
        application_mode: scheme.application_mode,
        official_portal_url: scheme.official_portal_url,
        official_guideline_url: scheme.official_guideline_url,
        source_name: scheme.source_name,
        source_verified_date: scheme.source_verified_date
      });

      insertCriteria.run({
        id: `crit-${scheme.id}`,
        scheme_id: scheme.id,
        min_age: scheme.criteria.min_age || null,
        max_age: scheme.criteria.max_age || null,
        gender: scheme.criteria.gender || 'All',
        caste_categories: JSON.stringify(scheme.criteria.caste_categories),
        max_income: scheme.criteria.max_income || null,
        min_income: scheme.criteria.min_income || null,
        required_occupation: scheme.criteria.required_occupation || 'All',
        required_education_status: scheme.criteria.required_education_status || 'Any',
        maharashtra_domicile_required: scheme.criteria.maharashtra_domicile_required ? 1 : 0,
        additional_conditions_en: scheme.criteria.additional_conditions_en,
        additional_conditions_mr: scheme.criteria.additional_conditions_mr,
        additional_conditions_hi: scheme.criteria.additional_conditions_hi
      });

      for (let i = 0; i < scheme.documents.length; i++) {
        const doc = scheme.documents[i];
        insertDoc.run({
          id: `doc-${scheme.id}-${i + 1}`,
          scheme_id: scheme.id,
          document_name_en: doc.document_name_en,
          document_name_mr: doc.document_name_mr,
          document_name_hi: doc.document_name_hi,
          is_mandatory: doc.is_mandatory ? 1 : 0,
          purpose_en: doc.purpose_en,
          purpose_mr: doc.purpose_mr,
          purpose_hi: doc.purpose_hi,
          alternative_documents: doc.alternative_documents || null
        });
      }

      for (let i = 0; i < scheme.chunks.length; i++) {
        const chunk = scheme.chunks[i];
        insertChunk.run({
          id: `chunk-${scheme.id}-${i + 1}`,
          scheme_id: scheme.id,
          chunk_type: chunk.chunk_type,
          chunk_text: chunk.chunk_text,
          language: chunk.language,
          keywords: chunk.keywords
        });
      }
    }

    db.prepare(`
      INSERT INTO admin_audit_log (id, action, details)
      VALUES (?, 'SEED_DATABASE', 'Seeded 10 verified Maharashtra Government schemes with criteria, documents, and RAG chunks.')
    `).run(uuidv4());
  });

  transaction();
  console.log(`[Database Seed] Successfully seeded ${VERIFIED_SCHEMES.length} verified Maharashtra schemes.`);
}

// Direct execution
if (process.argv[1]?.includes('seed.ts') || process.argv[1]?.includes('seed.js')) {
  seedDatabase();
}

