import { ENV } from '../config/env.js';
import { RAGContext, RetrievedScheme } from './ragEngine.js';
import { LanguageCode } from './intentParser.js';

export interface AIResponsePayload {
  answer: string;
  language: LanguageCode;
  related_schemes: Array<{
    id: string;
    slug: string;
    name: string;
    category: string;
    benefits: string;
    official_portal_url: string;
  }>;
  eligibility_guidance: string[];
  document_checklist: Array<{
    name: string;
    is_mandatory: boolean;
    purpose: string;
  }>;
  sources: Array<{
    scheme_name: string;
    source_name: string;
    official_portal_url: string;
    source_verified_date: string;
  }>;
  disclaimer: string;
  provider: 'gemini' | 'openai' | 'local-grounded';
}

export class LLMAdapter {
  public static async generateResponse(ragContext: RAGContext, preferredLang?: LanguageCode): Promise<AIResponsePayload> {
    const lang = preferredLang || ragContext.parsedIntent.language || 'en';

    // 1. Try Gemini if API key is provided
    if (ENV.GEMINI_API_KEY) {
      try {
        const geminiRes = await this.callGemini(ragContext, lang);
        if (geminiRes) return geminiRes;
      } catch (err) {
        console.warn('[LLMAdapter] Gemini call failed, falling back to local grounded engine:', err);
      }
    }

    // 2. Try OpenAI if API key is provided
    if (ENV.OPENAI_API_KEY) {
      try {
        const openaiRes = await this.callOpenAI(ragContext, lang);
        if (openaiRes) return openaiRes;
      } catch (err) {
        console.warn('[LLMAdapter] OpenAI call failed, falling back to local grounded engine:', err);
      }
    }

    // 3. Built-in Grounded Local Engine (always deterministic, safe, zero-hallucination)
    return this.generateLocalGroundedResponse(ragContext, lang);
  }

