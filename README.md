# 👨‍💻 Omkar Kadam - Personal Portfolio Website

Welcome to the source code for my personal portfolio! This is a modern, blazing-fast, and fully responsive web application built to showcase my skills as a Full Stack Machine Learning Developer. 

![Portfolio Preview](./public/favicon.svg) <!-- *You can add a screenshot of your portfolio to the public folder and link it here* -->

## 🌟 Live Demo
**https://omkar-kadam.vercel.app/**

---

## 🚀 Features

- **Modern & Responsive UI**: Looks and feels fully native on all devices—from ultra-wide desktops down to the smallest mobile phones.
- **Dark/Light Mode**: Seamless theme switching with persistent state.
- **Smooth Animations**: High-performance, physics-based micro-interactions powered by `framer-motion`.
- **Serverless Contact Form**: Direct-to-inbox messaging using a secure Node.js backend (Vercel Functions) and SendGrid API. Contains zero client-side secret exposure.
- **Dynamic Project Showcase**: Interactive project cards with detailed "Case Study" modals displaying architecture, challenges, and tech stacks.

---

## 🛠️ Technology Stack

**Frontend Framework:**
- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

**Styling & UI:**
- [Tailwind CSS v3](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Lucide React](https://lucide.dev/) (Icons)
- [React Hot Toast](https://react-hot-toast.com/) (Notifications)

**Backend & Infrastructure:**
- Node.js (Vercel Serverless Functions)
- [SendGrid API](https://sendgrid.com/) (Email Dispatching)
- [Vercel](https://vercel.com/) (Hosting & Edge Networking)

---

## 💻 Running Locally

To get this project up and running on your local machine, follow these simple steps.

### Prerequisites
Make sure you have Node.js and npm installed on your computer. You will also need a SendGrid account for the contact form functionality.

### 1. Clone the repository
```bash
git clone https://github.com/omkarrr88/portfolio.git
cd portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your SendGrid API key. This is required for the contact form to route emails properly.
```env
SENDGRID_API_KEY="your-sendgrid-api-key-here"
```

### 4. Start the Dev Server
Since the contact form relies on a backend API route (`/api/contact`), you must run the project using the Vercel CLI instead of standard Vite, otherwise the backend wrapper won't spin up.

```bash
npx vercel dev
```
Your local environment will now be running on `http://localhost:3000`!

---

## 📝 Configuration & Customization

If you plan on forking this to build your own portfolio:

1. **Email Destination**: Head to `api/contact.js` and change the `to` and `from` email addresses to match your verified SendGrid Single Sender identity.
2. **Personal Data**: Every section (`About.tsx`, `Projects.tsx`, `Experience.tsx`, etc.) contains simple Arrays and Objects at the top of the file. Simply edit those arrays with your own data!
3. **Resume Link**: In `Hero.tsx`, replace the Google Drive link with your own resume PDF link.

---

## 🛡️ License

This project is open source and available under the [MIT License](LICENSE). Feel free to fork, customize, and use it for your own personal website!

---

*Designed and Built by Omkar Kadam.*
