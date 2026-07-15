from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, Literal


class AdminRegister(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class ManagerCreate(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)
    phone: str = Field(..., min_length=11, max_length=15)    


class ManagerUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, min_length=11, max_length=15)
    is_active: Optional[bool] = None


class ManagerLogin(BaseModel): 
    email: EmailStr
    password: str


class TableCreate(BaseModel):
    table_number: int = Field(
        ...,
        gt=0,
        le=999,
        description="Table number must be between 1 and 999"
    )

    capacity: int = Field(
        ...,
        ge=1,
        le=20,
        description="Capacity must be between 1 and 20"
    )

    status: Literal["Available", "Reserved"] = "Available"

    @field_validator("table_number")
    @classmethod
    def validate_table_number(cls, value):
        if value <= 0:
            raise ValueError("Table number must be greater than 0.")
        return value


class TableUpdate(BaseModel):

    table_number: Optional[int] = Field(
        None,
        gt=0,
        le=999,
        description="Table number must be between 1 and 999"
    )

    capacity: Optional[int] = Field(
        None,
        ge=1,
        le=20,
        description="Capacity must be between 1 and 20"
    )

    status: Optional[
        Literal[
            "Available",
            "Reserved",
            "Occupied"
        ]
    ] = None


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    description: Optional[str] = None


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    description: Optional[str] = None


class MenuCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    category_id: str
    image: Optional[str] = None
    is_available: bool = True


class OrderStatusUpdate(BaseModel):
    status: str


class CartItemCreate(BaseModel):
    table_number: int
    menu_id: str
    quantity: int


class CartUpdate(BaseModel):
    quantity: int


class CartUpdate(BaseModel):
    quantity: int


class PlaceOrder(BaseModel):
    table_number: int


class KitchenOrderStatusUpdate(BaseModel):
    status: Literal["Preparing", "Ready"]


class ManagerOrderStatusUpdate(BaseModel):
    status: Literal["Served", "Completed"]


class FeedbackCreate(BaseModel):
    order_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: str | None = None


class TabletCreate(BaseModel):

    device_id: str

    table_number: int


class TabletUpdate(BaseModel):

    table_number: int


class TabletResponse(BaseModel):

    device_id: str

    table_number: int

    is_active: bool