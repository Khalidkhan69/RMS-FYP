from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBearer
from app.database import db
from app.schema import AdminRegister,AdminLogin,ManagerCreate,ManagerUpdate
from app.core.security import hash_password,verify_password
from app.core.jwt import create_access_token,verify_access_token
from app.core.dependencies import get_current_admin
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)



#Admin Register
@router.post("/register")
async def admin_register(admin: AdminRegister):

    admin_collection = db["admins"]

    # Check if email already exists
    existing_admin = await admin_collection.find_one(
        {"email": admin.email}
    )

    if existing_admin:
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    # Hash password
    hashed_password = hash_password(admin.password)

    # Create admin document
    new_admin = {
        "full_name": admin.full_name,
        "email": admin.email,
        "password": hashed_password,
        "role": "admin",
        "is_active": True
    }

    # Insert into MongoDB
    result = await admin_collection.insert_one(new_admin)

    return {
        "message": "Admin registered successfully.",
        "admin_id": str(result.inserted_id)
    }



#Admin login
@router.post("/login")
async def admin_login(admin: AdminLogin):

    admin_collection = db["admins"]

    # Find Admin
    existing_admin = await admin_collection.find_one(
        {
            "email": admin.email
        }
    )

    if not existing_admin:
        raise HTTPException(
            status_code=404,
            detail="Invalid email or password."
        )

    # Verify Password
    if not verify_password(
        admin.password,
        existing_admin["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    # Generate JWT
    token = create_access_token(
        {
            "admin_id": str(existing_admin["_id"]),
            "email": existing_admin["email"],
            "role": existing_admin["role"]
        }
    )    

    return {
        "message": "Login successful.",
        "access_token": token,
        "token_type": "bearer"
    }



#Admin dashboard
@router.get("/dashboard")
async def admin_dashboard(
    current_admin: dict = Depends(get_current_admin)
):

    # Collections
    manager_collection = db["managers"]
    table_collection = db["tables"]
    menu_collection = db["menu"]
    category_collection = db["categories"]
    order_collection = db["orders"]
    feedback_collection = db["feedback"]

    # ----------------------------------
    # Existing Statistics
    # ----------------------------------

    total_managers = await manager_collection.count_documents({})
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

    total_menu_items = await menu_collection.count_documents({})
    total_categories = await category_collection.count_documents({})
    total_orders = await order_collection.count_documents({})
    total_feedback = await feedback_collection.count_documents({})


    completed_orders = order_collection.find(
    {
        "status": "Completed"
    }
)
    total_revenue = 0
    async for order in completed_orders:
        total_revenue += order.get("total_amount", 0)


    # ----------------------------------
    # Order Statistics
    # ----------------------------------

    pending_orders = await order_collection.count_documents(
        {"status": "Pending"}
    )

    preparing_orders = await order_collection.count_documents(
        {"status": "Preparing"}
    )

    ready_orders = await order_collection.count_documents(
        {"status": "Ready"}
    )

    served_orders = await order_collection.count_documents(
        {"status": "Served"}
    )

    completed_orders = await order_collection.count_documents(
        {"status": "Completed"}
    )

    cancelled_orders = await order_collection.count_documents(
        {"status": "Cancelled"}
    )

    active_orders = (
        pending_orders
        + preparing_orders
        + ready_orders
        + served_orders
    )

    completion_rate = (
        round(
            (completed_orders / total_orders) * 100,
            2
        )
        if total_orders > 0
        else 0
    )

    # ----------------------------------
    # Revenue
    # ----------------------------------

    today = datetime.utcnow()

    today_start = today.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    tomorrow = today_start + timedelta(days=1)

    month_start = today.replace(
        day=1,
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    if today.month == 12:
        month_end = month_start.replace(
            year=today.year + 1,
            month=1
        )
    else:
        month_end = month_start.replace(
            month=today.month + 1
        )

    year_start = today.replace(
        month=1,
        day=1,
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    year_end = year_start.replace(
        year=today.year + 1
    )

    today_revenue = 0
    monthly_revenue = 0
    yearly_revenue = 0
    todays_orders = 0

    cursor = order_collection.find(
        {"status": "Completed"}
    )

    async for order in cursor:

        created_at = order["created_at"]

        if today_start <= created_at < tomorrow:
            today_revenue += order["total_amount"]
            todays_orders += 1

        if month_start <= created_at < month_end:
            monthly_revenue += order["total_amount"]

        if year_start <= created_at < year_end:
            yearly_revenue += order["total_amount"]

    # ----------------------------------
    # Top Selling Item
    # ----------------------------------

    item_sales = {}

    cursor = order_collection.find(
        {"status": "Completed"}
    )

    async for order in cursor:

        for item in order["items"]:

            name = item["item_name"]

            item_sales[name] = item_sales.get(name, 0) + item["quantity"]

    top_selling_item = None
    least_selling_item = None

    if item_sales:

        top_selling_item = max(
            item_sales,
            key=item_sales.get
        )

        least_selling_item = min(
            item_sales,
            key=item_sales.get
        )

    # ----------------------------------
    # Response
    # ----------------------------------

    return {

        "message": "Admin Dashboard",

        "admin": current_admin["email"],

        "statistics": {

            "total_managers": total_managers,
            "total_tables": total_tables,
            "available_tables": available_tables,
            "occupied_tables": occupied_tables,
            "reserved_tables": reserved_tables,
            "total_menu_items": total_menu_items,
            "total_categories": total_categories,
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "total_feedback": total_feedback

        },

        "analytics": {

            "today_revenue": today_revenue,
            "monthly_revenue": monthly_revenue,
            "yearly_revenue": yearly_revenue,
            "todays_orders": todays_orders,
            "active_orders": active_orders,
            "pending_orders": pending_orders,
            "preparing_orders": preparing_orders,
            "ready_orders": ready_orders,
            "served_orders": served_orders,
            "completed_orders": completed_orders,
            "cancelled_orders": cancelled_orders,
            "completion_rate": completion_rate,
            "top_selling_item": top_selling_item,
            "least_selling_item": least_selling_item

        }

    }


#Admin Create-Manager
@router.post("/create-manager")
async def create_manager(
    manager: ManagerCreate,
    current_admin: dict = Depends(get_current_admin)
    ):
    manager_collection = db["managers"]

    # Check if manager already exists
    existing_manager = await manager_collection.find_one(
        {"email": manager.email}
    )

    if existing_manager:
        raise HTTPException(
            status_code=400,
            detail="Manager already exists."
        )

    # Hash password
    hashed_password = hash_password(manager.password)

    # Manager document
    new_manager = {
        "full_name": manager.full_name,
        "email": manager.email,
        "password": hashed_password,
        "phone": manager.phone,
        "role": "manager",
        "is_active": True
    }

    result = await manager_collection.insert_one(new_manager)

    return {
        "message": "Manager created successfully.",
        "manager_id": str(result.inserted_id)
    }



#Get All Managers 
@router.get("/managers")
async def get_all_managers(
    current_admin: dict = Depends(get_current_admin)
):
    manager_collection = db["managers"]

    managers = await manager_collection.find().to_list(None)

    result = []

    for manager in managers:
        result.append({
            "id": str(manager["_id"]),
            "full_name": manager["full_name"],
            "email": manager["email"],
            "phone": manager["phone"],
            "role": manager["role"],
            "is_active": manager["is_active"]
        })

    return {
        "total_managers": len(result),
        "managers": result
    }



#Update Manager Credentials
@router.put("/managers/{manager_id}")
async def update_manager(
    manager_id: str,
    manager: ManagerUpdate,
    current_admin: dict = Depends(get_current_admin)
):

    manager_collection = db["managers"]

    # Check manager exists
    existing_manager = await manager_collection.find_one(
        {"_id": ObjectId(manager_id)}
    )

    if not existing_manager:
        raise HTTPException(
            status_code=404,
            detail="Manager not found."
        )

    update_data = manager.model_dump(exclude_unset=True)

    # Check email duplication
    if "email" in update_data:

        email_exists = await manager_collection.find_one({
            "email": update_data["email"],
            "_id": {"$ne": ObjectId(manager_id)}
        })

        if email_exists:
            raise HTTPException(
                status_code=400,
                detail="Email already exists."
            )

    # Update manager
    await manager_collection.update_one(
        {"_id": ObjectId(manager_id)},
        {"$set": update_data}
    )

    updated_manager = await manager_collection.find_one(
        {"_id": ObjectId(manager_id)}
    )

    return {
        "message": "Manager updated successfully.",
        "manager": {
            "id": str(updated_manager["_id"]),
            "full_name": updated_manager["full_name"],
            "email": updated_manager["email"],
            "phone": updated_manager["phone"],
            "role": updated_manager["role"],
            "is_active": updated_manager["is_active"]
        }
    }



#Search Manager by name or email
@router.get("/manager/search")
async def search_manager(
    search: str = Query(...),
    current_admin: dict = Depends(get_current_admin)
):

    manager_collection = db["managers"]

    managers = await manager_collection.find({
        "$or": [
            {"full_name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}}
        ]
    }).to_list(length=None)

    if not managers:
        raise HTTPException(
            status_code=404,
            detail="No manager found."
        )

    result = []

    for manager in managers:
        result.append({
            "id": str(manager["_id"]),
            "full_name": manager["full_name"],
            "email": manager["email"],
            "phone": manager["phone"],
            "role": manager["role"],
            "is_active": manager["is_active"]
        })

    return {
        "total_results": len(result),
        "managers": result
    }



#Admin delete manager
@router.delete("/delete-manager/{manager_id}")
async def delete_manager(
    manager_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    manager_collection = db["managers"]

    try:
        object_id = ObjectId(manager_id)
    except InvalidId:
        raise HTTPException(
            status_code=400,
            detail="Invalid Manager ID."
        )

    manager = await manager_collection.find_one(
        {"_id": object_id}
    )

    if not manager:
        raise HTTPException(
            status_code=404,
            detail="Manager not found."
        )

    await manager_collection.delete_one(
        {"_id": object_id}
    )

    return {
        "message": "Manager deleted successfully."
    }



#Daily Sales
@router.get("/reports/daily-sales")
async def daily_sales_report(
    current_admin: dict = Depends(get_current_admin)
):

    order_collection = db["orders"]

    # Start of today (UTC)
    today = datetime.utcnow().replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    tomorrow = today + timedelta(days=1)

    cursor = order_collection.find({
        "status": "Completed",
        "created_at": {
            "$gte": today,
            "$lt": tomorrow
        }
    })

    total_orders = 0
    total_revenue = 0

    async for order in cursor:

        total_orders += 1
        total_revenue += order["total_amount"]

    average_order = (
        total_revenue / total_orders
        if total_orders > 0 else 0
    )

    return {

        "date": today.strftime("%Y-%m-%d"),
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "average_order_value": round(
            average_order,
            2
        )

    }



#weekly sales
@router.get("/reports/weekly-sales")
async def weekly_sales_report(
    current_admin: dict = Depends(get_current_admin)
):

    order_collection = db["orders"]

    today = datetime.utcnow()

    week_start = (today - timedelta(days=today.weekday())).replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    week_end = week_start + timedelta(days=7)

    cursor = order_collection.find({
        "status": "Completed",
        "created_at": {
            "$gte": week_start,
            "$lt": week_end
        }
    })

    total_orders = 0
    total_revenue = 0

    async for order in cursor:
        total_orders += 1
        total_revenue += order["total_amount"]

    average_order = (
        total_revenue / total_orders
        if total_orders else 0
    )

    return {
        "week_start": week_start.strftime("%Y-%m-%d"),
        "week_end": (week_end - timedelta(days=1)).strftime("%Y-%m-%d"),
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "average_order_value": round(average_order, 2)
    }



#monthly sales
@router.get("/reports/monthly-sales")
async def monthly_sales_report(
    current_admin: dict = Depends(get_current_admin)
):

    order_collection = db["orders"]
    today = datetime.utcnow()
    month_start = today.replace(
        day=1,
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    # First day of next month
    if today.month == 12:
        month_end = month_start.replace(
            year=today.year + 1,
            month=1
        )
    else:
        month_end = month_start.replace(
            month=today.month + 1
        )

    cursor = order_collection.find(
        {
            "status": "Completed",
            "created_at": {
                "$gte": month_start,
                "$lt": month_end
            }
        }
    )

    total_orders = 0
    total_revenue = 0

    async for order in cursor:

        total_orders += 1
        total_revenue += order["total_amount"]

    average_order = (
        total_revenue / total_orders
        if total_orders > 0 else 0
    )

    return {

        "month": month_start.strftime("%B %Y"),
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "average_order_value": round(
            average_order,
            2
        )

    }



#Yearly sales
@router.get("/reports/yearly-sales")
async def yearly_sales_report(
    current_admin: dict = Depends(get_current_admin)
):

    order_collection = db["orders"]
    today = datetime.utcnow()
    year_start = today.replace(
        month=1,
        day=1,
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    year_end = year_start.replace(
        year=today.year + 1
    )

    cursor = order_collection.find(
        {
            "status": "Completed",
            "created_at": {
                "$gte": year_start,
                "$lt": year_end
            }
        }
    )

    total_orders = 0
    total_revenue = 0

    async for order in cursor:

        total_orders += 1
        total_revenue += order["total_amount"]

    average_order = (
        total_revenue / total_orders
        if total_orders > 0 else 0
    )

    return {

        "year": today.year,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "average_order_value": round(
            average_order,
            2
        )

    }



#top selling items
@router.get("/reports/top-selling-items")
async def top_selling_items(
    current_admin: dict = Depends(get_current_admin)
):

    order_collection = db["orders"]

    cursor = order_collection.find(
        {
            "status": "Completed"
        }
    )

    item_sales = {}

    async for order in cursor:

        for item in order["items"]:

            item_name = item["item_name"]
            quantity = item["quantity"]

            if item_name not in item_sales:

                item_sales[item_name] = {
                    "item_name": item_name,
                    "total_quantity_sold": 0,
                    "total_revenue": 0
                }

            item_sales[item_name]["total_quantity_sold"] += quantity
            item_sales[item_name]["total_revenue"] += quantity * item["price"]

    result = sorted(
        item_sales.values(),
        key=lambda x: x["total_quantity_sold"],
        reverse=True
    )

    return {
        "total_items": len(result),
        "top_selling_items": result
    }



#Least selling items
@router.get("/reports/least-selling-items")
async def least_selling_items(
    current_admin: dict = Depends(get_current_admin)
):

    order_collection = db["orders"]

    cursor = order_collection.find(
        {
            "status": "Completed"
        }
    )

    item_sales = {}

    async for order in cursor:

        for item in order["items"]:

            item_name = item["item_name"]
            quantity = item["quantity"]

            if item_name not in item_sales:

                item_sales[item_name] = {
                    "item_name": item_name,
                    "total_quantity_sold": 0,
                    "total_revenue": 0
                }

            item_sales[item_name]["total_quantity_sold"] += quantity
            item_sales[item_name]["total_revenue"] += quantity * item["price"]

    result = sorted(
        item_sales.values(),
        key=lambda x: x["total_quantity_sold"]
    )

    return {
        "total_items": len(result),
        "least_selling_items": result
    }


# Monthly Sales Chart
@router.get("/reports/monthly-sales-chart")
async def monthly_sales_chart(
    current_admin: dict = Depends(get_current_admin)
):

    order_collection = db["orders"]

    current_year = datetime.utcnow().year

    pipeline = [

        {
            "$match": {
                "status": "Completed",
                "created_at": {
                    "$gte": datetime(current_year, 1, 1),
                    "$lt": datetime(current_year + 1, 1, 1)
                }
            }
        },

        {
            "$group": {
                "_id": {
                    "$month": "$created_at"
                },
                "revenue": {
                    "$sum": "$total_amount"
                }
            }
        },

        {
            "$sort": {
                "_id": 1
            }
        }

    ]

    result = await order_collection.aggregate(pipeline).to_list(length=12)

    month_names = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ]

    chart_data = []

    for month in range(1, 13):
        revenue = 0

        for item in result:
            if item["_id"] == month:
                revenue = item["revenue"]
                break

        chart_data.append({
            "month": month_names[month - 1],
            "revenue": revenue
    })

    return chart_data

#Order statistics
@router.get("/reports/order-statistics")
async def order_statistics(
    current_admin: dict = Depends(get_current_admin)
):

    order_collection = db["orders"]

    cursor = order_collection.find()

    stats = {
        "total_orders": 0,
        "pending": 0,
        "preparing": 0,
        "ready": 0,
        "served": 0,
        "completed": 0,
        "cancelled": 0
    }

    async for order in cursor:

        stats["total_orders"] += 1

        status = order.get("status", "").lower()

        if status == "pending":
            stats["pending"] += 1

        elif status == "preparing":
            stats["preparing"] += 1

        elif status == "ready":
            stats["ready"] += 1

        elif status == "served":
            stats["served"] += 1

        elif status == "completed":
            stats["completed"] += 1

        elif status == "cancelled":
            stats["cancelled"] += 1

    # Calculate completion rate
    completion_rate = (
        round(
            (stats["completed"] / stats["total_orders"]) * 100,
            2
        )
        if stats["total_orders"] > 0
        else 0
    )

    stats["completion_rate"] = completion_rate

    return {
        "message": "Order statistics fetched successfully.",
        "statistics": stats
    }

    