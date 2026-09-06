import os
from typing import Dict

import pandas as pd


class DatasetManager:
    """
    Handles loading datasets and creating lightweight summaries
    for the LLM.
    """

    def __init__(self):
        pass

    # --------------------------------------------------
    # Load Dataset
    # --------------------------------------------------

    def load_dataset(
        self,
        file_path: str
    ) -> pd.DataFrame:
        """
        Load a CSV or Excel file into a DataFrame.
        """

        extension = os.path.splitext(file_path)[1].lower()

        if extension == ".csv":
            return pd.read_csv(file_path)

        elif extension in [".xls", ".xlsx"]:
            return pd.read_excel(file_path)

        else:
            raise ValueError(
                f"Unsupported file type: {extension}"
            )

    # --------------------------------------------------
    # Dataset Summary
    # --------------------------------------------------

    def create_summary(
        self,
        df: pd.DataFrame
    ) -> Dict:
        """
        Create a lightweight summary of the dataset.
        """

        rows = len(df)

        columns = df.columns.tolist()

        dtypes = {
            column: str(dtype)
            for column, dtype in df.dtypes.items()
        }

        missing_values = (
            df.isnull()
            .sum()
            .to_dict()
        )

        duplicates = int(
            df.duplicated().sum()
        )

        numeric_columns = (
            df.select_dtypes(
                include="number"
            )
            .columns
            .tolist()
        )

        categorical_columns = (
            df.select_dtypes(
                include="object"
            )
            .columns
            .tolist()
        )

        datetime_columns = (
            df.select_dtypes(
                include=["datetime", "datetimetz"]
            )
            .columns
            .tolist()
        )

        return {
            "rows": rows,
            "columns": columns,
            "dtypes": dtypes,
            "missing_values": missing_values,
            "duplicates": duplicates,
            "numeric_columns": numeric_columns,
            "categorical_columns": categorical_columns,
            "datetime_columns": datetime_columns,
        }

    # --------------------------------------------------
    # Format Summary For LLM
    # --------------------------------------------------

    def format_summary_for_llm(
        self,
        summary: Dict
    ) -> str:
        """
        Convert summary dictionary into an LLM-friendly prompt.
        """

        text = []

        text.append("Dataset Summary")
        text.append("")
        text.append(f"Rows: {summary['rows']}")
        text.append("")

        text.append("Columns:")
        for col in summary["columns"]:
            dtype = summary["dtypes"][col]
            text.append(f"- {col} ({dtype})")

        text.append("")

        text.append("Missing Values:")
        for col, value in summary["missing_values"].items():
            text.append(f"- {col}: {value}")

        text.append("")

        text.append(f"Duplicate Rows: {summary['duplicates']}")

        text.append("")

        text.append("Numeric Columns:")
        if summary["numeric_columns"]:
            for col in summary["numeric_columns"]:
                text.append(f"- {col}")
        else:
            text.append("- None")

        text.append("")

        text.append("Categorical Columns:")
        if summary["categorical_columns"]:
            for col in summary["categorical_columns"]:
                text.append(f"- {col}")
        else:
            text.append("- None")

        text.append("")

        text.append("Datetime Columns:")
        if summary["datetime_columns"]:
            for col in summary["datetime_columns"]:
                text.append(f"- {col}")
        else:
            text.append("- None")

        return "\n".join(text)


dataset_manager = DatasetManager()