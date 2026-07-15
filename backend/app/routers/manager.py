from fastapi import APIRouter,HTTPException,Depends,UploadFile,File,Form
from bson.errors import InvalidId
import os
import uuid
import shutil
from app.database import db
from app.schema import ManagerLogin,TableCreate,TableUpdate,CategoryCreate,CategoryUpdate,MenuCreate,ManagerOrderStatusUpdate,TabletCreate, TabletUpdate
from app.core.security import verify_password
from app.core.jwt import create_access_token
from app.core.manager_dependencies import get_current_manager
from bson import ObjectId
from typing import Optional
from datetime import datetime, time

router = APIRouter(
    prefix="/manager",
    tags=["Manager"]
)

#Manager login
@router.post("/login")
async def manager_login(manager: ManagerLogin):

    manager_collection = db["managers"]

    # Find manager
    existing_manager = await manager_collection.find_one(
        {
            "email": manager.email
        }
    )

    if not existing_manager:
        raise HTTPException(
            status_code=404,
            detail="Invalid email or password."
        )

    # Verify password
    if not verify_password(
        manager.password,
        existing_manager["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    # Check account status
    if not existing_manager["is_active"]:
        raise HTTPException(
            status_code=403,
            detail="Manager account is disabled."
        )

    # Generate JWT
    token = create_access_token(
        {
            "manager_id": str(existing_manager["_id"]),
            "email": existing_manager["email"],
            "role": existing_manager["role"]
        }
    )

    return {
        "message": "Login successful.",
        "access_token": token,
        "token_type": "bearer"
    }



#Manger dashboard
# Manager Dashboard
@router.get("/dashboard")
async def manager_dashboard(
    current_manager: dict = Depends(get_current_manager)
):
    # Collections
    table_collection = db["tables"]
    category_collection = db["categories"]
    menu_collection = db["menu"]
    order_collection = db["orders"]

    # Today's Date (00:00:00)
    today = datetime.combine(datetime.today(), time.min)

    # ==========================
    # TABLE STATISTICS
    # ==========================

    total_tables = await table_collection.count_documents({})

    available_tables = await table_collection.count_documents(
        {"status": "Available"}
    )

    occupied_tables = await table_collection.count_documents(
        {"status": "Occupied"}
    )

    reserved_tables = await table_collection.count_documents(
        {"status": "Reserved"}
    )

    # ==========================
    # CATEGORY STATISTICS
    # ==========================

    total_categories = await category_collection.count_documents({})

    # ==========================
    # MENU STATISTICS
    # ==========================

    total_menu_items = await menu_collection.count_documents({})

    # ==========================
    # ORDER STATISTICS
    # ==========================

    total_orders = await order_collection.count_documents({})

    today_orders = await order_collection.count_documents(
        {
            "created_at": {
                "$gte": today
            }
        }
    )

    pending_orders = await order_collection.count_documents(
        {"status": "Pending"}
    )

    preparing_orders = await order_collection.count_documents(
        {"status": "Preparing"}
    )

    ready_orders = await order_collection.count_documents(
        {"status": "Ready"}
    )

    completed_orders = await order_collection.count_documents(
        {"status": "Completed"}
    )

    cancelled_orders = await order_collection.count_documents(
        {"status": "Cancelled"}
    )

    return {

        "message": "Manager Dashboard",

        "manager": {
            "email": current_manager["email"],
            "role": current_manager["role"]
        },

        "statistics": {

            "tables": {
                "total": total_tables,
                "available": available_tables,
                "occupied": occupied_tables,
                "reserved": reserved_tables
            },

            "categories": total_categories,

            "menu_items": total_menu_items,

            "today_orders": today_orders,

            "orders": {
                "total": total_orders,
                "pending": pending_orders,
                "preparing": preparing_orders,
                "ready": ready_orders,
                "completed": completed_orders,
                "cancelled": cancelled_orders
            }

        }

    }




# Register Tablet
@router.post("/tablets")
async def register_tablet(
    tablet: TabletCreate,
    current_manager: dict = Depends(get_current_manager)
):

    tablet_collection = db["tablet_configurations"]

    table_collection = db["tables"]

    # Check table exists
    table = await table_collection.find_one(
        {
            "table_number": tablet.table_number
        }
    )

    if not table:
        raise HTTPException(
            status_code=404,
            detail="Table not found."
        )

    # Check device already exists
    existing_device = await tablet_collection.find_one(
        {
            "device_id": tablet.device_id
        }
    )

    if existing_device:
        raise HTTPException(
            status_code=400,
            detail="Device ID already exists."
        )

    # Check table already assigned
    assigned_table = await tablet_collection.find_one(
        {
            "table_number": tablet.table_number
        }
    )

    if assigned_table:
        raise HTTPException(
            status_code=400,
            detail="This table already has a tablet assigned."
        )

    await tablet_collection.insert_one(

        {
            "device_id": tablet.device_id,
            "table_number": tablet.table_number,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

    )

    return {

        "message": "Tablet registered successfully.",

        "device_id": tablet.device_id,

        "table_number": tablet.table_number

    }


# Get All Tablets
@router.get("/tablets")
async def get_all_tablets(
    current_manager: dict = Depends(get_current_manager)
):

    tablet_collection = db["tablet_configurations"]

    tablets = []

    async for tablet in tablet_collection.find().sort("table_number", 1):

        tablets.append({

            "id": str(tablet["_id"]),

            "device_id": tablet["device_id"],

            "table_number": tablet["table_number"],

            "is_active": tablet["is_active"],

            "created_at": tablet["created_at"],

            "updated_at": tablet["updated_at"]

        })

    return {

        "total_tablets": len(tablets),

        "tablets": tablets

    }
# Update Tablet
@router.put("/tablets/{tablet_id}")
async def update_tablet(
    tablet_id: str,
    tablet: TabletUpdate,
    current_manager: dict = Depends(get_current_manager)
):

    tablet_collection = db["tablet_configurations"]

    table_collection = db["tables"]

    # Validate ObjectId
    if not ObjectId.is_valid(tablet_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid Tablet ID."
        )

    # Check tablet exists
    existing_tablet = await tablet_collection.find_one(
        {
            "_id": ObjectId(tablet_id)
        }
    )

    if not existing_tablet:
        raise HTTPException(
            status_code=404,
            detail="Tablet not found."
        )

    # Check table exists
    table = await table_collection.find_one(
        {
            "table_number": tablet.table_number
        }
    )

    if not table:
        raise HTTPException(
            status_code=404,
            detail="Table not found."
        )

    # Check table already assigned to another tablet
    assigned_table = await tablet_collection.find_one(
        {
            "table_number": tablet.table_number,
            "_id": {
                "$ne": ObjectId(tablet_id)
            }
        }
    )

    if assigned_table:
        raise HTTPException(
            status_code=400,
            detail="This table already has a tablet assigned."
        )

    await tablet_collection.update_one(

        {
            "_id": ObjectId(tablet_id)
        },

        {
            "$set": {
                "table_number": tablet.table_number,
                "updated_at": datetime.utcnow()
            }
        }

    )

    updated_tablet = await tablet_collection.find_one(
        {
            "_id": ObjectId(tablet_id)
        }
    )

    return {

        "message": "Tablet updated successfully.",

        "tablet": {

            "id": str(updated_tablet["_id"]),

            "device_id": updated_tablet["device_id"],

            "table_number": updated_tablet["table_number"],

            "is_active": updated_tablet["is_active"]

        }

    }
    # Deactivate Tablet
@router.delete("/tablets/{tablet_id}")
async def deactivate_tablet(
    tablet_id: str,
    current_manager: dict = Depends(get_current_manager)
):

    tablet_collection = db["tablet_configurations"]

    if not ObjectId.is_valid(tablet_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid Tablet ID."
        )

    tablet = await tablet_collection.find_one(
        {
            "_id": ObjectId(tablet_id)
        }
    )

    if not tablet:
        raise HTTPException(
            status_code=404,
            detail="Tablet not found."
        )

    await tablet_collection.update_one(
        {
            "_id": ObjectId(tablet_id)
        },
        {
            "$set": {
                "is_active": False,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return {
        "message": "Tablet deactivated successfully."
    }
    
    # Activate Tablet
@router.put("/tablets/{tablet_id}/activate")
async def activate_tablet(
    tablet_id: str,
    current_manager: dict = Depends(get_current_manager)
):

    tablet_collection = db["tablet_configurations"]

    # Validate ObjectId
    if not ObjectId.is_valid(tablet_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid Tablet ID."
        )

    # Check tablet exists
    tablet = await tablet_collection.find_one(
        {
            "_id": ObjectId(tablet_id)
        }
    )

    if not tablet:
        raise HTTPException(
            status_code=404,
            detail="Tablet not found."
        )

    # Already active
    if tablet["is_active"]:
        raise HTTPException(
            status_code=400,
            detail="Tablet is already active."
        )

    await tablet_collection.update_one(
        {
            "_id": ObjectId(tablet_id)
        },
        {
            "$set": {
                "is_active": True,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return {
        "message": "Tablet activated successfully."
    }

#Create table
@router.post("/table")
async def create_table(
    table: TableCreate,
    current_manager: dict = Depends(get_current_manager)
):

    table_collection = db["tables"]

    existing_table = await table_collection.find_one(
        {
            "table_number": table.table_number
        }
    )

    if existing_table:
        raise HTTPException(
            status_code=400,
            detail="Table already exists."
        )

    new_table = {
        "table_number": table.table_number,
        "capacity": table.capacity,
        "status": table.status
    }

    result = await table_collection.insert_one(new_table)

    return {
        "message": "Table created successfully.",
        "table_id": str(result.inserted_id)
    }


#Get all tables
@router.get("/tables")
async def get_all_tables(
    current_manager: dict = Depends(get_current_manager)
):

    table_collection = db["tables"]

    tables = []

    async for table in table_collection.find():

        tables.append({
            "id": str(table["_id"]),
            "table_number": table["table_number"],
            "capacity": table["capacity"],
            "status": table["status"]
        })

    return {
        "total_tables": len(tables),
        "tables": tables
    }


#Searach Table
@router.get("/table/search")
async def search_table(
    table_number: int,
    current_manager: dict = Depends(get_current_manager)
):

    table_collection = db["tables"]

    table = await table_collection.find_one(
        {
            "table_number": table_number
        }
    )

    if not table:
        raise HTTPException(
            status_code=404,
            detail="Table not found."
        )

    return {
        "id": str(table["_id"]),
        "table_number": table["table_number"],
        "capacity": table["capacity"],
        "status": table["status"]
    }


#Update Table
# Update Table
@router.put("/table/{table_id}")
async def update_table(
    table_id: str,
    table: TableUpdate,
    current_manager: dict = Depends(get_current_manager)
):

    table_collection = db["tables"]

    # Validate ObjectId
    try:
        object_id = ObjectId(table_id)
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid Table ID."
        )

    # Check if table exists
    existing_table = await table_collection.find_one(
        {
            "_id": object_id
        }
    )

    if not existing_table:
        raise HTTPException(
            status_code=404,
            detail="Table not found."
        )

    update_data = table.model_dump(exclude_unset=True)

    # Check duplicate table number
    if "table_number" in update_data:

        duplicate = await table_collection.find_one(
            {
                "table_number": update_data["table_number"],
                "_id": {
                    "$ne": object_id
                }
            }
        )

        if duplicate:
            raise HTTPException(
                status_code=400,
                detail="Table number already exists."
            )

    # Update table
    await table_collection.update_one(
        {
            "_id": object_id
        },
        {
            "$set": update_data
        }
    )

    # Get updated table
    updated_table = await table_collection.find_one(
        {
            "_id": object_id
        }
    )

    return {

        "message": "Table updated successfully.",

        "table": {

            "id": str(updated_table["_id"]),
            "table_number": updated_table["table_number"],
            "capacity": updated_table["capacity"],
            "status": updated_table["status"]

        }

    }

#Delete Table
# Delete Table
@router.delete("/table/{table_id}")
async def delete_table(
    table_id: str,
    current_manager: dict = Depends(get_current_manager)
):

    table_collection = db["tables"]

    # Validate ObjectId
    try:
        object_id = ObjectId(table_id)
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid Table ID."
        )

    # Check table exists
    existing_table = await table_collection.find_one(
        {
            "_id": object_id
        }
    )

    if not existing_table:
        raise HTTPException(
            status_code=404,
            detail="Table not found."
        )

    # Prevent deleting occupied tables
    if existing_table["status"] == "Occupied":
        raise HTTPException(
            status_code=400,
            detail="Occupied table cannot be deleted."
        )

    # Delete table
    await table_collection.delete_one(
        {
            "_id": object_id
        }
    )

    return {
        "message": "Table deleted successfully."
    }


#Create Category
@router.post("/category")
async def create_category(
    category: CategoryCreate,
    current_manager: dict = Depends(get_current_manager)
):

    category_collection = db["categories"]

    existing_category = await category_collection.find_one(
        {
            "name": {
                "$regex": f"^{category.name}$",
                "$options": "i"
            }
        }
    )

    if existing_category:
        raise HTTPException(
            status_code=400,
            detail="Category already exists."
        )

    new_category = {
        "name": category.name,
        "description": category.description,
        "is_active": True
    }

    result = await category_collection.insert_one(new_category)

    return {
        "message": "Category created successfully.",
        "category_id": str(result.inserted_id)
    }



#Get all categories
@router.get("/categories")
async def get_all_categories(
    current_manager: dict = Depends(get_current_manager)
):

    category_collection = db["categories"]

    categories = []

    async for category in category_collection.find():

        categories.append({
            "id": str(category["_id"]),
            "name": category["name"],
            "description": category.get("description"),
            "is_active": category["is_active"]
        })

    return {
        "total_categories": len(categories),
        "categories": categories
    }



#Search for Category
@router.get("/category/search")
async def search_category(
    name: str,
    current_manager: dict = Depends(get_current_manager)
):

    category_collection = db["categories"]

    categories = []

    cursor = category_collection.find(
        {
            "name": {
                "$regex": name,
                "$options": "i"
            }
        }
    )

    async for category in cursor:

        categories.append({
            "id": str(category["_id"]),
            "name": category["name"],
            "description": category.get("description"),
            "is_active": category["is_active"]
        })

    if not categories:
        raise HTTPException(
            status_code=404,
            detail="No category found."
        )

    return {
        "total": len(categories),
        "categories": categories
    }


# Update Category
@router.put("/category/{category_id}")
async def update_category(
    category_id: str,
    category: CategoryUpdate,
    current_manager: dict = Depends(get_current_manager)
):

    category_collection = db["categories"]

    # Validate ObjectId
    try:
        object_id = ObjectId(category_id)
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid Category ID."
        )

    # Check category exists
    existing_category = await category_collection.find_one(
        {
            "_id": object_id
        }
    )

    if not existing_category:
        raise HTTPException(
            status_code=404,
            detail="Category not found."
        )

    update_data = category.model_dump(exclude_unset=True)

    # Check duplicate name
    if "name" in update_data:

        duplicate = await category_collection.find_one(
            {
                "name": {
                    "$regex": f"^{update_data['name']}$",
                    "$options": "i"
                },
                "_id": {
                    "$ne": object_id
                }
            }
        )

        if duplicate:
            raise HTTPException(
                status_code=400,
                detail="Category already exists."
            )

    # Update category
    await category_collection.update_one(
        {
            "_id": object_id
        },
        {
            "$set": update_data
        }
    )

    updated_category = await category_collection.find_one(
        {
            "_id": object_id
        }
    )

    return {

        "message": "Category updated successfully.",

        "category": {

            "id": str(updated_category["_id"]),
            "name": updated_category["name"],
            "description": updated_category.get("description"),
            "is_active": updated_category["is_active"]

        }

    }

# Delete Category
@router.delete("/category/{category_id}")
async def delete_category(
    category_id: str,
    current_manager: dict = Depends(get_current_manager)
):

    category_collection = db["categories"]
    menu_collection = db["menu"]

    # Validate ObjectId
    try:
        object_id = ObjectId(category_id)
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid Category ID."
        )

    # Check category exists
    existing_category = await category_collection.find_one(
        {
            "_id": object_id
        }
    )

    if not existing_category:
        raise HTTPException(
            status_code=404,
            detail="Category not found."
        )

    # Prevent deleting category if menu items exist
    menu_exists = await menu_collection.find_one(
        {
            "category_id": str(object_id)
        }
    )

    if menu_exists:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete category because menu items are assigned to it."
        )

    # Delete category
    await category_collection.delete_one(
        {
            "_id": object_id
        }
    )

    return {
        "message": "Category deleted successfully."
    }

# Create Menu
@router.post("/menu")
async def create_menu_item(

    name: str = Form(...),
    description: str = Form(""),
    price: float = Form(...),
    category_id: str = Form(...),
    is_available: bool = Form(True),
    image: UploadFile = File(...),

    current_manager: dict = Depends(get_current_manager)

):

   
    menu_collection = db["menu"]
    category_collection = db["categories"]

    # -----------------------------
    # Validate Category ID
    # -----------------------------
    try:
        category_object_id = ObjectId(category_id)
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid Category ID."
        )

    # -----------------------------
    # Check Category Exists
    # -----------------------------
    category = await category_collection.find_one(
        {
            "_id": category_object_id
        }
    )

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found."
        )

    # -----------------------------
    # Duplicate Menu Name
    # -----------------------------
    existing_item = await menu_collection.find_one(
        {
            "name": {
                "$regex": f"^{name}$",
                "$options": "i"
            }
        }
    )

    if existing_item:
        raise HTTPException(
            status_code=400,
            detail="Menu item already exists."
        )

    # -----------------------------
    # Validate Image
    # -----------------------------
    allowed_extensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ]

    extension = os.path.splitext(
        image.filename
    )[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG and WEBP images are allowed."
        )

    # -----------------------------
    # Create Upload Folder
    # -----------------------------
    upload_directory = os.path.join(
        "uploads",
        "menu"
    )

    os.makedirs(
        upload_directory,
        exist_ok=True
    )

    # -----------------------------
    # Save Image
    # -----------------------------
    filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(
        upload_directory,
        filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            image.file,
            buffer
        )

    # -----------------------------
    # Save Menu Item
    # -----------------------------
    new_item = {

        "name": name,

        "description": description,

        "price": price,

        "category_id": category_object_id,

        "category_name": category["name"],

        "image": filename,

        "is_available": is_available

    }

    result = await menu_collection.insert_one(
        new_item
    )

    return {

        "message": "Menu item created successfully.",

        "menu_id": str(
            result.inserted_id
        )

    }

# Get All Menu Items
@router.get("/menu")
async def get_all_menu(
    current_manager: dict = Depends(get_current_manager)
):

    menu_collection = db["menu"]

    items = []

    async for item in menu_collection.find():

        image_url = None

        if item.get("image"):

            image_url = (
                f"http://127.0.0.1:8000/uploads/menu/{item['image']}"
            )

        items.append({

            "id": str(item["_id"]),

            "name": item["name"],

            "description": item["description"],

            "price": item["price"],

            "category_id": str(item["category_id"]),

            "category_name": item["category_name"],

            "image": image_url,

            "is_available": item["is_available"]

        })

    return {

        "total_items": len(items),

        "menu": items

    }


#Search menu items
@router.get("/menu/search")
async def search_menu(
    keyword: str,
    current_manager: dict = Depends(get_current_manager)
):

    menu_collection = db["menu"]

    items = []

    cursor = menu_collection.find({
        "name": {
            "$regex": keyword,
            "$options": "i"
        }
    })

    async for item in cursor:

        items.append({
            "id": str(item["_id"]),
            "name": item["name"],
            "price": item["price"],
            "category": item["category_name"],
            "is_available": item["is_available"]
        })

    if not items:
        raise HTTPException(
            status_code=404,
            detail="No menu item found."
        )

    return {
        "total": len(items),
        "menu": items
    }



# Update Menu
@router.put("/menu/{menu_id}")
async def update_menu(

    menu_id: str,

    name: str = Form(...),
    description: str = Form(""),
    price: float = Form(...),
    category_id: str = Form(...),
    is_available: bool = Form(True),
    image: UploadFile | None = File(None),

    current_manager: dict = Depends(get_current_manager)

):

    import os
    import uuid
    import shutil

    menu_collection = db["menu"]
    category_collection = db["categories"]

    # ---------------------------------
    # Validate Menu ID
    # ---------------------------------

    try:
        menu_object_id = ObjectId(menu_id)
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid Menu ID."
        )

    # ---------------------------------
    # Check Menu Exists
    # ---------------------------------

    existing_item = await menu_collection.find_one(
        {
            "_id": menu_object_id
        }
    )

    if not existing_item:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found."
        )

    # ---------------------------------
    # Validate Category ID
    # ---------------------------------

    try:
        category_object_id = ObjectId(category_id)
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid Category ID."
        )

    category = await category_collection.find_one(
        {
            "_id": category_object_id
        }
    )

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found."
        )

    # ---------------------------------
    # Duplicate Menu Name Check
    # ---------------------------------

    duplicate = await menu_collection.find_one(
        {
            "name": {
                "$regex": f"^{name}$",
                "$options": "i"
            },
            "_id": {
                "$ne": menu_object_id
            }
        }
    )

    if duplicate:
        raise HTTPException(
            status_code=400,
            detail="Menu item already exists."
        )

    # ---------------------------------
    # Keep Existing Image
    # ---------------------------------

    image_name = existing_item.get("image")

    # ---------------------------------
    # Upload New Image (Optional)
    # ---------------------------------

    if image:

        allowed_extensions = [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        ]

        extension = os.path.splitext(
            image.filename
        )[1].lower()

        if extension not in allowed_extensions:

            raise HTTPException(
                status_code=400,
                detail="Only JPG, JPEG, PNG and WEBP images are allowed."
            )

        # Create upload directory if it doesn't exist

        upload_directory = os.path.join(
            "uploads",
            "menu"
        )

        os.makedirs(
            upload_directory,
            exist_ok=True
        )

        # Delete old image

        if image_name:

            old_image_path = os.path.join(
                upload_directory,
                image_name
            )

            if os.path.exists(old_image_path):
                os.remove(old_image_path)

        # Generate unique filename

        image_name = f"{uuid.uuid4()}{extension}"

        file_path = os.path.join(
            upload_directory,
            image_name
        )

        # Save new image

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                image.file,
                buffer
            )

    # ---------------------------------
    # Update Database
    # ---------------------------------

    await menu_collection.update_one(

        {
            "_id": menu_object_id
        },

        {
            "$set": {

                "name": name,

                "description": description,

                "price": price,

                "category_id": category_object_id,

                "category_name": category["name"],

                "image": image_name,

                "is_available": is_available

            }

        }

    )

    # ---------------------------------
    # Get Updated Menu Item
    # ---------------------------------

    updated = await menu_collection.find_one(
        {
            "_id": menu_object_id
        }
    )

    image_url = None

    if updated.get("image"):
        image_url = (
            f"http://127.0.0.1:8000/uploads/menu/{updated['image']}"
        )

    return {

        "message": "Menu updated successfully.",

        "menu": {

            "id": str(updated["_id"]),

            "name": updated["name"],

            "description": updated["description"],

            "price": updated["price"],

            "category_id": str(updated["category_id"]),

            "category_name": updated["category_name"],

            "image": image_url,

            "is_available": updated["is_available"]

        }

    }

