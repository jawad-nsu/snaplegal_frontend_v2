# API Routes & Backend Features Documentation

This document outlines all API routes and CRUD operations that should be implemented for the SnapLegal web application.

## Current Status

### ✅ Already Implemented

1. **Authentication APIs** (`/api/auth/*`)
   - `POST /api/auth/signup` - User registration
   - `POST /api/auth/signin` - User login
   - `POST /api/auth/send-otp` - Send OTP
   - `POST /api/auth/verify-otp` - Verify OTP
   - `GET/POST /api/auth/[...nextauth]` - NextAuth handlers

2. **User Management** (`/api/users`)
   - `GET /api/users` - List all users (with search & filter)
   - `POST /api/users` - Create user
   - `GET /api/users/[id]` - Get user by ID
   - `PUT /api/users/[id]` - Update user
   - `DELETE /api/users/[id]` - Delete user

3. **Lead Management** (`/api/leads`)
   - `GET /api/leads` - List all leads (with search & filters)
   - `POST /api/leads` - Create lead
   - `GET /api/leads/[id]` - Get lead by ID
   - `PUT /api/leads/[id]` - Update lead
   - `DELETE /api/leads/[id]` - Delete lead

4. **Employee Management** (`/api/employees`)
   - `GET /api/employees` - List all employees (ADMIN & EMPLOYEE types)

5. **Vendor/Partner** (`/api/vendor`)
   - `GET /api/vendor/profile` - Get partner profile

---

## 🚧 Required API Routes to Implement

### 1. Services Management (`/api/services`)

**Purpose:** Manage service offerings (AC repair, cleaning, plumbing, etc.)

**Routes:**
- `GET /api/services` - List all services
  - Query params: `category`, `search`, `minPrice`, `maxPrice`, `rating`, `page`, `limit`
  - Response: Paginated list of services with filters
- `POST /api/services` - Create new service (ADMIN/PARTNER only)
  - Body: `name`, `slug`, `category`, `description`, `image`, `price`, `originalPrice`, `features[]`, `packages[]`
- `GET /api/services/[slug]` - Get service by slug
  - Response: Full service details with packages, FAQs, reviews
- `PUT /api/services/[slug]` - Update service (ADMIN/PARTNER only)
- `DELETE /api/services/[slug]` - Delete service (ADMIN only)
- `GET /api/services/categories` - List all service categories
- `GET /api/services/category/[categoryId]` - Get services by category

**Database Model Needed:**
```prisma
model Service {
  id            String   @id @default(uuid())
  name          String
  slug          String   @unique
  category      String
  description   String?  @db.Text
  image         String?
  price         Float
  originalPrice Float?
  rating        Float    @default(0)
  reviewCount   Int      @default(0)
  features      String[]
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  packages      ServicePackage[]
  reviews       Review[]
  orderItems    OrderItem[]
}
```

---

### 2. Service Packages (`/api/services/[slug]/packages`)

**Purpose:** Manage service packages (different pricing tiers)

**Routes:**
- `GET /api/services/[slug]/packages` - Get packages for a service
- `POST /api/services/[slug]/packages` - Create package (ADMIN/PARTNER only)
- `PUT /api/services/[slug]/packages/[packageId]` - Update package
- `DELETE /api/services/[slug]/packages/[packageId]` - Delete package

**Database Model Needed:**
```prisma
model ServicePackage {
  id          String   @id @default(uuid())
  serviceId   String
  service     Service  @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  name        String
  price       Float
  originalPrice Float?
  features    String[]
  popular     Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### 3. Orders/Service Orders (`/api/orders`)

**Purpose:** Manage customer orders and service bookings

**Routes:**
- `GET /api/orders` - List orders
  - Query params: `userId`, `status`, `dateFrom`, `dateTo`, `page`, `limit`
  - Auth: Users see their own, ADMIN/EMPLOYEE see all
- `POST /api/orders` - Create order from cart
  - Body: `items[]`, `customerId`, `address`, `scheduledDate`, `scheduledTime`, `notes`, `paymentMethod`
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]` - Update order (status, schedule, etc.)
  - Auth: ADMIN/EMPLOYEE can update status, users can update schedule
