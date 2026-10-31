import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';

const router = Router();

export interface UserEligibilityProfile {
  age?: number;
  gender?: string; // 'Male', 'Female', 'Transgender', 'Other'
  caste?: string; // 'General', 'SC', 'ST', 'OBC', 'EWS', 'SEBC', 'Neo-Buddhist'
  annualIncome?: number; // In INR
  occupation?: string; // 'Farmer', 'Student', 'Destitute', 'Employed', 'Unemployed', 'Homemaker', 'Other'
  educationStatus?: string; // 'School', 'Higher Education', 'Any'
  isMaharashtraResident?: boolean;
  hasSpecialDisability?: boolean;
  isWidowOrDeserted?: boolean;
  language?: 'en' | 'mr' | 'hi';
}

router.post('/eligibility/check', (req: Request, res: Response) => {
  try {
    const profile: UserEligibilityProfile = req.body;
    const lang = profile.language || 'en';

    const schemes = db.prepare('SELECT * FROM schemes WHERE active = 1').all() as any[];
    const evaluationResults: any[] = [];

    for (const scheme of schemes) {
      const criteria = db.prepare('SELECT * FROM eligibility_criteria WHERE scheme_id = ?').get(scheme.id) as any;
      if (!criteria) continue;

      const casteCategories: string[] = JSON.parse(criteria.caste_categories || '["All"]');
      const satisfiedConditions: string[] = [];
      const unmetConditions: string[] = [];
      const pendingVerifications: string[] = [];

      // 1. Domicile Check
      if (criteria.maharashtra_domicile_required === 1) {
        if (profile.isMaharashtraResident === true) {
          satisfiedConditions.push(lang === 'mr' ? 'महाराष्ट्र अधिवास निकष पूर्ण' : lang === 'hi' ? 'महाराष्ट्र निवास शर्त पूरी' : 'Maharashtra domicile verified');
        } else if (profile.isMaharashtraResident === false) {
          unmetConditions.push(lang === 'mr' ? 'महाराष्ट्र राज्याचे रहिवासी असणे आवश्यक' : lang === 'hi' ? 'महाराष्ट्र का मूल निवासी होना अनिवार्य' : 'Maharashtra domicile required');
        } else {
          pendingVerifications.push(lang === 'mr' ? 'अधिवास प्रमाणपत्र पडताळणी आवश्यक' : lang === 'hi' ? 'अधिवास प्रमाण पत्र सत्यापन आवश्यक' : 'Domicile verification pending');
        }
      }

      // 2. Age Check
      if (profile.age !== undefined && profile.age !== null) {
        if (criteria.min_age && profile.age < criteria.min_age) {
          unmetConditions.push(lang === 'mr' ? `किमान वय ${criteria.min_age} वर्षे असणे आवश्यक (आपले वय: ${profile.age})` : lang === 'hi' ? `न्यूनतम आयु ${criteria.min_age} वर्ष आवश्यक (आपकी आयु: ${profile.age})` : `Minimum age must be ${criteria.min_age} (Your age: ${profile.age})`);
        } else if (criteria.max_age && profile.age > criteria.max_age) {
          unmetConditions.push(lang === 'mr' ? `कमाल वय मर्यादा ${criteria.max_age} वर्षे (आपले वय: ${profile.age})` : lang === 'hi' ? `अधिकतम आयु सीमा ${criteria.max_age} वर्ष (आपकी आयु: ${profile.age})` : `Maximum age limit is ${criteria.max_age} (Your age: ${profile.age})`);
        } else if (criteria.min_age || criteria.max_age) {
          satisfiedConditions.push(lang === 'mr' ? `वय निकष पूर्ण (${profile.age} वर्षे)` : lang === 'hi' ? `आयु शर्त पूरी (${profile.age} वर्ष)` : `Age criteria satisfied (${profile.age} yrs)`);
        }
      }

      // 3. Gender Check
      if (criteria.gender && criteria.gender !== 'All' && profile.gender) {
        if (criteria.gender.toLowerCase() === profile.gender.toLowerCase()) {
          satisfiedConditions.push(lang === 'mr' ? `लिंग निकष पात्र (${profile.gender})` : lang === 'hi' ? `लिंग शर्त पात्र (${profile.gender})` : `Gender criteria matched (${profile.gender})`);
        } else {
          unmetConditions.push(lang === 'mr' ? `ही योजना केवळ ${criteria.gender === 'Female' ? 'महिलांसाठी' : criteria.gender} आहे` : lang === 'hi' ? `यह योजना केवल ${criteria.gender === 'Female' ? 'महिलाओं' : criteria.gender} के लिए है` : `Scheme is exclusively for ${criteria.gender}`);
        }
      }

      // 4. Caste Check
      if (!casteCategories.includes('All') && profile.caste) {
        const matchesCaste = casteCategories.some(c => c.toLowerCase() === profile.caste?.toLowerCase());
        if (matchesCaste) {
          satisfiedConditions.push(lang === 'mr' ? `आरक्षित प्रवर्ग पात्र (${profile.caste})` : lang === 'hi' ? `आरक्षित श्रेणी पात्र (${profile.caste})` : `Category requirement satisfied (${profile.caste})`);
        } else {
          unmetConditions.push(lang === 'mr' ? `ही योजना केवळ ${casteCategories.join(', ')} प्रवर्गासाठी आहे` : lang === 'hi' ? `यह योजना केवल ${casteCategories.join(', ')} वर्ग हेतु है` : `Eligible categories: ${casteCategories.join(', ')}`);
        }
      }

      // 5. Income Check
      if (profile.annualIncome !== undefined && profile.annualIncome !== null) {
        if (criteria.max_income && profile.annualIncome > criteria.max_income) {
          unmetConditions.push(lang === 'mr' ? `वार्षिक उत्पन्न मर्यादा ₹${criteria.max_income.toLocaleString('en-IN')} पेक्षा जास्त आहे` : lang === 'hi' ? `वार्षिक आय सीमा ₹${criteria.max_income.toLocaleString('en-IN')} से अधिक है` : `Annual income exceeds limit of ₹${criteria.max_income.toLocaleString('en-IN')}`);
        } else if (criteria.max_income) {
          satisfiedConditions.push(lang === 'mr' ? `उत्पन्न मर्यादा पात्र (₹${profile.annualIncome.toLocaleString('en-IN')} <= ₹${criteria.max_income.toLocaleString('en-IN')})` : lang === 'hi' ? `आय सीमा पात्र (₹${profile.annualIncome.toLocaleString('en-IN')} <= ₹${criteria.max_income.toLocaleString('en-IN')})` : `Income within limit of ₹${criteria.max_income.toLocaleString('en-IN')}`);
        }
      }

      // 6. Occupation Check
      if (criteria.required_occupation && criteria.required_occupation !== 'All' && profile.occupation) {
        if (criteria.required_occupation.toLowerCase() === profile.occupation.toLowerCase()) {
          satisfiedConditions.push(lang === 'mr' ? `व्यवसाय निकष पूर्ण (${profile.occupation})` : lang === 'hi' ? `व्यवसाय शर्त पूरी (${profile.occupation})` : `Occupation matches (${profile.occupation})`);
        } else {
          unmetConditions.push(lang === 'mr' ? `आवश्यक व्यवसाय: ${criteria.required_occupation}` : lang === 'hi' ? `आवश्यक व्यवसाय: ${criteria.required_occupation}` : `Requires occupation: ${criteria.required_occupation}`);
        }
      }

      // Special conditional additions
      if (scheme.id === 'sanjay-gandhi-niradhar') {
        if (profile.hasSpecialDisability || profile.isWidowOrDeserted || profile.occupation === 'Destitute') {
          satisfiedConditions.push(lang === 'mr' ? 'विशेष सहाय्य घटक (दिव्यांग / विधवा / निराधार) जुळतो' : lang === 'hi' ? 'विशेष सहायता घटक (दिव्यांग / विधवा / निराधार) सुसंगत' : 'Special category matched (Disabled/Widow/Destitute)');
        }
      }

      // Evaluate Overall Status
      let status: 'Eligible' | 'Conditionally Eligible' | 'Ineligible' = 'Conditionally Eligible';
      if (unmetConditions.length > 0) {
        status = 'Ineligible';
      } else if (satisfiedConditions.length >= 2 && unmetConditions.length === 0) {
        status = 'Eligible';
      }

      const docs = db.prepare('SELECT * FROM scheme_documents WHERE scheme_id = ?').all(scheme.id) as any[];

      evaluationResults.push({
        scheme_id: scheme.id,
        scheme_slug: scheme.slug,
        scheme_name: lang === 'mr' ? scheme.name_mr : lang === 'hi' ? scheme.name_hi : scheme.name_en,
        category: scheme.category,
        department: scheme.department,
        status,
        benefits_summary: scheme.benefits_summary,
        official_portal_url: scheme.official_portal_url,
        satisfied_conditions: satisfiedConditions,
        unmet_conditions: unmetConditions,
        pending_verifications: pendingVerifications,
        required_documents: docs.map(d => ({
          name: lang === 'mr' ? d.document_name_mr : lang === 'hi' ? d.document_name_hi : d.document_name_en,
          is_mandatory: d.is_mandatory === 1,
          purpose: lang === 'mr' ? d.purpose_mr : lang === 'hi' ? d.purpose_hi : d.purpose_en
        }))
      });
    }

    // Sort: Eligible first, then Conditionally Eligible, then Ineligible
    evaluationResults.sort((a, b) => {
      const order = { 'Eligible': 0, 'Conditionally Eligible': 1, 'Ineligible': 2 };
      return order[a.status as keyof typeof order] - order[b.status as keyof typeof order];
    });

    res.json({
      timestamp: new Date().toISOString(),
      profile_summary: {
        age: profile.age,
        gender: profile.gender,
        caste: profile.caste,
        annualIncome: profile.annualIncome,
        occupation: profile.occupation,
        isMaharashtraResident: profile.isMaharashtraResident
      },
      results: evaluationResults,
      disclaimer: lang === 'mr'
        ? 'टीप: ही पडताळणी केवळ प्राथमिक मार्गदर्शक आहे. प्रत्यक्ष मंजुरी शासकीय कागदपत्रे व सक्षम अधिकाऱ्यांच्या छाननीनंतरच निश्चित होते.'
        : lang === 'hi'
        ? 'नोट: यह परिणाम केवल सांकेतिक मार्गदर्शन है। वास्तविक स्वीकृति सरकारी दस्तावेजों और सक्षम प्राधिकारी की जांच के उपरांत ही होगी।'
        : 'Note: This evaluation is indicative and non-binding. Official eligibility is confirmed solely by the designated government authority upon document verification.'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

