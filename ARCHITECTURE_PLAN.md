# Cleaning Hub Website Architecture Plan

## Project Overview
A comprehensive cleaning services website for "Cleaning Hub" with online booking, customer accounts, and WhatsApp integration.

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui or Headless UI
- **State Management**: Zustand or Context API
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend & Integration
- **Workflow Automation**: n8n (self-hosted or cloud)
- **Database**: Supabase (PostgreSQL) or Firebase
- **Authentication**: NextAuth.js with Supabase Auth
- **Email Service**: SendGrid or Resend (via n8n)
- **WhatsApp**: WhatsApp Business API
- **Payment Processing**: Via WhatsApp Bot

### Hosting & Deployment
- **Frontend Hosting**: Netlify
- **Build Tool**: Next.js with Turbopack
- **CI/CD**: Netlify automatic deployments from GitHub

## Core Features

### 1. Public Website
- Homepage with hero section and service highlights
- Comprehensive services page (16 services)
- About Us page
- Gallery with before/after photos
- Testimonials/Reviews section
- Contact page with form
- Blog section with cleaning tips
- SEO optimized pages

### 2. Booking System
- Service selection interface
- Calendar-based availability viewer
- Time slot selection
- Booking form with customer details
- Real-time availability checking
- Booking confirmation system

### 3. Customer Portal
- User registration/login
- Profile management
- Booking history
- Upcoming appointments
- Reschedule/cancel bookings
- Download invoices
- **Loyalty points dashboard**
- **Review submission interface**
- **Referral system**

### 4. Admin Dashboard
- Booking management
- Availability calendar management
- Customer management
- Service management
- Reports and analytics
- Email/SMS notifications settings
- **Review moderation panel**
- **Loyalty program management**

### 5. WhatsApp Integration
- Floating chat button
- Quick inquiry templates
- Booking confirmations via WhatsApp
- Payment links through WhatsApp Bot
- Customer support chat
- **Loyalty points notifications**

### 6. Reviews & Ratings System
- Star rating component (1-5 stars)
- Written review submission
- Photo upload with reviews
- Review moderation workflow
- Display reviews on service pages
- Average rating calculations
- Verified customer badge
- Response from business feature
- Sort/filter reviews options

### 7. Blog & Content Marketing
- Article categories (Cleaning Tips, Home Care, Green Cleaning, Seasonal)
- Rich text editor for admin
- Featured articles section
- Search functionality
- Tags and categories
- Author profiles
- Social sharing buttons
- Comment system with moderation
- Related articles suggestions
- RSS feed for SEO
- Newsletter subscription integration

### 8. Loyalty Program
- Points earning system
- Tier-based rewards (Bronze, Silver, Gold, Platinum)
- Points redemption catalog
- Referral bonus system
- Birthday rewards
- Service-specific multipliers
- Points expiry management
- Loyalty member exclusive offers
- Digital loyalty card
- Points transfer options

## Database Schema

### Tables
1. **users**
   - id, email, name, phone, password_hash, role, created_at
   - loyalty_tier, loyalty_points, referral_code, referred_by

2. **services**
   - id, name, description, price, duration, category, active
   - average_rating, total_reviews, points_multiplier

3. **bookings**
   - id, user_id, service_id, date, time_slot, status, notes, created_at
   - points_earned, review_id

4. **availability**
   - id, date, time_slots (JSON), is_available

5. **testimonials**
   - id, customer_name, rating, review, service_id, created_at

6. **gallery_images**
   - id, title, before_url, after_url, service_id, created_at

7. **reviews**
   - id, user_id, booking_id, service_id, rating, title, comment
   - photos (JSON), verified, status, helpful_count, created_at
   - business_response, response_date

8. **loyalty_points**
   - id, user_id, points, transaction_type, description
   - booking_id, expiry_date, created_at

9. **loyalty_rewards**
   - id, name, description, points_required, tier_required
   - discount_type, discount_value, active, usage_limit

10. **loyalty_transactions**
    - id, user_id, reward_id, points_used, status, created_at

