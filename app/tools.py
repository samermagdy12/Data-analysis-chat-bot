# import json
# from typing import Callable

# from app.executor import executor
# from app.session import session_manager


# TOOLS = []


# class ToolManager:

#     def __init__(self):

#         self.registry = {}

#     # ------------------------------------
#     # Tool Decorator
#     # ------------------------------------

#     def tool(
#         self,
#         *,
#         name: str,
#         description: str,
#         parameters: dict
#     ):

#         def decorator(func: Callable):

#             self.registry[name] = func

#             TOOLS.append(
#                 {
#                     "type": "function",
#                     "function": {
#                         "name": name,
#                         "description": description,
#                         "parameters": parameters
#                     }
#                 }
#             )

#             return func

#         return decorator

#     # ------------------------------------
#     # Execute Tool
#     # ------------------------------------

#     def execute(
#         self,
#         tool_name: str,
#         arguments: str,
#         session_id: str
#     ):

#         if tool_name not in self.registry:
#             raise ValueError(f"Unknown tool: {tool_name}")

#         args = json.loads(arguments)

#         return self.registry[tool_name](
#             args,
#             session_id
#         )


# tool_manager = ToolManager()


# # ==========================================================
# # Python Execution Tool
# # ==========================================================

# @tool_manager.tool(
#     name="execute_python",
#     description=(
#         "Execute Python code on the uploaded dataframe. "
#         "The dataframe is available as variable df. "
#         "Store the final answer in a variable called result."
#     ),
#     parameters={
#         "type": "object",
#         "properties": {
#             "code": {
#                 "type": "string",
#                 "description": "Python code."
#             }
#         },
#         "required": [
#             "code"
#         ],
#         "additionalProperties": False
#     }
# )
# def execute_python(
#     arguments: dict,
#     session_id: str
# ):

#     df = session_manager.get_dataframe(session_id)

#     if df is None:
#         raise ValueError("No dataset uploaded.")

#     return executor.execute(
#         code=arguments["code"],
#         dataframe=df
#     )