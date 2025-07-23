from datetime import datetime, timedelta
from typing import Dict, Any
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from auth import auth_service

class CalendarService:
    def __init__(self):
        pass
    
    def create_event(self, user_id: str, title: str, start_time: str, end_time: str = None, description: str = "") -> Dict[str, Any]:
        """Create a calendar event using Google Calendar API"""
        try:
            # Get user credentials
            credentials = auth_service.get_user_credentials(user_id)
            if not credentials:
                return {
                    "success": False,
                    "error": "User credentials not found. Please re-authenticate."
                }
            
            # Build Calendar service
            service = build('calendar', 'v3', credentials=credentials)
            
            # Parse start time
            try:
                if isinstance(start_time, str):
                    if 'T' in start_time:
                        start_dt = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
                    else:
                        start_dt = datetime.strptime(start_time, '%Y-%m-%d %H:%M:%S')
                else:
                    start_dt = start_time
            except:
                # Fallback: tomorrow at 2 PM
                start_dt = datetime.now().replace(hour=14, minute=0, second=0, microsecond=0) + timedelta(days=1)
            
            # Parse end time or default to 1 hour after start
            if end_time:
                try:
                    if isinstance(end_time, str):
                        if 'T' in end_time:
                            end_dt = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
                        else:
                            end_dt = datetime.strptime(end_time, '%Y-%m-%d %H:%M:%S')
                    else:
                        end_dt = end_time
                except:
                    end_dt = start_dt + timedelta(hours=1)
            else:
                end_dt = start_dt + timedelta(hours=1)
            
            # Create event object
            event = {
                'summary': title,
                'description': description,
                'start': {
                    'dateTime': start_dt.isoformat(),
                    'timeZone': 'UTC',
                },
                'end': {
                    'dateTime': end_dt.isoformat(),
                    'timeZone': 'UTC',
                },
            }
            
            # Create the event
            created_event = service.events().insert(calendarId='primary', body=event).execute()
            
            return {
                "success": True,
                "event_id": created_event['id'],
                "event_link": created_event.get('htmlLink'),
                "details": {
                    "title": title,
                    "start": start_dt.isoformat(),
                    "end": end_dt.isoformat(),
                    "description": description
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to create calendar event: {str(e)}"
            }

calendar_service = CalendarService() 