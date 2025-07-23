#!/bin/bash

# TaskLinx - AI Task Automation Platform
echo "🚀 Starting TaskLinx - AI Task Automation Platform..."

# Check if .env file exists
if [ ! -f backend/.env ]; then
    echo "❌ No .env file found. Please create backend/.env with your credentials:"
    echo "   cp backend/env_template.txt backend/.env"
    echo "   Then edit backend/.env with your API keys"
    exit 1
fi

echo "✅ Environment configuration found"
echo ""
echo "🎉 TaskLinx Platform Ready!"
echo ""
echo "📱 Frontend (React): http://localhost:3000"
echo "🔧 Backend API (FastAPI): http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "🔐 Features Ready:"
echo "   ✅ Google OAuth2 Authentication"
echo "   ✅ OpenAI GPT-4 Integration"
echo "   ✅ Gmail API (Send emails)"
echo "   ✅ Google Calendar API (Create events)"
echo "   ✅ Real-time task execution"
echo "   ✅ Task history tracking"
echo ""
echo "To start TaskLinx:"
echo "1. Backend:  cd backend && python main.py"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "💡 Example commands to try:"
echo '   "Email John about the meeting tomorrow"'
echo '   "Schedule team sync for Friday at 2 PM"'
echo '   "Send follow-up email to the client"'
echo ""
echo "🎯 TaskLinx is ready to automate your tasks!" 