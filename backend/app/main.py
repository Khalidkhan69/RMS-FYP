from fastapi import FastAPI,HTTPException
from app.database import db
from app.schema import AdminRegister,AdminLogin,ManagerCreate
from passlib.context import CryptContext
from app.core.jwt import create_access_token
from app.database import db
from app.routers import admin,manager,customer,kitchen
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="Restaurant Management System",
    version="1.0.0"
)

# ===========================
# CORS Configuration
# ===========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===========================
# Serve Uploaded Images
# ===========================
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# ===========================
# Register Routers
# ===========================
app.include_router(admin.router)
app.include_router(manager.router)
app.include_router(customer.router)
app.include_router(kitchen.router)

# ===========================
# Home Route
# ===========================
@app.get("/")
async def home():
    return {
        "message": "Restaurant Management System API"
    }