11. **referrals**
    - id, referrer_id, referred_id, status, points_awarded, created_at

12. **blog_posts**
    - id, title, slug, content, excerpt, featured_image, author_id
    - category_id, tags (JSON), status, views, created_at, updated_at

13. **blog_categories**
    - id, name, slug, description, parent_id

14. **blog_comments**
    - id, post_id, user_id, comment, status, created_at

## n8n Workflows

### 1. Contact Form Workflow
- Trigger: Form submission
- Actions:
  - Validate data
  - Send email to admin
  - Send confirmation to customer
  - Store in database
  - Send WhatsApp notification

### 2. Booking Workflow
- Trigger: New booking request
- Actions:
  - Check availability
  - Create booking record
  - Send confirmation email
  - Send WhatsApp confirmation
  - Update calendar
  - Notify admin
  - Calculate and award loyalty points

### 3. Reminder Workflow
- Trigger: Scheduled (daily)
- Actions:
  - Query upcoming bookings
  - Send reminder emails (24h before)
  - Send WhatsApp reminders
  - Log notifications

### 4. Review Request Workflow
- Trigger: 24 hours after service completion
- Actions:
  - Send review request email
  - Send WhatsApp review link
  - Track review submission
  - Award bonus points for review

### 5. Loyalty Points Workflow
- Trigger: Booking completion
- Actions:
  - Calculate points based on service
  - Apply tier multipliers
  - Update user points balance
  - Check for tier upgrade
  - Send points notification

### 6. Referral Workflow
- Trigger: New user registration with referral code
- Actions:
  - Validate referral code
  - Award points to referrer
  - Send welcome bonus to new user
  - Track referral analytics

### 7. Blog Content Workflow
- Trigger: New blog post published
- Actions:
  - Generate SEO metadata
  - Create social media posts
  - Send newsletter to subscribers
  - Update sitemap
  - Ping search engines

## API Endpoints

### Public Endpoints
- `GET /api/services` - List all services
- `GET /api/testimonials` - Get testimonials
- `GET /api/gallery` - Get gallery images
- `POST /api/contact` - Submit contact form
- `GET /api/availability` - Check available slots
- `GET /api/reviews/:serviceId` - Get service reviews
- `GET /api/loyalty/rewards` - List available rewards
- `GET /api/blog/posts` - List blog posts
- `GET /api/blog/posts/:slug` - Get single blog post
- `GET /api/blog/categories` - List blog categories

### Protected Endpoints
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user bookings
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/reviews` - Submit review
- `PUT /api/reviews/:id` - Update review
- `GET /api/loyalty/points` - Get points balance
- `GET /api/loyalty/history` - Points transaction history
- `POST /api/loyalty/redeem` - Redeem reward
- `POST /api/referral/generate` - Generate referral code
- `GET /api/referral/status` - Check referral status
- `POST /api/blog/comments` - Submit blog comment

### Admin Endpoints
- `GET /api/admin/bookings` - All bookings
- `PUT /api/admin/availability` - Update availability
- `GET /api/admin/customers` - List customers
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/reviews` - All reviews for moderation
- `PUT /api/admin/reviews/:id` - Approve/reject review
- `POST /api/admin/reviews/:id/respond` - Respond to review
- `GET /api/admin/loyalty/members` - List loyalty members
- `POST /api/admin/loyalty/rewards` - Create new reward
- `PUT /api/admin/loyalty/rewards/:id` - Update reward
- `POST /api/admin/loyalty/points` - Manual points adjustment
- `GET /api/admin/blog/posts` - List all blog posts
- `POST /api/admin/blog/posts` - Create new blog post
- `PUT /api/admin/blog/posts/:id` - Update blog post
- `DELETE /api/admin/blog/posts/:id` - Delete blog post
- `GET /api/admin/blog/comments` - Moderate comments

