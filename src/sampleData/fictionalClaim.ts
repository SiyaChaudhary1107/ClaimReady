import { PolicyData, MedicalDocument, IntelligenceFinding, ClaimReadinessSummary } from '../types';

export const fictionalPolicyText = `STAR MICRO HEALTH INSURANCE COMPANY LIMITED
Registered Office: 1, New Tank Street, Valluvar Kottam High Road, Nungambakkam, Chennai - 600034
POLICY SCHEDULE - MICRO HEALTH SHIELD (REIMBURSEMENT & CASHLESS)

1. POLICY DETAILS:
Policy Number: SMH-2024-884920
Plan Type: Micro Health Suraksha Shield
Previous Policy No: SMH-2023-741029 (Renewal with Continuous Coverage from 01-Jan-2023)
Period of Insurance: From 00:00 hrs on 01-Jan-2024 To 23:59 hrs on 31-Dec-2024

2. INSURED DETAILS:
Primary Policyholder: Ravi Kumar (Self)
Occupation: Gig Delivery Associate / Platform Worker
Mobile: +91-98765-XXXXX
Insured Beneficiary 1: Ravi Kumar | Age: 29 | Relation: Self
Insured Beneficiary 2: Shanti Devi | Age: 58 | Relation: Mother
Total Sum Insured: INR 1,50,000 (Rupees One Lakh Fifty Thousand Only)
Cumulative Bonus: INR 15,000 (10% earned)

3. BENEFIT SCHEDULE & SUB-LIMITS (Clause 3.1):
(a) Room, Boarding and Nursing Expenses: Up to 1.0% of Sum Insured per day (Max INR 1,500 per day). If admitted to a room with higher tariff, proportionate deductions shall apply to associated medical charges.
(b) Intensive Care Unit (ICU) Expenses: Up to 2.0% of Sum Insured per day (Max INR 3,000 per day).
(c) Surgeon, Anesthetist, Medical Practitioner, Consultant, Specialist Fees: Subject to maximum 25% of Sum Insured.
(d) Pre-Hospitalization Medical Expenses: Incurred up to 30 days prior to the date of admission.
(e) Post-Hospitalization Medical Expenses: Incurred up to 60 days from the date of discharge.
(f) Road Ambulance Charges: Actual expenses incurred up to INR 1,000 per hospitalization episode.
(g) Co-Payment: 0% (Nil co-pay for network/authorized non-network hospitals).

4. WAITING PERIODS (Clause 4):
4.1 Initial Waiting Period: 30 days from the date of initial inception for all illnesses except accidental injuries.
4.2 Specific Illnesses Waiting Period (24 Months): Expenses related to treatment of Cataract, Benign Prostatic Hypertrophy, Hernia, Hydrocele, Calculus diseases (Gallbladder stones / Cholecystectomy), Hysterectomy are excluded until 24 months of continuous coverage have elapsed, unless certified by treating surgeon as life-threatening acute emergency.
4.3 Pre-Existing Diseases (PED): Covered after 48 months of continuous coverage.

5. GENERAL EXCLUSIONS (Clause 5):
5.1 Domiciliary hospitalization expenses unless medically required and certified.
5.2 Cosmetic or plastic surgery, weight loss treatments, sex change procedures.
5.3 Expenses for non-medical consumables, including PPE kits exceeding hospital standard cap, sanitizers, gloves, registration and admission fees.
5.4 Diagnostic charges not directly related to the inpatient treatment diagnosis.
`;

