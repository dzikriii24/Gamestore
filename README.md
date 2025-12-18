# 🎮 Game Store - Steam-like Fullstack Application

![Game Store Screenshot](https://docs.google.com/document/d/1PZ8JqewEnk6e2FSv9zA-Ea-wCER_tZzJ_yu_rC9PhNk/edit?usp=sharing)



A modern, full-featured digital game distribution platform built with Laravel backend and React frontend. Inspired by Steam's elegant design, this application provides a complete e-commerce experience for digital games.

## ✨ Features

### 🎯 Core Features
- **Full CRUD Operations** - Complete Create, Read, Update, Delete functionality
- **Elegant Steam-like UI** - Dark theme with gradient accents and modern design
- **Shopping Cart System** - Real-time cart management with quantity control
- **Wishlist Management** - Add/remove games to/from wishlist
- **Game Filtering** - Filter by category, price range, discounts
- **Advanced Search** - Search games by title, description, or developer
- **Game Carousel** - Featured games showcase with SwiperJS
- **Responsive Design** - Fully responsive across all devices

### 🛒 Shopping Experience
- Add games to cart with one click
- Update quantities in real-time
- View cart total with discount calculations
- Clear cart functionality
- Persistent cart state (requires login)

### ❤️ Wishlist System
- Toggle games to/from wishlist
- Visual feedback for wishlisted items
- Wishlist counter in navigation
- Dedicated wishlist page

### 🎮 Game Management
- Featured games section
- Trending games highlight
- Special deals showcase
- Game categories browsing
- Detailed game cards with hover effects
- Rating system (1-5 stars)

### 👨‍💼 Admin Panel
- Add new games
- Edit existing games
- Delete games
- Game statistics overview
- Protected admin routes

## 🏗️ Tech Stack

### Backend
- **Laravel 10+** - PHP framework
- **MySQL** - Database
- **Laravel Sanctum** - Authentication
- **Eloquent ORM** - Database operations
- **API Resources** - JSON responses

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling framework
- **React Router DOM** - Navigation
- **SwiperJS** - Carousel/slider
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

## 📁 Project Structure

```
game-store-app/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Models/         # Game, Cart, Wishlist models
│   │   ├── Http/
│   │   │   ├── Controllers/ # API controllers
│   │   │   ├── Resources/   # API resources
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/     # Database migrations
│   │   └── seeders/        # Sample data
│   └── routes/             # API routes
│
└── frontend/               # React App
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── contexts/       # React contexts
    │   ├── pages/          # Page components
    │   ├── services/       # API services
    │   └── utils/          # Utility functions
```

## 🚀 Quick Start

### Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js 16 or higher
- MySQL 5.7 or higher
- Git

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/dzikriii24/Gamestore.git
cd game-store-app
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env file
# Update DB_DATABASE, DB_USERNAME, DB_PASSWORD

# Run migrations
php artisan migrate

# Seed database with sample data
php artisan db:seed --class=GameSeeder

# Generate sanctum migration
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Start the backend server
php artisan serve
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
```

#### 4. Configure CORS

Update `backend/config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:5173'], // Vite dev server
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

## 🔧 Configuration

### Backend (.env)

```env
APP_NAME="Game Store"
APP_ENV=local
APP_KEY=
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=game_store
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

### Frontend (Environment Variables)

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Game Store
```

## 📊 Database Schema

### Games Table
```sql
games
├── id (primary key)
├── title
├── description
├── price
├── discount
├── rating
├── category
├── platform
├── developer
├── publisher
├── release_date
├── image_url
├── screenshots (JSON)
├── tags (JSON)
├── age_rating
├── is_featured
├── is_trending
└── timestamps
```

### Carts & Cart Items
```sql
carts
├── id
├── user_id
└── timestamps

cart_items
├── id
├── cart_id
├── game_id
├── quantity
└── timestamps
```

### Wishlists
```sql
wishlists
├── id
├── user_id
├── game_id
└── timestamps
```

## 🌐 API Endpoints

### Public Endpoints
```
GET    /api/games              - List all games
GET    /api/games/{id}         - Get specific game
GET    /api/games/featured     - Get featured games
GET    /api/games/trending     - Get trending games
GET    /api/games/on-sale      - Get games on sale
GET    /api/games/categories   - List all categories
POST   /api/register           - Register new user
POST   /api/login              - User login
```

### Protected Endpoints (Requires Authentication)
```
GET    /api/user               - Get current user
POST   /api/logout             - User logout
GET    /api/cart               - Get user's cart
POST   /api/cart/add/{id}      - Add game to cart
PUT    /api/cart/update/{id}   - Update cart item quantity
DELETE /api/cart/remove/{id}   - Remove from cart
DELETE /api/cart/clear         - Clear cart
GET    /api/wishlist           - Get user's wishlist
POST   /api/wishlist/toggle/{id} - Toggle wishlist
GET    /api/wishlist/check/{id} - Check if in wishlist
```

### Admin Endpoints
```
POST   /api/games              - Create new game
PUT    /api/games/{id}         - Update game
DELETE /api/games/{id}         - Delete game
```

## 🎨 UI Components

### GameCard Component
- Displays game image, title, price, and rating
- Hover effects with game description
- Add to cart button
- Wishlist toggle button
- Discount badges

### GameSwiper Component
- Featured games carousel
- Autoplay with navigation
- Full-screen hero images
- Call-to-action buttons

### Sidebar Navigation
- Main navigation menu
- Categories filter
- Cart counter badge
- User profile section

## 🔐 Authentication Flow

1. User registers/login via API
2. JWT token returned and stored in localStorage
3. Token included in subsequent API requests
4. Protected routes check for valid token
5. Automatic logout on token expiration

## 🧪 Testing

### Backend Tests
```bash
cd backend
php artisan test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Production)

```bash
# Set environment to production
APP_ENV=production
APP_DEBUG=false

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force
```

### Frontend Deployment

```bash
# Build for production
cd frontend
npm run build

# The built files will be in the 'dist' directory
# Deploy to hosting service (Vercel, Netlify, etc.)
```

## 📱 Pages Overview

### Home Page (`/`)
- Featured games carousel
- Trending games section
- Special deals showcase
- Game categories preview

### Games Page (`/games`)
- All games grid view
- Advanced filtering options
- Search functionality
- Sorting options (price, rating, date)

### Cart Page (`/cart`)
- Shopping cart items
- Quantity adjustments
- Cart total calculation
- Checkout button

### Wishlist Page (`/wishlist`)
- Wishlisted games
- Remove from wishlist
- Move to cart functionality

### Admin Page (`/admin`)
- Game management interface
- Add/edit/delete games
- Game statistics

## 🎯 Features in Detail

### Filtering System
- Filter by category (RPG, Action, Adventure, etc.)
- Price range filter
- On-sale filter
- Platform filter
- Rating filter

### Search Functionality
- Real-time search suggestions
- Search in title, description, developer
- Category-based search

### Shopping Cart Features
- Real-time quantity updates
- Total price calculation with discounts
- Persistent cart (requires login)
- Cart item removal
- Clear entire cart

### Wishlist Features
- One-click wishlist toggle
- Visual feedback (heart animation)
- Wishlist counter
- Dedicated wishlist page

## 🛠️ Development

### Adding New Features

1. **Backend Changes**
   - Create new migration: `php artisan make:migration create_table_name`
   - Create model: `php artisan make:model ModelName`
   - Create controller: `php artisan make:controller Api/ControllerName`
   - Define routes in `routes/api.php`

2. **Frontend Changes**
   - Create new component: `src/components/NewComponent.jsx`
   - Add route in `src/App.jsx`
   - Update context if needed

### Code Style

Backend follows PSR-12 standards:
```bash
composer require --dev friendsofphp/php-cs-fixer
./vendor/bin/php-cs-fixer fix
```

Frontend follows ESLint configuration:
```bash
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspired by Steam Store
- Icons from React Icons
- Images from Unsplash
- SwiperJS for carousel functionality
- Framer Motion for animations

## 📞 Support

For support, email dzikrirabbani2401@gmail.com or create an issue in the GitHub repository.

---

**Made with ❤️ for the gaming community**

Happy Gaming! 🎮
