# Paginita

Paginita is a Content Management System (CMS) that uses [Strapi](https://strapi.io/) as the backend, [Nuxt](https://nuxt.com/) as the frontend framework, and [Quasar](https://quasar.dev/) as the UI library.

## Features

- Modern CMS with a customizable backend (Strapi)
- Fast, SEO-friendly frontend (Nuxt)
- Beautiful UI components (Quasar)

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- [pnpm](https://pnpm.io/) package manager

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/paginita.git
   cd paginita
   ```

2. **Install dependencies for backend (Strapi):**

   ```bash
   cd backend
   pnpm install
   ```

3. **Install dependencies for frontend (Nuxt + Quasar):**
   ```bash
   cd ../frontend
   pnpm install
   ```

### Running in Development Mode

1. **Start the Strapi backend:**

   ```bash
   cd backend
   pnpm run develop
   ```

2. **Start the Nuxt frontend:**
   ```bash
   cd ../frontend
   pnpm run dev
   ```

The frontend will typically be available at `http://localhost:3000` and the backend admin panel at `http://localhost:1337/admin`.

## License

MIT
