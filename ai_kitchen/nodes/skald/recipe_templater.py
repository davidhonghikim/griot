"""Template generator for Skald node."""
from __future__ import annotations

IMAGE_TEMPLATE = {
    "workflow": [
        {"step": "generate_base_image", "skill": "comfyui/text-to-image", "params": {"prompt": ""}},
    ]
}

VIDEO_TEMPLATE = {
    "workflow": [
        {"step": "generate_base_frames", "skill": "comfyui/text-to-video", "params": {"prompt": ""}},
    ]
}

AUDIO_TEMPLATE = {
    "workflow": [
        {"step": "generate_voiceover", "skill": "llama-voice", "params": {"text": ""}},
    ]
}


def create_template(output_type: str):
    """Return a recipe template matching *output_type*."""
    mapping = {
        "image": IMAGE_TEMPLATE,
        "video": VIDEO_TEMPLATE,
        "audio": AUDIO_TEMPLATE,
    }
    if output_type not in mapping:
        raise ValueError(f"Unknown output_type: {output_type}")
    return mapping[output_type]
