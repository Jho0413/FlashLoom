# FlashLoom

FlashLoom is a web application that follows the **Software as a Service (Saas)** model, allowing users to summarize and test their understanding on anything by generating flashcards using AI from different input sources:
- Text prompts
- YouTube URLS (extracting key points from videos)
- PDF files (summarising content from files)

This web application has been deployed using **Vercel** and can be accessed here: https://flash-loom.vercel.app/. The Flask application has been deployed using **Heroku**.
Since it is a **cloud-based SaaS platform**, users can access it from any device without needing to install software. The platform offers a **free trial**, after which users can subscribe to a paid plan to continue using the service.

## Features

- **AI-Powered Flashcard Generation**: Tell us what you want and let AI do the rest.
- **Multiple Input Sources**: Enter a prompt, provide a YouTube URL, or upload a PDF.
- **User-Friendly Interface**: Easily manage and review generated flashcards from any device, at anytime.

## Subscription

- **Free Trial**: 3 flashcard generations.
- **Basic**: Unlocks unlimited flashcard generations.
- **Pro**: Features are still in development
  - **Analytics Dashboard**: allows users to track their study progress
  - **Integration with Other Learning Platforms**: allow users to import or export their study materials seamlessly

## Technologies Used

- **Frontend**: NextJS, React
- **Backend**:
  - NextJS (subscription and user management)
  - Flask (generating flashcards)
  - Celery + Redis (background task queue — task broker + result storage)
- **Database**: Firebase
- **Session management and authentication**: Clerk
- **Payments**: Stripe
