import json
from typing import Callable
from app.utils.json_utils import make_json_safe


TOOLS = []


class ToolManager:

    def __init__(self):

        self.registry = {}

    # ----------------------------------------
    # Register Tool
    # ----------------------------------------

    def tool(
        self,
        *,
        name: str,
        description: str,
        parameters: dict
    ):

        def decorator(func: Callable):

            if name in self.registry:
                raise ValueError(
                    f"Tool '{name}' is already registered."
                )

            self.registry[name] = func

            TOOLS.append(
                {
                    "type": "function",
                    "function": {
                        "name": name,
                        "description": description,
                        "parameters": parameters,
                    },
                }
            )

            return func

        return decorator

    # ----------------------------------------
    # Execute Tool
    # ----------------------------------------

    def execute(
        self,
        tool_name: str,
        arguments: str,
        session_id: str
    ):

        if tool_name not in self.registry:
            raise ValueError(
                f"Unknown tool: {tool_name}"
            )

        if arguments:
            args = json.loads(arguments)
        else:
            args = {}

        response = self.registry[tool_name](
            args,
            session_id
        )

        # Make result JSON-safe
        if isinstance(response, dict):

            response["result"] = make_json_safe(
                response.get("result")
            )

            response["metadata"] = make_json_safe(
                response.get("metadata")
            )

            response["chart"] = make_json_safe(
                response.get("chart")
            )

        return response

    # ----------------------------------------
    # Utility Functions
    # ----------------------------------------

    def list_tools(self):

        return list(self.registry.keys())

    def exists(self, tool_name: str):

        return tool_name in self.registry


tool_manager = ToolManager()