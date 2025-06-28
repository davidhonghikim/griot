def load_skill(name):
    # Load from ./skills/{name}.py
    module = importlib.import_module(f"skills.{name}")
    return {
        "fn": module.execute,
        "requirements": module.REQUIREMENTS  # For auto-install
    }