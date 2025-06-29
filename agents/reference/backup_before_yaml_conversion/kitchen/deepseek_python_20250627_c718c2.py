def create_template(output_type):
    return {
        "image": IMAGE_TEMPLATE,
        "video": VIDEO_TEMPLATE,
        "audio": AUDIO_TEMPLATE
    }[output_type]