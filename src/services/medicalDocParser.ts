import { MedicalDocument, DocumentType, DocumentFieldMeta } from '../types';

/**
 * Classifies a document based on text tokens and extracts key medical fields.
 */
export function parseMedicalDocument(
  id: string,
  fileName: string,
  fileType: string,
  size: number,
  rawText: string,
  isOcrHandwritten: boolean = false,
  fileDataUrl?: string
): MedicalDocument {
  const lowerText = rawText.toLowerCase();
  const sourceExcerpts: Record<string, DocumentFieldMeta> = {};

  // 1. Classify Document Type
  let classifiedType: DocumentType = 'OTHER';
  let classificationConfidence = 0.70;

  if (
    lowerText.includes('discharge summary') ||
    lowerText.includes('inpatient record') ||
    (lowerText.includes('clinical summary') && lowerText.includes('discharge')) ||
    (lowerText.includes('operative procedure') && lowerText.includes('admission'))
  ) {
    classifiedType = 'DISCHARGE_SUMMARY';
    classificationConfidence = 0.96;
  } else if (
    lowerText.includes('final bill') ||
    lowerText.includes('tax invoice') ||
    lowerText.includes('itemized bill') ||
    lowerText.includes('breakdown of charges') ||
    lowerText.includes('inpatient bill')
  ) {
    classifiedType = 'HOSPITAL_BILL';
    classificationConfidence = 0.95;
  } else if (
    lowerText.includes('receipt') ||
    lowerText.includes('payment receipt') ||
    lowerText.includes('advance receipt') ||
    lowerText.includes('cashier receipt') ||
    lowerText.includes('received from')
  ) {
    classifiedType = 'PAYMENT_RECEIPT';
    classificationConfidence = 0.94;
  } else if (
    lowerText.includes('rx') ||
    lowerText.includes('prescription') ||
    lowerText.includes('tab ') ||
    lowerText.includes('cap ') ||
    lowerText.includes('syrup ') ||
    lowerText.includes('mg bd') ||
    lowerText.includes('mg od')
  ) {
    classifiedType = 'PRESCRIPTION';
    classificationConfidence = 0.88;
  } else if (
    lowerText.includes('ultrasound') ||
    lowerText.includes('radiology') ||
    lowerText.includes('pathology') ||
    lowerText.includes('investigation report') ||
    lowerText.includes('blood count') ||
    lowerText.includes('biopsy')
  ) {
    classifiedType = 'DIAGNOSTIC_REPORT';
    classificationConfidence = 0.91;
  }

  // 2. Extract Patient Name
  let patientName: string | undefined;
  const patientMatch = rawText.match(/(?:Patient(?:\s*Name)?|Name\s*of\s*Patient|Mrs?\.?\s*|Mr\.?\s*)\s*[:\-]?\s*([A-Za-z\s\.]{3,30})(?:\s*\||\s*Age|\s*\n|$)/i);
  if (patientMatch) {
    const candidate = patientMatch[1].trim().replace(/\s*\|\s*/g, '');
    if (candidate.length > 2 && !/^(the|and|for|with|bill|hospital)$/i.test(candidate)) {
      patientName = candidate;
      sourceExcerpts['patientName'] = {
        textSnippet: patientMatch[0].trim(),
        confidence: 0.92,
        status: 'clear',
        page: 1,
        extractedValue: patientName,
      };
    }
  }

  // 3. Extract Hospital Name
  let hospitalName: string | undefined;
  const hospitalMatch = rawText.match(/([A-Z][A-Za-z\s&]{4,40}(?:HOSPITAL|CENTRE|CENTER|CLINIC|NURSING\s*HOME|INSTITUTE|HEALTHCARE))/i);
  if (hospitalMatch) {
    hospitalName = hospitalMatch[0].trim().replace(/\n/g, ' ');
    sourceExcerpts['hospitalName'] = {
      textSnippet: hospitalName,
      confidence: 0.94,
      status: 'clear',
      page: 1,
      extractedValue: hospitalName,
    };
  }

  // 4. Extract Admission & Discharge Dates
  let admissionDate: string | undefined;
  let dischargeDate: string | undefined;

  const admMatch = rawText.match(/(?:Date\s*(?:&|and)?\s*Time\s*of\s*)?(?:Admission|Admitted|DOA)\s*[:\-]?\s*([0-9]{1,2}[-\/][A-Za-z0-9]{2,4}[-\/][0-9]{2,4})/i);
  if (admMatch) {
    admissionDate = admMatch[1].trim();
    sourceExcerpts['admissionDate'] = {
      textSnippet: admMatch[0].trim(),
      confidence: 0.95,
      status: 'clear',
      page: 1,
      extractedValue: admissionDate,
    };
  }

  const disMatch = rawText.match(/(?:Date\s*(?:&|and)?\s*Time\s*of\s*)?(?:Discharge|Discharged|DOD)\s*[:\-]?\s*([0-9]{1,2}[-\/][A-Za-z0-9]{2,4}[-\/][0-9]{2,4})/i);
  if (disMatch) {
    dischargeDate = disMatch[1].trim();
    sourceExcerpts['dischargeDate'] = {
      textSnippet: disMatch[0].trim(),
      confidence: 0.95,
      status: 'clear',
      page: 1,
      extractedValue: dischargeDate,
    };
  }

  // 5. Extract Bill Amount
  let billAmount: number | undefined;
  const billMatch = rawText.match(/(?:TOTAL\s*(?:BILL)?\s*AMOUNT|NET\s*(?:PAYABLE|AMOUNT)|GRAND\s*TOTAL|INVOICE\s*TOTAL)\s*[:\-]?\s*(?:INR|Rs\.?|₹)?\s*([0-9,]{3,10})/i);
  if (billMatch) {
    const val = parseInt(billMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(val) && val > 0) {
      billAmount = val;
      sourceExcerpts['billAmount'] = {
        textSnippet: billMatch[0].trim(),
        confidence: 0.96,
        status: 'clear',
        page: 1,
        extractedValue: billAmount,
      };
    }
  }

  // 6. Extract Payment Amount
  let paymentAmount: number | undefined;
  const payMatch = rawText.match(/(?:Amount\s*Received|Total\s*Receipts?|Paid\s*Amount|Amount\s*Paid)\s*[:\-]?\s*(?:INR|Rs\.?|₹)?\s*([0-9,]{3,10})/i);
  if (payMatch) {
    const val = parseInt(payMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(val) && val > 0) {
      paymentAmount = val;
      sourceExcerpts['paymentAmount'] = {
        textSnippet: payMatch[0].trim(),
        confidence: 0.95,
        status: 'clear',
        page: 1,
        extractedValue: paymentAmount,
      };
    }
  } else if (classifiedType === 'PAYMENT_RECEIPT' && billAmount) {
    paymentAmount = billAmount;
  }

  // 7. Extract Doctor Name
  let doctorName: string | undefined;
  const docMatch = rawText.match(/(?:Dr\.?\s+[A-Za-z\s\.]{3,30}(?:,\s*[A-Z]{2,4}(?:\s*\([^)]*\))?)?)/i);
  if (docMatch) {
    doctorName = docMatch[0].trim();
    sourceExcerpts['doctorName'] = {
      textSnippet: doctorName,
      confidence: 0.90,
      status: 'clear',
      page: 1,
      extractedValue: doctorName,
    };
  }

  // 8. Extract Diagnosis
  let diagnosis: string | undefined;
  const diagMatch = rawText.match(/(?:Diagnosis|DIAGNOSIS|Clinical\s*Impression|Provisional\s*Diagnosis)\s*[:\-]?\s*([^\n\r]{5,100})/i);
  if (diagMatch) {
    diagnosis = diagMatch[1].trim();
    sourceExcerpts['diagnosis'] = {
      textSnippet: diagMatch[0].trim(),
      confidence: 0.93,
      status: 'clear',
      page: 1,
      extractedValue: diagnosis,
    };
  }

  // 9. Extract Prescription Medicines & Detect illegible lines
  const medicines: string[] = [];
  const lines = rawText.split('\n');
  let hasIllegible = isOcrHandwritten;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^(?:rx|\d+[\.\)]|tab|cap|syrup|inj)\b/i.test(trimmed)) {
      medicines.push(trimmed);
      if (/unreadable|illegible|\?{2,}|___/i.test(trimmed) || (isOcrHandwritten && trimmed.length < 15)) {
        hasIllegible = true;
      }
    }
  }

  if (classifiedType === 'PRESCRIPTION' && hasIllegible) {
    sourceExcerpts['medication_unclear'] = {
      textSnippet: 'Handwritten or low-confidence medicine entry detected on prescription note.',
      confidence: 0.40,
      status: 'unclear',
      page: 1,
      extractedValue: 'Unclear medication',
    };
  }

  return {
    id,
    fileName,
    fileType,
    size,
    uploadDate: new Date().toISOString(),
    classifiedType,
    confidence: classificationConfidence,
    patientName,
    hospitalName,
    admissionDate,
    dischargeDate,
    billAmount,
    paymentAmount,
    doctorName,
    diagnosis,
    medicines: medicines.length > 0 ? medicines : undefined,
    rawText,
    sourceExcerpts,
    isHandwritten: hasIllegible,
    manualReviewFlag: hasIllegible || classificationConfidence < 0.85,
    fileDataUrl,
  };
}
