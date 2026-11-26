import { IntelligenceFinding } from '../types';

/**
 * TypeScript Interfaces for Covexcode Event Completion API
 */
export interface CovexcodeMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CovexcodeCompletionRequest {
  model?: string;
  messages: CovexcodeMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface CovexcodeChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason?: string;
}

export interface CovexcodeUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

export interface CovexcodeCompletionResponse {
  id?: string;
  object?: string;
  created?: number;
  model?: string;
  choices: CovexcodeChoice[];
  usage?: CovexcodeUsage;
  error?: {
    message: string;
    type?: string;
    code?: string | number;
  };
}

export interface AIExplanationResult {
  text: string;
  source: 'covexcode-deepseek' | 'offline-fallback';
  tokensUsed?: number;
  error?: string;
}

export interface CovexcodeServiceConfig {
  endpoint: string;
  model: string;
  apiKey: string;
  timeoutMs: number;
}

/**
 * Get active configuration with environment variable fallbacks
 */
export function getCovexcodeConfig(): CovexcodeServiceConfig {
  const env = (import.meta as any).env || {};

  const endpoint =
    env.COVEXCODE_ENDPOINT ||
    env.VITE_COVEXCODE_ENDPOINT ||
    'https://llm.covexcode.com/event/v1';

  const model =
    env.COVEXCODE_MODEL ||
    env.VITE_COVEXCODE_MODEL ||
    'deepseek-v4-flash';

  const apiKey =
    env.COVEXCODE_API_KEY ||
    env.VITE_COVEXCODE_API_KEY ||
    'bx-live-42f1e2e4146426cffc6e6642d7df34df';

  return {
    endpoint,
    model,
    apiKey,
    timeoutMs: 15000,
  };
}

/**
 * Sends a completion prompt to the Covexcode endpoint using deepseek-v4-flash.
 * Includes timeout control, error classification, and comprehensive response parsing.
 */
export async function sendCovexcodeCompletion(
  prompt: string,
  systemPrompt: string = 'You are ClaimReady Policy AI, an expert insurance claim intelligence assistant. Provide factual, concise, and plain-English summaries.',
  configOverrides?: Partial<CovexcodeServiceConfig>
): Promise<{ text: string; usage?: CovexcodeUsage }> {
  const config = { ...getCovexcodeConfig(), ...configOverrides };

  if (!config.apiKey || config.apiKey.trim() === '') {
    throw new Error('Covexcode API Key is missing. Please check your .env configuration.');
  }

  const payload: CovexcodeCompletionRequest = {
    model: config.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
    max_tokens: 500,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      let errDetail = `HTTP ${response.status} ${response.statusText}`;
      try {
        const errJson = await response.json();
        if (errJson.error?.message) {
          errDetail = `${errDetail}: ${errJson.error.message}`;
        }
      } catch {
        // Body was not JSON
      }

      if (response.status === 429) {
        throw new Error(`Covexcode Rate Limit or Quota Exceeded (${errDetail})`);
      }
      throw new Error(`Covexcode Request Failed: ${errDetail}`);
    }

    const data: CovexcodeCompletionResponse = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Unknown error returned by Covexcode API');
    }

    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new Error('Covexcode returned an empty response content.');
    }

    return {
      text,
      usage: data.usage,
    };
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error(`Covexcode request timed out after ${config.timeoutMs / 1000}s`);
    }
    throw err;
  }
}

/**
 * Summarize an insurance policy clause into simple, claimant-friendly language.
 * Falls back to deterministic rule-based analysis if network or API call fails.
 */
export async function summarizePolicyCondition(
  policyCondition: string,
  category?: string
): Promise<AIExplanationResult> {
  const prompt = `Explain the following health insurance policy condition in 1-2 simple, consumer-friendly sentences. Highlight any financial implications (such as deductions, limits, or mandatory proofs):
Condition: "${policyCondition}"
${category ? `Category: ${category}` : ''}
Keep the response under 60 words, strictly factual, and direct.`;

  try {
    const result = await sendCovexcodeCompletion(
      prompt,
      'You are a transparent health insurance claim advisor helping Indian policyholders understand clause wording clearly.'
    );

    return {
      text: result.text,
      source: 'covexcode-deepseek',
      tokensUsed: result.usage?.total_tokens,
    };
  } catch (error: any) {
    console.warn('[Covexcode] Summarize failed, invoking deterministic fallback:', error?.message);
    const fallbackText = getDeterministicConditionSummary(policyCondition, category);
    return {
      text: fallbackText,
      source: 'offline-fallback',
      error: error?.message || 'Covexcode API unreachable',
    };
  }
}

