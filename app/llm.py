from typing import List, Optional
from openai import OpenAI
from app.config import OPENAI_API_KEY


class LLM:

    def __init__(self):

        self.client = OpenAI(
            api_key=OPENAI_API_KEY,
            base_url="https://api.groq.com/openai/v1"
        )

        self.model = "qwen/qwen3.6-27b"

    def generate(
        self,
        messages: List[dict],
        tools: Optional[list] = None,
    ):

        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            tools=tools
        )

        return response


llm = LLM()