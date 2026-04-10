# MindTrace Backend

Minimal hackathon-ready backend for MindTrace using Node.js, Express, TypeScript, SQLite, JWT, bcrypt, and Zod.

## Project Structure

```text
backend/
  src/
    app.ts
    server.ts
    config/
      env.ts
      jwt.ts
    routes/
      auth.routes.ts
      profile.routes.ts
      onboarding.routes.ts
      checkin.routes.ts
      analyze.routes.ts
      study-plan.routes.ts
    controllers/
      auth.controller.ts
      profile.controller.ts
      onboarding.controller.ts
      checkin.controller.ts
      analyze.controller.ts
      study-plan.controller.ts
    services/
      auth.service.ts
      profile.service.ts
      onboarding.service.ts
      checkin.service.ts
      analyze.service.ts
      study-plan.service.ts
    middleware/
      auth.middleware.ts
      error.middleware.ts
      logger.middleware.ts
      validate.middleware.ts
    validations/
      auth.validation.ts
      profile.validation.ts
      onboarding.validation.ts
    database/
      sqlite/
        db.ts
    types/
      auth.ts
      express.d.ts
```

## Run

1. Open a terminal in `backend/`
2. Install dependencies
   `npm install`
3. Start development server
   `npm run dev`
4. Or build and run production output
   `npm run build`
   `npm start`

Default API URL: `http://localhost:4000`

## Environment Variables

- `PORT=4000`
- `JWT_SECRET=mindtrace-demo-secret`
- `SALT_ROUNDS=10`

## Response Format

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "error message"
}
```

## API Summary

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `PUT /profile/me`
- `PUT /onboarding`
- `POST /checkin`
- `GET /checkin/history`
- `POST /analyze`
- `GET /study-plan`

## Example Requests

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "name": "Riya Kapoor",
  "email": "riya@example.com",
  "password": "secret123"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "riya@example.com",
  "password": "secret123"
}
```

### Get Current User

```http
GET /auth/me
Authorization: Bearer <token>
```

### Update Profile

```http
PUT /profile/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Riya Kapoor",
  "age": 21,
  "gender": "female"
}
```

### Update Onboarding

```http
PUT /onboarding
Authorization: Bearer <token>
Content-Type: application/json

{
  "goals": "Stay consistent before exams",
  "stressLevel": "medium",
  "studyHours": 4
}
```

## Notes

- SQLite database file is created automatically as `backend/mindtrace.db`
- CORS is enabled for React Native and web frontend integration
- Passwords are hashed with bcrypt
- JWT is passed through `Authorization: Bearer <token>`