export const samplePolicyData: PolicyData = {
  policyNumber: "SMH-2024-884920",
  policyholderName: "Ravi Kumar",
  insurerName: "Star Micro Health Insurance Co. Ltd.",
  policyPeriod: {
    from: "01-Jan-2024",
    to: "31-Dec-2024"
  },
  sumInsured: 150000,
  roomRentLimit: "1% of Sum Insured (INR 1,500 / day)",
  icuLimit: "2% of Sum Insured (INR 3,000 / day)",
  preHospitalizationDays: 30,
  postHospitalizationDays: 60,
  ambulanceCover: "Up to INR 1,000 per hospitalization",
  copayPercentage: 0,
  rawText: fictionalPolicyText,
  totalPages: 3,
  waitingPeriods: [
    {
      condition: "Initial Illness Waiting Period",
      periodMonths: 1,
      sourceExcerpt: "Clause 4.1: Initial Waiting Period: 30 days from the date of initial inception for all illnesses except accidental injuries.",
      page: 2
    },
    {
      condition: "Specified Surgeries (Calculus diseases / Cholecystectomy / Hernia)",
      periodMonths: 24,
      sourceExcerpt: "Clause 4.2: Expenses related to Calculus diseases (Gallbladder stones / Cholecystectomy) excluded until 24 months of continuous coverage have elapsed, unless certified as emergency.",
      page: 2
    },
    {
      condition: "Pre-Existing Diseases (PED)",
      periodMonths: 48,
      sourceExcerpt: "Clause 4.3: Pre-Existing Diseases (PED): Covered after 48 months of continuous coverage.",
      page: 2
    }
  ],
  subLimits: [
    {
      category: "Room Rent & Nursing",
      limit: "INR 1,500 / day (1% of Sum Insured)",
      sourceExcerpt: "Clause 3.1(a): Up to 1.0% of Sum Insured per day (Max INR 1,500 per day). Proportionate deductions apply to higher room tariffs.",
      page: 1
    },
    {
      category: "ICU Charges",
      limit: "INR 3,000 / day (2% of Sum Insured)",
      sourceExcerpt: "Clause 3.1(b): Intensive Care Unit (ICU) Expenses: Up to 2.0% of Sum Insured per day (Max INR 3,000 per day).",
      page: 1
    },
    {
      category: "Surgeon & Specialist Fees",
      limit: "Max 25% of Sum Insured (INR 37,500)",
      sourceExcerpt: "Clause 3.1(c): Surgeon, Anesthetist, Medical Practitioner Fees: Subject to maximum 25% of Sum Insured.",
      page: 1
    },
    {
      category: "Ambulance Transportation",
      limit: "INR 1,000 max per hospitalization",
      sourceExcerpt: "Clause 3.1(f): Road Ambulance Charges: Actual expenses incurred up to INR 1,000 per hospitalization episode.",
      page: 1
    }
  ],
  exclusions: [
    {
      description: "Non-medical consumables (Registration fees, admission kit, gloves, sanitizers)",
      sourceExcerpt: "Clause 5.3: Expenses for non-medical consumables, including sanitizers, gloves, registration and admission fees.",
      page: 3
    },
    {
      description: "Cosmetic surgery and aesthetic treatments",
      sourceExcerpt: "Clause 5.2: Cosmetic or plastic surgery, weight loss treatments.",
      page: 3
    },
    {
      description: "Diagnostic charges not directly related to inpatient treatment",
      sourceExcerpt: "Clause 5.4: Diagnostic charges not directly related to the inpatient treatment diagnosis.",
      page: 3
    }
  ],
  extractedFields: {
    policyNumber: {
      value: "SMH-2024-884920",
      page: 1,
      confidence: 0.99,
      sourceSnippet: "Policy Number: SMH-2024-884920",
      verified: true,
      fieldKey: "policyNumber",
      label: "Policy Number"
    },
    policyholderName: {
      value: "Ravi Kumar",
      page: 1,
      confidence: 0.98,
      sourceSnippet: "Primary Policyholder: Ravi Kumar (Self)",
      verified: true,
      fieldKey: "policyholderName",
      label: "Policyholder Name"
    },
    insurerName: {
      value: "Star Micro Health Insurance Company Limited",
      page: 1,
      confidence: 0.99,
      sourceSnippet: "STAR MICRO HEALTH INSURANCE COMPANY LIMITED",
      verified: true,
      fieldKey: "insurerName",
      label: "Insurance Company"
    },
    sumInsured: {
      value: 150000,
      page: 1,
      confidence: 0.96,
      sourceSnippet: "Total Sum Insured: INR 1,50,000",
      verified: true,
      fieldKey: "sumInsured",
      label: "Sum Insured"
    },
    roomRentLimit: {
      value: "1% of Sum Insured (INR 1,500/day)",
      page: 1,
      confidence: 0.95,
      sourceSnippet: "Room, Boarding and Nursing Expenses: Up to 1.0% of Sum Insured per day (Max INR 1,500 per day)",
      verified: true,
      fieldKey: "roomRentLimit",
      label: "Room Rent Limit"
    }
  }
};

