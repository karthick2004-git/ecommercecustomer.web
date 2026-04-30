# COZY HOOD - React.js Conversion

## Project Structure
```
cozy-hood-react/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx        # Entry point
    ├── App.jsx         # All pages & components
    └── index.css       # All styles (combined from original)
```

## Pages (Hash-based routing)
- `#home` → Home Page (Hero, Collection, Reviews, Menswear, Fashion Trends, Contact)
- `#collection` → Shop / New Arrivals
- `#collection/shirts` → Shirts collection
- `#collection/t-shirts` → T-Shirts collection
- `#product/{id}` → Product detail page
- `#checkout` → Checkout page
- `#orders` → My Orders page
- `#contact` → Contact/Delivery details page

## Features Converted
✅ Sticky Navbar with Login/SignIn modals
✅ Mobile hamburger menu
✅ Hero section with floating card
✅ Scrolling marquee
✅ Collection grid
✅ New Design section
✅ Customer reviews
✅ Menswear arrival section
✅ Fashion Trends section
✅ Contact form with WhatsApp integration
✅ Google Maps embed
✅ Product listing with cart drawer
✅ Wishlist toggle
✅ Sort by price
✅ Cart with payment (UPI/COD)
✅ Product detail page with image gallery & size selector
✅ Checkout page with order saving
✅ Orders page with tracking timeline & cancel
✅ Floating WhatsApp & Instagram buttons
✅ Footer
✅ All animations & hover effects preserved
✅ Fully responsive (mobile-first)

## Setup & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Key React Patterns Used
- `useContext` + `Context.Provider` for global cart state
- `useState` + `useEffect` for localStorage sync
- Hash-based routing (no react-router needed, uses `window.location.hash`)
- Component composition for shared Navbar/Footer
- CSS unchanged from original (same class names, same styles)
