from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

# Create MongoDB Client
client = AsyncIOMotorClient(settings.MONGODB_URL)

# Select Database
db = client[settings.DATABASE_NAME]


def get_database():
    return db