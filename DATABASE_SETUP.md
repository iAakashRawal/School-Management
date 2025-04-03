# Database Setup Guide

## Prerequisites

1. Install Node.js (v18 or later)
2. Install PostgreSQL (v14 or later)
3. Install Git

## System Requirements

```bash
# Windows
- Node.js v18+
- PostgreSQL v14+
- Git
- Windows 10 or later

# Required NPM packages
- @prisma/client
- prisma (dev dependency)
```

## Installation Steps

1. **Install PostgreSQL**
   - Download PostgreSQL from: https://www.postgresql.org/download/
   - During installation:
     - Remember your superuser (postgres) password
     - Default port: 5432
     - Install pgAdmin (recommended)

2. **Install Project Dependencies**
   ```bash
   npm install @prisma/client
   npm install prisma --save-dev
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in your project root:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/school_management"
   ```
   Replace:
   - USER with your PostgreSQL username (default: postgres)
   - PASSWORD with your PostgreSQL password
   - school_management with your desired database name

4. **Initialize Prisma**
   ```bash
   npx prisma init
   ```

5. **Create Database**
   ```bash
   # Using psql
   createdb school_management

   # OR using pgAdmin:
   # 1. Open pgAdmin
   # 2. Right-click on 'Databases'
   # 3. Click 'Create' > 'Database'
   # 4. Name it 'school_management'
   ```

## Database Schema

The schema is defined in `prisma/schema.prisma`. Here's our inventory management schema:

```prisma
model InventoryItem {
  id          String   @id @default(cuid())
  name        String   @unique
  category    String
  description String?
  quantity    Int      @default(0)
  unit        String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  transactions InventoryTransaction[]
}

model InventoryTransaction {
  id          String   @id @default(cuid())
  type        String   // 'IN' or 'OUT'
  quantity    Int
  date        DateTime
  remarks     String?
  referenceNo String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  itemId      String
  item        InventoryItem @relation(fields: [itemId], references: [id])
}
```

## Apply Database Migrations

After setting up:

1. **Generate Migration**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

2. **Verify Connection**
   ```bash
   npx prisma studio
   ```
   This will open Prisma Studio in your browser where you can verify the connection and manage data.

## Common Issues & Solutions

1. **Connection Failed**
   - Verify PostgreSQL is running
   - Check credentials in `.env`
   - Ensure database exists
   - Check firewall settings

2. **Permission Denied**
   - Verify user permissions in PostgreSQL
   - Check database user roles
   - Ensure proper access rights

3. **Port Already in Use**
   - Check if PostgreSQL is running on default port (5432)
   - Update port in connection string if using different port

## Maintenance

1. **Backup Database**
   ```bash
   pg_dump -U postgres school_management > backup.sql
   ```

2. **Restore Database**
   ```bash
   psql -U postgres school_management < backup.sql
   ```

3. **Reset Database**
   ```bash
   npx prisma migrate reset
   ```

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js PostgreSQL Setup Guide](https://node-postgres.com/) 