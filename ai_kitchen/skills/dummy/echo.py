"""Echo skill – returns params as-is."""

REQUIREMENTS: list[str] = []


def execute(params):  # type: ignore[override]
    return {"echo": params}