  /**
   * Deterministic Grounded Reasoning Engine
   * Formulates human-grade conversational responses directly from verified scheme facts.
   */
  private static generateLocalGroundedResponse(ragContext: RAGContext, lang: LanguageCode): AIResponsePayload {
    const { topScheme, schemes, parsedIntent, sources } = ragContext;

    // Disclaimer in three languages
    const disclaimers: Record<LanguageCode, string> = {
      en: 'Disclaimer: SAHAY AI provides informational guidance based on verified Government of Maharashtra notifications. Final eligibility and approvals rest solely with the competent government authority.',
      mr: 'सूचना: सहाय्य AI केवळ अधिकृत शासन निर्णयांवर आधारित मार्गदर्शक माहिती पुरवते. अंतिम पात्रता व लाभाचे वितरण संबंधित शासकीय विभागाच्या अधिकाराखाली आहे.',
      hi: 'अस्वीकरण: सहाय्य AI केवल सत्यापित सरकारी अधिसूचनाओं के आधार पर मार्गदर्शन प्रदान करता है। अंतिम पात्रता और स्वीकृति संबंधित सरकारी प्राधिकारी के अधीन है।'
    };

    // If greeting intent
    if (parsedIntent.intent === 'greeting') {
      const greetings: Record<LanguageCode, string> = {
        en: 'Hello! I am SAHAY AI, your citizen services assistant for Maharashtra government welfare schemes. How may I help you today? You can ask about schemes for farmers, students, women, health coverage, pensions, or check eligibility and required documents.',
        mr: 'नमस्कार! मी सहाय्य AI, महाराष्ट्र शासनाच्या विविध जनकल्याणकारी योजनांची माहिती देणारा आपला डिजिटल साहाय्यक आहे. मी आपल्याला कशी मदत करू शकतो? आपण शेतकरी, विद्यार्थी, महिला, आरोग्य, घरकुल किंवा निवृत्तिवेतन योजनांबद्दल विचारू शकता.',
        hi: 'नमस्ते! मैं सहाय्य AI हूँ, महाराष्ट्र सरकार की जनकल्याणकारी योजनाओं के लिए आपका डिजिटल सहायक। मैं आपकी क्या सहायता कर सकता हूँ? आप किसानों, विद्यार्थियों, महिलाओं, स्वास्थ्य, आवास अथवा पेंशन योजनाओं के बारे में पूछ सकते हैं।'
      };

      return {
        answer: greetings[lang],
        language: lang,
        related_schemes: schemes.map(s => this.mapSchemeSummary(s, lang)),
        eligibility_guidance: [],
        document_checklist: [],
        sources: [],
        disclaimer: disclaimers[lang],
        provider: 'local-grounded'
      };
    }

    // If no verified scheme matched (Strict Anti-Hallucination)
    if (!topScheme || ragContext.confidence === 'none') {
      const notFoundAnswers: Record<LanguageCode, string> = {
        en: "I couldn't verify this information from the available official Maharashtra government sources. To protect against misinformation, SAHAY AI only provides facts grounded in verified Government Resolutions (GR) and official portals. Please check the Scheme Explorer or try searching for schemes related to agriculture, higher education, women empowerment, health (MJPJAY), or social welfare.",
        mr: 'माफ करा, उपलब्ध अधिकृत शासकीय नोंदींमध्ये मला याबद्दल खात्रीशीर माहिती सापडली नाही. चुकीची माहिती टाळण्यासाठी, सहाय्य AI केवळ पडताळणी केलेल्या शासन निर्णयांवर (GR) आधारित माहिती देते. आपण कृपया शेती, उच्च शिक्षण, लाडकी बहीण, महात्मा फुले जन आरोग्य (MJPJAY), किंवा निवृत्तिवेतन योजनांबद्दल विचारू शकता.',
        hi: 'क्षमा करें, उपलब्ध आधिकारिक सरकारी स्रोतों में मुझे इस संबंध में सत्यापित जानकारी नहीं मिली। गलत जानकारी से बचाव हेतु, सहाय्य AI केवल आधिकारिक सरकारी संकल्पों (GR) पर आधारित तथ्य ही प्रदान करता है। कृपया योजना एक्सप्लोरर में देखें या कृषि, शिक्षा, लाड़की बहिन, स्वास्थ्य (MJPJAY) अथवा सामाजिक सहायता से जुड़े प्रश्न पूछें।'
      };

      return {
        answer: notFoundAnswers[lang],
        language: lang,
        related_schemes: [],
        eligibility_guidance: [],
        document_checklist: [],
        sources: [],
        disclaimer: disclaimers[lang],
        provider: 'local-grounded'
      };
    }

    // Build focused answer based on intent and topScheme
    const schemeName = lang === 'mr' ? topScheme.name_mr : lang === 'hi' ? topScheme.name_hi : topScheme.name_en;
    const schemeDesc = lang === 'mr' ? topScheme.description_mr : lang === 'hi' ? topScheme.description_hi : topScheme.description_en;
    const additionalCond = lang === 'mr' ? topScheme.criteria?.additional_conditions_mr : lang === 'hi' ? topScheme.criteria?.additional_conditions_hi : topScheme.criteria?.additional_conditions_en;

    let answer = '';
    const eligibilityGuidance: string[] = [];
    const documentChecklist = (topScheme.documents || []).map(d => ({
      name: lang === 'mr' ? d.document_name_mr : lang === 'hi' ? d.document_name_hi : d.document_name_en,
      is_mandatory: d.is_mandatory,
      purpose: lang === 'mr' ? d.purpose_mr : lang === 'hi' ? d.purpose_hi : d.purpose_en
    }));

    if (topScheme.criteria) {
      const c = topScheme.criteria;
      if (lang === 'mr') {
        if (c.min_age || c.max_age) eligibilityGuidance.push(`वय मर्यादा: ${c.min_age ? c.min_age + ' वर्षे' : ''} ते ${c.max_age ? c.max_age + ' वर्षे' : ''}`);
        if (c.gender && c.gender !== 'All') eligibilityGuidance.push(`लिंग: ${c.gender === 'Female' ? 'फक्त महिला' : c.gender}`);
        if (c.max_income) eligibilityGuidance.push(`कौटुंबिक उत्पन्न मर्यादा: कमाल ₹${c.max_income.toLocaleString('en-IN')} वार्षिक`);
        if (c.required_occupation && c.required_occupation !== 'All') eligibilityGuidance.push(`व्यवसाय: ${c.required_occupation}`);
        if (c.maharashtra_domicile_required) eligibilityGuidance.push('महाराष्ट्र राज्याचे अधिवास (Domicile) अनिवार्य');
        if (additionalCond) eligibilityGuidance.push(additionalCond);
      } else if (lang === 'hi') {
        if (c.min_age || c.max_age) eligibilityGuidance.push(`आयु सीमा: ${c.min_age ? c.min_age + ' वर्ष' : ''} से ${c.max_age ? c.max_age + ' वर्ष' : ''}`);
        if (c.gender && c.gender !== 'All') eligibilityGuidance.push(`लिंग: ${c.gender === 'Female' ? 'केवल महिला' : c.gender}`);
        if (c.max_income) eligibilityGuidance.push(`पारिवारिक आय सीमा: अधिकतम ₹${c.max_income.toLocaleString('en-IN')} प्रति वर्ष`);
        if (c.required_occupation && c.required_occupation !== 'All') eligibilityGuidance.push(`व्यवसाय: ${c.required_occupation}`);
        if (c.maharashtra_domicile_required) eligibilityGuidance.push('महाराष्ट्र का मूल निवासी (Domicile) होना आवश्यक');
        if (additionalCond) eligibilityGuidance.push(additionalCond);
      } else {
        if (c.min_age || c.max_age) eligibilityGuidance.push(`Age: ${c.min_age ? 'from ' + c.min_age : ''} ${c.max_age ? 'up to ' + c.max_age + ' years' : ''}`);
        if (c.gender && c.gender !== 'All') eligibilityGuidance.push(`Gender requirement: ${c.gender}`);
        if (c.max_income) eligibilityGuidance.push(`Max annual family income: ₹${c.max_income.toLocaleString('en-IN')}`);
        if (c.required_occupation && c.required_occupation !== 'All') eligibilityGuidance.push(`Occupation requirement: ${c.required_occupation}`);
        if (c.maharashtra_domicile_required) eligibilityGuidance.push('Maharashtra domicile / residence is required');
        if (additionalCond) eligibilityGuidance.push(additionalCond);
      }
    }

    if (parsedIntent.intent === 'document_checklist') {
      if (lang === 'mr') {
        answer = `**${schemeName}** साठी आवश्यक असलेली अधिकृत कागदपत्रे खालीलप्रमाणे आहेत:\n\n` +
          documentChecklist.map((d, i) => `${i + 1}. **${d.name}** (${d.is_mandatory ? 'अनिवार्य' : 'ऐच्छिक'})\n   उद्देश: ${d.purpose}`).join('\n\n') +
          `\n\nअर्ज करण्यासाठी अधिकृत संकेतस्थळ: ${topScheme.official_portal_url}`;
      } else if (lang === 'hi') {
        answer = `**${schemeName}** के लिए आवश्यक आधिकारिक दस्तावेजों की सूची निम्नलिखित है:\n\n` +
          documentChecklist.map((d, i) => `${i + 1}. **${d.name}** (${d.is_mandatory ? 'अनिवार्य' : 'वैकल्पिक'})\n   उद्देश्य: ${d.purpose}`).join('\n\n') +
          `\n\nआवेदन के लिए आधिकारिक पोर्टल: ${topScheme.official_portal_url}`;
      } else {
        answer = `Here is the official document checklist required for **${schemeName}**:\n\n` +
          documentChecklist.map((d, i) => `${i + 1}. **${d.name}** (${d.is_mandatory ? 'Mandatory' : 'Optional'})\n   Purpose: ${d.purpose}`).join('\n\n') +
          `\n\nYou can submit your application at the official portal: ${topScheme.official_portal_url}`;
      }
    } else if (parsedIntent.intent === 'eligibility_check') {
      if (lang === 'mr') {
        answer = `**${schemeName}** साठी पात्रता निकष खालीलप्रमाणे आहेत:\n\n` +
          eligibilityGuidance.map(c => `• ${c}`).join('\n') +
          `\n\n**प्रमुख लाभ:** ${topScheme.benefits_summary}\n\nअधिकृत पोर्टल: ${topScheme.official_portal_url}`;
      } else if (lang === 'hi') {
        answer = `**${schemeName}** के लिए पात्रता शर्तें निम्नलिखित हैं:\n\n` +
          eligibilityGuidance.map(c => `• ${c}`).join('\n') +
          `\n\n**मुख्य लाभ:** ${topScheme.benefits_summary}\n\nआधिकारिक पोर्टल: ${topScheme.official_portal_url}`;
      } else {
        answer = `Eligibility criteria for **${schemeName}**:\n\n` +
          eligibilityGuidance.map(c => `• ${c}`).join('\n') +
          `\n\n**Key Benefits:** ${topScheme.benefits_summary}\n\nOfficial Portal: ${topScheme.official_portal_url}`;
      }
    } else if (parsedIntent.intent === 'application_portal') {
      if (lang === 'mr') {
        answer = `**${schemeName}** साठी अर्ज प्रक्रिया:\n\n` +
          `• **अर्ज करण्याची पद्धत:** ${topScheme.application_mode}\n` +
          `• **अधिकृत पोर्टल लिंक:** [${topScheme.official_portal_url}](${topScheme.official_portal_url})\n` +
          `• **विभाग:** ${topScheme.department}\n` +
          `• **लाभ:** ${topScheme.benefits_summary}\n\nअर्ज करण्यापूर्वी आवश्यक कागदपत्रांची पूर्तता करून ठेवा.`;
      } else if (lang === 'hi') {
        answer = `**${schemeName}** के लिए आवेदन प्रक्रिया:\n\n` +
          `• **आवेदन का माध्यम:** ${topScheme.application_mode}\n` +
          `• **आधिकारिक पोर्टल लिंक:** [${topScheme.official_portal_url}](${topScheme.official_portal_url})\n` +
          `• **विभाग:** ${topScheme.department}\n` +
          `• **लाभ:** ${topScheme.benefits_summary}`;
      } else {
        answer = `Application guidelines for **${schemeName}**:\n\n` +
          `• **Application Mode:** ${topScheme.application_mode}\n` +
          `• **Official Portal Link:** [${topScheme.official_portal_url}](${topScheme.official_portal_url})\n` +
          `• **Department:** ${topScheme.department}\n` +
          `• **Benefit Summary:** ${topScheme.benefits_summary}`;
      }
    } else {
      // General scheme inquiry or multi-scheme answer
      if (lang === 'mr') {
        answer = `**${schemeName}** (${topScheme.department})\n\n` +
          `${schemeDesc}\n\n` +
          `**मुख्य लाभ:** ${topScheme.benefits_summary}\n\n` +
          `**पात्र लाभार्थी:** ${topScheme.target_beneficiaries}\n\n` +
          `**अधिकृत पोर्टल:** [${topScheme.official_portal_url}](${topScheme.official_portal_url})`;
      } else if (lang === 'hi') {
        answer = `**${schemeName}** (${topScheme.department})\n\n` +
          `${schemeDesc}\n\n` +
          `**मुख्य लाभ:** ${topScheme.benefits_summary}\n\n` +
          `**लक्षित लाभार्थी:** ${topScheme.target_beneficiaries}\n\n` +
          `**आधिकारिक पोर्टल:** [${topScheme.official_portal_url}](${topScheme.official_portal_url})`;
      } else {
        answer = `**${schemeName}** (${topScheme.department})\n\n` +
          `${schemeDesc}\n\n` +
          `**Key Benefits:** ${topScheme.benefits_summary}\n\n` +
          `**Target Beneficiaries:** ${topScheme.target_beneficiaries}\n\n` +
          `**Official Portal:** [${topScheme.official_portal_url}](${topScheme.official_portal_url})`;
      }
    }

    return {
      answer,
      language: lang,
      related_schemes: schemes.map(s => this.mapSchemeSummary(s, lang)),
      eligibility_guidance: eligibilityGuidance,
      document_checklist: documentChecklist,
      sources,
      disclaimer: disclaimers[lang],
      provider: 'local-grounded'
    };
  }

