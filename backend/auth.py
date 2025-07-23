import json
import os
from datetime import datetime, timedelta
from typing import Optional
import httpx
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from jose import JWTError, jwt
from fastapi import HTTPException, status
from config import config

class AuthService:
    def __init__(self):
        self.client_config = {
            "web": {
                "client_id": config.GOOGLE_CLIENT_ID,
                "client_secret": config.GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [f"{config.FRONTEND_URL}/auth/callback"]
            }
        }
        
    def get_authorization_url(self) -> str:
        """Generate Google OAuth2 authorization URL"""
        flow = Flow.from_client_config(
            self.client_config,
            scopes=config.GOOGLE_SCOPES,
            redirect_uri=f"{config.FRONTEND_URL}/auth/callback"
        )
        
        authorization_url, _ = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent'
        )
        
        return authorization_url
    
    def exchange_code_for_tokens(self, code: str) -> dict:
        """Exchange authorization code for access and refresh tokens"""
        flow = Flow.from_client_config(
            self.client_config,
            scopes=config.GOOGLE_SCOPES,
            redirect_uri=f"{config.FRONTEND_URL}/auth/callback"
        )
        
        flow.fetch_token(code=code)
        credentials = flow.credentials
        
        # Get user info
        user_info = self._get_user_info(credentials.token)
        
        # Store tokens
        user_id = user_info['id']
        self._store_user_tokens(user_id, credentials)
        
        # Create JWT token for our app
        access_token = self._create_access_token(user_id)
        
        return {
            "access_token": access_token,
            "user_info": user_info
        }
    
    def _get_user_info(self, access_token: str) -> dict:
        """Get user information from Google"""
        url = f"https://www.googleapis.com/oauth2/v2/userinfo?access_token={access_token}"
        with httpx.Client() as client:
            response = client.get(url)
            response.raise_for_status()
            return response.json()
    
    def _store_user_tokens(self, user_id: str, credentials: Credentials):
        """Store user tokens in file"""
        os.makedirs(config.CREDS_DIR, exist_ok=True)
        
        tokens_data = {}
        if os.path.exists(config.TOKENS_FILE):
            with open(config.TOKENS_FILE, 'r') as f:
                tokens_data = json.load(f)
        
        tokens_data[user_id] = {
            "token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "scopes": credentials.scopes,
            "expiry": credentials.expiry.isoformat() if credentials.expiry else None
        }
        
        with open(config.TOKENS_FILE, 'w') as f:
            json.dump(tokens_data, f, indent=2)
    
    def get_user_credentials(self, user_id: str) -> Optional[Credentials]:
        """Get stored user credentials"""
        if not os.path.exists(config.TOKENS_FILE):
            return None
        
        with open(config.TOKENS_FILE, 'r') as f:
            tokens_data = json.load(f)
        
        if user_id not in tokens_data:
            return None
        
        token_info = tokens_data[user_id]
        credentials = Credentials(
            token=token_info["token"],
            refresh_token=token_info["refresh_token"],
            token_uri=token_info["token_uri"],
            client_id=token_info["client_id"],
            client_secret=token_info["client_secret"],
            scopes=token_info["scopes"]
        )
        
        # Refresh if expired
        if credentials.expired:
            credentials.refresh(Request())
            self._store_user_tokens(user_id, credentials)
        
        return credentials
    
    def _create_access_token(self, user_id: str) -> str:
        """Create JWT access token for our app"""
        expire = datetime.utcnow() + timedelta(hours=24)
        to_encode = {"sub": user_id, "exp": expire}
        return jwt.encode(to_encode, config.SECRET_KEY, algorithm="HS256")
    
    def verify_token(self, token: str) -> str:
        """Verify JWT token and return user_id"""
        try:
            payload = jwt.decode(token, config.SECRET_KEY, algorithms=["HS256"])
            user_id: str = payload.get("sub")
            if user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication token"
                )
            return user_id
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )

auth_service = AuthService() 