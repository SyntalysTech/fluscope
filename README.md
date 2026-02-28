# Fluscope

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![OpenAI](https://img.shields.io/badge/AI-GPT--4o--mini-fuchsia?logo=openai)](https://openai.com/)
[![Deployment: Vercel](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel)](https://vercel.com/)
[![Discord](https://img.shields.io/badge/Discord-Join%20Us-7289DA?logo=discord)](https://discord.gg/atQEZvhwfy)

**Fluscope** is a structural validation workspace for product teams. Map out user flows and automatically detect logical gaps, edge cases, and missing states before writing a single line of code.

[**🌐 Live Demo**](https://fluscope.vercel.app)

---

## The Mission
**Logic-first design.** Fluscope shifts the focus from pixels to the "if-then" of your product, ensuring the skeleton of your user experience is solid. No more discovering missing password recovery or no-logout paths during development.

---

<p align="center">
  <img src="https://raw.githubusercontent.com/SyntalysTech/fluscope/main/public/logos/logo-horizontal-text-alone-1600x400.png" width="800" alt="Fluscope Banner" />
</p>

---

## Key Features

### Smart Builder (AI-Powered)
Zero-to-flow in seconds. Simply describe your user flow in plain language (e.g., *"Create a subscription flow with Stripe and an email confirmation"*), and Fluscope's AI agent will generate the full logic graph for you.

### Dual-Layer Audit Engine
Fluscope doesn't just draw flows; it validates them.
- **Layer 1: Deterministic Rules**: Instant check for unreachable nodes, dead ends, and graph connectivity issues (< 10ms).
- **Layer 2: AI Deep Audit**: A semantic audit using GPT-4o-mini that analyzes your flow from three expert perspectives: *System Architect*, *UX Researcher*, and *Security Lead*.

### Laser Presentation Mode
Built for meetings. Use the interactive Laser Mode to guide your team's eyes during demos without messy annotations.

### Privacy-First / Zero Backend
- **Zero Telemetry**: Your data stays in your browser.
- **Local Persistence**: Auto-saves every change to `localStorage`.
- **JSON Portability**: Import/Export your flows as structured JSON files for backup or sharing.

---

## Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Logic Engine**: Custom Deterministic Graph Validator
- **AI**: OpenAI GPT-4o-mini (for Smart Builder & AI Audits)
- **Deployment**: Vercel

---

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SyntalysTech/fluscope.git
   cd fluscope
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## License

Built for product teams by **Syntalys**. Distributed under the MIT License.

---

<p align="center">
  <img src="https://raw.githubusercontent.com/SyntalysTech/fluscope/main/public/logos/logo-isotope-1024x1024.png" width="40" height="40" alt="Fluscope Logo" />
  <br/>
  <b>Fluscope</b> — Stop shipping broken flows. Start auditing.
  <br/>
  <a href="https://discord.gg/atQEZvhwfy">Join our Discord Community</a>
</p>
