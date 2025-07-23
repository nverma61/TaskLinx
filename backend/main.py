from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
import uvicorn

from config import config
from auth import auth_service
from task_service import task_service

app = FastAPI(
    title="TaskLinx API", 
    version="1.0.0",
    description="AI-powered task automation platform for emails and calendar events"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Pydantic models
class TaskRequest(BaseModel):
    task: str

class AuthCallbackRequest(BaseModel):
    code: str

class TaskResponse(BaseModel):
    success: bool
    task_id: Optional[str] = None
    result: dict
    interpretation: dict

class HistoryResponse(BaseModel):
    tasks: List[dict]

# Dependency to get current user
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    return auth_service.verify_token(token)

# Routes
@app.get("/")
async def root():
    return {
        "message": "TaskLinx API - AI-powered task automation", 
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/auth/login")
async def login():
    """Get Google OAuth2 authorization URL for TaskLinx"""
    try:
        auth_url = auth_service.get_authorization_url()
        return {"auth_url": auth_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication error: {str(e)}")

@app.post("/auth/callback")
async def auth_callback(request: AuthCallbackRequest):
    """Handle OAuth2 callback and exchange code for TaskLinx tokens"""
    try:
        result = auth_service.exchange_code_for_tokens(request.code)
        return {
            "access_token": result["access_token"],
            "user_info": result["user_info"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Authentication failed: {str(e)}")

@app.post("/tasks/execute", response_model=TaskResponse)
async def execute_task(request: TaskRequest, user_id: str = Depends(get_current_user)):
    """Execute a natural language task using TaskLinx AI"""
    try:
        result = task_service.execute_task(user_id, request.task)
        return TaskResponse(
            success=result["result"]["success"],
            task_id=result["id"],
            result=result["result"],
            interpretation=result["interpretation"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Task execution failed: {str(e)}")

@app.get("/tasks/history", response_model=HistoryResponse)
async def get_task_history(limit: int = 20, user_id: str = Depends(get_current_user)):
    """Get user's task history from TaskLinx"""
    try:
        tasks = task_service.get_task_history(user_id, limit)
        return HistoryResponse(tasks=tasks)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve history: {str(e)}")

@app.get("/user/profile")
async def get_user_profile(user_id: str = Depends(get_current_user)):
    """Get current user profile in TaskLinx"""
    try:
        credentials = auth_service.get_user_credentials(user_id)
        if not credentials:
            raise HTTPException(status_code=401, detail="User not authenticated")
        
        return {"user_id": user_id, "authenticated": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get profile: {str(e)}")

if __name__ == "__main__":
    print("🚀 Starting TaskLinx API Server...")
    print("📧 Gmail integration: Ready")
    print("📅 Calendar integration: Ready")
    print("🧠 AI processing: Ready")
    print("🔗 Server: http://localhost:8000")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 