  private static mapSchemeSummary(s: RetrievedScheme, lang: LanguageCode) {
    return {
      id: s.id,
      slug: s.slug,
      name: lang === 'mr' ? s.name_mr : lang === 'hi' ? s.name_hi : s.name_en,
      category: s.category,
      benefits: s.benefits_summary,
      official_portal_url: s.official_portal_url
    };
  }

  /**
   * Gemini API call with grounded context
   */
  private static async callGemini(ragContext: RAGContext, lang: LanguageCode): Promise<AIResponsePayload | null> {
    const prompt = this.buildPrompt(ragContext, lang);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${ENV.GEMINI_API_KEY}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.statusText}`);
    }

    const data: any = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return null;

    const basePayload = this.generateLocalGroundedResponse(ragContext, lang);
    return {
      ...basePayload,
      answer: candidateText.trim(),
      provider: 'gemini'
    };
  }

  /**
   * OpenAI API call with grounded context
   */
  private static async callOpenAI(ragContext: RAGContext, lang: LanguageCode): Promise<AIResponsePayload | null> {
    const prompt = this.buildPrompt(ragContext, lang);
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ENV.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are SAHAY AI, a helpful citizen services assistant for Maharashtra government welfare schemes. Answer strictly using the verified information provided. Do not hallucinate or promise official approvals.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      })
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.statusText}`);
    }

    const data: any = await res.json();
    const candidateText = data?.choices?.[0]?.message?.content;
    if (!candidateText) return null;

    const basePayload = this.generateLocalGroundedResponse(ragContext, lang);
    return {
      ...basePayload,
      answer: candidateText.trim(),
      provider: 'openai'
    };
  }

  private static buildPrompt(ragContext: RAGContext, lang: LanguageCode): string {
    const langName = lang === 'mr' ? 'Marathi' : lang === 'hi' ? 'Hindi' : 'English';
    const verifiedKnowledge = ragContext.schemes.map(s => `
Scheme Name: ${s.name_en} (${s.name_mr} / ${s.name_hi})
Department: ${s.department}
Category: ${s.category}
Benefits: ${s.benefits_summary} (Max: ${s.max_benefit_amount})
Target Beneficiaries: ${s.target_beneficiaries}
Application Mode: ${s.application_mode}
Official Portal: ${s.official_portal_url}
Source: ${s.source_name} (Verified: ${s.source_verified_date})
Eligibility: ${JSON.stringify(s.criteria || {})}
Documents: ${JSON.stringify(s.documents || [])}
`).join('\n---\n');

    return `You are SAHAY AI (सहाय्य AI), the official citizen services assistant for Maharashtra government welfare schemes.
Respond in ${langName}.
Be polite, simple, and empathetic to ordinary citizens.
Never invent benefits, income criteria, or documents not listed in the verified knowledge base below.
If the information cannot be found, state clearly: "I couldn't verify this information from the available official sources."

VERIFIED KNOWLEDGE BASE:
${verifiedKnowledge}

CITIZEN QUESTION:
"${ragContext.query}"

Provide your grounded answer:`;
  }
}

