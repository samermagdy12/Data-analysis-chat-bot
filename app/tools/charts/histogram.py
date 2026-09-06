import matplotlib.pyplot as plt

from app.tools.manager import tool_manager
from .utils import (
    get_dataframe,
    success,
    error,
    figure_to_base64
)


@tool_manager.tool(
    name="histogram",
    description="Create a histogram for a numeric column.",
    parameters={
        "type": "object",
        "properties": {
            "column": {
                "type": "string"
            },
            "bins": {
                "type": "integer",
                "default": 20
            }
        },
        "required": ["column"]
    }
)
def histogram(arguments, session_id):

    df = get_dataframe(session_id)

    if df is None:
        return error("No dataset uploaded.")

    column = arguments["column"]

    if column not in df.columns:
        return error(f"Column '{column}' does not exist.")

    bins = arguments.get("bins", 20)

    plt.figure(figsize=(8, 5))

    df[column].hist(bins=bins)

    plt.title(column)
    plt.xlabel(column)
    plt.ylabel("Frequency")

    chart = figure_to_base64()

    return success(
        "Histogram created successfully.",
        chart=chart
    )