# Delete Menu
@router.delete("/menu/{menu_id}")
async def delete_menu(
    menu_id: str,
    current_manager: dict = Depends(get_current_manager)
):

    import os

    menu_collection = db["menu"]

    # -----------------------------
    # Validate Menu ID
    # -----------------------------
    try:
        menu_object_id = ObjectId(menu_id)
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid Menu ID."
        )

    # -----------------------------
    # Check Menu Exists
    # -----------------------------
    existing_item = await menu_collection.find_one(
        {
            "_id": menu_object_id
        }
    )

    if not existing_item:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found."
        )

    # -----------------------------
    # Delete Image
    # -----------------------------
    image_name = existing_item.get("image")

    if image_name:

        image_path = os.path.join(
            "uploads",
            "menu",
            image_name
        )

        if os.path.exists(image_path):
            os.remove(image_path)

    # -----------------------------
    # Delete Menu Item
    # -----------------------------
    await menu_collection.delete_one(
        {
            "_id": menu_object_id
        }
    )

    return {
        "message": "Menu item deleted successfully."
    }

#Get all orders
@router.get("/orders")
async def get_all_orders(
    current_manager: dict = Depends(get_current_manager)
):

    order_collection = db["orders"]

    orders = []

    async for order in order_collection.find():

        orders.append({
            "id": str(order["_id"]),
            "table_number": order["table_number"],
            "items": order["items"],
            "total_amount": order["total_amount"],
            "status": order["status"],
            "created_at": order["created_at"]
        })

    return {
        "total_orders": len(orders),
        "orders": orders
    }


