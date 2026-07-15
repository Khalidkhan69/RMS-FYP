from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.database import db
from app.schema import CartItemCreate,CartUpdate,PlaceOrder,FeedbackCreate
from datetime import datetime

router = APIRouter(
    prefix="/customer",
    tags=["Customer"]
)


@router.get("/categories")
async def get_categories():

    category_collection = db["categories"]

    categories = []

    async for category in category_collection.find(
        {"is_active": True}
    ):

        categories.append({
            "id": str(category["_id"]),
            "name": category["name"],
            "description": category.get("description")
        })

    return {
        "total_categories": len(categories),
        "categories": categories
    }



# Get Customer Menu
@router.get("/menu")
async def get_all_menu():

    menu_collection = db["menu"]

    menu = []

    async for item in menu_collection.find(
        {
            "is_available": True
        }
    ):

        image_url = None

        if item.get("image"):

            image_url = (
                f"http://127.0.0.1:8000/uploads/menu/{item['image']}"
            )

        menu.append({

            "id": str(item["_id"]),

            "name": item["name"],

            "description": item["description"],

            "price": item["price"],

            "image": image_url,

            "category_id": str(item["category_id"]),

            "category_name": item["category_name"]

        })

    return {

        "total_items": len(menu),

        "menu": menu

    }

@router.get("/menu/search")
async def search_menu(keyword: str):

    menu_collection = db["menu"]

    menu = []

    cursor = menu_collection.find({
        "$or": [
            {
                "name": {
                    "$regex": keyword,
                    "$options": "i"
                }
            },
            {
                "category_name": {
                    "$regex": keyword,
                    "$options": "i"
                }
            }
        ],
        "is_available": True
    })

    async for item in cursor:

        menu.append({
            "id": str(item["_id"]),
            "name": item["name"],
            "description": item["description"],
            "price": item["price"],
            "image": item.get("image"),
            "category": item["category_name"]
        })

    return {
        "total": len(menu),
        "menu": menu
    }



@router.get("/menu/category/{category_id}")
async def menu_by_category(category_id: str):

    if not ObjectId.is_valid(category_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid category ID."
        )

    menu_collection = db["menu"]

    menu = []

    async for item in menu_collection.find({
        "category_id": ObjectId(category_id),
        "is_available": True
    }):

        menu.append({
            "id": str(item["_id"]),
            "name": item["name"],
            "description": item["description"],
            "price": item["price"],
            "image": item.get("image")
        })

    return {
        "total": len(menu),
        "menu": menu
    }



@router.get("/menu/item/{menu_id}")
async def get_menu_item(menu_id: str):

    if not ObjectId.is_valid(menu_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid menu ID."
        )

    menu_collection = db["menu"]

    item = await menu_collection.find_one({
        "_id": ObjectId(menu_id)
    })

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found."
        )

    return {
        "id": str(item["_id"]),
        "name": item["name"],
        "description": item["description"],
        "price": item["price"],
        "image": item.get("image"),
        "category_name": item["category_name"],
        "is_available": item["is_available"]
    }



#Add to cart 
@router.post("/cart/add")
async def add_to_cart(cart: CartItemCreate):

    menu_collection = db["menu"]
    cart_collection = db["carts"]

    if not ObjectId.is_valid(cart.menu_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid menu ID."
        )

    menu = await menu_collection.find_one({
        "_id": ObjectId(cart.menu_id),
        "is_available": True
    })

    if not menu:
        raise HTTPException(
            status_code=404,
            detail="Menu item not found."
        )

    existing_item = await cart_collection.find_one({
        "table_number": cart.table_number,
        "menu_id": ObjectId(cart.menu_id)
    })

    if existing_item:

        new_quantity = existing_item["quantity"] + cart.quantity

        await cart_collection.update_one(
            {"_id": existing_item["_id"]},
            {
                "$set": {
                    "quantity": new_quantity,
                    "subtotal": new_quantity * menu["price"]
                }
            }
        )

        return {
            "message": "Cart updated successfully."
        }

    await cart_collection.insert_one({

        "table_number": cart.table_number,

        "menu_id": ObjectId(cart.menu_id),

        "item_name": menu["name"],

        "price": menu["price"],

        "quantity": cart.quantity,

        "subtotal": menu["price"] * cart.quantity

    })

    return {
        "message": "Item added to cart."
    }



