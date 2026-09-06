from typing import Dict, List, Optional
from uuid import uuid4

import pandas as pd


class SessionManager:
    """
    Responsible for managing every user session.

    Each session stores:
        - DataFrame
        - Dataset Summary
        - Chat History
        - Metadata
    """

    def __init__(self):
        self.sessions: Dict[str, dict] = {}

    # ----------------------------
    # Session Management
    # ----------------------------

    def create_session(self) -> str:

        session_id = str(uuid4())

        self.sessions[session_id] = {
            "df": None,
            "summary": None,
            "history": [],
            "metadata": {}
        }

        return session_id

    def delete_session(self, session_id: str):

        if session_id in self.sessions:
            del self.sessions[session_id]

    def session_exists(self, session_id: str) -> bool:

        return session_id in self.sessions

    # ----------------------------
    # DataFrame
    # ----------------------------

    def set_dataframe(
        self,
        session_id: str,
        df: pd.DataFrame
    ):

        self.sessions[session_id]["df"] = df

    def get_dataframe(
        self,
        session_id: str
    ) -> Optional[pd.DataFrame]:

        return self.sessions[session_id]["df"]

    # ----------------------------
    # Dataset Summary
    # ----------------------------

    def set_summary(
        self,
        session_id: str,
        summary: dict
    ):

        self.sessions[session_id]["summary"] = summary

    def get_summary(
        self,
        session_id: str
    ):

        return self.sessions[session_id]["summary"]

    # ----------------------------
    # Chat History
    # ----------------------------

    def add_message(
        self,
        session_id: str,
        role: str,
        content: str
    ):

        self.sessions[session_id]["history"].append(
            {
                "role": role,
                "content": content
            }
        )

    def get_history(
        self,
        session_id: str
    ) -> List[dict]:

        return self.sessions[session_id]["history"]

    def clear_history(
        self,
        session_id: str
    ):

        self.sessions[session_id]["history"] = []

    # ----------------------------
    # Metadata
    # ----------------------------

    def set_metadata(
        self,
        session_id: str,
        metadata: dict
    ):

        self.sessions[session_id]["metadata"] = metadata

    def get_metadata(
        self,
        session_id: str,
        key: str,
        default=None
    ):

        return self.sessions[session_id]["metadata"].get(key, default)


session_manager = SessionManager()