export const sampleMedicalDocuments: MedicalDocument[] = [
  {
    id: "doc-1",
    fileName: "Discharge_Summary_ShantiDevi_Sanjeevani.pdf",
    fileType: "application/pdf",
    size: 245000,
    uploadDate: "2024-10-18T10:15:00Z",
    classifiedType: "DISCHARGE_SUMMARY",
    confidence: 0.97,
    patientName: "Shanti Devi",
    hospitalName: "Sanjeevani Community Hospital & Trauma Centre",
    admissionDate: "2024-10-12",
    dischargeDate: "2024-10-15",
    doctorName: "Dr. Anand Verma, MS (Gen Surgery)",
    diagnosis: "Acute Calculous Cholecystitis with Sepsis - Emergency Laparoscopic Cholecystectomy performed on 13-Oct-2024",
    rawText: `SANJEEVANI COMMUNITY HOSPITAL & TRAUMA CENTRE
Plot 44, Metro Road, Janakpuri, New Delhi - 110058 | Ph: 011-2550XXXX
NABH Accredited Healthcare Provider | Reg No: DEL/HOSP/2019/401

PATIENT DISCHARGE SUMMARY (INPATIENT RECORD)
UHID / IP No: IPD-2024-9104
Patient Name: Mrs. Shanti Devi | Age: 58 Yrs | Sex: Female
Attendant / Nominee: Ravi Kumar (Son) | Contact: +91-98765-XXXXX
Date & Time of Admission: 12-Oct-2024 at 10:30 AM
Date & Time of Discharge: 15-Oct-2024 at 04:00 PM
Ward: Semi-Private Room No. 204

CLINICAL SUMMARY & DIAGNOSIS:
Admitted with severe right upper quadrant abdominal pain radiating to back for 2 days, accompanied by nausea, vomiting and low grade fever.
Diagnosis: ACUTE CALCULOUS CHOLECYSTITIS WITH SEPSIS
Ultrasound Abdomen (Done 12-Oct-2024): Gallbladder distended with multiple calculi, wall edema 5.2mm, pericholecystic fluid present.

OPERATIVE PROCEDURE (13-Oct-2024):
EMERGENCY LAPAROSCOPIC CHOLECYSTECTOMY under General Anesthesia.
Operated by: Dr. Anand Verma, MS, MCh (GI Surgery).
Anesthetist: Dr. Priya Nair, MD (Anaesth).
Findings: Inflamed and tense gallbladder with thick wall, multiple stones impacted at Hartman's pouch. Uneventful procedure.

POST-OPERATIVE COURSE & CONDITION AT DISCHARGE:
Patient tolerated oral sips from 14-Oct. Drain removed on 15-Oct morning. Wound clean and dry, vitals stable.
BP: 124/82 mmHg, Pulse: 78/min, Afebrile. Patient discharged in hemodynamically stable condition.

DISCHARGE ADVICE & FOLLOW-UP:
Review in surgical OPD after 5 days on 20-Oct-2024 for stitch inspection. Avoid lifting heavy weights for 4 weeks.`,
    sourceExcerpts: {
      patientName: {
        textSnippet: "Patient Name: Mrs. Shanti Devi | Age: 58 Yrs | Sex: Female",
        confidence: 0.98,
        status: "clear",
        page: 1,
        extractedValue: "Shanti Devi"
      },
      hospitalName: {
        textSnippet: "SANJEEVANI COMMUNITY HOSPITAL & TRAUMA CENTRE, New Delhi",
        confidence: 0.99,
        status: "clear",
        page: 1,
        extractedValue: "Sanjeevani Community Hospital & Trauma Centre"
      },
      admissionDate: {
        textSnippet: "Date & Time of Admission: 12-Oct-2024 at 10:30 AM",
        confidence: 0.96,
        status: "clear",
        page: 1,
        extractedValue: "12-Oct-2024"
      },
      dischargeDate: {
        textSnippet: "Date & Time of Discharge: 15-Oct-2024 at 04:00 PM",
        confidence: 0.96,
        status: "clear",
        page: 1,
        extractedValue: "15-Oct-2024"
      },
      diagnosis: {
        textSnippet: "Diagnosis: ACUTE CALCULOUS CHOLECYSTITIS WITH SEPSIS - EMERGENCY LAPAROSCOPIC CHOLECYSTECTOMY",
        confidence: 0.94,
        status: "clear",
        page: 1,
        extractedValue: "Acute Calculous Cholecystitis"
      }
    }
  },
  {
    id: "doc-2",
    fileName: "Hospital_Final_Bill_SCH_10928.pdf",
    fileType: "application/pdf",
    size: 320000,
    uploadDate: "2024-10-18T10:16:30Z",
    classifiedType: "HOSPITAL_BILL",
    confidence: 0.98,
    patientName: "Shanti Devi",
    hospitalName: "Sanjeevani Community Hospital & Trauma Centre",
    admissionDate: "2024-10-12",
    dischargeDate: "2024-10-15",
    billAmount: 57100,
    doctorName: "Dr. Anand Verma",
    rawText: `SANJEEVANI COMMUNITY HOSPITAL & TRAUMA CENTRE
FINAL ITEMIZED INPATIENT BILL / TAX INVOICE
Bill No: SCH-2024-10928 | Date of Bill: 15-Oct-2024
Patient: Mrs. Shanti Devi | IPD No: IPD-2024-9104 | Bed No: Room 204
Admission: 12-Oct-2024 (10:30 AM) | Discharge: 15-Oct-2024 (04:00 PM) | Days: 3

ITEMIZED CHARGES BREAKDOWN:
1. Room & Nursing Charges (Room 204, Semi-Private): 3 Days @ INR 2,200/day = INR 6,600
2. Operation Theatre (OT) & Equipment Charges: INR 18,000
3. Surgeon Professional Fees (Dr. Anand Verma): INR 12,000
4. Anesthesia Charges (Dr. Priya Nair): INR 5,000
5. Inpatient Pharmacy, Medicines & IV Fluids: INR 9,500
6. Pathology & Laboratory Investigations (CBC, LFT, KFT, Viral Markers): INR 2,400
7. Radiology / Pre-Op Imaging (Ultrasound Abdomen & ECG): INR 1,800
8. Road Ambulance Transport to Hospital (12-Oct-2024): INR 1,800

TOTAL BILL AMOUNT: INR 57,100
(Rupees Fifty Seven Thousand One Hundred Only)
Advance Received (Receipt REC-881): INR 20,000
Balance Due: INR 37,100
Authorized Signatory: Billing Officer, Sanjeevani Community Hospital`,
    sourceExcerpts: {
      billAmount: {
        textSnippet: "TOTAL BILL AMOUNT: INR 57,100 (Rupees Fifty Seven Thousand One Hundred Only)",
        confidence: 0.98,
        status: "clear",
        page: 1,
        extractedValue: 57100
      },
      roomRentRate: {
        textSnippet: "Room & Nursing Charges (Room 204): 3 Days @ INR 2,200/day = INR 6,600",
        confidence: 0.95,
        status: "clear",
        page: 1,
        extractedValue: "INR 2,200/day"
      },
      ambulanceCharge: {
        textSnippet: "Road Ambulance Transport to Hospital (12-Oct-2024): INR 1,800",
        confidence: 0.94,
        status: "clear",
        page: 1,
        extractedValue: 1800
      }
    }
  },
  {
    id: "doc-3",
    fileName: "Settlement_Payment_Receipts.pdf",
    fileType: "application/pdf",
    size: 180000,
    uploadDate: "2024-10-18T10:17:45Z",
    classifiedType: "PAYMENT_RECEIPT",
    confidence: 0.95,
    patientName: "Shanti Devi",
    hospitalName: "Sanjeevani Community Hospital",
    paymentAmount: 57100,
    rawText: `SANJEEVANI COMMUNITY HOSPITAL - OFFICIAL RECEIPT
Receipt 1: Advance Cashier Receipt
Receipt No: REC-881 | Date: 12-Oct-2024 (11:15 AM)
Received from: Ravi Kumar for Patient Mrs. Shanti Devi (IPD-9104)
Payment Mode: UPI / PhonePe (Ref: 428619381029)
Amount: INR 20,000 (Twenty Thousand Only)

Receipt 2: Final Settlement Discharge Receipt
Receipt No: REC-942 | Date: 16-Oct-2024 (09:45 AM)
Received from: Ravi Kumar for Patient Mrs. Shanti Devi (IPD-9104)
Payment Mode: UPI / GPay (Ref: 428751902831)
Amount: INR 37,100 (Thirty Seven Thousand One Hundred Only)
Total Receipts Cumulative: INR 57,100 (Nil Balance Outstanding)
Status: Paid in Full & Bill Cleared`,
    sourceExcerpts: {
      totalPayment: {
        textSnippet: "Receipt 1: INR 20,000 + Receipt 2: INR 37,100 = Total Receipts Cumulative: INR 57,100",
        confidence: 0.97,
        status: "clear",
        page: 1,
        extractedValue: 57100
      },
      receiptDate: {
        textSnippet: "Receipt No: REC-942 | Date: 16-Oct-2024 (09:45 AM)",
        confidence: 0.95,
        status: "clear",
        page: 1,
        extractedValue: "16-Oct-2024"
      }
    }
  },
  {
    id: "doc-4",
    fileName: "Doctor_Prescription_Discharge_Medication.jpg",
    fileType: "image/jpeg",
    size: 410000,
    uploadDate: "2024-10-18T10:19:10Z",
    classifiedType: "PRESCRIPTION",
    confidence: 0.82,
    patientName: "Shanti Devi",
    doctorName: "Dr. Anand Verma",
    hospitalName: "Sanjeevani Community Hospital",
    isHandwritten: true,
    manualReviewFlag: true,
    medicines: [
      "Tab Cefixime 200mg BD x 5 days",
      "Tab Pantoprazole 40mg OD before breakfast x 7 days",
      "Tab [UNREADABLE HANDWRITING - 500mg SOS/TDS] for abdominal spasm/pain"
    ],
    rawText: `Dr. Anand Verma, MS, MCh
Consultant GI Surgeon | Reg No: DMC-38491
SANJEEVANI COMMUNITY HOSPITAL
Date: 15-Oct-2024 | Patient: Mrs. Shanti Devi (58F)

Rx (Discharge Medicines):
1. Tab Cefixime 200mg - 1 tab twice daily (BD) after food x 5 days.
2. Tab Pantoprazole 40mg - 1 tab daily morning empty stomach x 7 days.
3. Tab [Illegible handwritten word / looks like Dolo or Drotaverine] 500mg - 1 tab TDS SOS when pain occurs.
Note: Dressing change on 18-Oct. Liquid diet for 2 days, then light soft diet.`,
    sourceExcerpts: {
      medication1: {
        textSnippet: "Tab Cefixime 200mg - 1 tab twice daily (BD) after food x 5 days",
        confidence: 0.92,
        status: "clear",
        page: 1,
        extractedValue: "Cefixime 200mg"
      },
      medication3: {
        textSnippet: "Tab [Illegible handwritten word] 500mg - 1 tab TDS SOS",
        confidence: 0.45,
        status: "unclear",
        page: 1,
        extractedValue: "Illegible 500mg"
      }
    }
  }
];

