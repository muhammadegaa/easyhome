# 🏠 EasyHome - Integrated Electronic Housing Marketplace

**Eliminate Broker Fees. Buy & Sell Direct.**

A modern property marketplace platform that connects buyers and sellers directly, eliminating traditional broker fees of 2-5% and saving millions for property transactions across Indonesia.

![EasyHome](https://img.shields.io/badge/Status-MVP-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)

## 🎯 Core Value Propositions

- **50x Cost Savings**: Pay only 0.05-0.09% transaction fee vs traditional 2-5% broker fees
- **Direct Transactions**: Connect property owners with buyers/renters without intermediaries
- **Transparent Pricing**: No hidden fees, clear pricing structure
- **Digital Documentation**: Streamlined notary services and property documentation

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js + Express
- PostgreSQL with Prisma ORM
- JWT Authentication
- Nodemailer for email verification

**Frontend:**
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Zustand for state management
- Axios for API calls

## 📁 Project Structure

```
easyhome-mvp/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # Database connection
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── propertyController.js
│   │   ├── middleware/
│   │   │   └── auth.js          # Authentication middleware
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── propertyRoutes.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   ├── password.js
│   │   │   └── email.js
│   │   └── index.js             # Main server file
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── auth/                # Authentication pages
│   │   ├── properties/          # Property listing pages
│   │   ├── dashboard/           # User dashboard
│   │   ├── layout.js            # Root layout
│   │   ├── page.js              # Homepage
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.js
│   │   └── property/
│   ├── lib/
│   │   ├── api/
│   │   │   └── client.js        # API client & endpoints
│   │   └── store/
│   │       └── authStore.js     # Auth state management
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository**
```bash
cd /Users/muhammadegaa/Documents/Sides/easyhome/easyhome-mvp
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

3. **Set up environment variables**

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/easyhome?schema=public"
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```bash
cd ../frontend
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

4. **Set up database**
```bash
cd backend

# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

5. **Run the development servers**

**Option 1: Run all services concurrently (from root)**
```bash
cd ..
npm run dev
```

**Option 2: Run separately**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/health

## 📊 Database Schema

### Core Models

**User**
- Supports multiple roles: BUYER, SELLER, DEVELOPER, NOTARY, ADMIN
- Email verification system
- Membership tiers for developers and notaries

**Property**
- Multiple property types: HOUSE, APARTMENT, LAND, COMMERCIAL, VILLA
- Listing types: SALE or RENT
- Comprehensive property details (bedrooms, bathrooms, area, etc.)
- Geolocation support
- Boosting/paid advertisement support

**Transaction**
- Tracks property sales
- Platform fee calculation (0.05-0.09%)
- Notary appointment scheduling
- Document management

**Additional Models:**
- PropertyImage
- PropertyFavorite
- Message (buyer-seller communication)
- Review
- MembershipPayment
- AdBoostPayment

## 🔐 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login
POST   /api/auth/verify-email      - Verify email
GET    /api/auth/profile           - Get user profile (protected)
PUT    /api/auth/profile           - Update profile (protected)
POST   /api/auth/resend-verification - Resend verification email (protected)
```

### Properties
```
GET    /api/properties             - Get all properties (with filters)
GET    /api/properties/:id         - Get single property
POST   /api/properties             - Create property (protected)
PUT    /api/properties/:id         - Update property (protected)
DELETE /api/properties/:id         - Delete property (protected)
GET    /api/properties/my/listings - Get user's properties (protected)
POST   /api/properties/:id/favorite - Toggle favorite (protected)
GET    /api/properties/my/favorites - Get favorites (protected)
```

### Query Parameters for Property Search
```
?search=           - Search in title, description, address
?propertyType=     - HOUSE, APARTMENT, LAND, COMMERCIAL, VILLA
?listingType=      - SALE or RENT
?city=             - Filter by city
?province=         - Filter by province
?minPrice=         - Minimum price
?maxPrice=         - Maximum price
?bedrooms=         - Minimum bedrooms
?bathrooms=        - Minimum bathrooms
?page=             - Page number (default: 1)
?limit=            - Items per page (default: 20)
?sortBy=           - Sort field (default: createdAt)
?sortOrder=        - asc or desc (default: desc)
```

## 💰 Revenue Model (from Proposal)

### Transaction Fees
| Property Price Range | Fee Percentage | Fee Amount (on Rp 1B property) |
|---------------------|----------------|--------------------------------|
| < Rp 500M | 0.09% | Rp 450K |
| Rp 500M - Rp 750M | 0.08% | Rp 800K |
| Rp 750M - Rp 1B | 0.075% | Rp 750K |
| Rp 1B - Rp 3B | 0.07% | Rp 700K |
| Rp 3B - Rp 5B | 0.065% | Rp 3.25M |
| > Rp 5B | 0.05% | - |

### Rental Fee
- 0.09% of total rental contract value

### Membership Fees

**Developer Memberships:**
- Bronze: Rp 10,000,000/year
- Silver: Rp 25,000,000/year
- Gold: Rp 50,000,000/year
- Platinum: Rp 100,000,000/year

**Notary Memberships:**
- Bronze: Rp 1,000,000/year
- Silver: Rp 2,500,000/year
- Gold: Rp 5,000,000/year
- Platinum: Rp 10,000,000/year

### Property Ad Boosting
- Tier 1 (< 50m²): Rp 25,000/unit
- Tier 2 (50-100m²): Rp 50,000/unit
- Tier 3 (100-300m²): Rp 100,000/unit
- Tier 4 (> 500m²): Rp 250,000/unit

### Registration Fees
- Developer Registration: Rp 5,000,000 (one-time)
- Notary Registration: Rp 500,000 (one-time)

## 🎨 Frontend Features

### Implemented
- ✅ Responsive homepage with hero section
- ✅ Property search with filters
- ✅ Featured property cards
- ✅ User authentication (login/register)
- ✅ Navigation with user menu
- ✅ Zustand state management

### To Implement (Next Steps)
- 📝 Property detail page
- 📝 Property listing form (with image upload)
- 📝 User dashboard
- 📝 Favorites page
- 📝 User profile page
- 📝 Messaging system
- 📝 Google Maps integration
- 📝 Payment integration

## 🔧 Development Tools

**Database Management:**
```bash
npm run db:studio    # Open Prisma Studio (visual database editor)
```

**Code Structure:**
- Uses ES6 modules (`import`/`export`)
- JWT for authentication
- Bcrypt for password hashing
- Prisma for type-safe database queries
- Express middleware for route protection

## 🚢 Deployment

### Backend Deployment (Railway/Heroku/DigitalOcean)

1. Set environment variables on your platform
2. Ensure PostgreSQL database is provisioned
3. Run migrations: `npm run db:migrate`
4. Deploy the backend folder

### Frontend Deployment (Vercel/Netlify)

1. Connect your Git repository
2. Set build command: `npm run build`
3. Set environment variables (NEXT_PUBLIC_API_URL)
4. Deploy

## 📝 Next Steps for MVP Completion

1. **Image Upload System**
   - Implement Multer middleware
   - Upload to cloud storage (Cloudinary/AWS S3)
   - Property image management

2. **Messaging System**
   - Real-time chat using Socket.io
   - Message notifications

3. **Payment Integration**
   - Midtrans payment gateway (Indonesia)
   - Membership payment processing
   - Ad boost payment

4. **Membership System**
   - Developer/Notary onboarding
   - Membership benefits enforcement
   - Subscription management

5. **Admin Dashboard**
   - Property moderation
   - User management
   - Analytics

## 🤝 Contributing

1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Based on the business proposal from:
- Muhammad Rizky Syahfie - Universitas Indonesia
- Yosua Pelangi B. A. - Universitas Indonesia
- Fernando Namora - Universitas Indonesia

Competition: FNWMU 2019 - Festival Nasional Wirausaha Muda Udayana
