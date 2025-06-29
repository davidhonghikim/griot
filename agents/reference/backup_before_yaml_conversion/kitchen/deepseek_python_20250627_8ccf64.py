REQUIREMENTS = ["comfyscript>=0.1.0"]

def execute(params):
    from comfyscript import Workflow
    wf = Workflow("config/comfyui_api.yaml")
    return wf.run(params)