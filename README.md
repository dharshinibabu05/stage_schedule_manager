# 🎭 Stage Schedule Manager App

A MERN Stack application used to manage live event schedules, performers, and stage allocations efficiently.

## 🚀 Tech Stack
Frontend: React  
Backend: Node.js + Express  
Database: MongoDB  
Authentication: JWT  

---

# 📁 Project Structure
```
## Frontend Structure

client/
│
├── src/
│
│   ├── components/
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── Sidebar.js
│   │   └── Sidebar.css
│
│   ├── image/
│   │   ├── background.png
│   │   ├── concert.avif
│   │   ├── dance.avif
│   │   ├── drums.avif
│   │   ├── festival.avif
│   │   └── stage.avif
│
│   ├── pages/
│   │   ├── Landing.js
│   │   ├── Landing.css
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Auth.css
│   │   ├── Home.js
│   │   ├── Dashboard.css
│   │   ├── Events.js
│   │   ├── Stages.js
│   │   ├── Schedule.js
│   │   ├── Tasks.js
│   │   └── Settings.js
│
│   ├── App.js
│   ├── App.css
│   └── App.test.js
│
├── package.json
└── package-lock.json

---

## Backend Structure

server/
│
├── config/
│   └── db.js
│
├── models/
│   ├── User.js
│   ├── Event.js
│   ├── Stage.js
│   ├── Schedule.js
│   └── Task.js
│
├── controllers/
│   ├── authController.js
│   ├── eventController.js
│   ├── stageController.js
│   ├── scheduleController.js
│   └── taskController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── routes/
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   ├── stageRoutes.js
│   ├── scheduleRoutes.js
│   └── taskRoutes.js
│
├── server.js
├── .env
├── package.json
└── package-lock.json

---

# 🎯 Features

• User Authentication (Login & Register)  
• Event Management  
• Stage Allocation  
• Performance Scheduling  
• Crew Task Management  
• Dashboard Overview  

---

# ▶️ How to Run the Project

### Backend

cd server  
npm run dev 

### Frontend

cd client  
npm start

### Figma
https://www.figma.com/design/MCxr22FOr8Lu4XiLFMjOeJ/Untitled?node-id=0-1&t=xAN79oUc9MJHxB2R-1

