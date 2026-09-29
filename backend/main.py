# Backend Entrypoint Proxy
# This file ensures backward compatibility with Render.com's existing 'uvicorn main:app' start command
# while keeping our new B.Tech modular architecture inside the 'app' module.

from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