#view cart
@router.get("/cart/{table_number}")
async def view_cart(table_number: int):

    cart_collection = db["carts"]

    cart_items = []

    total_amount = 0

    async for item in cart_collection.find(
        {"table_number": table_number}
    ):

        cart_items.append({
            "cart_id": str(item["_id"]),
            "menu_id": str(item["menu_id"]),
            "item_name": item["item_name"],
            "price": item["price"],
            "quantity": item["quantity"],
            "subtotal": item["subtotal"]
        })

        total_amount += item["subtotal"]

    if not cart_items:
        return {
            "message": "Cart is empty.",
            "table_number": table_number,
            "total_items": 0,
            "total_amount": 0,
            "cart": []
        }

    return {
        "table_number": table_number,
        "total_items": len(cart_items),
        "total_amount": total_amount,
        "cart": cart_items
    }



#update cart
@router.put("/cart/update/{cart_id}")
async def update_cart(
    cart_id: str,
    cart: CartUpdate
):

    cart_collection = db["carts"]

    if not ObjectId.is_valid(cart_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid cart ID."
        )

    existing_item = await cart_collection.find_one(
        {"_id": ObjectId(cart_id)}
    )

    if not existing_item:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found."
        )

    if cart.quantity <= 0:
        await cart_collection.delete_one(
            {"_id": ObjectId(cart_id)}
        )
        return {
        "message": "Item removed from cart."
        }
    subtotal = existing_item["price"] * cart.quantity

    await cart_collection.update_one(
        {"_id": ObjectId(cart_id)},
        {
            "$set": {
                "quantity": cart.quantity,
                "subtotal": subtotal
            }
        }
    )

    updated_item = await cart_collection.find_one(
        {"_id": ObjectId(cart_id)}
    )

    return {
        "message": "Cart updated successfully.",
        "cart": {
            "cart_id": str(updated_item["_id"]),
            "item_name": updated_item["item_name"],
            "price": updated_item["price"],
            "quantity": updated_item["quantity"],
            "subtotal": updated_item["subtotal"]
        }
    }



#Delete entire items from cart
@router.delete("/cart/remove/{cart_id}")
async def remove_cart_item(cart_id: str):

    cart_collection = db["carts"]

    # Validate Cart ID
    if not ObjectId.is_valid(cart_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid cart ID."
        )

    # Check if cart item exists
    existing_item = await cart_collection.find_one(
        {"_id": ObjectId(cart_id)}
    )

    if not existing_item:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found."
        )

    # Delete cart item
    await cart_collection.delete_one(
        {"_id": ObjectId(cart_id)}
    )

    return {
        "message": "Item removed from cart successfully."
    }



# Place Order
@router.post("/place-order")
async def place_order(order: PlaceOrder):

    cart_collection = db["carts"]
    order_collection = db["orders"]
    table_collection = db["tables"]

    # ---------------------------------
    # Check Table Exists
    # ---------------------------------

    table = await table_collection.find_one(
        {
            "table_number": order.table_number
        }
    )

    if not table:
        raise HTTPException(
            status_code=404,
            detail="Table not found."
        )

    # ---------------------------------
    # Check Active Order
    # ---------------------------------

    active_order = await order_collection.find_one(
        {
            "table_number": order.table_number,
            "status": {
                "$in": [
                    "Pending",
                    "Preparing",
                    "Ready",
                    "Served"
                ]
            }
        }
    )

    if active_order:
        raise HTTPException(
            status_code=400,
            detail="This table already has an active order."
        )

    # ---------------------------------
    # Read Cart
    # ---------------------------------

    cart_items = []

    total_amount = 0

    async for item in cart_collection.find(
        {
            "table_number": order.table_number
        }
    ):

        cart_items.append({

            "menu_id": str(item["menu_id"]),

            "item_name": item["item_name"],

            "price": item["price"],

            "quantity": item["quantity"],

            "subtotal": item["subtotal"]

        })

        total_amount += item["subtotal"]

    if not cart_items:

        raise HTTPException(
            status_code=400,
            detail="Cart is empty."
        )

    # ---------------------------------
    # Create Order
    # ---------------------------------

    new_order = {

        "table_number": order.table_number,

        "items": cart_items,

        "total_amount": total_amount,

        "status": "Pending",

        "created_at": datetime.utcnow()

    }

    result = await order_collection.insert_one(
        new_order
    )

    # ---------------------------------
    # Occupy Table
    # ---------------------------------

    await table_collection.update_one(

        {
            "table_number": order.table_number
        },

        {
            "$set": {
                "status": "Occupied"
            }
        }

    )

    # ---------------------------------
    # Clear Cart
    # ---------------------------------

    await cart_collection.delete_many(

        {
            "table_number": order.table_number
        }

    )

    return {

        "message": "Order placed successfully.",

        "order_id": str(result.inserted_id),

        "table_number": order.table_number,

        "total_amount": total_amount,

        "status": "Pending"

    }


