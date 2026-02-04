# Bloggy Startup — Project Context

## 📌 Project Overview

Bloggy — bu social blogging platforma bo‘lib, foydalanuvchilar:

- ro'yxatdan o'tishi (register)
- login qilishi (JWT auth)
- post joylashi
- postlarni ko'rishi (feed)
- comment yozishi
- profil ko'rishi

mumkin bo‘lgan platforma.

Backend Django REST API, frontend Next.js (TypeScript + Tailwind).

---

# 🧩 Tech Stack

## Backend
- Django
- Django REST Framework
- SimpleJWT (JWT authentication)
- PostgreSQL (Render database)
- drf-spectacular (Swagger docs)
- CORS enabled

Hosted on:
https://bloggy-startup.onrender.com

---

## Frontend
- Next.js (App Router)
- TypeScript
- TailwindCSS
- JWT auth via localStorage

---

# 🔐 Authentication Flow

JWT authentication ishlatiladi.

## Login
Endpoint:

POST /api/token/

Body:

{
  "username": "...",
  "password": "..."
}

Response:

{
  "access": "...",
  "refresh": "..."
}

Frontend:
- access → localStorage
- refresh → localStorage

---

## Authenticated requests

Header:

Authorization: Bearer <access_token>

---

# 👤 User System

## Register

Endpoint mavjud:
POST /api/users/register/

Frontend register page ishlaydi.

Registerdan keyin:
- user avtomatik login qilinadi
- token olinadi
- feedga redirect qilinadi

---

## Profile (Me endpoint)

Endpoint:

GET /api/users/me/

IsAuthenticated talab qiladi.

MeView ishlaydi backendda.

Serializer mavjud.

Frontend profile page token bilan request yuboradi.

---

# 📝 Posts

Endpoint:

GET /api/posts/
POST /api/posts/

Feed sahifada postlar chiqadi.

JWT talab qilinadi.

---

# 💬 Comments

Nested endpoints:

GET /api/posts/{post_id}/comments/
POST /api/posts/{post_id}/comments/

Backend ishlaydi.

Frontend integration hali to'liq emas.

---

# 🎥 Media Upload (Planned)

Hozircha to'liq implement qilinmagan.

Plan:

Post modelga:
- image field
- video field

qo'shish.

Frontend:
multipart/form-data upload.

---

# 🚧 Current Status

✅ Register works  
✅ Login works  
✅ JWT auth works  
✅ Feed loads posts  
✅ Profile (/users/me) works  
✅ Render deployment working  
✅ PostgreSQL connected  

---

# ❗ Pending Features

1) Comments UI integration  
2) Profile UI upgrade (avatar, bio, user posts)  
3) Post image/video upload  
4) Better error handling  
5) Token auto refresh logic improvement  

---

# 📂 Important API Base URL

https://bloggy-startup.onrender.com

Swagger docs:

/api/schema/
/api/docs/

---

# 🧠 Notes for Future Development

- Always use JWT header
- Backend already supports nested comments
- Media upload requires backend model update
- Frontend must use FormData for files
- Tokens stored in localStorage

---

# 🎯 Goal

Make Bloggy a portfolio-level social platform with:

- auth
- posts
- comments
- media
- profile system

similar to LinkedIn-lite.
