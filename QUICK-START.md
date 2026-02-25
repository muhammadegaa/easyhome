# EasyHome MVP - Quick Start Guide

Get your EasyHome MVP running in **5 minutes**!

## Prerequisites Checklist

- [ ] Node.js 18+ installed ([download](https://nodejs.org/))
- [ ] PostgreSQL 14+ installed and running ([download](https://www.postgresql.org/download/))
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## Installation Steps

### 1. Navigate to Project
```bash
cd /Users/muhammadegaa/Documents/Sides/easyhome/easyhome-mvp
```

### 2. Run Automated Setup
```bash
./setup.sh
```

This will install all dependencies for backend and frontend.

### 3. Create PostgreSQL Database
```bash
# Option 1: Using psql
psql -U postgres
CREATE DATABASE easyhome;
\q

# Option 2: Using createdb
createdb easyhome
```

### 4. Configure Backend Environment

Edit `backend/.env`:

```env
# Required: Update these
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/easyhome?schema=public"

# Email (Optional for testing - you can skip email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# These are fine as-is for development
PORT=5000
NODE_ENV=development
JWT_SECRET=dev-secret-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Getting Gmail App Password** (if you want email verification):
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Go to "App Passwords"
4. Generate password for "Mail"
5. Use that password in `SMTP_PASS`

### 5. Configure Frontend Environment

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key-here  # Optional for now
```

### 6. Initialize Database
```bash
cd backend
npm run db:push
```

You should see: ✅ Database connected successfully

### 7. Start Development Servers

**Option A: Run Everything (Recommended)**
```bash
# From project root
cd ..
npm run dev
```

**Option B: Run Separately**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 8. Access Application

Open in browser:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/health

You should see:
- Frontend: EasyHome homepage
- Backend: `{"status":"OK","message":"EasyHome API is running"}`

## 🎉 You're Ready!

### Test the Application

1. **Register a User**
   - Go to http://localhost:3000 (when auth page is built)
   - Or use API directly:

   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "seller@example.com",
       "password": "password123",
       "name": "John Doe",
       "role": "SELLER"
     }'
   ```

2. **Create a Property** (using the token from registration)
   ```bash
   curl -X POST http://localhost:5000/api/properties \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -d '{
       "title": "Beautiful House in Jakarta",
       "description": "Modern house with 3 bedrooms",
       "propertyType": "HOUSE",
       "listingType": "SALE",
       "price": 2500000000,
       "address": "Jl. Sudirman No. 123",
       "city": "Jakarta",
       "province": "DKI Jakarta",
       "bedrooms": 3,
       "bathrooms": 2,
       "landArea": 200,
       "buildingArea": 150
     }'
   ```

3. **View Properties**
   - Visit: http://localhost:3000
   - Should see your property in the featured section!

## Troubleshooting

### Database Connection Failed
```bash
# Check if PostgreSQL is running
pg_isready

# If not, start it:
# macOS with Homebrew:
brew services start postgresql@14

# Linux:
sudo systemctl start postgresql

# Check connection:
psql -U postgres -c "SELECT version();"
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -ti:5000

# Kill it
kill -9 $(lsof -ti:5000)

# Or change PORT in backend/.env
PORT=5001
```

### Module Not Found
```bash
# Re-install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### Database Schema Issues
```bash
# Reset database
cd backend
npm run db:push -- --force-reset
```

## Development Tools

### View Database (Prisma Studio)
```bash
cd backend
npm run db:studio
```
Opens at: http://localhost:5555

### API Testing
Use these tools to test API endpoints:
- [Postman](https://www.postman.com/downloads/)
- [Insomnia](https://insomnia.rest/download)
- curl (command line)

### VS Code Extensions (Recommended)
- Prisma
- ESLint
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets

## Sample API Requests

### Get All Properties
```bash
curl http://localhost:5000/api/properties
```

### Search Properties
```bash
curl "http://localhost:5000/api/properties?city=Jakarta&minPrice=1000000000&maxPrice=3000000000"
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@example.com",
    "password": "password123"
  }'
```

## Next Steps

Once you have the basic MVP running:

1. **Build Frontend Pages** (in progress)
   - Login/Register pages
   - Property detail page
   - User dashboard

2. **Add Image Upload**
   - Property photos
   - User avatars

3. **Implement Messaging**
   - Buyer-seller communication

4. **Add Payment Integration**
   - Midtrans for Indonesia
   - Transaction fees

## Getting Help

- Read `README.md` for full documentation
- Check `MVP-STATUS.md` for feature status
- Review `backend/prisma/schema.prisma` for database structure
- Check API routes in `backend/src/routes/`

## Useful Commands

```bash
# Root directory
npm run dev              # Run both backend and frontend
npm run dev:backend      # Run only backend
npm run dev:frontend     # Run only frontend

# Backend directory
npm run dev              # Start dev server
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:migrate       # Create migration
npm run db:studio        # Open Prisma Studio

# Frontend directory
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
```

## Default Credentials

No default users exist. You need to register through:
- API: POST /api/auth/register
- Frontend: /auth/register (when page is built)

## Project Structure Overview

```
easyhome-mvp/
├── backend/          # Node.js/Express API
│   ├── prisma/       # Database schema
│   └── src/          # Source code
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       └── utils/
├── frontend/         # Next.js app
│   ├── app/          # Pages
│   ├── components/   # React components
│   └── lib/          # Utilities
└── README.md         # Full documentation
```

---

Happy building! 🚀

If you encounter any issues, check the troubleshooting section or review the full README.md.
