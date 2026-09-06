"""
Optional endpoints that expose SessionManager's in-memory state over HTTP.

These are NOT required for the frontend to work — the React app tracks
chat history client-side in localStorage because the original backend
has no durable session store. Wiring these up just lets:
  - a "Delete" action in the sidebar also free the in-memory session
    on the server (frontend calls this "best effort" and ignores 404s)
  - a future admin/debug view list what the server currently holds

Sessions still do not survive a server restart — they are an in-memory
dict on SessionManager, exactly as in the original project. If you need
real persistence, session_manager would need to be backed by Redis/DB,
which is out of scope for this patch.
"""

from fastapi import APIRouter, HTTPException

from app.session import session_manager

router = APIRouter()


@router.get("/sessions")
def list_sessions():
    """List every session currently held in memory, with basic metadata."""

    return {
        "sessions": [
            {
                "session_id": session_id,
                "filename": data["metadata"].get("filename"),
                "rows": data["metadata"].get("rows"),
                "columns": data["metadata"].get("columns"),
                "message_count": len(data["history"]),
            }
            for session_id, data in session_manager.sessions.items()
        ]
    }


@router.get("/sessions/{session_id}/history")
def get_session_history(session_id: str):
    """Return the raw chat history FastAPI has stored for this session."""

    if not session_manager.session_exists(session_id):
        raise HTTPException(status_code=404, detail="Session not found.")

    return {
        "session_id": session_id,
        "history": session_manager.get_history(session_id),
    }


@router.delete("/sessions/{session_id}")
def delete_session(session_id: str):
    """Delete a session and its in-memory dataset/history."""

    if not session_manager.session_exists(session_id):
        raise HTTPException(status_code=404, detail="Session not found.")

    session_manager.delete_session(session_id)

    return {"success": True, "session_id": session_id}
