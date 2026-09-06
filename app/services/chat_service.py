import json

from app.llm import llm
from app.prompts import SYSTEM_PROMPT
from app.session import session_manager
from app.tools import TOOLS, tool_manager


class ChatService:

    # ----------------------------------------
    # Prepare Tool Response For LLM
    # ----------------------------------------

    def _prepare_tool_response(self, tool_result):

        result = tool_result.get("result")

        # Prevent sending huge payloads to the LLM
        if isinstance(result, list):
            result = result[:20]

        elif isinstance(result, dict):
            result = dict(list(result.items())[:20])

        response = {
            "success": tool_result.get("success"),
            "message": tool_result.get("message"),
            "metadata": tool_result.get("metadata", {})
        }

        # Never send Base64 images to the LLM
        if tool_result.get("chart"):
            response["chart"] = "generated"
        else:
            response["result"] = result

        return response

    # ----------------------------------------
    # Chat
    # ----------------------------------------

    def chat(
        self,
        session_id: str,
        message: str
    ):

        history = session_manager.get_history(session_id)
        summary = session_manager.get_summary(session_id)

        messages = [

            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },

            {
                "role": "system",
                "content": summary
            }

        ]

        messages.extend(history)

        messages.append(
            {
                "role": "user",
                "content": message
            }
        )

        # ----------------------------------------
        # First LLM Call
        # ----------------------------------------

        response = llm.generate(
            messages=messages,
            tools=TOOLS
        )

        assistant_message = response.choices[0].message

        tool_result = None

        # ----------------------------------------
        # Tool Calling Loop
        # ----------------------------------------

        while assistant_message.tool_calls:

            messages.append(assistant_message)

            for tool_call in assistant_message.tool_calls:

                tool_result = tool_manager.execute(

                    tool_call.function.name,

                    tool_call.function.arguments,

                    session_id

                )

                tool_response_for_llm = self._prepare_tool_response(
                    tool_result
                )

                messages.append(

                    {
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": f"""
The tool executed successfully.

Below is the tool output.

{json.dumps(tool_response_for_llm, indent=2, ensure_ascii=False)}

Your task:

- Answer the user's original request.
- Do NOT return raw JSON.
- Do NOT expose the tool output directly.
- Convert the tool output into natural language.
- Summarize large dictionaries and lists.
- Mention only the important insights.
"""
                    }

                )

            response = llm.generate(
                messages=messages,
                tools=TOOLS
            )

            assistant_message = response.choices[0].message

        assistant_text = assistant_message.content

        # Save Conversation
        session_manager.add_message(
            session_id,
            "user",
            message
        )

        session_manager.add_message(
            session_id,
            "assistant",
            assistant_text
        )

        # Return Full Tool Result To Frontend
        return {

            "answer": assistant_text,

            "success": tool_result["success"] if tool_result else True,

            "message": tool_result["message"] if tool_result else "",

            "result": tool_result["result"] if tool_result else None,

            "chart": tool_result["chart"] if tool_result else None,

            "metadata": tool_result["metadata"] if tool_result else {}

        }


chat_service = ChatService()