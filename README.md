# YouTube Clone — Full-Stack MERN Capstone Project

A high-fidelity full-stack YouTube Clone built using the MERN stack (MongoDB, Express, React/Vite, Node.js) styled with Tailwind CSS. This application features responsive UI layouts, custom JWT authentication, video CRUD, interactive likes/dislikes, dynamic comments CRUD, customizable user channels, and real-time category filtering & title search.

---

## 🚀 Features List

### 1. Home Page UI/UX
- **Header Section**: Hamburger menu toggling collapsible sidebar, custom Red logo, fully functional search bar with interactive voice microphone icon, and dynamic auth profile actions.
- **Sidebar Drawer**: Expanded/collapsed states transitions. Includes links to Home, Shorts, Subscriptions, History, Playlists, Watch Later, Liked Videos, and Explore categories.
- **Horizontal Scroll Filters**: 12 responsive category chips filter the video grid instantly (All, Web Dev, JavaScript, Data Structures, Server, Music, Information Technology, Gaming, Live, Spring Framework, News, Movies).
- **Responsive Video Grid**: Auto-adjusts cards to 3–4 columns on Desktop, 2 on Tablet, and 1 column on Mobile.

### 2. User Authentication
- **Split Modal/Page Tabs**: Seamless transition between login and registration.
- **Form validation**: Client-side regex checking on usernames, email verification, password strength (min 6 characters) with inline red validation error messages.
- **JWT Protection**: Tokens stored locally to automatically session-authorize API requests.

### 3. Video Player Page
- **Native HTML5 Media Streamer**: Interactive control bars playing selected video stream urls.
- **Full engagement bar**: Shows live views count, upload dates, interactive Like/Dislike triggers with automatic update metrics, Share, and Download actions.
- **Collapsible description container**: "Show more" and "Show less" detail expansions.
- **Interactive Comments Section (CRUD)**: Add comments, edit existing comments (via inline input box), and delete comments immediately with UI reflection.
- **Sidebar Related Videos**: Carousel of other uploaded media showing thumbnails and summaries.

### 4. Custom Channels (CRUD)
- **Interactive creation wizard**: Prompt user to claim channel Name, Handle (`@handle`), customized avatar, and banners.
- **Dynamic layout**: Displays banner image, circular overlap avatar, handle, stats (views, subs), and tab options (Videos / About).
- **Video Management**: Create (Upload), Read, Update (Edit), and Delete video listings with category choices.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite-powered), React Router DOM, Axios
- **Styling**: Tailwind CSS (v3), PostCSS, Autoprefixer
- **Backend**: Node.js, Express.js (ES Modules import/export syntax)
- **Database**: MongoDB (Mongoose schemas)
- **Authentication**: JSON Web Tokens (JWT), BcryptJS hashing password protection

---

## 📋 Prerequisites
- **Node.js**: v16+ or newer installed on your environment.
- **MongoDB**: A local MongoDB database engine running on port `27017`, or a MongoDB Atlas connection string URI.

---

## 📥 Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd youtube-clone
   ```

2. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

---

## 🔐 Environment Variables

### Backend (`server/.env`):
| Variable | Description | Default |
|---|---|---|
| `PORT` | Local network port for Express backend application server | `5000` |
| `MONGO_URI` | Mongo DB collection cluster connector URL path | `mongodb://localhost:27017/youtube-clone` |
| `JWT_SECRET` | Cryptographic secret seed signature for JWT verification keys | `yt_clone_super_secret_jwt_key_2024` |

### Frontend (`client/.env`):
| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Destination base path pointing towards Backend endpoint | `http://localhost:5000/api` |

---

## 🗄️ Database Setup (Seeding)

To populate your local or remote database cluster with test channels, video entries, comments, and predefined mock accounts run:
```bash
cd server
npm run seed
```
**Test User Credentials:**
- **Email:** `techguru@example.com`
- **Password:** `password123`

---

## 🏃 Running the App

### Start the Backend (API Server):
```bash
cd server
npm run dev
```
Starts backend server with hot-reload monitoring enabled on `http://localhost:5000`.

### Start the Frontend (Vite Client):
```bash
cd client
npm run dev
```
Will run React app locally at `http://localhost:5173`.

---

## 📖 API Documentation

### Auth Endpoints (`/api/auth`)
- **`POST /register`**: Register a new user profile.
  - *Auth Required*: No.
  - *Request Body*: `{ "username": "JohnDoe", "email": "john@doe.com", "password": "securepassword" }`
  - *Response (201)*: `{ "message": "Registration successful" }`
- **`POST /login`**: Validate credentials and return JWT token.
  - *Auth Required*: No.
  - *Request Body*: `{ "email": "john@doe.com", "password": "securepassword" }`
  - *Response (200)*: `{ "token": "jwt_token_here", "user": { ... } }`
- **`GET /me`**: Retrieve verified profile details.
  - *Auth Required*: Yes (JWT Bearer Token).
  - *Response (200)*: User profile data payload.

### Video Endpoints (`/api/videos`)
- **`GET /`**: Fetch all videos. Supports category filter chips and search queries.
  - *Query Params*: `?search=react&category=Web Dev`
- **`GET /:videoId`**: Get video details and increment view counter.
- **`POST /`**: Upload/Publish video.
  - *Auth Required*: Yes.
- **`PUT /:videoId`**: Update video details (uploader owner only).
  - *Auth Required*: Yes.
- **`DELETE /:videoId`**: Delete video (uploader owner only).
  - *Auth Required*: Yes.
- **`PUT /:videoId/like`**: Toggle Like attribute on video.
  - *Auth Required*: Yes.
- **`PUT /:videoId/dislike`**: Toggle Dislike attribute on video.
  - *Auth Required*: Yes.

### Channel Endpoints (`/api/channels`)
- **`POST /`**: Create user's custom channel.
  - *Auth Required*: Yes.
- **`GET /:channelId`**: Fetch channel info details and list of uploaded videos.
- **`PUT /:channelId`**: Update channel banner or about descriptions.
  - *Auth Required*: Yes.

### Comment Endpoints (`/api/comments`)
- **`GET /:videoId`**: Fetch all comments associated with video ID.
- **`POST /:videoId`**: Create and post a comment.
  - *Auth Required*: Yes.
- **`PUT /:commentId`**: Update comment message content.
  - *Auth Required*: Yes.
- **`DELETE /:commentId`**: Delete comment.
  - *Auth Required*: Yes.

---

## 📸 Screenshots

*Include representative screenshots showing standard interfaces:*
1. **Home Feed UI** with responsive cards and filter chips.
2. **Interactive Video Player Page** including streaming box and comment section.
3. **Owner Channel Dashboard** featuring upload and edit panels.

---

## 🎥 Demo Video Link
[Watch the walkthrough video here](https://example.com/demo-video-placeholder)
