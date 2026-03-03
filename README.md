Chatters is a high-performance, full-stack communication application built using the MERN stack. This project focuses on real-time data synchronization, server-side content moderation, and accessible UI/UX design.

**🚀 Key Features**

Real-Time Synchronization: Leverages Socket.io for instant message delivery and live online status updates.

Automated Content Moderation: Integrated a Profanity Filter on the backend to sanitize incoming messages and ensure a safe community environment.

Secure Authentication: Implemented a robust login/signup system using JWT and Cookie-parser for persistent, secure user sessions.

Profile Personalization: Users can upload and manage profile pictures, with data stored and retrieved via MongoDB.

Accessible UI: Optimized "Glassmorphism" interface with high-contrast text and custom CSS for clear readability on dark backgrounds.

**🛠️ Tech Stack**

Frontend: React.js, Tailwind CSS, DaisyUI, Zustand (State Management).

Backend: Node.js, Express.js.

Database: MongoDB (Mongoose ODM).

Communication: Socket.io.

**🛡️ Security & Forensic Focus**

As a developer with a background in Cyber Forensics, I prioritized Data Integrity in this build.

Server-Side Validation: All user inputs are sanitized on the server to prevent malicious injections.

Forensic Auditing: The messaging controller is designed to store only processed, safe data, ensuring the database remains clean for potential audits.
