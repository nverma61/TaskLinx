# 🚀 TaskLinx - AI-Powered Task Automation Platform

**Transform your natural language into powerful automations for emails and calendar events using OpenAI GPT-4 and Google APIs.**

[![AI Powered](https://img.shields.io/badge/AI-GPT--4-purple)](https://openai.com)

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

## 🚀 Quick Start

### Prerequisites ✅
- Python 3.8+
- Node.js 16+
- Google Cloud Console account
- OpenAI API account with GPT-4 access

### 1. API Credentials (Already Configured!) 🎉

✅ **Google OAuth2**: Already set up with your credentials  
✅ **OpenAI API**: Configured with your GPT-4 key  
✅ **JWT Secret**: Generated and secured  

### 2. Start the Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The backend will start on **http://localhost:8000**

### 3. Start the Frontend

```bash
cd frontend
npm install
npm start
```

The frontend will open at **http://localhost:3000**

### 4. Quick Start Script

```bash
./start.sh
```

This will check dependencies and start both backend and frontend automatically.

## 📱 Using TaskLinx

### Step 1: Authentication
1. Click "Sign in with Google" 
2. Authorize TaskLinx to access Gmail and Calendar
3. You'll be redirected to the main dashboard

### Step 2: Execute Tasks
1. Type your task in natural language
2. TaskLinx AI will interpret your intent
3. View real-time results and AI confidence scores
4. Check your email/calendar for the completed action

### Step 3: Track History
- View all completed tasks in the sidebar
- See AI interpretation details
- Monitor success rates and confidence scores

## 🔧 API Endpoints

### Authentication
- `GET /auth/login` - Get Google OAuth2 URL
- `POST /auth/callback` - Exchange code for tokens

### Task Execution  
- `POST /tasks/execute` - Execute natural language task
- `GET /tasks/history` - Get user task history

### User Management
- `GET /user/profile` - Get current user info

## 🎨 TaskLinx AI Features

### Natural Language Processing
- **Context Understanding**: Interprets complex task requests
- **Parameter Extraction**: Automatically extracts recipients, times, subjects
- **Confidence Scoring**: Provides reliability metrics for each interpretation
- **Error Handling**: Graceful fallbacks for ambiguous requests

### Email Automation
- **Smart Composition**: Generates appropriate email content
- **Recipient Resolution**: Handles names and email addresses
- **Subject Generation**: Creates relevant subject lines
- **Professional Tone**: Maintains business-appropriate communication

### Calendar Intelligence  
- **Time Parsing**: Understands relative dates ("tomorrow", "next Friday")
- **Duration Inference**: Automatically sets appropriate meeting lengths
- **Conflict Awareness**: Basic scheduling intelligence
- **Event Descriptions**: Generates relevant event details

## 🔐 Security & Privacy

- **OAuth2 Flow**: Secure Google authentication
- **Scope Limitation**: Only requests necessary permissions
- **Token Encryption**: JWT-based session management
- **Data Isolation**: User data separated by user ID
- **No Data Storage**: TaskLinx doesn't store email/calendar content

## 🔍 Configuration Details

### Environment Variables
```bash
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
```

### Google Cloud Console Setup
- **Project**: TaskLinx AI Automation
- **APIs Enabled**: Gmail API, Google Calendar API, Google+ API
- **OAuth Consent**: External, Testing Mode
- **Redirect URI**: `http://localhost:3000/auth/callback`

## 🚀 Deployment

### Production Checklist
- [ ] Update OAuth redirect URIs for production domain
- [ ] Configure CORS for production frontend URL
- [ ] Use proper database instead of file storage
- [ ] Set up environment variable management
- [ ] Configure HTTPS and security headers
- [ ] Set up monitoring and logging

### Suggested Platforms
- **Backend**: Heroku, Railway, DigitalOcean, AWS
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: PostgreSQL, MongoDB, Firebase

## 🐛 Troubleshooting

### Common Issues

**Authentication Fails**
- Check Google OAuth credentials
- Verify redirect URI matches exactly
- Ensure APIs are enabled in Google Cloud Console

**OpenAI Errors**  
- Verify API key is correct
- Check GPT-4 access permissions
- Monitor API usage limits

**CORS Issues**
- Check FRONTEND_URL in backend config
- Verify both servers are running

### Debug Mode
```bash
# Backend logs
cd backend && python main.py

# Frontend console
Open browser dev tools → Console tab
```

## 📈 Performance & Limits

- **OpenAI Rate Limits**: Respects GPT-4 API limitations
- **Google API Quotas**: Efficient API usage patterns
- **Task History**: Stores last 100 tasks per user
- **Session Duration**: 24-hour JWT tokens

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with your own API keys
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Success! 

**TaskLinx is now fully configured and ready to use!**

- ✅ Backend and frontend servers ready
- ✅ Google OAuth2 configured
- ✅ OpenAI GPT-4 integrated
- ✅ Gmail & Calendar APIs ready

**Start TaskLinx**: `./start.sh` or follow the manual steps above.

---

*Built with ❤️ using OpenAI GPT-4, Google APIs, FastAPI, and React* 