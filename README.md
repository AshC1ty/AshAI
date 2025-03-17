# Ash AI

Ash AI is an AI-powered assistant designed to utilize the Gemini and Sarvam APIs so the AI can understand and interact in 10 different Indian languages, making it accessible to a diverse user base.

## Features
- AI assistant capable of understanding and responding in 10 Indian languages.
- Integration with Gemini API for advanced natural language processing.
- Integration with Sarvam API for multilingual support.
- User-friendly interface for seamless interaction.

## Setup

### Prerequisites
- Node.js
- npm

### Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/AshC1ty/AshAI.git
    cd AshAI
    ```

2. Install dependencies in both the client and backend folders:
    ```sh
    npm install -f
    ```

3. Create a `.env` file in the both directories and add your API keys:
    ```sh
    touch .env
    ```

4. Add the following lines to the backend `.env` file:
    ```env
    IMAGE_KIT_ENDPOINT=your_api_key
    IMAGE_KIT_PUBLIC_KEY=your_api_key
    IMAGE_KIT_PRIVATE_KEY=your_api_key
    CLIENT_URL=http://localhost:5173
    MONGO = =your_api_key
    CLERK_PUBLISHABLE_KEY=your_api_key
    CLERK_SECRET_KEY=your_api_key
    ```

5. Add the following to the client folder `.env` file:
    ```env
    VITE_CLERK_PUBLISHABLE_KEY=your_api_key
    VITE_IMAGE_KIT_ENDPOINT=your_api_key
    VITE_IMAGE_KIT_PUBLIC_KEY=your_api_key
    VITE_GEMINI_PUBLIC_KEY=your_api_key
    VITE_API_URL = http://localhost:3000
    VITE_SARVAM_API =your_api_key

6. Start the application on the backend:
    ```sh
    npm start
    ```

7. Start the application on the client:
    ```sh
    npm run dev
    ```

## Usage
- You can login using google, microsoft and apple IDs
- Your previous chats will be remembered
- Interact with the AI assistant through the provided interface.
- The assistant will understand and respond in the same language you speak with it.
- If you type the prompt, it will not speak back.
- You can upload images that can be used as context for asking questions