#Order Search by table no. or status
@router.get("/orders/search")
async def search_orders(
    table_number: Optional[int] = None,
    status: Optional[str] = None,
    current_manager: dict = Depends(get_current_manager)
):

    order_collection = db["orders"]

    query = {}

    if table_number is not None:
        query["table_number"] = table_number

    if status:
        query["status"] = status

    orders = []

    async for order in order_collection.find(query):

        orders.append({
            "id": str(order["_id"]),
            "table_number": order["table_number"],
            "status": order["status"],
            "total_amount": order["total_amount"]
        })

    return {
        "total": len(orders),
        "orders": orders
    }



#Get order details
@router.get("/orders/{order_id}")
async def get_order(
    order_id: str,
    current_manager: dict = Depends(get_current_manager)
):

    order_collection = db["orders"]

    order = await order_collection.find_one(
        {"_id": ObjectId(order_id)}
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found."
        )

    order["_id"] = str(order["_id"])

    return order



#Served order
@router.put("/order/serve/{order_id}")
async def serve_order(
    order_id: str,
    current_manager: dict = Depends(get_current_manager)
):

    order_collection = db["orders"]

    # Validate Order ID
    if not ObjectId.is_valid(order_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid Order ID."
        )

    # Find Order
    order = await order_collection.find_one(
        {"_id": ObjectId(order_id)}
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found."
        )

    # Only Ready orders can be served
    if order["status"] != "Ready":
        raise HTTPException(
            status_code=400,
            detail="Only Ready orders can be served."
        )

    # Update status
    await order_collection.update_one(
        {"_id": ObjectId(order_id)},
        {
            "$set": {
                "status": "Served"
            }
        }
    )

    updated_order = await order_collection.find_one(
        {"_id": ObjectId(order_id)}
    )

    return {
        "message": "Order served successfully.",
        "order": {
            "id": str(updated_order["_id"]),
            "table_number": updated_order["table_number"],
            "status": updated_order["status"]
        }
    }


