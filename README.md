# 🛡️ CLAIMREADY — Micro-Insurance Claim Settlement Assistance

<div align="center">

[![Microsoft Hackathon](https://img.shields.io/badge/Microsoft%20Hackathon-Micro--Insurance%20Track-0078D4?style=for-the-badge&logo=microsoft)](https://github.com/SiyaChaudhary1107/claimready)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Website-2ea44f?style=for-the-badge&logo=github)](https://siyachaudhary1107.github.io/claimready/)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Client--Side-10B981?style=for-the-badge&logo=shield)](https://github.com/SiyaChaudhary1107/claimready)

**Your insurance claim, understood, checked and prepared.**

*A multilingual health-insurance claim preparation platform designed for gig workers, rural families, low-income households, and first-time policyholders.*

</div>

---

> **Responsible AI Principle:** CLAIMREADY is an independent preparation assistant. It **never promises claim approval, does not make coverage decisions, and does not replace official insurance company or TPA underwriting**. Every finding is 100% explainable, traceable, and grounded in source documents.

---

## 🌟 1. Problem & Product Vision

### The Problem
Over **68% of first-time health insurance claimants and gig workers** experience claim rejections, deduction shocks, or multi-week query delays—not because they lack coverage, but due to:
1. **Hidden Policy Sub-Limits:** Room rent caps (e.g., 1% of Sum Insured = ₹1,500/day), ICU limits (2%), and waiting periods buried in 30-page documents with fine print.
2. **Unorganized Hospital Records:** Discharge summaries and final bills with date mismatches (e.g. evening discharge vs next-morning cashier clearance).
3. **Illegible Prescriptions:** Cursive handwritten doctor notes leading to pharmacy bill rejections.
4. **Zero Pre-Submission Guidance:** No way to know if required diagnostic reports (like Ultrasound films) are missing before filing.

### The Solution: CLAIMREADY
CLAIMREADY acts as a **smart pre-submission audit layer** running completely inside the user's browser:
- 📄 Extracts and analyzes policy limits and exclusions from PDF schedules.
- 🏥 Scans and classifies medical records (bills, discharge summaries, prescriptions, receipts) via PDF.js and Tesseract.js OCR.
- ⚙️ Runs the **Evidence-to-Policy Intelligence Engine** to cross-examine evidence against policy conditions.
- 📊 Outputs an official, downloadable **Claim Readiness Dossier (PDF)** with a TPA submission checklist.
- 🗣️ Provides full support in **4 Languages**: English, Hindi (हिंदी), Punjabi (ਪੰਜਾਬੀ), and Bengali (বাংলা).

---

## 🚀 2. The Core Innovation: Evidence-to-Policy Intelligence Engine

Unlike generic conversational AI wrappers that hallucinate rules, CLAIMREADY uses a **deterministic, rule-based cross-verification engine**. Every finding is categorized into one of **four distinct statuses**:

| Status | Meaning | Real Case Example |
| :--- | :--- | :--- |
| 🟢 **`EVIDENCE FOUND`** | Direct documentary support identified in bills or discharge summary matching the policy clause. | Patient identity matches insured dependent; 77-hr inpatient stay verified; ₹57,100 billed = ₹57,100 receipts paid. |
| ⚪ **`NOT FOUND`** | Mandatory document referenced in records is missing from the batch. | Discharge summary mentions an *Ultrasound Abdomen* done on 12-Oct, but the standalone film/report was not uploaded. |
| 🟡 **`UNCLEAR`** | Ambiguity requiring human review or doctor certification. | 24-month waiting period has 2.5 months left, but acute sepsis emergency is cited; prescription contains cursive handwriting. |
| 🔴 **`CONFLICT`** | Objective data inconsistency or sub-limit breach. | Hospital billed ₹2,200/day vs ₹1,500/day cap (₹2,100 excess); Discharge date 15-Oct vs Receipt date 16-Oct. |

> **Neutral Tone:** Date mismatches are flagged as *inconsistencies for hospital billing clarification*, **never accused as fraud**. Missing items are never treated as automatic grounds for claim rejection.

---

## ⚖️ 3. Feature Comparison: CLAIMREADY vs Generic AI

| Feature | Generic Chatbots (ChatGPT / Claude) | CLAIMREADY |
| :--- | :--- | :--- |
| **Privacy & DPDP Compliance** | ❌ Transmits patient medical bills to cloud servers | ✅ **100% Client-Side WebAssembly (Zero server data transmission)** |
| **Policy Clause Accuracy** | ⚠️ Prone to hallucinating coverage terms | ✅ **Deterministic extraction with exact page citations** |
| **Document Classification** | ❌ Requires manual user tagging | ✅ **Auto-classifies Bills, Discharge Cards, Rx, and Receipts** |
| **Handwriting Handling** | ⚠️ Guesses or invents illegible text | ✅ **Flags cursive handwriting as `UNCLEAR` with manual review note** |
| **Explainability** | ❌ Black-box output | ✅ **1-Click Source Inspector showing exact document excerpt** |
| **Official PDF Dossier** | ❌ Plain text chat response | ✅ **Generates publication-quality PDF report with TPA checklist** |
| **Vernacular Access** | ⚠️ English-dominated terminology | ✅ **Complete UI & Engine in English, Hindi, Punjabi, Bengali** |

---

## 💻 4. Running the Application Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the local server
npm run dev
```

Open **`http://localhost:5173`** in your browser.

To test the production build:
```bash
npm run build
npm run preview
```

---

## 📁 5. Project Structure
