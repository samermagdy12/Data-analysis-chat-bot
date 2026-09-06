from pathlib import Path
import shutil

from app.dataset import dataset_manager
from app.session import session_manager


class UploadService:

    def __init__(self):

        self.upload_dir = Path("uploads")
        self.upload_dir.mkdir(exist_ok=True)

    def upload_dataset(
        self,
        file
    ):

        extension = Path(file.filename).suffix.lower()

        session_id = session_manager.create_session()

        stored_filename = f"{session_id}{extension}"

        file_path = self.upload_dir / stored_filename

        try:

            with open(file_path, "wb") as buffer:

                shutil.copyfileobj(
                    file.file,
                    buffer
                )

            df = dataset_manager.load_dataset(
                str(file_path)
            )

            summary = dataset_manager.create_summary(
                df
            )

            summary_text = dataset_manager.format_summary_for_llm(
                summary
            )

            session_manager.set_dataframe(
                session_id,
                df
            )

            session_manager.set_summary(
                session_id,
                summary_text
            )

            session_manager.set_metadata(
                session_id,
                {
                    "filename": file.filename,
                    "stored_filename": stored_filename,
                    "rows": len(df),
                    "columns": len(df.columns),
                    "extension": extension,
                }
            )

            return {
                "success": True,
                "session_id": session_id,
                "rows": len(df),
                "columns": len(df.columns),
                "filename": file.filename
            }

        except Exception:

            if file_path.exists():
                file_path.unlink()

            session_manager.delete_session(
                session_id
            )

            raise

        finally:

            file.file.close()


upload_service = UploadService()