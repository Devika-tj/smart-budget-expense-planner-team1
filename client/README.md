# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Requirements:
* Node.js
Local development:
1.Clone Repository:
 git clone <repository-url>

2.Install Dependencies
# Frontend dependencies
cd client
npm install

# Backend dependencies
cd server
npm install
cd ..

3.Start development services
# Start backend (Terminal 1)
cd server
npm start

# Start frontend (Terminal 2)
cd client
npm run dev

4.Access the application
Frontend: http://localhost:5173/
Backend:  http://localhost:8000/

Technology Stack:-

Frontend: React
Build Tool: Vite
Routing: React Router
Chart: Recharts
UI Components: Material UI

Backend:
Runtime: Node.js
Framework: Express.js
Database: MongoDB
Authentication: Session Based login(username/password-with-bycrypt-hashing)
Notifications: Email(SMTP with Nodemailer)
Password Hashing: Bycrypt.js

Deployment:-
Containerisation: Docker