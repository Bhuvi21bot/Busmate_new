# Bus Mate - Static HTML Website

A fully functional static website converted from the Next.js version, built with pure HTML, CSS, and JavaScript.

## 🚀 Features

- **Homepage** (`index.html`) - Hero section, stats, features, services, and CTA
- **Vehicles Page** (`vehicles.html`) - Browse and filter available vehicles
- **Booking Page** (`booking.html`) - Complete booking form with seat selection
- **Driver Dashboard** (`driver-dashboard.html`) - Driver registration with document upload
- **Live Tracking** (`tracking.html`) - Real-time bus tracking simulation

## 📁 Files Structure

```
static-site/
├── index.html              # Homepage
├── vehicles.html           # Vehicle listing page
├── booking.html            # Booking page
├── driver-dashboard.html   # Driver registration
├── tracking.html           # Live tracking
├── styles.css              # All CSS styles
├── scripts.js              # All JavaScript functionality
└── README.md              # This file
```

## 🎨 Features

### Animations & Interactions
- Smooth scroll animations
- Fade-in effects on scroll
- Hover animations on cards
- Mobile-responsive hamburger menu
- Parallax effects on hero section
- Animated statistics counter

### Functional Components
- **Navigation**: Sticky header with active link highlighting
- **Chat Widget**: AI chatbot with predefined responses
- **Filters**: Real-time vehicle filtering by type, route, and seats
- **Seat Selection**: Interactive seat booking with availability status
- **Form Validation**: Complete form validation for booking and registration
- **Live Tracking**: Animated bus movement simulation
- **File Upload**: Custom file upload UI with preview

## 🎯 How to Use

### Running Locally
1. Simply open `index.html` in any modern web browser
2. No server or build process required!

### Deploying
Upload all files to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any web hosting service

## 🎨 Design System

### Colors
- **Primary**: `#008870` (Teal Green)
- **Background**: `#0d0d0d` (Dark)
- **Card**: `#141414` (Darker)
- **Text**: `rgba(250, 250, 250, 0.8)` (Light)

### Fonts
- **Headings**: Montserrat
- **Body**: Roboto
- Loaded from Google Fonts

### Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 💡 Key Features Explained

### 1. Navigation
- Smooth scrolling to sections
- Active link highlighting based on scroll position
- Mobile-friendly hamburger menu
- Closes automatically when clicking outside

### 2. Chat Widget
- Context-aware responses
- Keywords: hello, fare, book, route, schedule, driver, track, etc.
- Smooth animations
- Floating button that opens chat panel

### 3. Vehicle Filters
- Filter by type (Government, Private, Chartered, E-Rickshaw)
- Search by route or vehicle name
- Filter by minimum available seats
- Real-time updates without page reload

### 4. Booking System
- Dynamic seat generation (20 seats)
- Random occupied seats simulation
- Real-time fare calculation
- Form validation before submission
- Success message with tracking link

### 5. Driver Registration
- Multi-section form (Personal, Vehicle, License)
- Custom file upload UI
- Date validation (license expiry must be future date)
- Terms and conditions checkbox
- Success confirmation

### 6. Live Tracking
- 4 active buses with different routes
- Real-time position animation
- Auto-updating ETA (decrements every 5 seconds)
- Bus selection with highlighted active state
- Live statistics (speed, next stop, available seats)

## 🔧 Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --color-primary: #008870;
    --color-background: #0d0d0d;
    /* ... more variables */
}
```

### Adding More Vehicles
Edit the `vehicles` array in `vehicles.html`:
```javascript
const vehicles = [
    {
        id: 1,
        name: "Your Bus Name",
        type: "government",
        // ... more properties
    }
];
```

### Customizing Chat Responses
Edit the `responses` object in `scripts.js`:
```javascript
const responses = {
    'keyword': 'Response message',
    // ... more responses
};
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Performance

- **No dependencies**: Pure vanilla JavaScript
- **Lightweight**: ~50KB total (HTML + CSS + JS)
- **Fast loading**: No build process or bundling
- **SEO friendly**: Semantic HTML structure
- **Accessible**: ARIA labels and keyboard navigation

## 📄 License

This is a demonstration project. Feel free to use and modify as needed.

## 🤝 Credits

Built with:
- Pure HTML5
- Pure CSS3
- Vanilla JavaScript
- Google Fonts (Roboto, Montserrat)
- SVG icons (inline)

---

**Note**: This is a static demonstration. For production use, consider:
- Adding a backend API for real data
- Implementing actual payment processing
- Adding real-time GPS tracking
- Database integration for bookings
- User authentication system