#Update order status
@router.put("/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    order: ManagerOrderStatusUpdate,
    current_manager: dict = Depends(get_current_manager)
):

    order_collection = db["orders"]
    table_collection = db["tables"]

    # Validate Order ID
    if not ObjectId.is_valid(order_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid Order ID."
        )

    # Find Order
    existing_order = await order_collection.find_one(
        {"_id": ObjectId(order_id)}
    )

    if not existing_order:
        raise HTTPException(
            status_code=404,
            detail="Order not found."
        )

    current_status = existing_order["status"]
    new_status = order.status

    # Manager allowed transitions
    allowed_transitions = {
        "Ready": ["Served"],
        "Served": ["Completed"]
    }

    if current_status not in allowed_transitions:
        raise HTTPException(
            status_code=400,
            detail="Manager cannot update this order."
        )

    if new_status not in allowed_transitions[current_status]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot change status from {current_status} to {new_status}."
        )

    # Prepare update data
    update_data = {
        "status": new_status
    }

    # -----------------------------
    # Ready -> Served
    # -----------------------------
    if new_status == "Served":

        update_data["payment_status"] = "Pending"

    # -----------------------------
    # Served -> Completed
    # -----------------------------
    if new_status == "Completed":

        # Customer must request bill first
        if not existing_order.get("bill_requested", False):
            raise HTTPException(
                status_code=400,
                detail="Customer has not requested the bill yet."
            )

        update_data["payment_status"] = "Paid"
        update_data["bill_requested"] = False

    # Update Order
    await order_collection.update_one(
        {"_id": ObjectId(order_id)},
        {
            "$set": update_data
        }
    )

    # Free table after payment
    if new_status == "Completed":

        await table_collection.update_one(
            {
                "table_number": existing_order["table_number"]
            },
            {
                "$set": {
                    "status": "Available"
                }
            }
        )

    updated_order = await order_collection.find_one(
        {"_id": ObjectId(order_id)}
    )

    return {
        "message": f"Order updated to {new_status} successfully.",
        "order": {
            "id": str(updated_order["_id"]),
            "table_number": updated_order["table_number"],
            "status": updated_order["status"],
            "payment_status": updated_order.get("payment_status"),
            "bill_requested": updated_order.get("bill_requested", False)
        }
    }

