from app.session import session_manager
from app.tools.manager import tool_manager


# ==========================================================
# Descriptive Statistics
# ==========================================================

@tool_manager.tool(
    name="descriptive_statistics",
    description="Generate descriptive statistics for the dataset.",
    parameters={
        "type": "object",
        "properties": {},
        "additionalProperties": False
    }
)
def descriptive_statistics(arguments: dict, session_id: str):

    df = session_manager.get_dataframe(session_id)

    if df is None:
        return {
            "success": False,
            "message": "No dataset uploaded.",
            "result": None,
            "chart": None,
            "metadata": {}
        }

    return {
        "success": True,
        "message": "Descriptive statistics generated successfully.",
        "result": df.describe(include="all").to_dict(),
        "chart": None,
        "metadata": {}
    }


# ==========================================================
# Missing Values Analysis
# ==========================================================

@tool_manager.tool(
    name="missing_values_analysis",
    description="Analyze missing values in the dataset.",
    parameters={
        "type": "object",
        "properties": {},
        "additionalProperties": False
    }
)
def missing_values_analysis(arguments: dict, session_id: str):

    df = session_manager.get_dataframe(session_id)

    if df is None:
        return {
            "success": False,
            "message": "No dataset uploaded.",
            "result": None,
            "chart": None,
            "metadata": {}
        }

    missing = df.isnull().sum()

    return {
        "success": True,
        "message": "Missing values analysis completed.",
        "result": missing.to_dict(),
        "chart": None,
        "metadata": {}
    }


# ==========================================================
# Duplicate Analysis
# ==========================================================

@tool_manager.tool(
    name="duplicate_analysis",
    description="Count duplicate rows in the dataset.",
    parameters={
        "type": "object",
        "properties": {},
        "additionalProperties": False
    }
)
def duplicate_analysis(arguments: dict, session_id: str):

    df = session_manager.get_dataframe(session_id)

    if df is None:
        return {
            "success": False,
            "message": "No dataset uploaded.",
            "result": None,
            "chart": None,
            "metadata": {}
        }

    duplicates = int(df.duplicated().sum())

    return {
        "success": True,
        "message": "Duplicate analysis completed.",
        "result": {
            "duplicate_rows": duplicates
        },
        "chart": None,
        "metadata": {}
    }


# ==========================================================
# Value Counts
# ==========================================================

@tool_manager.tool(
    name="value_counts",
    description="Count unique values in a specific column.",
    parameters={
        "type": "object",
        "properties": {
            "column": {
                "type": "string",
                "description": "Column name."
            }
        },
        "required": [
            "column"
        ],
        "additionalProperties": False
    }
)
def value_counts(arguments: dict, session_id: str):

    df = session_manager.get_dataframe(session_id)

    if df is None:
        return {
            "success": False,
            "message": "No dataset uploaded.",
            "result": None,
            "chart": None,
            "metadata": {}
        }

    column = arguments["column"]

    if column not in df.columns:
        return {
            "success": False,
            "message": f"Column '{column}' does not exist.",
            "result": None,
            "chart": None,
            "metadata": {}
        }

    return {
        "success": True,
        "message": "Value counts generated successfully.",
        "result": df[column].value_counts().to_dict(),
        "chart": None,
        "metadata": {}
    }