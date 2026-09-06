from app.session import session_manager
from app.tools.manager import tool_manager


@tool_manager.tool(
    name="dataset_summary",
    description=(
        "Get general information about the uploaded dataset "
        "including rows, columns, column names and data types."
    ),
    parameters={
        "type": "object",
        "properties": {},
        "additionalProperties": False
    }
)
def dataset_summary(
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

    result = {
        "rows": len(df),
        "columns": len(df.columns),
        "column_names": df.columns.tolist(),
        "data_types": {
            column: str(dtype)
            for column, dtype in df.dtypes.items()
        }
    }

    return {
        "success": True,
        "message": "Dataset summary generated successfully.",
        "result": result,
        "chart": None,
        "metadata": {}
    }