#Order status
@router.get("/order-status/{table_number}")
async def track_order_status(table_number: int):

    order_collection = db["orders"]

    order = await order_collection.find_one(
        {
            "table_number": table_number,
            "status": {
                "$in": [
                    "Pending",
                    "Preparing",
                    "Ready",
                    "Served",
                    "Completed"
                ]
            }
        },
        sort=[("created_at", -1)]
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="No active order found."
        )

    return {
        "order_id": str(order["_id"]),
        "table_number": order["table_number"],
        "status": order["status"],
        "total_amount": order["total_amount"],
        "items": order["items"],
        "ordered_at": order["created_at"]
    }



#Request bill
@router.post("/request-bill/{table_number}")
async def request_bill(table_number: int):

    order_collection = db["orders"]

    order = await order_collection.find_one(
        {
            "table_number": table_number,
            "status": "Served"
        },
        sort=[("created_at", -1)]
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="No served order found for this table."
        )

    if order.get("bill_requested", False):
        raise HTTPException(
            status_code=400,
            detail="Bill has already been requested."
        )

    await order_collection.update_one(
        {
            "_id": order["_id"]
        },
        {
            "$set": {
                "bill_requested": True,
                "bill_requested_at": datetime.utcnow()
            }
        }
    )
    return {
        "message": "Bill requested successfully."
    }


#Customer feedback
@router.post("/feedback")
async def submit_feedback(
    feedback: FeedbackCreate
):

    feedback_collection = db["feedback"]
    order_collection = db["orders"]

    # Validate Order ID
    if not ObjectId.is_valid(feedback.order_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid Order ID."
        )

    order = await order_collection.find_one(
        {
            "_id": ObjectId(feedback.order_id)
        }
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found."
        )

    # Feedback only after payment
    if order["status"] != "Completed":
        raise HTTPException(
            status_code=400,
            detail="You can submit feedback only after completing your order."
        )

    # Prevent duplicate feedback
    existing_feedback = await feedback_collection.find_one(
        {
            "order_id": ObjectId(feedback.order_id)
        }
    )

    if existing_feedback:
        raise HTTPException(
            status_code=400,
            detail="Feedback has already been submitted."
        )

    feedback_document = {

        "order_id": ObjectId(feedback.order_id),
        "table_number": order["table_number"],
        "rating": feedback.rating,
        "comment": feedback.comment,
        "created_at": datetime.utcnow()

    }

    result = await feedback_collection.insert_one(
        feedback_document
    )

    return {

        "message": "Thank you for your feedback.",
        "feedback_id": str(result.inserted_id)
    }

    # Get Tablet Configuration
@router.get("/tablet-configuration/{device_id}")
async def get_tablet_configuration(device_id: str):

    tablet_collection = db["tablet_configurations"]

    tablet = await tablet_collection.find_one(
        {
            "device_id": device_id,
            "is_active": True
        }
    )

    if not tablet:
        raise HTTPException(
            status_code=404,
            detail="Tablet not configured."
        )

    return {

        "device_id": tablet["device_id"],

        "table_number": tablet["table_number"],

        "is_active": tablet["is_active"]

    }
