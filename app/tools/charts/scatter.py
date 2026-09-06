import matplotlib.pyplot as plt

from app.tools.manager import tool_manager
from .utils import (
    get_dataframe,
    success,
    error,
    figure_to_base64
)


@tool_manager.tool(
    name="scatter_plot",
    description="Create a scatter plot between two numeric columns.",
    parameters={
        "type": "object",
        "properties": {
            "x": {"type": "string"},
            "y": {"type": "string"}
        },
        "required": ["x", "y"],
        "additionalProperties": False
    }
)
def scatter_plot(arguments, session_id):

    df = get_dataframe(session_id)

    if df is None:
        return error("No dataset uploaded.")

    x = arguments["x"]
    y = arguments["y"]

    if x not in df.columns:
        return error(f"Column '{x}' does not exist.")

    if y not in df.columns:
        return error(f"Column '{y}' does not exist.")

    plt.figure(figsize=(8, 5))

    plt.scatter(df[x], df[y])

    plt.xlabel(x)
    plt.ylabel(y)
    plt.title(f"{y} vs {x}")

    chart = figure_to_base64()

    return success(
        "Scatter plot created successfully.",
        chart=chart
    )