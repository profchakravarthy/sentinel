# Sentinel - Personal Web Monitor

Sentinel is a secure, AI-powered application designed to help individuals monitor their digital footprint. By leveraging the **Google Gemini API** with **Live Search Grounding**, Sentinel performs real-time scans of the open web to identify public mentions, assess privacy risks, and provide actionable insights without hallucinations.

![Sentinel Dashboard](https://via.placeholder.com/1200x600?text=Sentinel+Dashboard+Preview)

## 🚀 Features

*   **AI-Powered Analysis**: Uses `gemini-2.5-flash` to analyze your professional profile and assess privacy risks.
*   **Live Web Search**: Utilizes Gemini's `googleSearch` tool to perform real, grounded searches for your name, location, and specific keywords.
*   **Hallucination-Free**: Unlike standard LLM queries, Sentinel retrieves specific, verifiable URLs and snippets from the live web.
*   **Sentiment Analysis**: Automatically categorizes mentions as Positive, Negative, or Neutral.
*   **Prominence Tracking**: Visualizes your digital presence over time.
*   **Keyword Monitoring**: Track specific handles, project names, or usernames alongside your real identity.
*   **Privacy Score**: quantitative assessment of your digital exposure risk (0-100).

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **AI & Data**: Google GenAI SDK (`@google/genai`)
*   **Visualization**: Recharts
*   **Icons**: Lucide React

## 📋 Prerequisites

Before running the application, you need:

1.  **Node.js** (v18 or higher recommended)
2.  A **Google AI Studio API Key** with access to Gemini 2.5 models.
    *   Get your key here: [Google AI Studio](https://aistudio.google.com/)

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/sentinel-web-monitor.git
    cd sentinel-web-monitor
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory of the project.
    ```bash
    touch .env
    ```

    Add your Google Gemini API key to the file:
    ```env
    API_KEY=your_actual_api_key_here
    ```

    > **Security Note**: Never commit your `.env` file to version control.

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

5.  **Open the App**
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

## 📖 Usage Guide

1.  **Onboarding**: Enter your Name, Location, Occupation, and upload a photo.
2.  **Keywords**: (Optional) Add specific terms like your Twitter handle, GitHub username, or specific project names to refine the search.
3.  **Dashboard**:
    *   **Health Score**: Your overall privacy rating.
    *   **Risk Alerts**: Specific vulnerabilities based on your profession and location.
    *   **Mentions Feed**: A list of real web pages containing your information.
4.  **Search Again**: Use the search button in the "Digital Facets" section to trigger a fresh web scan at any time.

## 🛡️ Privacy & Security

*   **Client-Side Operations**: Sentinel runs primarily in the browser.
*   **Secure API Usage**: Your API key is accessed via `process.env` and requests are made securely to Google's servers.
*   **No Data Retention**: Your personal profile data is stored in the application state and is wiped upon refresh/logout. It is not saved to any external database by this application.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
