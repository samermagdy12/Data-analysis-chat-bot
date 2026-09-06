import matplotlib.pyplot as plt

from app.tools.manager import tool_manager
from .utils import (
    get_dataframe,
    success,
    error,
    figure_to_base64
)


@tool_manager.tool(
    name="pie_chart",
    description="Create a pie chart for a categorical column.",
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
def pie_chart(arguments, session_id):

    df = get_dataframe(session_id)

    if df is None:
        return error("No dataset uploaded.")

    column = arguments["column"]

    if column not in df.columns:
        return error(f"Column '{column}' does not exist.")

    counts = df[column].value_counts()

    plt.figure(figsize=(7,7))

    plt.pie(
        counts.values,
        labels=counts.index,
        autopct="%1.1f%%"
    )

    plt.title(column)

    chart = figure_to_base64()

    return success(
        "Pie chart created successfully.",
        chart=chart
    )