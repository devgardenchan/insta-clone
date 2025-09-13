# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 기술스택 템플릿 (Instagram Clone 기반)
# Core Stack:
Language: JavaScript/TypeScript
Build Tool: Vite
Package Manager: npm

# Frontend:
Framework: React 18.3.1
Router: React Router DOM 6.22.3
UI Library: Chakra UI 2.1.1
Icons: Chakra UI Icons + React Icons
Animations: Framer Motion 10.16.4
Styling: Emotion (CSS-in-JS)

# State Management:
Global State: Zustand 5.0.4

# Backend/Database:
BaaS: Firebase 11.7.3
├── Authentication: Firebase Auth
├── Database: Firestore
├── Storage: Firebase Storage
├── Config: Environment Variables (.env)
Firebase Hooks: React Firebase Hooks 5.1.1

# Development:
Linting: ESLint 9.21.0
Dev Tools: React DevTools
TypeScript: Yes (타입 정의 포함)

# Deployment (새로 추가):
Platform: Vercel
Config: SPA Routing 설정 (모든 경로를 index.html로 리다이렉트)

Environment (새로 추가):
Environment Variables: Vite (.env with VITE_ prefix)
├── VITE_FIREBASE_API_KEY
├── VITE_FIREBASE_AUTH_DOMAIN
├── VITE_FIREBASE_PROJECT_ID
├── VITE_FIREBASE_STORAGE_BUCKET
├── VITE_FIREBASE_MESSAGING_SENDER_ID
└── VITE_FIREBASE_APP_ID
