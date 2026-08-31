# FlashLoom

FlashLoom is a web application that follows the **Software as a Service (SaaS)** model, allowing users to summarize and test their understanding of anything by generating flashcards using AI from different input sources:

- Text prompts
- YouTube URLs (extracting key points from videos)
- PDF files (summarising content from files)

Deployed on **Vercel**: https://flash-loom.vercel.app/. It is a **cloud-based SaaS platform**, so users can access it from any device without installing software. There is a **free trial**, after which users can subscribe to a paid plan.

## Features

- **AI-Powered Flashcard Generation**: Tell us what you want and let AI do the rest.
- **Multiple Input Sources**: Enter a prompt, provide a YouTube URL, or upload a PDF.
- **User-Friendly Interface**: Easily manage and review generated flashcards from any device, at any time.

## Subscription

- **Free Trial**: 3 flashcard generations.
- **Basic**: Unlimited flashcard generations.
- **Pro**: Still in development
  - **Analytics Dashboard**: track study progress
  - **Integration with other learning platforms**: import/export study materials

## Tech stack

- **App**: Next.js (App Router) + React, styled with Tailwind on a token-based design system
- **Auth**: Clerk
- **Database**: Firestore (accessed server-side via the Firebase Admin SDK)
- **Payments**: Stripe
- **Flashcard generation**:
  - **Inngest**: runs the generation pipeline as a durable background function (queue, retries, observability)
  - **Google Gemini**: the LLM
  - **Pinecone**: vector store with integrated embeddings + reranking, for RAG on PDF/YouTube content
  - **Supadata**: YouTube transcript retrieval

## Local development

### Prerequisites

- Node.js 20+
- Accounts / keys for: Clerk, Stripe, a Firebase project (with a service account), Google AI Studio (Gemini), Pinecone

### Setup

```bash
npm install
```

Create `.env.local` in the project root:

```bash
# Firebase Admin service account
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...

# Generation
GOOGLE_API_KEY=...
GEMINI_MODEL=gemini-3.5-flash-lite
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=flashloom
SUPADATA_API_KEY=...   # YouTube transcripts (supadata.ai)

# Inngest: local only
INNGEST_DEV=1
```

### Run

Two processes:

```bash
# 1. the app
npm run dev                                                # http://localhost:3000

# 2. the Inngest dev server (discovers the app at /api/inngest)
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest   # http://localhost:8288
```

Flashcard generation only runs while the Inngest dev server is up. Its dashboard (`:8288`) shows every run and lets you replay failures.

## Deployment

Hosted on Vercel at https://flash-loom.vercel.app/, with the Next.js app at the repository root. Background generation runs on Inngest, synced to the deployed `/api/inngest` endpoint. Secrets for Firebase, Clerk, Stripe, Gemini, Pinecone, and Inngest are held as environment variables in the Vercel and Inngest dashboards.
