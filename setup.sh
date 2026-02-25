#!/bin/bash

echo "🏠 EasyHome MVP Setup Script"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}⚠️  PostgreSQL is not found. Please ensure PostgreSQL is installed and running.${NC}"
fi

# Install root dependencies
echo -e "\n${BLUE}📦 Installing root dependencies...${NC}"
npm install

# Install backend dependencies
echo -e "\n${BLUE}📦 Installing backend dependencies...${NC}"
cd backend
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "\n${BLUE}📝 Creating backend .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ Created backend/.env - Please update with your credentials${NC}"
else
    echo -e "${GREEN}✅ backend/.env already exists${NC}"
fi

# Install frontend dependencies
echo -e "\n${BLUE}📦 Installing frontend dependencies...${NC}"
cd ../frontend
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo -e "\n${BLUE}📝 Creating frontend .env.local file...${NC}"
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
EOF
    echo -e "${GREEN}✅ Created frontend/.env.local - Please update with your API keys${NC}"
else
    echo -e "${GREEN}✅ frontend/.env.local already exists${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Update backend/.env with your PostgreSQL credentials and SMTP settings"
echo "2. Update frontend/.env.local with your API keys"
echo "3. Create PostgreSQL database: createdb easyhome"
echo "4. Run database migrations: cd backend && npm run db:push"
echo "5. Start development servers: npm run dev (from root)"
echo ""
echo "Access the application:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend: http://localhost:5000"
echo "  - API Health: http://localhost:5000/health"
echo ""
echo -e "${BLUE}Happy coding! 🚀${NC}"
