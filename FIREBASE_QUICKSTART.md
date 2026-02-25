# Firebase Quick Start Guide - EasyHome MVP

Get Firebase up and running in 10 minutes!

## Prerequisites
- Firebase account (free): https://firebase.google.com/
- Node.js installed
- EasyHome MVP code

---

## Step 1: Create Firebase Project (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `easyhome-mvp`
4. Disable Google Analytics (optional)
5. Click **"Create project"**

---

## Step 2: Enable Services (3 minutes)

### Enable Authentication
1. In Firebase Console, click **"Authentication"**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"**
5. Click **"Save"**

### Enable Firestore Database
1. Click **"Firestore Database"** in sidebar
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose your location (closest to users)
5. Click **"Enable"**

### Enable Storage
1. Click **"Storage"** in sidebar
2. Click **"Get started"**
3. Select **"Start in production mode"**
4. Use same location as Firestore
5. Click **"Done"**

---

## Step 3: Get Configuration (2 minutes)

1. Click **gear icon** ⚙️ → **"Project settings"**
2. Scroll to **"Your apps"** section
3. Click web icon **</>**
4. Register app name: `EasyHome Web`
5. Skip Firebase Hosting
6. **Copy the config values** (you'll need these)

---

## Step 4: Configure Environment (1 minute)

Create `.env.local` in the `frontend` folder:

```bash
cd frontend
```

Create file:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=easyhome-mvp.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=easyhome-mvp
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=easyhome-mvp.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc

# Enable Firebase
NEXT_PUBLIC_USE_FIREBASE=true
```

**Replace the values** with your Firebase config from Step 3!

---

## Step 5: Deploy Security Rules (2 minutes)

Install Firebase CLI:
```bash
npm install -g firebase-tools
```

Login to Firebase:
```bash
firebase login
```

Initialize project (in frontend folder):
```bash
cd frontend
firebase init
```

When prompted:
- Select: **Firestore**, **Storage**
- Use existing project: **easyhome-mvp**
- Firestore rules: **firestore.rules** (already exists)
- Firestore indexes: **firestore.indexes.json** (already exists)
- Storage rules: **storage.rules** (already exists)

Deploy rules:
```bash
firebase deploy --only firestore:rules,storage:rules,firestore:indexes
```

---

## Step 6: Start Application

```bash
npm run dev
```

Open http://localhost:3000

**You're done!** 🎉

---

## Quick Test

### Test Authentication
1. Go to **Register** page
2. Create account with email/password
3. Check Firebase Console → Authentication → Users

### Test Property Listing
1. **Login** with your account
2. Click **"List Property"**
3. Fill in property details
4. Upload images
5. Check Firebase Console → Firestore → properties collection
6. Check Firebase Console → Storage → properties folder

### Test Property Viewing
1. Go to **Browse Properties**
2. See your listed property
3. Click to view details
4. Check Firebase Console → Firestore → viewCount incremented

---

## Troubleshooting

### "Firebase not configured" warning
- Check `.env.local` exists in `frontend` folder
- Verify all variables start with `NEXT_PUBLIC_`
- Restart dev server: `npm run dev`

### Authentication errors
- Check Email/Password is enabled in Firebase Console
- Verify email format is valid
- Check Firebase Authentication rules

### Upload errors
- Check Storage rules are deployed
- Verify file is under 5MB
- Check file is an image (jpg, png, gif, webp)

### Permission denied
- Deploy security rules: `firebase deploy --only firestore:rules,storage:rules`
- Check you're logged in
- Verify you own the resource

---

## Switch Back to REST API

Set in `.env.local`:
```env
NEXT_PUBLIC_USE_FIREBASE=false
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Restart dev server.

---

## Firebase Console URLs

Quick access:
- **Dashboard**: https://console.firebase.google.com/project/easyhome-mvp
- **Authentication**: https://console.firebase.google.com/project/easyhome-mvp/authentication
- **Firestore**: https://console.firebase.google.com/project/easyhome-mvp/firestore
- **Storage**: https://console.firebase.google.com/project/easyhome-mvp/storage
- **Usage**: https://console.firebase.google.com/project/easyhome-mvp/usage

---

## Free Tier Limits

Firebase Spark Plan (Free):
- **Authentication**: Unlimited users
- **Firestore**: 50,000 reads/day, 20,000 writes/day, 1GB storage
- **Storage**: 5GB storage, 1GB/day download
- **Hosting**: 10GB/month transfer

More than enough for MVP! 🚀

---

## Next Steps

1. ✅ **Test all features** (auth, properties, images, favorites)
2. ✅ **Monitor usage** in Firebase Console
3. ✅ **Set up custom domain** (optional)
4. ✅ **Enable Google Analytics** (optional)
5. ✅ **Add more security rules** as needed

---

## Need Help?

- Full Documentation: `/frontend/lib/firebase/README.md`
- Firebase Docs: https://firebase.google.com/docs
- Firebase Support: https://firebase.google.com/support

---

**Ready to scale!** Your app now runs on Google's infrastructure. 🌟
