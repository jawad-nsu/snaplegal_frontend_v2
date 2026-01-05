# Setup SubCategory Model

## Steps to Fix the Error

The error occurs because the Prisma client hasn't been regenerated after adding the SubCategory model. Follow these steps:

### 1. Stop the Development Server
Press `Ctrl+C` in the terminal where your dev server is running.

### 2. Regenerate Prisma Client
```bash
npx prisma generate
```

### 3. Create and Run Database Migration
```bash
npx prisma migrate dev --name add_subcategory_model
```

This will:
- Create a migration file
- Apply it to your database
- Create the `sub_categories` table with all required fields

### 4. Restart Development Server
```bash
npm run dev
```

## What Was Added

- **SubCategory Model** in Prisma schema with:
  - `serialNumber` (Int?, unique)
  - `lastModifiedById` (String?)
  - `status` (String, default "active")
  - Relations to Category and User

- **API Routes**:
  - `GET /api/subcategories` - List all subcategories
  - `POST /api/subcategories` - Create subcategory
  - `GET /api/subcategories/[id]` - Get subcategory
  - `PUT /api/subcategories/[id]` - Update subcategory
  - `DELETE /api/subcategories/[id]` - Delete subcategory

- **Admin Page Updates**:
  - Full CRUD operations
  - Serial number support
  - Status management
  - Last modified tracking
  - Sorting by serial number or last modified date

