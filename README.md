# 🚀 TaskLinx - AI-Powered Task Automation Platform

**Transform your natural language into powerful automations for emails and calendar events using OpenAI GPT-4 and Google APIs.**


## ✨ Features

🧠 **AI-Powered Interpretation**: Uses OpenAI GPT-4 to understand natural language commands  
📧 **Gmail Integration**: Send emails automatically based on conversational prompts  
📅 **Google Calendar**: Create and manage calendar events through natural language  
🔐 **Secure Authentication**: Google OAuth2 with proper scope management  
📱 **Modern Interface**: Beautiful React UI with real-time feedback and results  
📊 **Task History**: Complete tracking and analytics of all executed tasks  
⚡ **Real-time Processing**: Instant AI interpretation with confidence scoring  

## 🎯 Example Commands

```text
"Email Alice to reschedule our meeting to tomorrow at 3 PM"
"Create a calendar event for team sync tomorrow at 2 PM"  
"Send a follow-up email to John about the project status"
"Schedule a call with the marketing team for Friday at 10 AM"
"Email the client about the proposal deadline next week"
```

## 🛠 Tech Stack

### Backend (Python)
- **FastAPI**: High-performance API framework
- **OpenAI GPT-4**: Natural language processing
- **Google APIs**: Gmail & Calendar integration
- **OAuth2 + JWT**: Secure authentication
- **File-based Storage**: MVP token and task storage

### Frontend (React)
- **React 18**: Modern UI framework with TypeScript
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **Lucide Icons**: Beautiful, consistent iconography

## 📁 Project Structure

```
TaskLinx/
├── backend/                 # FastAPI Python Application
│   ├── main.py             # FastAPI app entry point
│   ├── config.py           # Configuration management
│   ├── auth.py             # Google OAuth2 service
│   ├── ai_service.py       # OpenAI GPT-4 integration
│   ├── gmail_service.py    # Gmail API service
│   ├── calendar_service.py # Google Calendar API service
│   ├── task_service.py     # Task execution & history
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Environment variables (configured)
│   └── env_template.txt    # Environment template
├── frontend/               # React TypeScript Application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── LoginButton.tsx
│   │   │   ├── TaskInput.tsx
│   │   │   ├── TaskResult.tsx
│   │   │   ├── TaskHistory.tsx
│   │   │   └── AuthCallback.tsx
│   │   ├── contexts/       # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── services/       # API communication
│   │   │   └── api.ts
│   │   ├── types.ts        # TypeScript definitions
│   │   ├── config.ts       # Frontend configuration
│   │   └── App.tsx         # Main application
│   ├── package.json        # Dependencies
│   ├── tailwind.config.js  # Tailwind configuration
│   └── tsconfig.json       # TypeScript configuration
├── creds/                  # Token storage (auto-created)
├── start.sh               # Quick start script
└── README.md              # This file
```

**Start TaskLinx**: `./start.sh` or follow the manual steps above.

---

*Built with ❤️ using OpenAI GPT-4, Google APIs, FastAPI, and React* 