export const sampleIntelligenceFindings: IntelligenceFinding[] = [
  {
    id: "find-1",
    category: "IDENTITY",
    requirement: "Patient & Policyholder Identity Verification",
    policyCondition: "Claimant must be an insured member covered under the policy schedule.",
    supportingEvidence: "Discharge summary lists patient as Mrs. Shanti Devi (58 Yrs, Female, Mother). Policy schedule lists Insured Beneficiary 2: Shanti Devi (Mother, 58 yrs) under Primary Policyholder Ravi Kumar.",
    documentName: "Discharge_Summary_ShantiDevi_Sanjeevani.pdf",
    pageOrExcerpt: "Discharge Summary Page 1: 'Patient Name: Mrs. Shanti Devi | Age: 58 Yrs | Attendant: Ravi Kumar (Son)'",
    status: "EVIDENCE_FOUND",
    explanation: "Identity verified. The patient name and age match the insured dependent listed in the active policy schedule.",
    recommendedAction: "Attach government ID proof (Aadhaar / Voter ID of Shanti Devi and Ravi Kumar) matching the policy records for the TPA submission.",
    severity: "success"
  },
  {
    id: "find-2",
    category: "HOSPITALIZATION",
    requirement: "Minimum 24-Hour Inpatient Hospitalization",
    policyCondition: "Policy requires continuous in-patient stay of at least 24 hours, except for approved daycare procedures.",
    supportingEvidence: "Admitted on 12-Oct-2024 at 10:30 AM; Discharged on 15-Oct-2024 at 04:00 PM. Total inpatient duration: ~77.5 hours (3 nights).",
    documentName: "Discharge_Summary_ShantiDevi_Sanjeevani.pdf",
    pageOrExcerpt: "Admission: 12-Oct-2024 (10:30 AM) | Discharge: 15-Oct-2024 (04:00 PM)",
    status: "EVIDENCE_FOUND",
    explanation: "The hospital stay exceeds 24 hours requirement. Discharge summary confirms inpatient treatment and bedside monitoring.",
    recommendedAction: "Submit the complete discharge summary with doctor's stamp and hospital registration number.",
    severity: "success"
  },
  {
    id: "find-3",
    category: "FINANCIAL",
    requirement: "Hospital Bill & Payment Proof Alignment",
    policyCondition: "Total claimed amount must be supported by stamped hospital tax invoice and matching payment receipts.",
    supportingEvidence: "Itemized Hospital Bill SCH-2024-10928 totals INR 57,100. Payment Receipts (REC-881 for INR 20,000 + REC-942 for INR 37,100) total INR 57,100.",
    documentName: "Hospital_Final_Bill_SCH_10928.pdf & Settlement_Payment_Receipts.pdf",
    pageOrExcerpt: "Bill Total: INR 57,100 | Receipts Total: INR 57,100 (Nil Balance Outstanding)",
    status: "EVIDENCE_FOUND",
    explanation: "Financial figures reconcile perfectly: INR 57,100 billed = INR 57,100 collected across advance and final payment.",
    recommendedAction: "Ensure both UPI transaction reference slips or bank transaction statements are attached to avoid payment dispute.",
    severity: "success"
  },
  {
    id: "find-4",
    category: "POLICY_LIMITS",
    requirement: "Room Rent & Boarding Sub-Limit Compliance",
    policyCondition: "Clause 3.1(a): Room rent is capped at 1% of Sum Insured (INR 1,500/day). Tariff above cap triggers proportionate deductions.",
    supportingEvidence: "Hospital bill shows 3 days in Semi-Private Room No. 204 charged at INR 2,200/day (Total INR 6,600). Allowed limit is INR 1,500/day (INR 4,500).",
    documentName: "Hospital_Final_Bill_SCH_10928.pdf",
    pageOrExcerpt: "Bill Line 1: 'Room & Nursing Charges (Room 204): 3 Days @ INR 2,200/day = INR 6,600' vs Policy Clause 3.1(a)",
    status: "CONFLICT",
    explanation: "Hospital room tariff of INR 2,200/day exceeds policy sub-limit of INR 1,500/day by INR 700/day (Total INR 2,100 excess). TPA will likely deduct INR 2,100 plus proportionate associated charges.",
    recommendedAction: "Be prepared for a standard deduction of at least INR 2,100 from room rent. Clarify with TPA if hospital had lower-tier rooms available during emergency admission.",
    differenceAmount: 2100,
    severity: "warning"
  },
  {
    id: "find-5",
    category: "POLICY_LIMITS",
    requirement: "Ambulance Expense Limit Compliance",
    policyCondition: "Clause 3.1(f): Road Ambulance covered up to actual expenses, capped at INR 1,000 per hospitalization.",
    supportingEvidence: "Hospital bill includes Road Ambulance charge of INR 1,800 on 12-Oct-2024.",
    documentName: "Hospital_Final_Bill_SCH_10928.pdf",
    pageOrExcerpt: "Bill Line 8: 'Road Ambulance Transport to Hospital (12-Oct-2024): INR 1,800' vs Policy Clause 3.1(f)",
    status: "CONFLICT",
    explanation: "Ambulance bill is INR 1,800, which exceeds the policy limit of INR 1,000 by INR 800.",
    recommendedAction: "The insurer will reimburse up to INR 1,000 for ambulance. Ensure ambulance trip sheet / log note is attached.",
    differenceAmount: 800,
    severity: "warning"
  },
  {
    id: "find-6",
    category: "HOSPITALIZATION",
    requirement: "Discharge Date vs Final Payment Receipt Date Inconsistency",
    policyCondition: "All medical documentation dates should align chronologically with admission and discharge timestamps.",
    supportingEvidence: "Discharge Summary notes discharge on 15-Oct-2024 at 04:00 PM. Final settlement receipt REC-942 is timestamped 16-Oct-2024 at 09:45 AM.",
    documentName: "Discharge_Summary_ShantiDevi_Sanjeevani.pdf & Settlement_Payment_Receipts.pdf",
    pageOrExcerpt: "Discharge: 15-Oct-2024 (04:00 PM) vs Receipt REC-942: 16-Oct-2024 (09:45 AM)",
    status: "CONFLICT",
    explanation: "Date difference detected between discharge date (15-Oct) and final bill clearance (16-Oct morning). This frequently occurs when billing counters close in the evening and process settlements next morning, but TPAs often raise queries regarding overnight charges.",
    recommendedAction: "Ask the hospital billing desk to provide a simple one-line clarification letter confirming that patient was discharged on 15-Oct evening and billing payment was finalized the next morning.",
    severity: "warning"
  },
  {
    id: "find-7",
    category: "MEDICAL_NECESSITY",
    requirement: "Waiting Period vs Acute Emergency Surgeries",
    policyCondition: "Clause 4.2 excludes calculus diseases / cholecystectomy for 24 months unless certified by treating surgeon as an acute life-threatening emergency.",
    supportingEvidence: "Policy continuous coverage started 01-Jan-2023 (~21.5 months active; 24-month waiting period not completed). Discharge summary states: 'Diagnosis: ACUTE CALCULOUS CHOLECYSTITIS WITH SEPSIS - EMERGENCY LAPAROSCOPIC CHOLECYSTECTOMY'.",
    documentName: "Discharge_Summary_ShantiDevi_Sanjeevani.pdf",
    pageOrExcerpt: "Discharge Summary Page 1: 'Admitted with severe pain... Diagnosis: Acute Calculous Cholecystitis with Sepsis - Emergency Laparoscopic Cholecystectomy'",
    status: "UNCLEAR",
    explanation: "The 24-month waiting period has 2.5 months remaining. However, the procedure was performed as an acute emergency with sepsis. Policy clause 4.2 waives the waiting period for emergencies, but TPAs will require explicit emergency medical justification.",
    recommendedAction: "Obtain an 'Emergency Admission Certificate' signed by Dr. Anand Verma explaining acute onset with sepsis necessitating immediate surgical intervention without delay.",
    severity: "warning"
  },
  {
    id: "find-8",
    category: "DOCUMENTATION",
    requirement: "Doctor Prescription & Discharge Medication Readability",
    policyCondition: "All medicines claimed must have a readable prescription and matching itemized pharmacy tax invoice.",
    supportingEvidence: "Prescription image contains readable entries for Cefixime 200mg and Pantoprazole 40mg. Line 3 contains an unreadable handwritten medication with illegible dosage notes.",
    documentName: "Doctor_Prescription_Discharge_Medication.jpg",
    pageOrExcerpt: "Prescription Line 3: 'Tab [Illegible handwritten word] 500mg - 1 tab TDS SOS'",
    status: "UNCLEAR",
    explanation: "Line 3 of the prescription cannot be reliably extracted due to cursive doctor handwriting. TPA auditors may reject reimbursement for pharmacy bills corresponding to this medicine.",
    recommendedAction: "Request a typed discharge medication summary or signed prescription copy from Sanjeevani Hospital with clear medicine names.",
    severity: "warning"
  },
  {
    id: "find-9",
    category: "DOCUMENTATION",
    requirement: "Pre-Operative Diagnostic Investigation Reports (Ultrasound)",
    policyCondition: "All surgical procedures and hospitalizations must be supported by diagnostic lab & radiological test reports.",
    supportingEvidence: "Discharge summary explicitly refers to 'Ultrasound Abdomen (Done 12-Oct-2024): Gallbladder distended with calculi, wall edema 5.2mm'. However, the standalone Ultrasound film and signed radiologist report is not among the uploaded files.",
    documentName: "Discharge_Summary_ShantiDevi_Sanjeevani.pdf",
    pageOrExcerpt: "Discharge Summary Page 1 mentions Ultrasound Abdomen, but no report file was uploaded.",
    status: "NOT_FOUND",
    explanation: "The Ultrasound report is a mandatory proof of medical necessity for gallbladder surgery. While mentioned in the summary, the actual signed diagnostic report was not found in reviewed documents.",
    recommendedAction: "Collect the original Ultrasound Abdomen report and films from the Sanjeevani Hospital radiology department before submitting your claim dossier.",
    severity: "danger"
  }
];

