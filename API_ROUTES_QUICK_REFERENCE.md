# API Routes Quick Reference

## ✅ Already Implemented

| Route | Methods | Status |
|-------|---------|--------|
| `/api/auth/*` | POST | ✅ Complete |
| `/api/users` | GET, POST | ✅ Complete |
| `/api/users/[id]` | GET, PUT, DELETE | ✅ Complete |
| `/api/leads` | GET, POST | ✅ Complete |
| `/api/leads/[id]` | GET, PUT, DELETE | ✅ Complete |
| `/api/employees` | GET | ✅ Complete |
| `/api/vendor/profile` | GET | ✅ Complete |

---

## 🚧 To Be Implemented

### Core Business Logic

| Route | Methods | Priority | Description |
|-------|---------|----------|-------------|
| `/api/services` | GET, POST | 🔴 High | Service listings & creation |
| `/api/services/[slug]` | GET, PUT, DELETE | 🔴 High | Individual service management |
| `/api/services/categories` | GET | 🔴 High | Service categories |
| `/api/orders` | GET, POST | 🔴 High | Order management |
| `/api/orders/[id]` | GET, PUT, DELETE | 🔴 High | Order details & updates |
| `/api/orders/[id]/status` | PUT | 🔴 High | Update order status |
| `/api/cart` | GET, POST, DELETE | 🔴 High | Shopping cart |
| `/api/cart/items` | POST, PUT, DELETE | 🔴 High | Cart item management |
| `/api/payments` | POST, GET | 🔴 High | Payment processing |
| `/api/payments/[id]/verify` | POST | 🔴 High | Payment verification |

### User Experience

| Route | Methods | Priority | Description |
|-------|---------|----------|-------------|
| `/api/addresses` | GET, POST, PUT, DELETE | 🟡 Medium | Delivery addresses |
| `/api/reviews` | GET, POST, PUT, DELETE | 🟡 Medium | Service reviews |
| `/api/documents` | POST, GET, DELETE | 🟡 Medium | Document uploads |
| `/api/notifications` | GET, PUT, DELETE | 🟡 Medium | User notifications |
| `/api/orders/[id]/timeline` | GET | 🟡 Medium | Order status history |

### Enhancement Features

| Route | Methods | Priority | Description |
|-------|---------|----------|-------------|
| `/api/promotions` | GET, POST, PUT, DELETE | 🟢 Low | Promo codes & discounts |
| `/api/messages` | GET, POST, PUT, DELETE | 🟢 Low | Customer support chat |
| `/api/admin/stats` | GET | 🟢 Low | Admin dashboard stats |
| `/api/admin/analytics` | GET | 🟢 Low | Analytics & reports |
| `/api/search` | GET | 🟢 Low | Global search |

---

## Database Models Needed

1. **Service** - Service offerings
2. **ServicePackage** - Service pricing packages
3. **Order** - Customer orders
4. **OrderItem** - Items in an order
5. **OrderDocument** - Uploaded documents
6. **OrderTimeline** - Order status history
7. **Cart** - Shopping cart
8. **CartItem** - Cart items
9. **Payment** - Payment transactions
10. **Review** - Service reviews
11. **Address** - Delivery addresses
12. **Promotion** - Promo codes
13. **Notification** - User notifications
14. **Conversation** - Chat conversations
15. **Message** - Chat messages
16. **Category** - Service categories

---

## Implementation Phases

### Phase 1: Core (Critical)
- Services CRUD
- Orders CRUD
- Cart Management
- Payments

### Phase 2: UX (Important)
- Addresses
- Reviews
- Documents
- Notifications
- Order Timeline

### Phase 3: Enhancements
- Promotions
- Chat/Messages
- Admin Analytics
- Search

---

## Total API Routes Summary

- **Already Implemented:** 7 route groups
- **To Be Implemented:** ~50+ routes across 17 route groups
- **Total Database Models Needed:** 16 new models

See `API_ROUTES_DOCUMENTATION.md` for detailed specifications.

