import matplotlib.pyplot as plt

from app.tools.manager import tool_manager
from .utils import (
    get_dataframe,
    success,
    error,
    figure_to_base64
)


@tool_manager.tool(
    name="box_plot",
    description="Create a box plot for a numeric column.",
    parameters={
        "type": "object",
        "properties": {
            "column": {
                "type": "string"
            }
        },
        "required": ["column"],
        "additionalProperties": False
    }
)
def box_plot(arguments, session_id):

    df = get_dataframe(session_id)

    if df is None:
        return error("No dataset uploaded.")

    column = arguments["column"]

    if column not in df.columns:
        return error(f"Column '{column}' does not exist.")

    plt.figure(figsize=(6,5))

    plt.boxplot(df[column].dropna())

    plt.title(column)

    chart = figure_to_base64()

    return success(
        "Box plot created successfully.",
        chart=chart
    )