## Component Structure

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx (Homepage)
│   │   ├── services/page.tsx
│   │   ├── about/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── booking/page.tsx
│   │   └── blog/
│   │       ├── page.tsx
│   │       ├── [slug]/page.tsx
│   │       └── category/[category]/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (customer)/
│   │   ├── dashboard/page.tsx
│   │   ├── bookings/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── loyalty/page.tsx
│   │   ├── reviews/page.tsx
│   │   └── referrals/page.tsx
│   ├── (admin)/
│   │   ├── admin/page.tsx
│   │   ├── admin/bookings/page.tsx
│   │   ├── admin/customers/page.tsx
│   │   ├── admin/reviews/page.tsx
│   │   ├── admin/loyalty/page.tsx
│   │   └── admin/blog/page.tsx
│   ├── api/
│   └── layout.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── booking/
│   │   ├── ServiceSelector.tsx
│   │   ├── Calendar.tsx
│   │   └── TimeSlots.tsx
│   ├── reviews/
│   │   ├── ReviewForm.tsx
│   │   ├── StarRating.tsx
│   │   ├── ReviewCard.tsx
│   │   └── ReviewList.tsx
│   ├── loyalty/
│   │   ├── PointsDisplay.tsx
│   │   ├── RewardsGrid.tsx
│   │   ├── TierProgress.tsx
│   │   └── ReferralCard.tsx
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   ├── BlogSearch.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── CommentSection.tsx
│   └── common/
│       ├── WhatsAppButton.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── utils.ts
└── styles/
    └── globals.css
```

## Design System

### Colors (Based on Flyer)
- Primary: Blue (#0EA5E9)
- Secondary: Yellow (#FCD34D)
- Text: Dark Gray (#1F2937)
- Background: White (#FFFFFF)
- Accent: Green for CTAs

### Typography
- Headings: Bold, Sans-serif
- Body: Regular, Sans-serif
- Sizes: Responsive using Tailwind

### Components
- Cards for services
- Modal for booking
- Floating WhatsApp button
- Responsive grid layouts
- Mobile-first approach

## Security Considerations
- JWT authentication
- Rate limiting on APIs
- Input validation and sanitization
- HTTPS only
- Environment variables for secrets
- CORS configuration
- SQL injection prevention
- XSS protection

## Performance Optimization
- Next.js Image optimization
- Lazy loading for images
- Code splitting
- Static generation where possible
- CDN for assets
- Minimize JavaScript bundle
- Progressive Web App features

## SEO Strategy
- Meta tags for all pages
- Open Graph tags
- Structured data (JSON-LD)
- XML sitemap
- Robots.txt
- Clean URLs
- Fast loading times
- Mobile responsive

## Deployment Steps
1. Set up GitHub repository
2. Configure Netlify account
3. Connect GitHub to Netlify
4. Set environment variables
5. Configure build settings
6. Set up custom domain
7. Enable HTTPS
8. Configure n8n workflows
9. Test all integrations
10. Launch

## Success Metrics
- Page load time < 3 seconds
- Mobile score > 90 (Lighthouse)
- Booking conversion rate
- User engagement metrics
- WhatsApp interaction rate
- Customer satisfaction score
- Average review rating > 4.5
- Loyalty program enrollment rate > 60%
- Referral conversion rate > 20%
- Review submission rate > 40%
- Loyalty member retention rate > 80%
- Points redemption rate

## Loyalty Program Tiers

### Bronze (0-499 points)
- Welcome bonus: 50 points
- 1x points multiplier
- Access to basic rewards

### Silver (500-1499 points)
- 1.25x points multiplier
- Priority booking slots
- 5% discount on services
- Birthday bonus: 100 points

### Gold (1500-3999 points)
- 1.5x points multiplier
- 10% discount on services
- Free add-on service monthly
- Birthday bonus: 200 points
- Exclusive offers

### Platinum (4000+ points)
- 2x points multiplier
- 15% discount on services
- Free premium service quarterly
- Birthday bonus: 500 points
- VIP customer support
- Early access to new services

## Points Earning Structure
- Basic cleaning: 10 points per $10 spent
- Deep cleaning: 15 points per $10 spent
- Specialized services: 20 points per $10 spent
- Review submission: 50 bonus points
- Photo with review: 25 extra points
- Referral successful: 200 points
- Social media share: 25 points
- Newsletter signup: 50 points