from fastapi import APIRouter
from pydantic import BaseModel

from app.services.chat_service import chat_service


router = APIRouter()


class ChatRequest(BaseModel):

    session_id: str

    message: str


@router.post("/chat")
def chat(
    request: ChatRequest
):

    return chat_service.chat(

        request.session_id,

        request.message

    )