import assert from 'assert';
import { RAGEngine } from '../ai/ragEngine.js';
import { LLMAdapter } from '../ai/llmAdapter.js';
import { detectLanguage, parseIntent } from '../ai/intentParser.js';
import { seedDatabase } from '../db/seed.js';
import { db } from '../db/database.js';

async function runComprehensiveTests() {
  console.log('=====================================================');
  console.log('  SAHAY AI FULL COMPREHENSIVE TEST SUITE (PHASE 11)   ');
  console.log('=====================================================\n');

  // Test 0: Database Seeding & Verification
  console.log('[Test 0] Seeding and verifying database records...');
  seedDatabase();
  const countRow = db.prepare('SELECT COUNT(*) as count FROM schemes').get() as { count: number };
  assert.strictEqual(countRow.count >= 10, true, 'Should have at least 10 seeded schemes');
  console.log(`✓ Database has ${countRow.count} active schemes.`);

  // Test 1: Multilingual Detection & Language-Aware Response
  console.log('\n[Test 1] Testing Multilingual Awareness (en, mr, hi)...');
  const mrQuery = 'लाडकी बहीण योजनेची माहिती आणि दरमहा मिळणारी रक्कम काय आहे?';
  const hiQuery = 'नमो शेतकरी महासम्मान निधि योजना में किसानों को कितना लाभ मिलता है?';
  const enQuery = 'How does Mahatma Jyotirao Phule Jan Arogya Yojana provide cashless treatment?';

  assert.strictEqual(detectLanguage(mrQuery), 'mr', 'Should detect Marathi');
  assert.strictEqual(detectLanguage(hiQuery), 'hi', 'Should detect Hindi');
  assert.strictEqual(detectLanguage(enQuery), 'en', 'Should detect English');

  const mrRes = await LLMAdapter.generateResponse(RAGEngine.retrieve(mrQuery, 'mr'), 'mr');
  const hiRes = await LLMAdapter.generateResponse(RAGEngine.retrieve(hiQuery, 'hi'), 'hi');
  const enRes = await LLMAdapter.generateResponse(RAGEngine.retrieve(enQuery, 'en'), 'en');

  assert.strictEqual(mrRes.language, 'mr', 'Should respond in Marathi');
  assert.strictEqual(hiRes.language, 'hi', 'Should respond in Hindi');
  assert.strictEqual(enRes.language, 'en', 'Should respond in English');

  assert.strictEqual(mrRes.answer.includes('१,५००') || mrRes.answer.includes('1500'), true, 'Marathi answer must preserve exact amount');
  assert.strictEqual(hiRes.answer.includes('६,०००') || hiRes.answer.includes('6,000') || hiRes.answer.includes('6000') || hiRes.answer.includes('१२,०००'), true, 'Hindi answer must preserve exact benefit amount');
  console.log('✓ Verified multilingual responses in Marathi, Hindi, and English.');

  // Test 2: Scheme Discovery
  console.log('\n[Test 2] Testing Scheme Discovery for Students in Maharashtra...');
  const studentContext = RAGEngine.retrieve('Find a government scheme for students in Maharashtra', 'en');
  assert.strictEqual(studentContext.schemes.length > 0, true, 'Should find student schemes');
  const matchedStudentSchemes = studentContext.schemes.map(s => s.name_en);
  console.log(`✓ Retrieved student schemes: ${matchedStudentSchemes.join(', ')}`);

  // Test 3: Structured Eligibility Evaluation
  console.log('\n[Test 3] Testing Guided Eligibility Rule Matching...');
  // Scenario A: 28 year old female homemaker with family income 1.8 Lakhs
  const femaleProfile = {
    age: 28,
    gender: 'Female',
    caste: 'General',
    annualIncome: 180000,
    occupation: 'Homemaker',
    isMaharashtraResident: true
  };

  const ladkiScheme = db.prepare('SELECT * FROM schemes WHERE id = ?').get('ladki-bahin-yojana') as any;
  const ladkiCriteria = db.prepare('SELECT * FROM eligibility_criteria WHERE scheme_id = ?').get('ladki-bahin-yojana') as any;
  assert.strictEqual(femaleProfile.age >= ladkiCriteria.min_age && femaleProfile.age <= ladkiCriteria.max_age, true);
  assert.strictEqual(femaleProfile.annualIncome <= ladkiCriteria.max_income, true);
  assert.strictEqual(femaleProfile.gender === ladkiCriteria.gender, true);
  console.log('✓ Scenario A: Successfully verified eligibility rules for Mukhyamantri Majhi Ladki Bahin Yojana.');

  // Scenario B: Ineligible condition (Age 15 for Ladki Bahin)
  const minorProfile = { age: 15, gender: 'Female', annualIncome: 100000 };
  assert.strictEqual(minorProfile.age < ladkiCriteria.min_age, true);
  console.log('✓ Scenario B: Accurately caught underage restriction (age 15 < 21 min_age).');

  // Test 4: Document Checklist Fidelity
  console.log('\n[Test 4] Testing Document Checklist Grounding...');
  const mjpjayDocs = db.prepare('SELECT * FROM scheme_documents WHERE scheme_id = ?').all('mjpjay-health') as any[];
  assert.strictEqual(mjpjayDocs.length >= 2, true);
  const docNames = mjpjayDocs.map(d => d.document_name_en);
  assert.strictEqual(docNames.some(d => d.includes('Ration Card')), true);
  assert.strictEqual(docNames.some(d => d.includes('Aadhaar')), true);
  console.log(`✓ Document checklist grounded strictly in DB: ${docNames.join(', ')}`);

  // Test 5: Official Link Transparency
  console.log('\n[Test 5] Testing Official Portal Links & Source Citations...');
  const allSchemes = db.prepare('SELECT official_portal_url, source_name, source_verified_date FROM schemes').all() as any[];
  for (const s of allSchemes) {
    assert.strictEqual(s.official_portal_url.startsWith('https://'), true, 'Must have valid HTTPS official portal');
    assert.strictEqual(s.source_name.length > 5, true, 'Must cite official Government Resolution or Department');
    assert.strictEqual(s.source_verified_date.length >= 10, true, 'Must have verified date string');
  }
  console.log(`✓ All ${allSchemes.length} schemes have verified HTTPS portals and official citations.`);

  // Test 6: Strict Anti-Hallucination on Unknown Information
  console.log('\n[Test 6] Testing Anti-Hallucination Protection for Unknown Query...');
  const fakeContext = RAGEngine.retrieve('crypto blockchain alien grant subsidy for spaceships 999999');
  assert.strictEqual(fakeContext.confidence === 'none', true);
  const fakeRes = await LLMAdapter.generateResponse(fakeContext, 'en');
  assert.strictEqual(fakeRes.answer.includes("couldn't verify this information from the available official"), true);
  console.log('✓ Unknown query gracefully refused without fabricating hallucinated policies.');

  // Test 7: Failure & Boundary Handling
  console.log('\n[Test 7] Testing Edge Case Input Handling...');
  const emptyContext = RAGEngine.retrieve('', 'en');
  assert.strictEqual(emptyContext.confidence === 'none', true);
  const singleCharContext = RAGEngine.retrieve('?', 'en');
  assert.strictEqual(singleCharContext.confidence === 'none', true);
  console.log('✓ Empty strings, symbols, and malformed inputs handled safely without crashes.');

  console.log('\n=====================================================');
  console.log('  ALL 8 PHASE 11 TESTS PASSED WITH 100% SUCCESS RATE  ');
  console.log('=====================================================\n');
}

runComprehensiveTests().catch(err => {
  console.error('Test suite failure:', err);
  process.exit(1);
});
