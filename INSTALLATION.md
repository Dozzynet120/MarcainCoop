# MARCAIN Frontend Integration Guide

## Files to Add/Replace in Your React Project

### 1. Create `src/services/` folder and add:
- `api.js` - All API calls to backend
- `socket.js` - Real-time notifications

### 2. Create `src/components/` and add:
- `LoginPage.js` - Admin login screen

### 3. Replace existing files:
- `src/components/PortalPage.js` - Full admin dashboard with real data
- Update `src/App.js` - Add login route and update navigation
- Update `src/components/MembershipFormPage.js` - Connect submit to backend

---

## Step-by-Step Installation

### Step 1: Install Socket.io Client

Open a NEW terminal (keep your backend running in the first one):

```cmd
cd C:\Users\HP\marcain-cooperative
npm install socket.io-client
```

### Step 2: Copy Files

Copy these files into your React project:

```
marcain-cooperative/
├── src/
│   ├── services/
│   │   ├── api.js          <-- COPY FROM ZIP
│   │   └── socket.js       <-- COPY FROM ZIP
│   ├── components/
│   │   ├── LoginPage.js    <-- COPY FROM ZIP
│   │   ├── PortalPage.js   <-- REPLACE WITH ZIP VERSION
│   │   └── MembershipFormPage.js  <-- UPDATE per CHANGES.txt
│   └── App.js              <-- UPDATE per INTEGRATION.txt
```

### Step 3: Update MembershipFormPage

In your existing `MembershipFormPage.js`, make these changes:

1. **Add import at top:**
```javascript
import { submitMembership } from '../services/api';
```

2. **Add state variables:**
```javascript
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState('');
```

3. **Replace handleSubmit function:**
```javascript
const handleSubmit = async () => {
  if (!validateStep(4)) return;
  setIsSubmitting(true);
  setSubmitError('');
  try {
    const result = await submitMembership(formData, canvasRef.current);
    if (result.success) {
      setRefCode(result.ref);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSubmitError(result.error || 'Submission failed');
    }
  } catch (err) {
    setSubmitError(err.message || 'Network error');
  } finally {
    setIsSubmitting(false);
  }
};
```

4. **Update submit button in Step 4:**
```javascript
<button 
  className="btn btn-success" 
  onClick={handleSubmit} 
  disabled={isSubmitting}
>
  {isSubmitting ? 'Submitting...' : 'Submit Application'}
</button>
```

5. **Add error display before form-actions in Step 4:**
```javascript
{submitError && (
  <div style={{background: '#f8d7da', color: '#721c24', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem'}}>
    <strong>Error:</strong> {submitError}
  </div>
)}
```

### Step 4: Update App.js

1. **Add import:**
```javascript
import LoginPage from './components/LoginPage';
```

2. **Add 'login' case to renderPage switch:**
```javascript
case 'login': return <LoginPage setPage={setPage} />;
```

3. **Update Portal nav link in Navbar:**
Change the Portal button to check for auth:
```javascript
<button onClick={() => {
  const token = localStorage.getItem('marcain_token');
  setPage(token ? 'portal' : 'login');
}}>
  Portal
</button>
```

### Step 5: Start Both Servers

You need TWO terminal windows running:

**Terminal 1 - Backend (already running):**
```cmd
cd C:\Users\HP\marcain-backend
npm start
```
Should show: `Server on port 5000`

**Terminal 2 - Frontend:**
```cmd
cd C:\Users\HP\marcain-cooperative
npm start
```
Should open browser at `http://localhost:3000`

---

## Testing the Flow

### Test 1: Submit a Membership Form
1. Go to `http://localhost:3000`
2. Click "Join Us" or navigate to Membership
3. Fill the 4-step form
4. Submit
5. You should see success screen with reference code like `MRCN-2026-1234`

### Test 2: Admin Login
1. Click "Portal" in navbar
2. Login with:
   - Email: `admin@marcaincoop.com`
   - Password: `admin123`
3. You should see the admin dashboard with your submitted application

### Test 3: Real-time Notifications
1. Open admin dashboard in one browser tab
2. Open membership form in another tab (or use incognito)
3. Submit a new application
4. The admin tab should show a toast notification automatically!

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to backend" | Make sure backend is running on port 5000 |
| CORS errors | Check `CLIENT_URL` in backend `.env` matches your React URL |
| "Invalid token" on login | Clear localStorage and login again |
| Files not uploading | Check `uploads/documents/` folder exists in backend |
| Socket.io not connecting | Both servers must be running, check browser console |

---

## Production Deployment

When ready to deploy:

1. **Backend:** Deploy to Render, Railway, or Heroku
2. **Update `.env`:** Set `NODE_ENV=production` and proper `MONGODB_URI`
3. **Frontend:** Update `REACT_APP_API_URL` to your deployed backend URL
4. **CORS:** Update `CLIENT_URL` in backend to your frontend domain
