import json
from typing import Dict, Any
from openai import OpenAI
from config import config

class AIService:
    def __init__(self):
        self.client = OpenAI(api_key=config.OPENAI_API_KEY)
        
    def interpret_task(self, user_input: str) -> Dict[str, Any]:
        """Use OpenAI to interpret user task and extract parameters"""
        
        system_prompt = """You are TaskLinx, an AI assistant that interprets natural language tasks for email and calendar operations.

Given a user's natural language input, determine:
1. The action type: "email" or "calendar" 
2. Extract relevant parameters for the action

For EMAIL tasks, extract:
- recipient: email address or name
- subject: email subject line
- message: email body content

For CALENDAR tasks, extract:
- title: event title
- start_time: start date/time (convert to ISO format if possible)
- end_time: end date/time (convert to ISO format if possible, default to 1 hour after start)
- description: optional event description

Respond with a JSON object containing:
{
  "action_type": "email" or "calendar",
  "parameters": {
    // extracted parameters based on action type
  },
  "confidence": number between 0-1,
  "reasoning": "brief explanation of interpretation"
}

Examples:
Input: "Email Alice to reschedule our meeting to tomorrow at 3 PM"
Output: {
  "action_type": "email",
  "parameters": {
    "recipient": "Alice",
    "subject": "Meeting Reschedule",
    "message": "Hi Alice, I'd like to reschedule our meeting to tomorrow at 3 PM. Please let me know if this works for you."
  },
  "confidence": 0.9,
  "reasoning": "Clear email intent with recipient and rescheduling context"
}

Input: "Create a calendar event for team sync tomorrow at 2 PM"
Output: {
  "action_type": "calendar",
  "parameters": {
    "title": "Team Sync",
    "start_time": "2024-01-20T14:00:00",
    "end_time": "2024-01-20T15:00:00",
    "description": "Team synchronization meeting"
  },
  "confidence": 0.95,
  "reasoning": "Clear calendar event creation request with specific time"
}"""

        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_input}
                ],
                temperature=0.1,
                max_tokens=500
            )
            
            response_content = response.choices[0].message.content
            
            # Parse JSON response
            try:
                parsed_response = json.loads(response_content)
                return parsed_response
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                return {
                    "action_type": "unknown",
                    "parameters": {},
                    "confidence": 0.0,
                    "reasoning": "Failed to parse AI response",
                    "raw_response": response_content
                }
                
        except Exception as e:
            return {
                "action_type": "error",
                "parameters": {},
                "confidence": 0.0,
                "reasoning": f"OpenAI API error: {str(e)}"
            }

ai_service = AIService() 