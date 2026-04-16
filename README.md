# Unified Identity Provider (OAuth 2.0 Server)

A custom-built, enterprise-grade Single Sign-On (SSO) authentication server. This project acts as a central Identity Hub, allowing multiple external client applications to securely authenticate users using the industry-standard OAuth 2.0 Authorization Code flow.

## 🚀 Features

* **Custom OAuth 2.0 Flow:** Implements secure authorization code generation and token exchange mechanics.
* **Cryptographic Security:** Utilizes `bcryptjs` for secure password hashing and client secret verification.
* **Stateless Authentication:** Mints highly secure, cryptographically signed JSON Web Tokens (JWTs) for client consumption.
* **Database Integration:** Fully integrated with MongoDB via Mongoose for persistent user and client-app storage.
* **Zero-Knowledge Architecture:** Stores only hashed versions of Client Secrets to prevent identity spoofing in the event of a database breach.

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router)
* **Database:** MongoDB & Mongoose
* **Security:** `jsonwebtoken`, `bcryptjs`, `crypto`
* **Language:** TypeScript

## 🚦 Getting Started

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/rahulpatel1025/user-identity-server.git](https://github.com/rahulpatel1025/user-identity-server.git)
