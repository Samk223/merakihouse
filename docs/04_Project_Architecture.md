# 04_Project_Architecture.md

# Meraki House Project Architecture

**Version:** 1.0

---

# 1. Project Structure

```text
meraki-house/
│
├── frontend/
├── backend/
├── docs/
└── README.md
```

---

# 2. Frontend Architecture

```text
frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── store/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   │
│   ├── App.tsx
│   ├── AppRoutes.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
└── vite.config.ts
```

---

# 3. Public Folder

```text
public/
│
├── fonts/
├── icons/
├── illustrations/
├── logos/
├── placeholders/
├── videos/
└── home/
```

---

# 4. Styles

```text
styles/
│
├── animations.css
├── colors.css
├── fonts.css
├── globals.css
├── spacing.css
├── typography.css
└── utilities.css
```

---

# 5. Pages

```text
pages/
│
├── HomePage.tsx
├── CollectionsPage.tsx
├── ProductPage.tsx
├── WishlistPage.tsx
├── CheckoutPage.tsx
├── ThankYouPage.tsx
├── LoginPage.tsx
├── SignupPage.tsx
├── ProfilePage.tsx
├── OrdersPage.tsx
├── HelpPage.tsx
│
├── AdminDashboardPage.tsx
├── AdminProductsPage.tsx
├── AdminOrdersPage.tsx
├── AdminCustomersPage.tsx
└── AdminRevenuePage.tsx
```

---

# 6. Layouts

```text
layouts/
│
├── MainLayout.tsx
├── AuthLayout.tsx
└── AdminLayout.tsx
```

---

# 7. Features

Each feature owns its components and logic.

```text
features/
│
├── home/
├── product/
├── auth/
├── cart/
├── wishlist/
├── checkout/
├── orders/
├── profile/
└── admin/
```

---

# 8. Backend Architecture

```text
backend/
│
├── app/
├── bootstrap/
├── config/
├── database/
├── public/
├── resources/
├── routes/
├── storage/
├── tests/
└── vendor/
```

---

# 9. Laravel App Structure

```text
app/
│
├── Http/
│   ├── Controllers/
│   ├── Middleware/
│   └── Requests/
│
├── Models/
├── Services/
├── Policies/
├── Jobs/
├── Notifications/
└── Providers/
```

---

# 10. Controllers

Every resource gets its own controller.

Example:

```text
Controllers/
│
├── AuthController.php
├── ProductController.php
├── CategoryController.php
├── WishlistController.php
├── CartController.php
├── OrderController.php
├── ReviewController.php
├── UserController.php
└── AdminController.php
```

---

# 11. Services

Business logic belongs here.

```text
Services/
│
├── ProductService.php
├── CartService.php
├── OrderService.php
├── PaymentService.php
└── RecommendationService.php
```

Controllers should remain thin.

---

# 12. API Routes

```text
api/
│
├── auth.php
├── products.php
├── categories.php
├── wishlist.php
├── cart.php
├── orders.php
├── reviews.php
├── profile.php
└── admin.php
```

---

# 13. Documentation

```text
docs/
│
├── README.md
├── 01_Project_Brain.md
├── 02_Brand_Guidelines.md
├── 03_Design_System.md
├── 04_Project_Architecture.md
├── 05_Database_Architecture.md
├── 06_API_Architecture.md
├── 07_Component_Library.md
├── 08_Coding_Guidelines.md
└── 09_Roadmap.md
```

---

# 14. Naming Conventions

## React

Components → PascalCase

Hooks → useCamelCase

Utilities → camelCase

Folders → lowercase

---

## Laravel

Controllers → PascalCase

Models → Singular PascalCase

Services → PascalCase

Database Tables → snake_case plural

---

# 15. Development Workflow

Design

↓

Database

↓

Backend

↓

API

↓

Frontend

↓

Testing

↓

Deployment

---

# 16. Git Workflow

Feature branches

↓

Pull Request

↓

Development

↓

Main

---

# 17. Project Principle

Every new feature must satisfy:

* Reusable
* Responsive
* Accessible
* Scalable
* Maintainable
* Well documented

No shortcuts should compromise the long-term architecture.