- `DELETE /api/orders/[id]` - Cancel order (soft delete)
- `GET /api/orders/[id]/timeline` - Get order status timeline
- `PUT /api/orders/[id]/status` - Update order status (ADMIN/EMPLOYEE only)
- `POST /api/orders/[id]/assign` - Assign order to employee/vendor (ADMIN only)

**Database Model Needed:**
```prisma
enum OrderStatus {
  Submitted
  Confirmed
  Assigned
  InProgress
  Review
  Delivered
  Closed
  Cancelled
}

enum PaymentMethod {
  bKash
  Card
  Cash
}

enum PaymentStatus {
  Pending
  Paid
  Refunded
  Failed
}

model Order {
  id              String        @id @default(uuid())
  orderNumber     String        @unique
  customerId      String
  customer        User          @relation("CustomerOrders", fields: [customerId], references: [id])
  vendorId        String?
  vendor          User?         @relation("VendorOrders", fields: [vendorId], references: [id])
  assignedToId   String?
  assignedTo     User?          @relation("AssignedOrders", fields: [assignedToId], references: [id])
  status          OrderStatus   @default(Submitted)
  paymentMethod   PaymentMethod
  paymentStatus   PaymentStatus @default(Pending)
  subtotal        Float
  additionalCost  Float         @default(0)
  deliveryCharge  Float         @default(0)
  discount        Float         @default(0)
  total           Float
  scheduledDate   DateTime?
  scheduledTime   String?
  address         String?
  notes           String?       @db.Text
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  items           OrderItem[]
  documents       OrderDocument[]
  timeline        OrderTimeline[]
  payments        Payment[]
}
```

---

### 4. Order Items (`/api/orders/[id]/items`)

**Purpose:** Manage individual items within an order

**Routes:**
- `GET /api/orders/[id]/items` - Get order items
- `POST /api/orders/[id]/items` - Add item to order
- `PUT /api/orders/[id]/items/[itemId]` - Update order item
- `DELETE /api/orders/[id]/items/[itemId]` - Remove item from order

**Database Model Needed:**
```prisma
model OrderItem {
  id          String   @id @default(uuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  serviceId   String?
  service     Service? @relation(fields: [serviceId], references: [id])
  serviceName String
  packageId   String?
  package     ServicePackage? @relation(fields: [packageId], references: [id])
  quantity    Int      @default(1)
  price       Float
  originalPrice Float?
  details     String?  // e.g., "1-2.5 Ton"
  createdAt   DateTime @default(now())
}
```

---

### 5. Cart Management (`/api/cart`)

**Purpose:** Manage shopping cart (session-based or user-based)

**Routes:**
- `GET /api/cart` - Get current user's cart
- `POST /api/cart/items` - Add item to cart
  - Body: `serviceId`, `packageId`, `quantity`, `scheduledDate`, `scheduledTime`, `details`
- `PUT /api/cart/items/[itemId]` - Update cart item (quantity, schedule)
- `DELETE /api/cart/items/[itemId]` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart
- `POST /api/cart/apply-promo` - Apply promo code
- `DELETE /api/cart/remove-promo` - Remove promo code

**Database Model Needed:**
```prisma
model Cart {
  id        String     @id @default(uuid())
  userId    String?    // null for guest carts
  user      User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
  sessionId String?    // for guest carts
  items     CartItem[]
  promoCode String?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id            String   @id @default(uuid())
  cartId        String
  cart          Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  serviceId     String
  service       Service  @relation(fields: [serviceId], references: [id])
  packageId     String?
  package       ServicePackage? @relation(fields: [packageId], references: [id])
  quantity      Int      @default(1)
  scheduledDate DateTime?
  scheduledTime String?
  details       String?
  createdAt     DateTime @default(now())
}
```

---

### 6. Payments (`/api/payments`)

**Purpose:** Handle payment processing and transactions

