export type LanguageCode = 'en' | 'mr' | 'hi';

export type UserIntent = 
  | 'greeting'
  | 'scheme_search'
  | 'scheme_detail'
  | 'eligibility_check'
  | 'document_checklist'
  | 'application_portal'
  | 'benefits_inquiry'
  | 'general_help';

export interface ParsedIntent {
  language: LanguageCode;
  intent: UserIntent;
  targetSchemeId?: string;
  categoryFilter?: string;
  targetBeneficiary?: string;
  keywords: string[];
}

export function detectLanguage(text: string): LanguageCode {
  if (!text) return 'en';
  
  const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;
  const totalLetters = (text.match(/[\p{L}]/gu) || []).length;

  if (totalLetters > 0 && devanagariCount / totalLetters > 0.3) {
    const marathiWords = ['आहे', 'आहेत', 'योजना', 'काय', 'कशी', 'मिळेल', 'कागदपत्रे', 'पात्रता', 'अर्ज', 'करावा', 'सांगा', 'माझी', 'शेतकरी', 'लाडकी', 'बहीण', 'शासकीय', 'हवी'];
    const hindiWords = ['है', 'हैं', 'योजना', 'क्या', 'कैसे', 'मिलेगा', 'दस्तावेज', 'पात्रता', 'आवेदन', 'करें', 'बताएं', 'मेरी', 'किसान', 'बहिन', 'सरकारी', 'चाहिए'];
    
    let marathiMatches = 0;
    let hindiMatches = 0;
    
    const lower = text.toLowerCase();
    for (const w of marathiWords) {
      if (lower.includes(w)) marathiMatches++;
    }
    for (const w of hindiWords) {
      if (lower.includes(w)) hindiMatches++;
    }

    if (marathiMatches >= hindiMatches) {
      return 'mr';
    } else {
      return 'hi';
    }
  }

  return 'en';
}

const SCHEME_KEYWORD_MAP: Record<string, string[]> = {
  'ladki-bahin-yojana': ['ladki bahin', 'ladki bahin yojana', 'लाडकी बहीण', 'लाड़की बहिन', 'ladki bahin yojana 1500', 'majhi ladki bahin'],
  'namo-shetkari-yojana': ['namo shetkari', 'नमो शेतकरी', 'shetkari sanman', 'farmer 6000', 'shetkari yojana', 'pm kisan maharashtra', 'किसान सम्मान'],
  'mjpjay-health': ['mjpjay', 'jyotirao phule', 'jan arogya', 'महात्मा फुले जन आरोग्य', 'आरोग्य योजना', '5 lakh cashless', 'health card', 'hospital scheme'],
  'shahu-maharaj-scholarship': ['shahu maharaj', 'शाहू महाराज', 'shikshan shulkh', '50% fee', 'scholarship', 'शिष्यवृत्ती', 'cap fee', 'mahadbt scholarship', 'engineering fee'],
  'swadhar-yojana': ['swadhar', 'स्वाधार', 'babasaheb ambedkar swadhar', 'hostel allowance', 'sc hostel', 'वसतिगृह'],
  'sanjay-gandhi-niradhar': ['sanjay gandhi niradhar', 'संजय गांधी निराधार', 'niradhar yojana', 'widow pension', 'disability pension', 'अपंग पेन्शन', 'विधवा पेन्शन'],
  'baliraja-vij-yojana': ['baliraja', 'बळीराजा', 'vij savalat', 'free electricity', 'मोफत वीज', 'शेतीपंप वीज'],
  'shabari-gharkul-yojana': ['shabari', 'शबरी', 'shabari gharkul', 'st housing', 'आदिवासी घरकुल'],
  'ramai-awas-yojana': ['ramai awas', 'रमाई आवास', 'sc housing', 'ramai gharkul'],
  'msrtc-student-concession': ['msrtc', 'student pass', 'bus concession', 'एसटी पास', 'विद्यार्थी पास', 'ahilyabai holkar bus', 'मोफत बस']
};

const STOP_WORDS = new Set([
  'scheme', 'schemes', 'yojana', 'yojna', 'योजना', 'government', 'maharashtra', 'शासन', 'महाराष्ट्र', 'सरकार',
  'sarkar', 'state', 'info', 'information', 'details', 'detail', 'about', 'what', 'which', 'tell', 'please',
  'सांगा', 'माहिती', 'बद्दल', 'बारे', 'में', 'क्या', 'the', 'and', 'for', 'with', 'from', 'this', 'that'
]);

