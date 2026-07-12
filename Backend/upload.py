import os
import uuid


def save_uploaded_video(video_file, upload_folder="uploads"):
    """
    Saves the uploaded video into the specified uploads folder
    and returns the full file path.
    """

    # Make sure upload folder exists
    os.makedirs(upload_folder, exist_ok=True)

    # Get original extension
    extension = os.path.splitext(video_file.filename)[1]

    # Generate unique filename
    filename = f"{uuid.uuid4()}{extension}"

    # Full save path
    save_path = os.path.join(upload_folder, filename)

    # Save the uploaded file
    video_file.save(save_path)

    return save_path