# Inner Eye VMS — Frontend

Vendor Registration and Approval Process UI built with React 18 and Tailwind CSS.

## Tech Stack

| Technology           | Version |
| -------------------- | ------- |
| React                | 18.3.1  |
| Vite                 | 6.0.5   |
| Tailwind CSS         | 3.4.17  |
| Redux Toolkit        | 2.5.0   |
| Redux Persist        | 6.0.0   |
| React Router         | 7.1.1   |
| Axios                | 1.7.9   |
| Yup                  | 1.6.1   |
| i18next              | 24.2.2  |
| Lucide React (icons) | 0.468.0 |
| React Toastify       | 11.0.3  |
| React Datepicker     | ^6.9.0  |

## How to Run

### 1. Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm

### 2. Install Dependencies

```bash
cd innereye-vms-ui
npm install
```

### 3. Configure Environment

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5133/api
VITE_APP_NAME=Inner Eye VMS
```

Change the URL to match your backend server address.

### 4. Run

```bash
npm run dev
```

App opens at: `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

Output: `dist/` folder

## Default Login

| Field    | Value              |
| -------- | ------------------ |
| Email    | admin@innereye.com |
| Password | Admin@1234         |

## Security

- **Access token**: stored in memory only (never localStorage/sessionStorage)
- **Refresh token**: httpOnly secure cookie (set by backend)
- **On page refresh**: silent token refresh via cookie — user stays logged in
- **Route protection**: public pages redirect to dashboard if logged in; protected pages redirect to login if not

## Project Structure

```
src/
├── api/              ← Axios instance, token interceptor, endpoints
├── app/              ← Redux store with persist config
├── components/
│   ├── layout/       ← Sidebar, Header, AppLayout
│   └── ui/           ← Button, Input, Select, Modal, Pagination, etc.
├── features/
│   ├── auth/         ← Login, ForgotPassword, ResetPassword, slice/thunks
│   ├── dashboard/    ← Dashboard, Settings (theme), Reports
│   ├── vendors/      ← List, Register (4-step), Detail (docs + approval)
│   └── users/        ← List, Create modal
├── hooks/            ← useAuth, useDebounce
├── i18n/             ← i18next config + en.json
├── routes/           ← AppRoutes, ProtectedRoute, PublicOnlyRoute
├── styles/           ← theme.js (4 color presets via CSS variables)
└── utils/            ← constants, helpers
```

## Theme Customization

Go to **Settings** page → select a color preset (Ocean Blue, Teal, Indigo, Slate). Colors are stored as CSS variables and persist across sessions.

To add a new preset, edit `src/styles/theme.js`.
