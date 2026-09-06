from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.upload_service import upload_service


router = APIRouter()


ALLOWED_EXTENSIONS = {
    ".csv",
    ".xlsx",
    ".xls"
}


@router.post("/upload")
async def upload(
    file: UploadFile = File(...)
):

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No file uploaded."
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail="Unsupported file type."
        )

    try:

        return upload_service.upload_dataset(
            file
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )