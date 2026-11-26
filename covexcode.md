# 🛡️ ClaimReady + Covexcode AI Integration

An explainable, AI-assisted health insurance claim readiness evaluation platform for micro-insurance policyholders, gig workers, and first-time claimants.

---

## 🤖 What is Covexcode?

**Covexcode** is an AI inference gateway (`https://llm.covexcode.com/event/v1`) that provides fast LLM event completions. In ClaimReady, it serves as the intelligence layer powered by **`deepseek-v4-flash`**.

### Configuration

| Variable | Value | Description |
| :--- | :--- | :--- |
| `COVEXCODE_ENDPOINT` | `https://llm.covexcode.com/event/v1` | LLM event endpoint |
| `COVEXCODE_MODEL` | `deepseek-v4-flash` | Ultra-fast completion & reasoning model |
| `COVEXCODE_API_KEY` | `api_key` | Authentication Bearer token |

---

## 💡 Why We Are Using Covexcode

Health insurance documentation in India is complex, jargon-heavy, and difficult for non-experts to decipher:
- Policies contain hidden restrictions (room rent 1% caps, proportionate deductions, waiting periods, ICU limits).
- Medical papers often have discrepancies (e.g. discharge summary timestamp vs. billing receipt date).
- Claimants frequently face claim deductions or outright repudiations from TPAs simply because they did not know what was ambiguous or missing beforehand.

While ClaimReady provides a **deterministic rule engine** to extract and match data, human claimants need **plain-language translation and actionable guidance**. 

Covexcode (`deepseek-v4-flash`) was integrated to solve these exact gaps:

1. **Plain-English Policy Clause Translation:**
   Translates dense legal conditions (e.g. clause 3.1 room rent caps) into 1–2 simple sentences explaining the real-world financial implications (e.g. *"If your room rate exceeds ₹1,500/day, proportionate deductions will reduce doctor fees, surgery charges, and nursing costs"*).

2. **Root-Cause Discrepancy Diagnostics:**
   When a claim check is flagged as `UNCLEAR`, `CONFLICT`, or `NOT_FOUND`, Covexcode analyzes the exact document text snippet and pinpoints:
   - What specific detail or stamp is missing or conflicting.
   - The exact document, hospital seal, or clarification letter the patient must request from the hospital desk before submitting to the TPA.

3. **Sub-second Response Times:**
   `deepseek-v4-flash` delivers ultra-low latency completions, enabling real-time interactive AI assistance inside the client browser.

4. **Guaranteed Reliability (Zero-Downtime Offline Fallback):**
   If network requests fail, timeouts occur, or tokens run out, the service automatically switches to domain-grounded offline rules. ClaimReady never crashes or shows empty screens.

---

## 🛠️ How We Integrated and Used Covexcode

```
                         [User Uploads Policy & Medical Papers]
                                           │
                                           ▼
                       [Evidence-to-Policy Intelligence Engine]
                         (Deterministic Clause & Evidence Check)
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
                [Clean Matches]                       [Unclear / Conflict]
                        │                                     │
                        │                                     ▼
                        │                         [Covexcode Service Layer]
                        │                         (deepseek-v4-flash)
                        │                                     │
                        │                     ┌───────────────┴───────────────┐
                        │                     ▼                               ▼
                        │             [Online API Success]           [Network / Rate Limit]
                        │                     │                               │
                        │                     ▼                               ▼
                        │             DeepSeek Reasoning             Deterministic Rules
                        │             & Remediation Steps            Offline Fallback
                        │                     │                               │
                        └─────────────────────┬───────────────────────────────┘
                                              ▼
                             [Engine Analysis View in ClaimWizard]
                             - Interactive "AI Clarify" button
                             - Batch "Covexcode DeepSeek Pass"
                             - Explainable source links & badges
```

### Key Modules:
- **`src/services/covexcodeService.ts`**:
  - `sendCovexcodeCompletion()`: Core HTTP client with `AbortController` timeout (15s), HTTP 429 quota handling, and error trapping.
  - `summarizePolicyCondition()`: Summarizes complex clauses into claimant-friendly language.
  - `explainUnclearEntry()`: Provides structured root-cause diagnostics and remediation steps for ambiguous evidence.
  - Pre-computed deterministic offline fallback for 100% availability.
- **`src/services/intelligenceEngine.ts`**:
  - `enhanceFindingWithAI()` & `enrichFindingsWithCovexcode()`: Injects AI policy summaries and discrepancy diagnostics directly into the engine's findings.
- **`src/components/ClaimWizard/EngineAnalysisView.tsx`**:
  - Interactive **"AI Clarify"** button per finding card.
  - Global **"Covexcode DeepSeek Pass"** button to batch-analyze the full claim dossier.
  - Visual badges displaying `deepseek-v4-flash` vs. `offline rules`.

---

## 🚀 Getting Started

### 1. Installation & Environment Setup
Clone the repository and install dependencies:

```bash
cd ClaimReady
npm install
```

Verify that `.env` exists in `ClaimReady/`:
```env
COVEXCODE_ENDPOINT=https://llm.covexcode.com/event/v1
COVEXCODE_MODEL=deepseek-v4-flash
COVEXCODE_API_KEY=api_key
```

*(Note: `.env` is automatically ignored in `.gitignore` to prevent secret leakage).*

### 2. Run the Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Test Covexcode in Action
1. Click **"Inspect This Sample Case"** on the landing page to load pre-filled claim records.
2. Advance to **Step 4: Engine Analysis**.
3. Click **"AI Clarify"** on any finding card or **"Covexcode DeepSeek Pass"** in the top bar to see DeepSeek explain policy conditions and unclear records in real-time.