/**
 * Explains an unclear or conflicting document entry and provides actionable steps to resolve it.
 * Falls back to deterministic medical claim rules if API call fails.
 */
export async function explainUnclearEntry(
  finding: IntelligenceFinding,
  documentSnippet?: string
): Promise<AIExplanationResult> {
  const prompt = `A health insurance claim check was flagged as "${finding.status}".
Requirement: ${finding.requirement}
Policy Clause: ${finding.policyCondition}
Supporting Evidence Recorded: ${finding.supportingEvidence}
Document Name: ${finding.documentName}
Document Excerpt / Note: ${documentSnippet || finding.pageOrExcerpt}

Explain in 2-3 crisp bullet points:
1. What exact detail or verification is missing/ambiguous.
2. What specific document or endorsement should the patient request from the hospital or insurer to clear this gap.`;

  try {
    const result = await sendCovexcodeCompletion(
      prompt,
      'You are an expert TPA claim auditor explaining documentation discrepancies with actionable guidance.'
    );

    return {
      text: result.text,
      source: 'covexcode-deepseek',
      tokensUsed: result.usage?.total_tokens,
    };
  } catch (error: any) {
    console.warn('[Covexcode] Explain unclear failed, invoking deterministic fallback:', error?.message);
    const fallbackText = getDeterministicUnclearExplanation(finding);
    return {
      text: fallbackText,
      source: 'offline-fallback',
      error: error?.message || 'Covexcode API unreachable',
    };
  }
}

/**
 * Deterministic fallback generator for policy condition summaries
 */
function getDeterministicConditionSummary(condition: string, category?: string): string {
  const c = condition.toLowerCase();

  if (c.includes('room') && (c.includes('rent') || c.includes('1%') || c.includes('sub-limit'))) {
    return 'Room Rent Cap: Daily room charges must stay within the stated policy limit. Any excess room rate triggers proportional deductions across all associated medical expenses in the hospital bill.';
  }

  if (c.includes('waiting period') || c.includes('pre-existing') || c.includes('24 month') || c.includes('48 month')) {
    return 'Waiting Period Rule: Treatment for specified conditions (e.g., joint replacement, cataract, gallbladder) is covered only after the mandatory waiting period has concluded.';
  }

  if (c.includes('admission') || c.includes('inpatient') || c.includes('24 hour') || c.includes('bedside')) {
    return 'Hospitalization Requirement: The claim requires formal admission with minimum 24 hours inpatient stay, unless listed under approved daycare surgical procedures.';
  }

  if (c.includes('prescription') || c.includes('diagnostic') || c.includes('investigation')) {
    return 'Supporting Records Rule: Every claimed lab test, scan, and pharmacy expense must correspond to a signed prescription and official test report from the treating doctor.';
  }

  if (category === 'FINANCIAL' || c.includes('receipt') || c.includes('payment')) {
    return 'Payment Reconciliation Rule: All billed line items must be supported by numbered, stamped hospital receipts showing zero balance or exact settlement.';
  }

  return `Policy Guideline: ${condition}. Ensure all submitted medical records explicitly reference and substantiate this requirement before TPA filing.`;
}

/**
 * Deterministic fallback generator for unclear / conflicting findings
 */
function getDeterministicUnclearExplanation(finding: IntelligenceFinding): string {
  switch (finding.category) {
    case 'IDENTITY':
      return '• Patient Identity Verification: Patient name on hospital papers does not match primary policyholder records.\n• Recommended Solution: Attach family relation proof (Aadhaar or ration card) and the insurer policy schedule listing covered family dependents.';
    case 'HOSPITALIZATION':
      return '• Hospitalization Timeline: Admission and discharge timestamps are incomplete or ambiguous across submitted sheets.\n• Recommended Solution: Obtain a stamped Inpatient Admission & Discharge Certificate from the hospital medical records desk.';
    case 'FINANCIAL':
      return '• Billing Discrepancy: Total bill charges exceed documented payment receipts.\n• Recommended Solution: Collect the final detailed bill breakdown and numbered payment receipts showing zero pending balance.';
    case 'POLICY_LIMITS':
      return '• Sub-limit Assessment: Billed item charges appear to exceed the allowable clause limits.\n• Recommended Solution: Review tariff itemization or request a written breakdown from billing counter to mitigate proportional deductions.';
    case 'DOCUMENTATION':
    case 'MEDICAL_NECESSITY':
    default:
      return `• Missing Documentation: Evidence for '${finding.requirement}' could not be definitively verified in current uploads.\n• Recommended Solution: ${finding.recommendedAction || 'Upload original signed physician prescriptions and diagnostic reports.'}`;
  }
}