export function parseIntent(query: string, preferredLang?: LanguageCode): ParsedIntent {
  const language = preferredLang || detectLanguage(query);
  const lower = query.toLowerCase();

  // Find targeted scheme
  let targetSchemeId: string | undefined;
  for (const [schemeId, keywords] of Object.entries(SCHEME_KEYWORD_MAP)) {
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        targetSchemeId = schemeId;
        break;
      }
    }
    if (targetSchemeId) break;
  }

  // Determine intent
  let intent: UserIntent = 'scheme_search';

  const greetingWords = ['hello', 'hi', 'namaste', 'namaskar', 'नमस्कार', 'नमस्ते', 'हेल्प', 'help', 'good morning'];
  const eligibilityWords = ['eligible', 'eligibility', 'पात्रता', 'पात्र', 'शर्त', 'नियम', 'age', 'वय', 'income', 'उत्पन्न', 'qualify', 'who can'];
  const documentWords = ['document', 'documents', 'paper', 'papers', 'कागदपत्रे', 'दस्तावेज', 'कागदपत्र', 'checklist', 'प्रमाणपत्र', 'certificate', 'proof'];
  const applicationWords = ['apply', 'portal', 'website', 'link', 'अर्ज', 'कसा करावा', 'कुठे करावा', 'आवेदन', 'लिंक', 'साइट', 'पोर्टल', 'process'];
  const benefitsWords = ['benefit', 'benefits', 'amount', 'money', 'रुपये', 'मिळतात', 'मिळेल', 'मिलेगा', 'लाभ', 'पैसा', 'किस्त'];

  if (greetingWords.some(w => lower.trim() === w || lower.startsWith(w + ' '))) {
    intent = 'greeting';
  } else if (documentWords.some(w => lower.includes(w))) {
    intent = 'document_checklist';
  } else if (eligibilityWords.some(w => lower.includes(w))) {
    intent = 'eligibility_check';
  } else if (applicationWords.some(w => lower.includes(w))) {
    intent = 'application_portal';
  } else if (benefitsWords.some(w => lower.includes(w))) {
    intent = 'benefits_inquiry';
  } else if (targetSchemeId) {
    intent = 'scheme_detail';
  }

  // Category & Beneficiary Detection
  let categoryFilter: string | undefined;
  let targetBeneficiary: string | undefined;

  if (lower.includes('farmer') || lower.includes('कृषी') || lower.includes('शेतकरी') || lower.includes('किसान') || lower.includes('agriculture')) {
    categoryFilter = 'Agriculture';
    targetBeneficiary = 'Farmer';
  } else if (lower.includes('student') || lower.includes('विद्यार्थी') || lower.includes('छात्र') || lower.includes('education') || lower.includes('शिक्षण') || lower.includes('scholarship') || lower.includes('शिष्यवृत्ती')) {
    categoryFilter = 'Education';
    targetBeneficiary = 'Student';
  } else if (lower.includes('women') || lower.includes('woman') || lower.includes('महिला') || lower.includes('स्त्री') || lower.includes('बहीण') || lower.includes('बहिन')) {
    categoryFilter = 'Women & Child Development';
    targetBeneficiary = 'Female';
  } else if (lower.includes('health') || lower.includes('hospital') || lower.includes('आरोग्य') || lower.includes('रुग्णालय') || lower.includes('स्वास्थ') || lower.includes('दवाखाना')) {
    categoryFilter = 'Healthcare';
  } else if (lower.includes('house') || lower.includes('housing') || lower.includes('घर') || lower.includes('घरकुल') || lower.includes('आवास') || lower.includes('makan')) {
    categoryFilter = 'Housing';
  } else if (lower.includes('disabled') || lower.includes('handicapped') || lower.includes('दिव्यांग') || lower.includes('अपंग') || lower.includes('widow') || lower.includes('विधवा') || lower.includes('pension') || lower.includes('पेन्शन')) {
    categoryFilter = 'Social Welfare';
  }

  // Keywords extraction with stop word removal
  const keywords = lower
    .replace(/[^\w\s\u0900-\u097F]/gi, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  return {
    language,
    intent,
    targetSchemeId,
    categoryFilter,
    targetBeneficiary,
    keywords
  };
}
