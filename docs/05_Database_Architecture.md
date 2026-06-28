# 05_Database_Architecture.md

# Meraki House Database Architecture

**Database:** Supabase PostgreSQL

**Backend:** Laravel API

**Version:** 1.0

---

# 1. Database Philosophy

The database should be:

* Normalized
* Scalable
* Secure
* Easy to maintain
* Optimized for future expansion

The system should avoid duplicated data wherever possible.

---

# 2. Core Entities

The application revolves around these entities:

```
Users

↓

Addresses

↓

Categories

↓

Products

↓

Product Images

↓

Wishlist

↓

Cart

↓

Orders

↓

Order Items

↓

Reviews

↓

Support Messages
```

---

# 3. Database Relationships

```
User
│
├── has many Orders
├── has many Addresses
├── has many Wishlist Items
├── has many Reviews
└── has many Support Messages

Category
│
└── has many Products

Product
│
├── belongs to Category
├── has many Images
├── has many Reviews
├── belongs to many Orders
└── belongs to many Wishlists

Order
│
├── belongs to User
└── has many Order Items
```

---

# 4. Tables

The initial version of the project will contain the following tables:

1. users
2. addresses
3. categories
4. products
5. product_images
6. wishlist
7. cart
8. orders
9. order_items
10. reviews
11. support_messages

---

# 5. User Roles

There are only two roles:

```
Admin

Customer
```

The role will be stored in the `users` table.

---

# 6. Authentication

Authentication will use:

Supabase Authentication

Laravel will consume authenticated user information and manage authorization for protected API routes.

---

# 7. Users Table

Stores account information.

Fields include:

* Full Name
* Email
* Password (managed by Supabase Auth)
* Phone
* Role
* Profile Image
* Created At
* Updated At

---

# 8. Addresses Table

A user can have multiple saved addresses.

Examples:

* Home
* Office

Each address belongs to one user.

---

# 9. Categories Table

Examples:

* Shampoo Bars
* Conditioner Bars
* Face Bars
* Body Wash Bars
* Hair Oils
* Hair Masks
* Accessories

Each category contains multiple products.

---

# 10. Products Table

Stores the core product information.

Examples:

* Product Name
* Slug
* Description
* Ingredients
* Benefits
* Usage Instructions
* Price
* Stock Quantity
* Weight
* Category
* Featured Product
* Best Seller
* Active Status

Each product belongs to exactly one category.

---

# 11. Product Images

Each product can have multiple images.

Examples:

* Thumbnail
* Front View
* Side View
* Lifestyle Image

A product can also include videos in future versions.

---

# 12. Wishlist

Each customer can save multiple products.

One product may appear in multiple wishlists.

---

# 13. Cart

Stores products the customer intends to purchase.

Each cart item belongs to one user and one product.

---

# 14. Orders

Created after checkout.

Contains:

* User
* Address
* Payment Status
* Delivery Status
* Order Total
* Order Date

---

# 15. Order Items

Stores the individual products belonging to an order.

Each order contains one or more order items.

---

# 16. Reviews

Customers may leave reviews after purchasing.

Each review belongs to:

* One User
* One Product

Fields include:

* Rating
* Review Title
* Review Content
* Review Date

---

# 17. Support Messages

Customers can submit support requests.

Each message contains:

* Subject
* Message
* Status
* Reply
* Created Date

---

# 18. Media Storage

Images and videos will **not** be stored directly in PostgreSQL.

They will be uploaded to **Supabase Storage**, and only the file paths/URLs will be stored in the database.

---

# 19. Relationships Summary

```
User
├── Addresses
├── Orders
├── Wishlist
├── Reviews
└── Support Messages

Category
└── Products

Product
├── Images
├── Reviews
├── Wishlist
├── Cart
└── Order Items

Order
└── Order Items
```

---

# 20. Future Expansion

The schema is designed to support future additions without major restructuring.

Possible future tables:

* coupons
* blog_posts
* product_tags
* ingredients
* inventory_logs
* notifications
* subscriptions
* loyalty_points
* referrals
* payment_transactions

---

# 21. Development Guidelines

* Use UUIDs where appropriate.
* Enforce foreign key constraints.
* Avoid storing duplicate data.
* Keep media in Supabase Storage.
* Use timestamps for all tables.
* Use soft deletes only where business requirements justify them.
* Validate all input through Laravel Request classes.
* Keep business logic in Laravel Services.

---

# Database Summary

Meraki House uses a normalized PostgreSQL database hosted on Supabase, with Laravel acting as the API layer.

The schema is intentionally modular, allowing the project to grow without significant redesign while remaining simple enough for the current assignment requirements.