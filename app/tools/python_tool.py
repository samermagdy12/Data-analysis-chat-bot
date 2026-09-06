from app.executor import executor
from app.session import session_manager
from app.tools.manager import tool_manager

@tool_manager.tool(
    name="execute_python",
    description=(
        "Execute Python code on the uploaded dataframe.\n\n"

        "Rules:\n"
        "- The dataframe is already available as variable df.\n"
        "- pandas is already available as pd.\n"
        "- numpy is already available as np.\n"
        "- matplotlib.pyplot is already available as plt.\n"
        "- Never import any library.\n"
        "- Never use import or from ... import ...\n"
        "- Store the final output in a variable named result.\n"
        "- Never use print().\n"
        "- Never call plt.show()."
    ),
    parameters={
        "type": "object",
        "properties": {
            "code": {
                "type": "string",
                "description": "Python code to execute."
            }
        },
        "required": [
            "code"
        ],
        "additionalProperties": False
    }
)
def execute_python(
    arguments: dict,
    session_id: str
):

    df = session_manager.get_dataframe(session_id)

    if df is None:
        return {
            "success": False,
            "message": "No dataset uploaded.",
            "result": None,
            "chart": None,
            "metadata": {}
        }

    output = executor.execute(
        code=arguments["code"],
        dataframe=df
    )

    return {
        "success": True,
        "message": "Python code executed successfully.",
        "result": output["result"],
        "chart": output["chart"],
        "metadata": {}
    }