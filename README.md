## Welcome to Huevee!
<img width="1917" height="963" alt="image" src="https://github.com/user-attachments/assets/138062d9-467d-497e-8c7d-6f391de489b9" />

Huevee is a web app that lets you share your palette ideas. 
Built with React, Express, and PostgreSQL.
Deployed on Vercel and Render.
All of the services use free-tier resources.

### What can Huevee do?
- CRUD palettes (Create, Read, Update, and Delete) operations.
- Every regular user can only manage their own palettes.
- The root user can delete any palette, reset a regular user's password, and delete a regular user.

### How to run this app?
1. Make sure you have accounts for Vercel and Render.
2. Create a new PostgreSQL database in Render and save the hostname and external database URL of the database.
3. Since in the free tier we can not run sql query, so we need to remote into it from outside. In this case, I'm using TablePlus.
4. Install TablePlus and remote into the database using the external database URL.
5. Select SQL, then create 3 tables: users, palettes, and colors using this query.
   ```
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      role VARCHAR(20) DEFAULT 'user'
    );
    
    CREATE TABLE palettes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      title VARCHAR(100),
      theme VARCHAR(50),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE colors (
      id SERIAL PRIMARY KEY,
      palette_id INTEGER REFERENCES palettes(id),
      hex_code CHAR(7) NOT NULL,
      position INTEGER
    );
   ```
