export type Language = 'en' | 'hi' | 'pa' | 'bn';

export type EngineStatus =
  | 'EVIDENCE_FOUND'
  | 'NOT_FOUND'
  | 'UNCLEAR'
  | 'CONFLICT';

export type DocumentType =
  | 'HOSPITAL_BILL'
  | 'DISCHARGE_SUMMARY'
  | 'PRESCRIPTION'
  | 'DIAGNOSTIC_REPORT'
  | 'PAYMENT_RECEIPT'
  | 'OTHER';

export interface ExtractedFieldMeta {
  value: string | number;
  page: number;
  confidence: number;
  sourceSnippet: string;
  verified?: boolean;
  fieldKey: string;
  label: string;
}

export interface WaitingPeriodItem {
  condition: string;
  periodMonths: number;
  sourceExcerpt?: string;
  page?: number;
}

export interface SubLimitItem {
  category: string;
  limit: string;
  sourceExcerpt?: string;
  page?: number;
}

export interface ExclusionItem {
  description: string;
  category?: string;
  sourceExcerpt?: string;
  page?: number;
}

export interface PolicyData {
  policyNumber: string;
  policyholderName: string;
  insurerName: string;
  policyPeriod: {
    from: string;
    to: string;
  };
  sumInsured: number;
  roomRentLimit: string;
  icuLimit: string;
  preHospitalizationDays: number;
  postHospitalizationDays: number;
  waitingPeriods: WaitingPeriodItem[];
  subLimits: SubLimitItem[];
  exclusions: ExclusionItem[];
  ambulanceCover: string;
  copayPercentage: number;
  rawText: string;
  totalPages: number;
  extractedFields: Record<string, ExtractedFieldMeta>;
}

export interface DocumentFieldMeta {
  page?: number;
  textSnippet: string;
  confidence: number;
  status: 'clear' | 'unclear';
  extractedValue?: string | number;
}

export interface MedicalDocument {
  id: string;
  fileName: string;
  fileType: string;
  size: number;
  uploadDate: string;
  classifiedType: DocumentType;
  confidence: number;
  patientName?: string;
  hospitalName?: string;
  admissionDate?: string;
  dischargeDate?: string;
  billAmount?: number;
  paymentAmount?: number;
  doctorName?: string;
  diagnosis?: string;
  medicines?: string[];
  rawText: string;
  sourceExcerpts: Record<string, DocumentFieldMeta>;
  isHandwritten?: boolean;
  manualReviewFlag?: boolean;
  fileDataUrl?: string;
}

export interface IntelligenceFinding {
  id: string;
  category: 'IDENTITY' | 'HOSPITALIZATION' | 'FINANCIAL' | 'MEDICAL_NECESSITY' | 'POLICY_LIMITS' | 'DOCUMENTATION';
  requirement: string;
  policyCondition: string;
  supportingEvidence: string;
  documentName: string;
  pageOrExcerpt: string;
  status: EngineStatus;
  explanation: string;
  recommendedAction: string;
  differenceAmount?: number;
  severity: 'success' | 'info' | 'warning' | 'danger';
}

export interface ClaimReadinessSummary {
  claimReference: string;
  preparedDate: string;
  policyNumber: string;
  policyholderName: string;
  patientName: string;
  hospitalName: string;
  totalDocuments: number;
  evidenceFoundCount: number;
  notFoundCount: number;
  unclearCount: number;
  conflictCount: number;
  overallReadiness: 'READY_TO_SUBMIT' | 'REVIEW_RECOMMENDED' | 'CRITICAL_GAPS';
  readinessScore: number; // 0 - 100
  totalClaimedAmount: number;
  totalReceiptsAmount: number;
  findings: IntelligenceFinding[];
  nextSteps: string[];
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  groundedSources?: Array<{
    documentName: string;
    pageOrExcerpt: string;
  }>;
  suggestedQuestions?: string[];
}
