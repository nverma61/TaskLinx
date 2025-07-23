import base64
import email.mime.text
from typing import Dict, Any
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from auth import auth_service

class GmailService:
    def __init__(self):
        pass
    
    def send_email(self, user_id: str, recipient: str, subject: str, message: str) -> Dict[str, Any]:
        """Send an email using Gmail API"""
        try:
            # Get user credentials
            credentials = auth_service.get_user_credentials(user_id)
            if not credentials:
                return {
                    "success": False,
                    "error": "User credentials not found. Please re-authenticate."
                }
            
            # Build Gmail service
            service = build('gmail', 'v1', credentials=credentials)
            
            # Get user's email address
            profile = service.users().getProfile(userId='me').execute()
            sender_email = profile['emailAddress']
            
            # Create email message
            msg = email.mime.text.MIMEText(message)
            msg['to'] = recipient
            msg['from'] = sender_email
            msg['subject'] = subject
            
            # Encode message
            raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode('utf-8')
            
            # Send email
            send_result = service.users().messages().send(
                userId='me',
                body={'raw': raw_message}
            ).execute()
            
            return {
                "success": True,
                "message_id": send_result['id'],
                "details": {
                    "to": recipient,
                    "subject": subject,
                    "from": sender_email
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to send email: {str(e)}"
            }

gmail_service = GmailService() 