# Cancel Order
@router.delete("/orders/{order_id}")
async def cancel_order(
    order_id: str,
    current_manager: dict = Depends(get_current_manager)
):

    order_collection = db["orders"]

    # Validate Order ID
    if not ObjectId.is_valid(order_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid Order ID."
        )

    # Find Order
    order = await order_collection.find_one(
        {
            "_id": ObjectId(order_id)
        }
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found."
        )

    # Only Pending and Preparing orders can be cancelled
    if order["status"] not in ["Pending", "Preparing"]:
        raise HTTPException(
            status_code=400,
            detail="Only Pending or Preparing orders can be cancelled."
        )

    # Cancel Order
    await order_collection.update_one(
        {
            "_id": ObjectId(order_id)
        },
        {
            "$set": {
                "status": "Cancelled"
            }
        }
    )

    updated_order = await order_collection.find_one(
        {
            "_id": ObjectId(order_id)
        }
    )

    return {
        "message": "Order cancelled successfully.",
        "order": {
            "id": str(updated_order["_id"]),
            "table_number": updated_order["table_number"],
            "status": updated_order["status"]
        }
    }


#Bill requests
@router.get("/bill-requests")
async def get_bill_requests(
    current_manager: dict = Depends(get_current_manager)
):

    order_collection = db["orders"]

    cursor = order_collection.find(
        {
            "status": "Served",
            "bill_requested": True,
        }
    ).sort("created_at", 1)

    bill_requests = []

    async for order in cursor:

        bill_requests.append({

            "order_id": str(order["_id"]),
            "table_number": order["table_number"],
            "total_items": sum(
                item["quantity"] for item in order["items"]
            ),

            "total_amount": order["total_amount"],

            "requested_at": order.get(
                "bill_requested_at",
                order["created_at"]
            ),

            "status": order["status"],
             "view_bill_api": f"/manager/bill/{str(order['_id'])}"
            

        })

    return {
        "total_requests": len(bill_requests),
        "bill_requests": bill_requests
    }



#Generate Bill
@router.get("/bill/{order_id}")
async def view_bill(
    order_id: str,
    current_manager: dict = Depends(get_current_manager)
):

    order_collection = db["orders"]

    if not ObjectId.is_valid(order_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid Order ID."
        )

    order = await order_collection.find_one(
        {"_id": ObjectId(order_id)}
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found."
        )

    bill_items = []

    for item in order["items"]:

        bill_items.append({

            "item_name": item["item_name"],
            "quantity": item["quantity"],
            "unit_price": item["price"],
            "subtotal": item["quantity"] * item["price"]

        })

    return {

        "restaurant_name": "Restaurant Management System",
        "order_id": str(order["_id"]),
        "table_number": order["table_number"],
        "ordered_at": order["created_at"],
        "bill_requested_at": order.get("bill_requested_at"),
        "status": order["status"],
        "payment_status": order.get("payment_status", "Pending"),
        "items": bill_items,
        "total_amount": order["total_amount"]

    }

    
