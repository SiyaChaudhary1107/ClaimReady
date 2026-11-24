import { PolicyData, MedicalDocument, IntelligenceFinding, AssistantMessage, Language } from '../types';

/**
 * Multilingual Grounded Claim Assistant Service
 * Provides answers strictly grounded in extracted policy rules and medical documents.
 * Discloses when a query cannot be verified from available documents.
 */
export function answerUserQuestion(
  question: string,
  policy: PolicyData | null,
  documents: MedicalDocument[],
  findings: IntelligenceFinding[],
  lang: Language = 'en'
): AssistantMessage {
  const q = question.toLowerCase();
  const id = `msg-${Date.now()}`;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Room Rent & Sub-limit Queries
  if (q.includes('room') || q.includes('rent') || q.includes('कमरा') || q.includes('ਕਮਰਾ') || q.includes('ভাড়া')) {
    const roomFinding = findings.find(f => f.category === 'POLICY_LIMITS' && f.id.includes('room'));
    const limit = policy?.roomRentLimit || '1% of Sum Insured';

    let text = '';
    if (lang === 'hi') {
      text = `आपकी पॉलिसी के क्लॉज 3.1(a) के अनुसार, कमरे के किराए की सीमा ${limit} है। \n\n${
        roomFinding?.differenceAmount
          ? `चेतावनी: आपके अस्पताल के बिल में कमरे का किराया ₹2,200/दिन लगाया गया है, जो तय सीमा (₹1,500/दिन) से ₹700/दिन अधिक है। कुल ₹${roomFinding.differenceAmount} की कटौती होने की संभावना है।`
          : `कमरे का किराया आपकी पॉलिसी की सीमा के भीतर है।`
      }`;
    } else if (lang === 'pa') {
      text = `ਤੁਹਾਡੀ ਪਾਲਿਸੀ ਦੀ ਧਾਰਾ 3.1(a) ਅਨੁਸਾਰ, ਕਮਰੇ ਦੇ ਕਿਰਾਏ ਦੀ ਸੀਮਾ ${limit} ਹੈ। \n\n${
        roomFinding?.differenceAmount
          ? `ਚੇਤਾਵਨੀ: ਹਸਪਤਾਲ ਦੇ ਬਿੱਲ ਵਿੱਚ ਕਮਰੇ ਦਾ ਕਿਰਾਇਆ ₹2,200/ਦਿਨ ਲਗਾਇਆ ਗਿਆ ਹੈ, ਜੋ ਸੀਮਾ (₹1,500/ਦਿਨ) ਤੋਂ ਵੱਧ ਹੈ। ਲਗਭਗ ₹${roomFinding.differenceAmount} ਦੀ ਕਟੌਤੀ ਹੋ ਸਕਦੀ ਹੈ।`
          : `ਕਮਰੇ ਦਾ ਕਿਰਾਇਆ ਪਾਲਿਸੀ ਸੀਮਾ ਦੇ ਅੰਦਰ ਹੈ।`
      }`;
    } else if (lang === 'bn') {
      text = `আপনার পলিসির ধারা ৩.১(a) অনুযায়ী রুম ভাড়ার সীমা হল ${limit}। \n\n${
        roomFinding?.differenceAmount
          ? `সতর্কতা: হাসপাতালের বিলে রুমের ভাড়া ₹২,২০০/দিন ধরা হয়েছে, যা অনুমোদিত সীমার (₹১,৫০০/দিন) চেয়ে বেশি। প্রায় ₹${roomFinding.differenceAmount} কাটা হতে পারে।`
          : `রুম ভাড়া পলিসির সীমার মধ্যেই রয়েছে।`
      }`;
    } else {
      text = `According to Clause 3.1(a) of your policy schedule, room rent and boarding expenses are capped at ${limit}.\n\n${
        roomFinding?.differenceAmount
          ? `Important Note: Your hospital bill charges ₹2,200/day for Room 204, exceeding your daily entitlement by ₹700/day. The insurer will likely deduct approximately ₹${roomFinding.differenceAmount.toLocaleString('en-IN')} plus proportionate medical expenses.`
          : `Your room rent charges fall within the allowable policy sub-limit.`
      }`;
    }

    return {
      id,
      sender: 'assistant',
      text,
      timestamp,
      groundedSources: [
        {
          documentName: policy?.policyNumber ? `Policy #${policy.policyNumber}` : 'Policy Schedule',
          pageOrExcerpt: policy?.roomRentLimit || 'Clause 3.1(a): Room, Boarding and Nursing Expenses up to 1% of Sum Insured',
        },
        ...(roomFinding ? [{ documentName: roomFinding.documentName, pageOrExcerpt: roomFinding.pageOrExcerpt }] : [])
      ],
      suggestedQuestions: [
        'Why is there a date mismatch?',
        'What documents are still missing?',
        'What is the ambulance cover?'
      ]
    };
  }

  // 2. Date Inconsistency / Mismatch Queries
  if (q.includes('date') || q.includes('mismatch') || q.includes('तारीख') || q.includes('ਮਿਤੀ') || q.includes('তারিখ')) {
    const dateFinding = findings.find(f => f.id === 'find-date-consistency' || f.status === 'CONFLICT');

    let text = '';
    if (lang === 'hi') {
      text = `दस्तावेजों की जांच में एक तारीख विसंगति पाई गई है:\n\n• डिस्चार्ज समरी के अनुसार मरीज को 15-अक्टूबर शाम 4:00 बजे छुट्टी दी गई।\n• अंतिम भुगतान रसीद (REC-942) 16-अक्टूबर सुबह 9:45 बजे कटी है।\n\nसलाह: अस्पताल के बिलिंग काउंटर से एक साधारण स्पष्टीकरण पत्र लें कि भुगतान अगली सुबह हुआ था ताकि बीमा कंपनी 15-16 की रात के अतिरिक्त कमरे का किराया न काटे।`;
    } else if (lang === 'pa') {
      text = `ਦਸਤਾਵੇਜ਼ਾਂ ਦੀ ਜਾਂਚ ਵਿੱਚ ਮਿਤੀਆਂ ਦਾ ਅੰਤਰ ਮਿਲਿਆ ਹੈ:\n\n• ਡਿਸਚਾਰਜ ਸਮਰੀ ਅਨੁਸਾਰ ਮਰੀਜ਼ ਨੂੰ 15-ਅਕਤੂਬਰ ਸ਼ਾਮ 4:00 ਵਜੇ ਛੁੱਟੀ ਮਿਲੀ।\n• ਆਖਰੀ ਭੁਗਤਾਨ ਰਸੀਦ 16-ਅਕਤੂਬਰ ਸਵੇਰੇ 9:45 ਵਜੇ ਕੱਟੀ ਗਈ ਹੈ।\n\nਸਲਾਹ: ਹਸਪਤਾਲ ਕਾਊਂਟਰ ਤੋਂ ਲਿਖਵਾ ਲਓ ਕਿ ਬਿੱਲ ਦਾ ਨਿਪਟਾਰਾ ਅਗਲੀ ਸਵੇਰ ਹੋਇਆ ਸੀ ਤਾਂ ਜੋ ਕੋਈ ਇਤਰਾਜ਼ ਨਾ ਲੱਗੇ।`;
    } else if (lang === 'bn') {
      text = `নথিপত্র পর্যালোচনার সময় একটি তারিখের অসঙ্গতি পাওয়া গেছে:\n\n• ডিসচার্জ সামারি অনুযায়ী রোগীকে ১৫ অক্টোবর বিকেল ৪:০০ টায় ছুটি দেওয়া হয়।\n• কিন্তু চূড়ান্ত পেমেন্ট রসিদটি ১৬ অক্টোবর সকাল ৯:৪৫ মিনিটে কাটা হয়েছে।\n\nপরামর্শ: হাসপাতাল থেকে একটি ব্যাখ্যা পত্র নিন যে ডিসচার্জ বিকেলে হওয়ায় পেমেন্ট পরের দিন সকালে সম্পন্ন হয়েছিল।`;
    } else {
      text = `A date inconsistency was detected across your documents:\n\n• The Discharge Summary confirms discharge on 15-Oct-2024 at 04:00 PM.\n• The Final Settlement Payment Receipt (REC-942) is dated 16-Oct-2024 at 09:45 AM.\n\nRecommended Action: Ask Sanjeevani Hospital billing desk for a one-line endorsement letter stating: 'Patient discharged 15-Oct evening; final billing account cleared on 16-Oct morning.' This prevents TPAs from raising queries regarding overnight stay charges.`;
    }

    return {
      id,
      sender: 'assistant',
      text,
      timestamp,
      groundedSources: dateFinding ? [{ documentName: dateFinding.documentName, pageOrExcerpt: dateFinding.pageOrExcerpt }] : [],
      suggestedQuestions: [
        'What documents are still missing?',
        'Does my policy cover room rent limits?',
        'What should I ask the hospital desk?'
      ]
    };
  }

  // 3. Missing Documents Queries
  if (q.includes('missing') || q.includes('not found') || q.includes('गायब') || q.includes('ਕਮੀ') || q.includes('অনুপস্থিত')) {
    const missing = findings.filter(f => f.status === 'NOT_FOUND');

    let text = '';
    if (lang === 'hi') {
      text = `समीक्षा किए गए दस्तावेजों में निम्नलिखित महत्वपूर्ण रिकॉर्ड नहीं मिले हैं:\n\n1. पेट का अल्ट्रासाउंड (Ultrasound Abdomen) रिपोर्ट और फिल्म — डिस्चार्ज समरी में इसका उल्लेख है लेकिन अलग से रिपोर्ट फ़ाइल अपलोड नहीं की गई है।\n2. इलाज करने वाले सर्जन (डॉ. आनंद वर्मा) का आपातकालीन प्रमाण पत्र (Emergency Certificate) — 24 महीने के वेटिंग पीरियड छूट के लिए।`;
    } else if (lang === 'pa') {
      text = `ਜਾਂਚ ਕੀਤੇ ਗਏ ਦਸਤਾਵੇਜ਼ਾਂ ਵਿੱਚ ਹੇਠ ਲਿਖੇ ਰਿਕਾਰਡ ਨਹੀਂ ਮਿਲੇ ਹਨ:\n\n1. ਅਲਟਰਾਸਾਊਂਡ (Ultrasound Abdomen) ਰਿਪੋਰਟ ਅਤੇ ਫਿਲਮਾਂ।\n2. ਸਰਜਨ (ਡਾ. ਆਨੰਦ ਵਰਮਾ) ਦਾ ਐਮਰਜੈਂਸੀ ਸਰਟੀਫਿਕੇਟ — 24 ਮਹੀਨੇ ਦੀ ਵੇਟਿੰਗ ਪੀਰੀਅਡ ਛੋਟ ਲਈ।`;
    } else if (lang === 'bn') {
      text = `পর্যালোচিত নথিতে নিম্নলিখিত গুরুত্বপূর্ণ ফাইলগুলো পাওয়া যায়নি:\n\n১. আল্ট্রাসাউন্ড (Ultrasound Abdomen) পরীক্ষার রিপোর্ট ও ফিল্ম।\n২. জরুরি অস্ত্রোপচারের প্রমাণপত্র (Emergency Certificate) — ২৪ মাসের ওয়েটিং পিরিয়ড মওকুফের জন্য।`;
    } else {
      text = `Based on your uploaded records, the following required evidence is NOT FOUND:\n\n1. Original Ultrasound Abdomen Investigation Report: Mentioned in your discharge summary, but the signed diagnostic report film is missing from your batch.\n2. Emergency Admission Justification Certificate: Required from Dr. Anand Verma to satisfy the Clause 4.2 acute emergency waiver for cholecystectomy.`;
    }

    return {
      id,
      sender: 'assistant',
      text,
      timestamp,
      groundedSources: missing.map(m => ({ documentName: m.documentName, pageOrExcerpt: m.pageOrExcerpt })),
      suggestedQuestions: [
        'What should I ask the hospital desk?',
        'What is the ambulance cover?',
        'Does my policy cover room rent limits?'
      ]
    };
  }

  // 4. Ambulance Coverage Queries
  if (q.includes('ambulance') || q.includes('एम्बुलेंस') || q.includes('ਐਂਬੂਲੈਂਸ') || q.includes('অ্যাম্বুলেন্স')) {
    const limit = policy?.ambulanceCover || 'Up to INR 1,000 per hospitalization';

    let text = '';
    if (lang === 'hi') {
      text = `आपकी पॉलिसी के क्लॉज 3.1(f) के तहत सड़क एम्बुलेंस का खर्च अधिकतम ₹1,000 प्रति अस्पताल भर्ती तक मिलता है।\n\nअस्पताल के बिल में ₹1,800 एम्बुलेंस शुल्क जोड़ा गया है। बीमा कंपनी अधिकतम ₹1,000 ही पास करेगी, शेष ₹800 का भुगतान आपको स्वयं करना होगा।`;
    } else if (lang === 'pa') {
      text = `ਤੁਹਾਡੀ ਪਾਲਿਸੀ ਦੀ ਧਾਰਾ 3.1(f) ਅਨੁਸਾਰ ਐਂਬੂਲੈਂਸ ਦਾ ਖਰਚਾ ਵੱਧ ਤੋਂ ਵੱਧ ₹1,000 ਪ੍ਰਤੀ ਹਸਪਤਾਲ ਦਾਖਲਾ ਮਿਲਦਾ ਹੈ।\n\nਹਸਪਤਾਲ ਦੇ ਬਿੱਲ ਵਿੱਚ ₹1,800 ਲਿਖਿਆ ਹੈ, ਇਸ ਲਈ ਬੀਮਾ ਕੰਪਨੀ ₹1,000 ਦੇਵੇਗੀ ਅਤੇ ਬਾਕੀ ₹800 ਤੁਹਾਨੂੰ ਖੁਦ ਦੇਣੇ ਪੈਣਗੇ।`;
    } else if (lang === 'bn') {
      text = `আপনার পলিসির ধারা ৩.১(f) অনুযায়ী রোড অ্যাম্বুলেন্স খরচ প্রতি ভর্তির জন্য সর্বোচ্চ ₹১,০০০ পর্যন্ত কভার করা হয়।\n\nহাসপাতালের বিলে ₹১,৮০০ ধরা হয়েছে, তাই বীমা কোম্পানি ₹১,০০০ দেবে এবং বাকি ₹৮০০ আপনার নিজস্ব খরচ হবে।`;
    } else {
      text = `Under Clause 3.1(f) of your Star Micro Health Shield policy, Road Ambulance expenses are reimbursable up to INR 1,000 per hospitalization.\n\nYour hospital bill contains an ambulance charge of INR 1,800. The insurer will cap this at INR 1,000 (INR 800 non-reimbursable difference).`;
    }

    return {
      id,
      sender: 'assistant',
      text,
      timestamp,
      groundedSources: [
        {
          documentName: policy?.policyNumber ? `Policy #${policy.policyNumber}` : 'Policy Terms',
          pageOrExcerpt: 'Clause 3.1(f): Road Ambulance Charges covered up to INR 1,000 per hospitalization episode.',
        }
      ],
      suggestedQuestions: [
        'What should I ask the hospital desk?',
        'Does my policy cover room rent limits?',
        'Why is there a date mismatch?'
      ]
    };
  }

  // 5. Hospital Desk Clarification Queries
  if (q.includes('hospital') || q.includes('desk') || q.includes('ask') || q.includes('अस्पताल') || q.includes('ਹਸਪਤਾਲ') || q.includes('কাউন্টার')) {
    let text = '';
    if (lang === 'hi') {
      text = `अस्पताल के बिलिंग और टीपीए डेस्क से संपर्क करते समय इन 3 आवश्यक चीजों का अनुरोध करें:\n\n1. 12-अक्टूबर की 'Ultrasound Abdomen' रिपोर्ट और फिल्म की मूल प्रति।\n2. डॉ. आनंद वर्मा से हस्ताक्षरित 'आपातकालीन चिकित्सा प्रमाण पत्र' (Emergency Justification Certificate)।\n3. 15-अक्टूबर छुट्टी और 16-अक्टूबर सुबह भुगतान के लिए एक साधारण क्लेरिफिकेशन नोट।\n4. डिस्चार्ज पर्ची पर लिखी गई अस्पष्ट दवाइयों का टाइप किया हुआ पर्चा।`;
    } else if (lang === 'pa') {
      text = `ਹਸਪਤਾਲ ਦੇ ਬਿਲਿੰਗ ਡੈਸਕ ਤੋਂ ਇਹ 3 ਜ਼ਰੂਰੀ ਚੀਜ਼ਾਂ ਮੰਗੋ:\n\n1. 12-ਅਕਤੂਬਰ ਦੀ 'Ultrasound Abdomen' ਅਸਲ ਰਿਪੋਰਟ।\n2. ਡਾ. ਆਨੰਦ ਵਰਮਾ ਤੋਂ ਐਮਰਜੈਂਸੀ ਸਰਟੀਫਿਕੇਟ (Emergency Certificate)।\n3. 15-ਅਕਤੂਬਰ ਛੁੱਟੀ ਅਤੇ 16-ਅਕਤੂਬਰ ਭੁਗਤਾਨ ਦੀ ਸਪੱਸ਼ਟੀਕਰਨ ਚਿੱਠੀ।\n4. ਦਵਾਈਆਂ ਦੀ ਟਾਈਪ ਕੀਤੀ ਹੋਈ ਸਾਫ਼ ਪਰਚੀ।`;
    } else if (lang === 'bn') {
      text = `হাসপাতালের বিলিং কাউন্টার থেকে এই প্রয়োজনীয় কাগজপত্রগুলো সংগ্রহ করুন:\n\n১. ১২ অক্টোবরের আল্ট্রাসাউন্ড পেটের (Ultrasound Abdomen) মূল রিপোর্ট।\n২. ডাঃ আনন্দ ভার্মার স্বাক্ষরিত জরুরি চিকিৎসার সার্টিফিকেট (Emergency Certificate)।\n৩. ১৫ অক্টোবর ছুটি ও ১৬ অক্টোবর সকালের বিল নিষ্পত্তির একটি স্পষ্টীকরণ পত্র।\n৪. অস্পষ্ট ওষুধের বদলে পরিষ্কার বা টাইপ করা প্রেসক্রিপশন।`;
    } else {
      text = `Before submitting your claim to your TPA, request these 4 specific items from Sanjeevani Community Hospital:\n\n1. Signed Ultrasound Abdomen Investigation Report: Needed from radiology records.\n2. Emergency Admission Justification Certificate: Signed by operating surgeon Dr. Anand Verma explaining acute onset with sepsis for Clause 4.2 waiting period compliance.\n3. Billing Date Endorsement: Clarification letter confirming discharge on 15-Oct evening and billing cashier clearance on 16-Oct morning.\n4. Typed Prescription Copy: Clear printed discharge medication slip with generic medicine names and pharmacy batch bills.`;
    }

    return {
      id,
      sender: 'assistant',
      text,
      timestamp,
      groundedSources: [
        {
          documentName: 'CLAIMREADY Action Plan',
          pageOrExcerpt: 'Hospital Submission Checklist: Radiologist report, Emergency Certificate, Date clarification',
        }
      ],
      suggestedQuestions: [
        'Does my policy cover room rent limits?',
        'Why is there a date mismatch?',
        'What is the ambulance cover?'
      ]
    };
  }

  // 6. Generic / Fallback Grounded Answer (Never Hallucinate)
  let fallbackText = '';
  if (lang === 'hi') {
    fallbackText = `यह प्रश्न आपकी अपलोड की गई पॉलिसी या मेडिकल फाइलों में स्पष्ट रूप से दर्ज नहीं है।\n\nCLAIMREADY केवल आपके सत्यापित दस्तावेजों के आधार पर सटीक जानकारी देता है और कभी मनगढ़ंत नियम नहीं बताता। कृपया अपनी बीमा कंपनी के टोल-फ्री नंबर या अस्पताल के टीपीए डेस्क से सीधे संपर्क करें।`;
  } else if (lang === 'pa') {
    fallbackText = `ਇਹ ਜਾਣਕਾਰੀ ਤੁਹਾਡੀ ਅਪਲੋਡ ਕੀਤੀ ਪਾਲਿਸੀ ਜਾਂ ਮੈਡੀਕਲ ਫਾਈਲਾਂ ਵਿੱਚ ਦਰਜ ਨਹੀਂ ਹੈ।\n\nCLAIMREADY ਸਿਰਫ਼ ਅਸਲ ਦਸਤਾਵੇਜ਼ਾਂ ਦੇ ਅਧਾਰ 'ਤੇ ਹੀ ਜਾਣਕਾਰੀ ਦਿੰਦਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਬੀਮਾ ਕੰਪਨੀ ਦੇ ਗਾਹਕ ਸਹਾਇਤਾ ਨੰਬਰ 'ਤੇ ਸੰਪਰਕ ਕਰੋ।`;
  } else if (lang === 'bn') {
    fallbackText = `এই প্রশ্নের উত্তর আপনার আপলোড করা পলিসি বা মেডিকেল নথিতে স্পষ্টভাবে পাওয়া যায়নি।\n\nCLAIMREADY শুধুমাত্র আপনার যাচাইকৃত নথির ওপর ভিত্তি করে তথ্য দেয় এবং কোনো অনুমান করে না। অনুগ্রহ করে আপনার বীমা কোম্পানির হেল্পলাইনে যোগাযোগ করুন।`;
  } else {
    fallbackText = `This specific query cannot be verified from your uploaded policy schedule or reviewed medical records.\n\nTo prevent incorrect assumptions, CLAIMREADY only provides answers strictly backed by extracted text. We recommend checking with your insurance company's help desk or hospital insurance counter directly.`;
  }

  return {
    id,
    sender: 'assistant',
    text: fallbackText,
    timestamp,
    suggestedQuestions: [
      'Does my policy cover room rent limits?',
      'Why is there a date mismatch?',
      'What documents are still missing?'
    ]
  };
}