**Routes:**
- `POST /api/payments` - Create payment for order
  - Body: `orderId`, `paymentMethod`, `amount`, `transactionId` (for bKash/card)
- `GET /api/payments/[id]` - Get payment details
- `GET /api/payments/order/[orderId]` - Get payments for an order
- `POST /api/payments/[id]/verify` - Verify payment (for bKash/card)
- `POST /api/payments/[id]/refund` - Process refund (ADMIN only)

**Database Model Needed:**
```prisma
model Payment {
  id            String        @id @default(uuid())
  orderId       String
  order         Order         @relation(fields: [orderId], references: [id])
  amount        Float
  paymentMethod PaymentMethod
  status        PaymentStatus @default(Pending)
  transactionId String?       // bKash transaction ID, card transaction ID
  receipt       String?       // Receipt URL
  paidAt        DateTime?
  refundedAt    DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}
```

---

### 7. Reviews & Ratings (`/api/reviews`)

**Purpose:** Customer reviews and ratings for services

**Routes:**
- `GET /api/reviews` - List reviews
  - Query params: `serviceId`, `userId`, `rating`, `page`, `limit`
- `POST /api/reviews` - Create review (authenticated users only)
  - Body: `serviceId`, `orderId`, `rating`, `comment`, `images[]`
- `GET /api/reviews/[id]` - Get review details
- `PUT /api/reviews/[id]` - Update own review
- `DELETE /api/reviews/[id]` - Delete own review or ADMIN
- `POST /api/reviews/[id]/helpful` - Mark review as helpful
- `GET /api/reviews/service/[serviceId]` - Get reviews for a service

**Database Model Needed:**
```prisma
model Review {
  id          String   @id @default(uuid())
  serviceId  String
  service    Service  @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  orderId    String?  // Link to order if available
  rating     Int      // 1-5
  comment    String?  @db.Text
  images     String[] // URLs
  helpfulCount Int    @default(0)
  isVerified Boolean  @default(false) // Verified purchase
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

---

### 8. Documents/File Uploads (`/api/documents`)

**Purpose:** Handle document uploads for orders (ID cards, agreements, etc.)

**Routes:**
- `POST /api/documents/upload` - Upload document
  - Body: FormData with file, `orderId`, `documentType`, `isRequired`
- `GET /api/documents/order/[orderId]` - Get documents for an order
- `GET /api/documents/[id]` - Get document details
- `DELETE /api/documents/[id]` - Delete document
- `GET /api/documents/[id]/download` - Download document

**Database Model Needed:**
```prisma
enum DocumentType {
  NationalId
  ServiceAgreement
  PropertyOwnership
  PreviousReceipt
  Other
}

