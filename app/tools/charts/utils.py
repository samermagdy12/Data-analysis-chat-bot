import base64
from io import BytesIO

import matplotlib.pyplot as plt

from app.session import session_manager


def get_dataframe(session_id):

    return session_manager.get_dataframe(session_id)


def success(message, chart=None, result=None):

    return {
        "success": True,
        "message": message,
        "result": result,
        "chart": chart,
        "metadata": {}
    }


def error(message):

    return {
        "success": False,
        "message": message,
        "result": None,
        "chart": None,
        "metadata": {}
    }


def figure_to_base64():

    buffer = BytesIO()

    plt.tight_layout()

    plt.savefig(
        buffer,
        format="png",
        bbox_inches="tight"
    )

    buffer.seek(0)

    chart = base64.b64encode(buffer.read()).decode("utf-8")

    plt.close()

    return chart