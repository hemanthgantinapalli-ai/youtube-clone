import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Video from '../models/Video.js';
import Channel from '../models/Channel.js';
import Comment from '../models/Comment.js';

dotenv.config();

/**
 * Seed script — populates the database with sample data for evaluators.
 * Run with: npm run seed
 */
await mongoose.connect(process.env.MONGO_URI);
console.log('✅ Connected to MongoDB for seeding...');

// Clear existing data
await Promise.all([
  User.deleteMany({}),
  Video.deleteMany({}),
  Channel.deleteMany({}),
  Comment.deleteMany({}),
]);
console.log('🗑️  Cleared existing data');

// --- Users ---
const hashedPw = await bcrypt.hash('password123', 12);
const users = await User.insertMany([
  { userId: 'user01', username: 'TechGuru', email: 'techguru@example.com', password: hashedPw, channels: ['channel01'] },
  { userId: 'user02', username: 'CodeMaster', email: 'codemaster@example.com', password: hashedPw, channels: ['channel02'] },
  { userId: 'user03', username: 'DevNinja', email: 'devninja@example.com', password: hashedPw, channels: ['channel03'] },
]);
console.log(`👥 Created ${users.length} users`);

// --- Channels ---
const channels = await Channel.insertMany([
  {
    channelId: 'channel01', channelName: 'Tech Guru TV', handle: '@techguru',
    owner: 'user01', description: 'Best tech tutorials on the web!',
    channelBanner: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=300&fit=crop',
    avatar: 'https://ui-avatars.com/api/?name=Tech+Guru&background=ff0000&color=fff&size=128',
    subscribers: 125000, videos: ['video01','video02','video03','video04'],
  },
  {
    channelId: 'channel02', channelName: 'Code Masters', handle: '@codemaster',
    owner: 'user02', description: 'Mastering code one tutorial at a time.',
    channelBanner: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=300&fit=crop',
    avatar: 'https://ui-avatars.com/api/?name=Code+Master&background=0047ab&color=fff&size=128',
    subscribers: 89000, videos: ['video05','video06','video07'],
  },
  {
    channelId: 'channel03', channelName: 'Dev Ninja', handle: '@devninja',
    owner: 'user03', description: 'Full-stack dev tutorials and tips.',
    channelBanner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=300&fit=crop',
    avatar: 'https://ui-avatars.com/api/?name=Dev+Ninja&background=00a86b&color=fff&size=128',
    subscribers: 52000, videos: ['video08','video09','video10'],
  },
]);
console.log(`📺 Created ${channels.length} channels`);

// --- Videos ---
const videos = await Video.insertMany([
  {
    videoId: 'video01', title: 'Learn React in 30 Minutes - Complete Beginner Guide',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'A quick tutorial to get started with React. We cover components, state, props, and hooks.',
    channelId: 'channel01', uploader: 'user01', category: 'Web Dev', views: 152000,
  },
  {
    videoId: 'video02', title: 'JavaScript ES6+ Features You Must Know',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=640',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    description: 'Arrow functions, destructuring, spread/rest, promises, async/await and more.',
    channelId: 'channel01', uploader: 'user01', category: 'JavaScript', views: 98300,
  },
  {
    videoId: 'video03', title: 'Node.js & Express Server Setup from Scratch',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'Build a complete REST API with Node.js and Express. Covers routing, middleware, and MongoDB.',
    channelId: 'channel01', uploader: 'user01', category: 'Server', views: 76100,
  },
  {
    videoId: 'video04', title: 'Data Structures & Algorithms - Arrays and Linked Lists',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=640',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    description: 'Deep dive into arrays, linked lists, and their trade-offs with JavaScript examples.',
    channelId: 'channel01', uploader: 'user01', category: 'Data Structures', views: 45200,
  },
  {
    videoId: 'video05', title: 'Spring Boot REST API Tutorial for Beginners',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    description: 'Create production-ready Spring Boot applications with REST APIs, JPA, and MySQL.',
    channelId: 'channel02', uploader: 'user02', category: 'Spring Framework', views: 63400,
  },
  {
    videoId: 'video06', title: 'Lofi Hip Hop Radio - Beats to Study / Relax To',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=640',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    description: '24/7 lofi hip hop beats to help you focus and relax. Perfect study music.',
    channelId: 'channel02', uploader: 'user02', category: 'Music', views: 2340000,
  },
  {
    videoId: 'video07', title: 'Information Technology Fundamentals - Full Course',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=640',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    description: 'A complete IT fundamentals course covering networking, hardware, OS, and cybersecurity.',
    channelId: 'channel02', uploader: 'user02', category: 'Information Technology', views: 187000,
  },
  {
    videoId: 'video08', title: 'Gaming PC Build 2024 - Best Budget Build Guide',
    thumbnailUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=640',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    description: 'Build the ultimate gaming PC on a $800 budget. Step-by-step guide with all parts listed.',
    channelId: 'channel03', uploader: 'user03', category: 'Gaming', views: 412000,
  },
  {
    videoId: 'video09', title: 'LIVE: JavaScript Coding Challenge Solutions',
    thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=640',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    description: 'Live coding session solving top LeetCode problems in JavaScript. Join and learn!',
    channelId: 'channel03', uploader: 'user03', category: 'Live', views: 28900,
  },
  {
    videoId: 'video10', title: 'CSS Grid & Flexbox Complete Guide 2024',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=640',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    description: 'Master modern CSS layouts with Grid and Flexbox. Includes responsive design patterns.',
    channelId: 'channel03', uploader: 'user03', category: 'Web Dev', views: 93700,
  },
]);
console.log(`🎬 Created ${videos.length} videos`);

// --- Comments ---
const comments = await Comment.insertMany([
  { commentId: 'cmt01', videoId: 'video01', userId: 'user02', username: 'CodeMaster', text: 'Excellent tutorial! Very clear and concise. Subscribed!', likes: 45 },
  { commentId: 'cmt02', videoId: 'video01', userId: 'user03', username: 'DevNinja', text: 'This is exactly what I needed to get started with React. Thanks!', likes: 28 },
  { commentId: 'cmt03', videoId: 'video02', userId: 'user01', username: 'TechGuru', text: 'Great coverage of ES6 features. Async/await section was 🔥', likes: 62 },
  { commentId: 'cmt04', videoId: 'video05', userId: 'user03', username: 'DevNinja', text: 'Best Spring Boot tutorial I\'ve seen. Keep them coming!', likes: 19 },
]);
console.log(`💬 Created ${comments.length} comments`);

console.log('\n✅ Database seeded successfully!');
console.log('📧 Test credentials: techguru@example.com / password123');
process.exit(0);
