# Alurà Project Structure Guide

**Alurà** is an AI-powered e-commerce platform specializing in selling cosmetics and pharmaceuticals. This web application helps users easily discover the most suitable products for their needs through intelligent search and recommendation features.

The frontend is built using **React** and **Vite** to ensure fast development, high performance, and maintainability.

Below is a breakdown of how the project is structured and how each folder in the `src/` directory should be used.

---

## 📁 src/

This is the main source folder containing all the frontend code.

### ┣ 📁 assets/
- Static assets like images, icons, fonts, etc.
- Example: `logo.png`, `background.jpg`

### ┣ 📁 components/
- Reusable UI components (buttons, cards, modals, etc.)
- Keep components small and modular.
- Example: `ProductCard.jsx`, `Navbar.jsx`, `SearchBar.jsx`

### ┣ 📁 hooks/
- Custom React hooks to encapsulate logic.
- Useful for AI-based recommendations, debouncing, auth, etc.
- Example: `useProductSearch.js`, `useAuth.js`, `useDebounce.js`

### ┣ 📁 layouts/
- Layout components that wrap around pages.
- Example: `MainLayout.jsx`, `AdminLayout.jsx`, `UserLayout.jsx`

### ┣ 📁 pages/
- Main page-level components.
- These are typically mapped to routes.
- Example: `Home.jsx`, `ProductDetail.jsx`, `Cart.jsx`, `Login.jsx`

### ┣ 📁 routes/
- Route configuration using React Router.
- Manages all application navigation in a centralized file.
- Example: `AppRoutes.jsx`

### ┣ 📁 store/
- Global state management (e.g., using Redux, Zustand, etc.).
- Handles shared state like user, cart, product filters.
- Example: `userStore.js`, `cartSlice.js`, `productStore.js`

### ┣ 📁 styles/
- Global styles or Tailwind CSS configurations.
- Can include CSS modules or utility classes.
- Example: `App.css`, `index.css`

### 📄 App.jsx
- The root component that sets up routing and layout wrappers.

### 📄 main.jsx
- The entry point of the application. It renders `App.jsx` into the DOM and initializes the app.

---

## 🚀 Getting Started

To run the project locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
