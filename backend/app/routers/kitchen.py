from fastapi import APIRouter, HTTPException
from app.database import db
from bson import ObjectId
from app.schema import KitchenOrderStatusUpdate

router = APIRouter(
    prefix="/kitchen",
    tags=["Kitchen"]
)


#Kitchen dashboard
@router.get("/dashboard")
async def kitchen_dashboard():

    order_collection = db["orders"]

    pending_orders = await order_collection.count_documents(
        {
            "status": "Pending"
        }
    )

    preparing_orders = await order_collection.count_documents(
        {
            "status": "Preparing"
        }
    )

    ready_orders = await order_collection.count_documents(
        {
            "status": "Ready"
        }
    )

    total_active_orders = await order_collection.count_documents(
        {
            "status": {
                "$in": [
                    "Pending",
                    "Preparing",
                    "Ready"
                ]
            }
        }
    )

    return {

        "message": "Kitchen Dashboard",
        "statistics": {
            "pending_orders": pending_orders,
            "preparing_orders": preparing_orders,
            "ready_orders": ready_orders,
            "total_active_orders": total_active_orders

        }

    }



#View Active orders
@router.get("/orders")
async def get_active_orders():

    order_collection = db["orders"]

    cursor = order_collection.find(
        {
            "status": {
                "$in": [
                    "Pending",
                    "Preparing",
                    "Ready"
                ]
            }
        }
    ).sort("created_at", 1)

    orders = []

    async for order in cursor:

        orders.append({

            "order_id": str(order["_id"]),
            "table_number": order["table_number"],
            "status": order["status"],
            "total_amount": order["total_amount"],
            "total_items": sum(
                item["quantity"] for item in order["items"]
            ),

            "created_at": order["created_at"]

        })

    return {
        "total_orders": len(orders),
        "orders": orders
    }



#Individual ordaer details
@router.get("/order/{order_id}")
async def get_order_details(order_id: str):

    order_collection = db["orders"]

    # Validate ObjectId
    if not ObjectId.is_valid(order_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid Order ID."
        )

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

    return {

        "order_id": str(order["_id"]),
        "table_number": order["table_number"],
        "status": order["status"],
        "total_amount": order["total_amount"],
        "items": order["items"],
        "created_at": order["created_at"]

    }



@router.put("/orders/{order_id}/status")
async def update_kitchen_order_status(
    order_id: str,
    order: KitchenOrderStatusUpdate
):
    order_collection = db["orders"]

    if not ObjectId.is_valid(order_id):
        raise HTTPException(status_code=400, detail="Invalid Order ID.")

    existing_order = await order_collection.find_one(
        {"_id": ObjectId(order_id)}
    )

    if not existing_order:
        raise HTTPException(status_code=404, detail="Order not found.")

    current_status = existing_order["status"]
    new_status = order.status

    allowed_transitions = {
        "Pending": ["Preparing"],
        "Preparing": ["Ready"]
    }

    if current_status not in allowed_transitions:
        raise HTTPException(
            status_code=400,
            detail="Kitchen cannot update this order."
        )

    if new_status not in allowed_transitions[current_status]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot change status from {current_status} to {new_status}."
        )

    await order_collection.update_one(
        {"_id": ObjectId(order_id)},
        {
            "$set": {
                "status": new_status
            }
        }
    )

    return {
        "message": f"Order updated to {new_status} successfully."
    }
    # Completed Orders
@router.get("/completed-orders")
async def get_completed_orders():

    order_collection = db["orders"]

    cursor = order_collection.find(
        {
            "status": "Completed"
        }
    ).sort("created_at", -1)

    orders = []

    async for order in cursor:

        orders.append({

            "order_id": str(order["_id"]),
            "table_number": order["table_number"],
            "status": order["status"],
            "total_amount": order["total_amount"],
            "total_items": sum(
                item["quantity"] for item in order["items"]
            ),
            "created_at": order["created_at"]

        })

    return {

        "total_orders": len(orders),

        "orders": orders

    }