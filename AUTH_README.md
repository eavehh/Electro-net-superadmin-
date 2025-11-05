# 🔐 Super Admin Authentication System

## ⚡ Quick Start

```bash
cd Electro-net-superadmin-
npm install
npm run dev
```

**Open:** http://localhost:3000

**Login:**
- Email: `superadmin@csms.com`
- Password: `SuperAdmin123!`

## ✅ What Was Created

### Core Files

| File | Purpose |
|------|---------|
| `contexts/AuthContext.tsx` | Auth state & login/logout methods |
| `middleware.ts` | Route protection |
| `hooks/use-api.ts` | API integration with JWT |
| `components/auth/login-form.tsx` | Login UI |

### Updated Files

| File | Changes |
|------|---------|
| `app/layout.tsx` | Wrapped in AuthProvider |
| `app/page.tsx` | Uses useAuth() |
| `components/layout/sidebar.tsx` | Logout button |

## 📚 Documentation

| File | Description |
|------|-------------|
| **SUPERADMIN_AUTH_QUICK.md** | 🚀 Quick start guide |
| **SUPERADMIN_AUTH_SYSTEM.md** | 📖 Full documentation |
| **SUPERADMIN_AUTH_CHECKLIST.md** | ✅ Testing checklist |
| **SUPERADMIN_AUTH_ARCHITECTURE.md** | 🏗️ Architecture diagrams |
| **SUPERADMIN_AUTH_SUMMARY.md** | 📋 Complete summary |

## 🎯 Key Features

✅ Real backend integration (`http://176.88.248.139`)  
✅ JWT token authentication (15 min expiry)  
✅ Protected routes with middleware  
✅ Auto redirect based on auth state  
✅ Logout with token cleanup  
✅ User info display in sidebar  
✅ API hooks with automatic token injection  

## 🔧 Usage Examples

### Get Auth State

```tsx
import { useAuth } from '@/contexts/AuthContext'

export default function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth()
  
  return (
    <div>
      {isAuthenticated && <p>Welcome, {user?.email}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Fetch API Data

```tsx
import { useStations } from '@/hooks/use-api'

export default function Stations() {
  const { stations, loading, error } = useStations()
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return <div>{stations.length} stations</div>
}
```

## 🏗️ Architecture

```
User Input
    ↓
Login Form (useAuth)
    ↓
Auth Context
    ↓
POST http://176.88.248.139/auth/login
    ↓
JWT Token → localStorage
    ↓
Auto redirect to /dashboard
    ↓
Protected routes check token
    ↓
API requests include token
    ↓
Backend validates & returns data
```

## 🛡️ Security

- ✅ JWT tokens (15 min expiry)
- ✅ Protected routes via middleware
- ✅ CORS enabled on backend
- ⚠️ Tokens in localStorage (consider httpOnly cookies for production)

## 📡 Backend Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/login` | POST | No | Login & get JWT |
| `/stations/` | GET | Yes | List stations |
| `/transactions/` | GET | Yes | List transactions |
| `/transactions/stats/summary` | GET | Yes | Transaction stats |

## 🧪 Testing

### Test Login
```bash
curl http://176.88.248.139/auth/login \
  -X POST -H "Content-Type: application/json" \
  -d '{"email":"superadmin@csms.com","password":"SuperAdmin123!"}'
```

### Test Protected Endpoint
```bash
TOKEN="your_token_here"
curl http://176.88.248.139/stations/ \
  -H "Authorization: Bearer $TOKEN"
```

## 🐛 Troubleshooting

### CORS Error
Check backend Nginx config for CORS headers

### 401 Unauthorized
Token expired (15 min). Logout & login again

### Login Failed
1. Check Network tab in DevTools
2. Verify backend is running
3. Check credentials

## 📝 TODO

- [ ] Auto refresh token on expiry
- [ ] Migrate to httpOnly cookies
- [ ] Add 2FA support
- [ ] Add password reset flow
- [ ] Role-based UI rendering

## 📞 Support

**Issues?** Check:
1. Browser DevTools → Console & Network
2. Backend logs: `docker logs auth-service`
3. localStorage: `localStorage.getItem('adminToken')`

---

**Built with ❤️ using Next.js 16 & React 19**

**Backend:** http://176.88.248.139  
**Docs:** See `SUPERADMIN_AUTH_*.md` files
