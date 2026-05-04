# Posible routes on the API

- `GET /api/hello`: A simple test route that returns a JSON message. Returns 200 with `{ message: 'Hello from Intermodular API' }`.

- `POST /api/auth/register`: Register a new user. Expects JSON body with `name`, `email`, and `password`. Returns 201 on success or 400 if email is already registered.

- `POST /api/auth/verify`: Verify a user's email. Expects JSON body with `email` and `code`. Returns 201 on success or 400 if verification fails.

- `POST /api/auth/login`: Log in a user. Expects JSON body with `email` and `password`. Returns access token on success or 400 if credentials are invalid.

- `POST /api/auth/refresh`: Refresh access token. Expects refresh token in HTTP-only cookie. Returns new access token on success or 401 if no valid refresh token is provided.

- `POST /api/auth/logout`: Log out a user. Clears the refresh token cookie. Returns 200 on success.