export const sampleReadinessSummary: ClaimReadinessSummary = {
  claimReference: "CR-2024-ND-81920",
  preparedDate: "18-Oct-2024",
  policyNumber: "SMH-2024-884920",
  policyholderName: "Ravi Kumar",
  patientName: "Shanti Devi",
  hospitalName: "Sanjeevani Community Hospital & Trauma Centre",
  totalDocuments: 4,
  evidenceFoundCount: 3,
  notFoundCount: 1,
  unclearCount: 2,
  conflictCount: 3,
  overallReadiness: "REVIEW_RECOMMENDED",
  readinessScore: 72, // 72% ready: good foundation, 3 key things to fix with hospital before submission
  totalClaimedAmount: 57100,
  totalReceiptsAmount: 57100,
  findings: sampleIntelligenceFindings,
  nextSteps: [
    "Collect the missing Ultrasound Abdomen report & film from Sanjeevani Hospital radiology lab.",
    "Obtain an 'Emergency Justification Certificate' from Dr. Anand Verma to satisfy Clause 4.2 emergency waiver for the 24-month waiting period.",
    "Ask the billing desk for a one-line letter explaining the 16-Oct payment settlement vs 15-Oct evening discharge date.",
    "Request a typed or legible copy of the discharge prescription for the handwritten 500mg medicine.",
    "Note potential room rent deduction of ~INR 2,100 (INR 2,200/day room vs INR 1,500/day policy sub-limit) and ambulance capping of INR 1,000."
  ]
};
