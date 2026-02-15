# 🛍️ VOGUE - Premium Fashion Store

A modern, responsive e-commerce website for luxury fashion built with HTML, CSS (Tailwind), and vanilla JavaScript.

![VOGUE Fashion Store](https://img.shields.io/badge/Status-Production%20Ready-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

## ✨ Features

### 🎨 Design
- **Modern UI/UX** - Clean, minimalist design with premium aesthetics
- **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- **Dark Mode** - Toggle between light and dark themes
- **Smooth Animations** - Hover effects, transitions, and micro-interactions
- **Glassmorphism** - Modern backdrop blur effects

### 🛒 E-Commerce Features
- **Product Grid** - Beautiful product cards with images and details
- **Shopping Cart** - Add/remove items with quantity management
- **Wishlist** - Save favorite products for later
- **Filters** - Filter by category, brand, size, color, and price
- **Search** - Real-time product search
- **Sorting** - Sort by price, rating, popularity, and new arrivals
- **Product Details** - Ratings, discounts, badges (New, Limited)

### 💾 Data Persistence
- **LocalStorage** - Cart and wishlist data persists across sessions
- **Dark Mode Preference** - Remembers user's theme choice

### 🎯 User Experience
- **Toast Notifications** - Feedback for user actions
- **Loading States** - Skeleton screens and spinners
- **Accessibility** - Keyboard navigation and screen reader support
- **SEO Optimized** - Proper meta tags and semantic HTML

## 📁 Project Structure

```
fashion-store/
├── index.html          # Main homepage
├── css/
│   └── styles.css      # Custom styles and animations
├── js/
│   └── app.js          # Main application logic
├── images/             # Product images (optional local storage)
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required!

### Installation

1. **Clone or Download** this repository
2. **Open** `index.html` in your browser
3. **That's it!** The site is ready to use

### Running Locally

**Option 1: Direct Open**
```bash
# Windows
start index.html

# Mac
open index.html

# Linux
xdg-open index.html
```

**Option 2: Live Server (VS Code)**
- Install "Live Server" extension
- Right-click `index.html`
- Select "Open with Live Server"

**Option 3: Python HTTP Server**
```bash
# Python 3
python -m http.server 8000

# Then visit: http://localhost:8000
```

## 🎮 Usage

### Shopping
1. **Browse Products** - Scroll through the product grid
2. **Filter** - Use sidebar filters to narrow down products
3. **Search** - Type in the search bar to find specific items
4. **Add to Cart** - Click "Add to Cart" on product hover
5. **Wishlist** - Click the heart icon to save favorites

### Customization

#### Change Brand Colors
Edit `index.html` (line 17):
```javascript
colors: {
    "primary": "#ec1380",  // Change this hex color
    ...
}
```

#### Add New Products
Edit `js/app.js` - add to the `products` array:
```javascript
{
    id: 7,
    name: "Your Product Name",
    brand: "Brand Name",
    price: 999,
    originalPrice: 1299,  // Optional
    rating: 4.5,
    image: "image-url",
    badge: "New",  // Optional: "New", "Limited", etc.
    category: "men",  // or "women", "kids"
    subcategory: "knitwear",
    color: "black",
    sizes: ["s", "m", "l", "xl"]
}
```

#### Modify Styles
Edit `css/styles.css` to customize:
- Colors and themes
- Animations and transitions
- Layout and spacing
- Typography

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom styles and animations
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **JavaScript (ES6+)** - Modern vanilla JS
- **Google Fonts** - Plus Jakarta Sans typography
- **Material Icons** - Icon library
- **LocalStorage API** - Data persistence

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Color Palette

```css
Primary:     #ec1380  /* Hot Pink */
Light BG:    #f8f6f7  /* Off White */
Dark BG:     #221019  /* Deep Purple */
Text Light:  #0f172a  /* Slate 900 */
Text Dark:   #f1f5f9  /* Slate 100 */
```

## 📦 Features Roadmap

- [ ] Product detail pages
- [ ] Shopping cart page
- [ ] Checkout process
- [ ] User authentication
- [ ] Backend integration
- [ ] Payment gateway
- [ ] Order tracking
- [ ] Product reviews
- [ ] Size guide modal
- [ ] Quick view modal

## 🤝 Contributing

This is a demo project, but feel free to:
1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built with ❤️ using AI assistance

## 🙏 Acknowledgments

- Product images from Google AIDA
- Icons from Material Design
- Fonts from Google Fonts
- Inspiration from luxury fashion websites

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact: your-email@example.com

---

**Made with 💎 by VOGUE Team**

*Premium fashion, delivered digitally.*
