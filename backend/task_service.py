import json
import os
from datetime import datetime
from typing import List, Dict, Any
from config import config
from ai_service import ai_service
from gmail_service import gmail_service
from calendar_service import calendar_service

class TaskService:
    def __init__(self):
        os.makedirs(config.CREDS_DIR, exist_ok=True)
    
    def execute_task(self, user_id: str, user_input: str) -> Dict[str, Any]:
        """Execute a natural language task using TaskLinx AI"""
        
        # Interpret the task using AI
        interpretation = ai_service.interpret_task(user_input)
        
        # Create task record
        task_record = {
            "id": f"task_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "timestamp": datetime.now().isoformat(),
            "user_input": user_input,
            "interpretation": interpretation,
            "result": None,
            "status": "processing"
        }
        
        # Execute based on action type
        if interpretation["action_type"] == "email":
            task_record["result"] = self._execute_email_task(user_id, interpretation["parameters"])
        elif interpretation["action_type"] == "calendar":
            task_record["result"] = self._execute_calendar_task(user_id, interpretation["parameters"])
        else:
            task_record["result"] = {
                "success": False,
                "error": f"Unknown action type: {interpretation['action_type']}"
            }
        
        # Update status
        task_record["status"] = "completed" if task_record["result"].get("success") else "failed"
        
        # Save task to history
        self._save_task_to_history(user_id, task_record)
        
        return task_record
    
    def _execute_email_task(self, user_id: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute an email task via Gmail API"""
        required_fields = ["recipient", "subject", "message"]
        
        # Check required fields
        missing_fields = [field for field in required_fields if not parameters.get(field)]
        if missing_fields:
            return {
                "success": False,
                "error": f"Missing required fields: {', '.join(missing_fields)}"
            }
        
        # Send email via Gmail
        return gmail_service.send_email(
            user_id=user_id,
            recipient=parameters["recipient"],
            subject=parameters["subject"],
            message=parameters["message"]
        )
    
    def _execute_calendar_task(self, user_id: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a calendar task via Google Calendar API"""
        required_fields = ["title"]
        
        # Check required fields
        missing_fields = [field for field in required_fields if not parameters.get(field)]
        if missing_fields:
            return {
                "success": False,
                "error": f"Missing required fields: {', '.join(missing_fields)}"
            }
        
        # Create calendar event
        return calendar_service.create_event(
            user_id=user_id,
            title=parameters["title"],
            start_time=parameters.get("start_time"),
            end_time=parameters.get("end_time"),
            description=parameters.get("description", "")
        )
    
    def _save_task_to_history(self, user_id: str, task_record: Dict[str, Any]):
        """Save task to user's history for TaskLinx dashboard"""
        history_data = {}
        if os.path.exists(config.TASKS_FILE):
            with open(config.TASKS_FILE, 'r') as f:
                history_data = json.load(f)
        
        if user_id not in history_data:
            history_data[user_id] = []
        
        history_data[user_id].append(task_record)
        
        # Keep only last 100 tasks per user
        history_data[user_id] = history_data[user_id][-100:]
        
        with open(config.TASKS_FILE, 'w') as f:
            json.dump(history_data, f, indent=2)
    
    def get_task_history(self, user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Get user's task history for TaskLinx dashboard"""
        if not os.path.exists(config.TASKS_FILE):
            return []
        
        with open(config.TASKS_FILE, 'r') as f:
            history_data = json.load(f)
        
        user_tasks = history_data.get(user_id, [])
        return user_tasks[-limit:][::-1]  # Return latest tasks first

task_service = TaskService() 