model OrderDocument {
  id            String       @id @default(uuid())
  orderId       String
  order         Order        @relation(fields: [orderId], references: [id], onDelete: Cascade)
  documentType  DocumentType
  fileName      String
  fileUrl       String
  fileSize      Int
  isRequired    Boolean      @default(false)
  uploadedBy    String       // userId
  uploadedAt    DateTime     @default(now())
}
```

---

### 9. Addresses (`/api/addresses`)

**Purpose:** Manage customer delivery addresses

**Routes:**
- `GET /api/addresses` - Get user's addresses
- `POST /api/addresses` - Create address
  - Body: `label`, `street`, `city`, `thana`, `district`, `postalCode`, `country`, `isDefault`
- `GET /api/addresses/[id]` - Get address details
- `PUT /api/addresses/[id]` - Update address
- `DELETE /api/addresses/[id]` - Delete address
- `PUT /api/addresses/[id]/set-default` - Set as default address

**Database Model Needed:**
```prisma
model Address {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  label      String?  // "Home", "Office", etc.
  street     String
  city       String
  thana      String?
  district   String
  postalCode String?
  country    String   @default("Bangladesh")
  isDefault  Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

---

### 10. Promotions & Discounts (`/api/promotions`)

**Purpose:** Manage promo codes and discounts

**Routes:**
- `GET /api/promotions` - List active promotions (public)
- `GET /api/promotions/all` - List all promotions (ADMIN only)
- `POST /api/promotions` - Create promotion (ADMIN only)
  - Body: `code`, `type` (percentage/fixed), `value`, `minPurchase`, `maxDiscount`, `validFrom`, `validTo`, `usageLimit`
- `GET /api/promotions/[id]` - Get promotion details
- `PUT /api/promotions/[id]` - Update promotion (ADMIN only)
- `DELETE /api/promotions/[id]` - Delete promotion (ADMIN only)
- `POST /api/promotions/validate` - Validate promo code
  - Body: `code`, `cartTotal`

**Database Model Needed:**
```prisma
enum PromotionType {
  Percentage
  Fixed
}

model Promotion {
  id          String         @id @default(uuid())
  code        String         @unique
  type        PromotionType
  value       Float          // Percentage or fixed amount
  minPurchase Float?         // Minimum purchase amount
  maxDiscount Float?         // Maximum discount cap
  validFrom   DateTime
  validTo     DateTime
  usageLimit  Int?           // Total usage limit
  usedCount   Int            @default(0)
  isActive    Boolean        @default(true)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}
```

---

### 11. Notifications (`/api/notifications`)

**Purpose:** User notifications (order updates, messages, etc.)

**Routes:**
- `GET /api/notifications` - Get user's notifications
  - Query params: `unreadOnly`, `page`, `limit`
- `GET /api/notifications/[id]` - Get notification details
- `PUT /api/notifications/[id]/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/[id]` - Delete notification

**Database Model Needed:**
```prisma
enum NotificationType {
  OrderUpdate
  Payment
  Message
  System
  Promotion
}

model Notification {
  id        String           @id @default(uuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      NotificationType
  title     String
  message   String           @db.Text
  link      String?
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())
}
```

---

### 12. Chat/Messages (`/api/messages`)

**Purpose:** Customer support chat and order-related messaging

**Routes:**
- `GET /api/messages` - Get conversations
  - Query params: `orderId`, `userId`
- `GET /api/messages/conversation/[conversationId]` - Get messages in conversation
- `POST /api/messages` - Send message
  - Body: `conversationId`, `orderId`, `message`, `attachments[]`
- `PUT /api/messages/[id]/read` - Mark message as read
- `DELETE /api/messages/[id]` - Delete message

**Database Model Needed:**
```prisma
model Conversation {
  id          String    @id @default(uuid())
  orderId     String?
  order       Order?    @relation(fields: [orderId], references: [id])
  participants String[] // User IDs
  lastMessage DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  messages    Message[]
}

model Message {
  id             String       @id @default(uuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  senderId       String
  sender         User         @relation(fields: [senderId], references: [id])
  message        String       @db.Text
  attachments    String[]     // URLs
  isRead         Boolean      @default(false)
  createdAt      DateTime     @default(now())
}
```

---

### 13. Service Categories (`/api/categories`)

**Purpose:** Manage service categories

**Routes:**
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (ADMIN only)
- `GET /api/categories/[id]` - Get category details
- `PUT /api/categories/[id]` - Update category (ADMIN only)
- `DELETE /api/categories/[id]` - Delete category (ADMIN only)

**Database Model Needed:**
```prisma
model Category {
  id          String    @id @default(uuid())
  name        String    @unique
  slug        String    @unique
  icon        String?   // Icon name or URL
  description String?   @db.Text
  image       String?
  isActive    Boolean   @default(true)
  sortOrder   Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

---

### 14. Order Timeline (`/api/orders/[id]/timeline`)

**Purpose:** Track order status changes and history

**Routes:**
- `GET /api/orders/[id]/timeline` - Get order timeline
- `POST /api/orders/[id]/timeline` - Add timeline event (system/ADMIN)

**Database Model Needed:**
```prisma
model OrderTimeline {
  id          String      @id @default(uuid())
  orderId     String
  order       Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)
  status      OrderStatus
  description String?     @db.Text
  createdBy   String?     // User ID or "system"
  createdAt   DateTime    @default(now())
}
```

---

### 15. Partner/Vendor Management (`/api/vendor`)

**Purpose:** Extended vendor/partner functionality

**Routes:**
- `GET /api/vendor/profile` - ✅ Already exists
- `PUT /api/vendor/profile` - Update partner profile
  - Body: `businessName`, `businessType`, `registrationNumber`, `address`, `district`, `serviceCategories[]`, `image`
- `GET /api/vendor/orders` - Get vendor's orders
- `GET /api/vendor/analytics` - Get vendor analytics (revenue, orders, ratings)
- `GET /api/vendor/services` - Get vendor's services (if vendors can create services)

---

### 16. Admin Dashboard APIs (`/api/admin`)

**Purpose:** Administrative functions

**Routes:**
- `GET /api/admin/stats` - Dashboard statistics
  - Response: `totalUsers`, `totalOrders`, `totalRevenue`, `pendingOrders`, `activeLeads`, etc.
- `GET /api/admin/analytics` - Analytics data
  - Query params: `dateFrom`, `dateTo`, `groupBy` (day/week/month)
- `GET /api/admin/users` - Enhanced user management (already exists at `/api/users`)
- `GET /api/admin/orders` - All orders with advanced filters
- `GET /api/admin/revenue` - Revenue reports
- `POST /api/admin/users/[id]/change-type` - Change user type (ADMIN only)
- `POST /api/admin/users/[id]/change-status` - Activate/deactivate user

---

### 17. Search & Filters (`/api/search`)

**Purpose:** Global search functionality

**Routes:**
- `GET /api/search` - Global search
  - Query params: `q` (query), `type` (services/orders/users), `filters`
  - Response: Aggregated results from multiple sources

---

## Database Schema Updates Required

Add these models to `prisma/schema.prisma`:

1. Service
2. ServicePackage
3. Order
4. OrderItem
5. OrderDocument
6. OrderTimeline
7. Cart
8. CartItem
9. Payment
10. Review
11. Address
12. Promotion
13. Notification
14. Conversation
15. Message
16. Category

Also add relations to existing User model:
```prisma
model User {
  // ... existing fields
  customerOrders Order[]        @relation("CustomerOrders")
  vendorOrders   Order[]        @relation("VendorOrders")
  assignedOrders Order[]        @relation("AssignedOrders")
  addresses      Address[]
  reviews        Review[]
  cart           Cart?
  notifications  Notification[]
  sentMessages   Message[]
}
```

---

## Priority Implementation Order

### Phase 1 (Critical - Core Functionality)
1. ✅ Users CRUD (Done)
2. ✅ Leads CRUD (Done)
3. Services CRUD
4. Orders CRUD
5. Cart Management
6. Payments

### Phase 2 (Important - User Experience)
7. Addresses
8. Reviews & Ratings
9. Documents/File Uploads
10. Order Timeline
11. Notifications

### Phase 3 (Enhancement Features)
12. Promotions & Discounts
13. Chat/Messages
14. Service Categories
15. Admin Dashboard APIs
16. Search & Filters

---

## Authentication & Authorization

All routes should implement:
- **Authentication:** Verify user is logged in (except public routes)
- **Authorization:** Check user type/permissions
  - `USER`: Can access own data
  - `PARTNER`: Can access own vendor data + assigned orders
  - `EMPLOYEE`: Can access assigned orders + read access to most data
  - `ADMIN`: Full access to everything

Use middleware or route-level checks:
```typescript
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { UserType } from '@prisma/client'

// Example authorization check
const session = await auth()
if (!session?.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

if (session.user.type !== UserType.ADMIN) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

---

## Response Format Standards

All API responses should follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "details": "Optional detailed error information"
}
```

**Paginated:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## Notes

- All timestamps should be in ISO 8601 format
- Use UUIDs for all IDs
- Implement soft deletes where appropriate (add `deletedAt` field)
- Add proper validation for all inputs
- Implement rate limiting for public endpoints
- Add proper error logging
- Consider implementing caching for frequently accessed data
- Add database indexes for frequently queried fields

