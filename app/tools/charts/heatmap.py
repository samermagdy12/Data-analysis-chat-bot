import matplotlib.pyplot as plt

from app.tools.manager import tool_manager
from .utils import (
    get_dataframe,
    success,
    error,
    figure_to_base64
)


@tool_manager.tool(
    name="correlation_heatmap",
    description="Create a correlation heatmap for all numeric columns.",
    parameters={
        "type": "object",
        "properties": {},
        "additionalProperties": False
    }
)
def correlation_heatmap(arguments, session_id):

    df = get_dataframe(session_id)

    if df is None:
        return error("No dataset uploaded.")

    corr = df.corr(numeric_only=True)

    plt.figure(figsize=(10,8))

    plt.imshow(corr)

    plt.colorbar()

    plt.xticks(
        range(len(corr.columns)),
        corr.columns,
        rotation=90
    )

    plt.yticks(
        range(len(corr.columns)),
        corr.columns
    )

    plt.title("Correlation Heatmap")

    chart = figure_to_base64()

    return success(
        "Correlation heatmap created successfully.",
        chart=chart
    )