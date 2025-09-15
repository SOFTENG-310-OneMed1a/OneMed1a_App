# Friendship Feature Implementation

This document describes the implementation of the friendship feature for the OneMed1a backend application.

## Overview

The friendship feature allows users to:
- Send friend requests to other users
- Accept or decline incoming friend requests
- View their friends list
- View pending friend requests (both incoming and outgoing)
- Remove friends
- Block users

## Database Schema

### Users Table
- `id` (BIGSERIAL PRIMARY KEY)
- `username` (VARCHAR(50) UNIQUE NOT NULL)
- `email` (VARCHAR(100) UNIQUE NOT NULL)
- `password` (VARCHAR(255) NOT NULL)
- `first_name` (VARCHAR(50))
- `last_name` (VARCHAR(50))
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### Friendships Table
- `id` (BIGSERIAL PRIMARY KEY)
- `requester_id` (BIGINT NOT NULL) - Foreign key to users table
- `addressee_id` (BIGINT NOT NULL) - Foreign key to users table
- `status` (VARCHAR(20) NOT NULL) - ENUM: PENDING, ACCEPTED, DECLINED, BLOCKED
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

## API Endpoints

All endpoints are prefixed with `/api/v1/me/friends` and require authentication (currently using hardcoded user ID 1 for development).

### GET /api/v1/me/friends
Returns the logged-in user's accepted friends list.

**Response:**
```json
[
  {
    "id": 2,
    "username": "janesmith",
    "firstName": "Jane",
    "lastName": "Smith",
    "friendshipCreatedAt": "2025-01-15T10:30:00"
  }
]
```

### GET /api/v1/me/friends/requests
Returns pending friend requests for the logged-in user (both incoming and outgoing).

**Response:**
```json
[
  {
    "id": 1,
    "requester": {
      "id": 1,
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "addressee": {
      "id": 3,
      "username": "bobwilson",
      "firstName": "Bob",
      "lastName": "Wilson"
    },
    "status": "PENDING",
    "createdAt": "2025-01-15T09:15:00",
    "type": "outgoing"
  }
]
```

### POST /api/v1/me/friends/requests
Send a friend request to another user.

**Request Body:**
```json
{
  "userId": 3
}
```

**Response:**
```json
{
  "id": 1,
  "requester": { ... },
  "addressee": { ... },
  "status": "PENDING",
  "createdAt": "2025-01-15T09:15:00",
  "type": "outgoing"
}
```

### PATCH /api/v1/me/friends/requests/{requestId}
Accept or decline a friend request.

**Request Body:**
```json
{
  "action": "ACCEPTED"
}
```

### DELETE /api/v1/me/friends/{friendId}
Remove a friend.

### POST /api/v1/me/friends/block/{userId}
Block a user.

## Business Rules

1. **No Self-Friendship**: Users cannot send friend requests to themselves or perform friendship actions on themselves.

2. **Unique Relationships**: Only one friendship record can exist between any two users (enforced by database constraint).

3. **Status Transitions**: 
   - Only PENDING requests can be accepted or declined
   - Only ACCEPTED friendships can be removed
   - Any relationship can be blocked

4. **Authorization**: 
   - Only the addressee can accept/decline a friend request
   - Both users in a friendship can remove the friendship
   - Any user can block any other user

5. **Bidirectional Queries**: Friendship queries work in both directions (if A is friends with B, then B is friends with A).

## File Structure

```
src/main/java/com/onemed1a/backend/
├── controller/
│   └── FriendshipController.java
├── dto/
│   ├── FriendDTO.java
│   ├── FriendRequestDTO.java
│   ├── SendFriendRequestDTO.java
│   └── RespondToFriendRequestDTO.java
├── entity/
│   ├── User.java
│   └── Friendship.java
├── exception/
│   ├── UserNotFoundException.java
│   ├── FriendshipNotFoundException.java
│   ├── InvalidFriendshipActionException.java
│   ├── ErrorResponse.java
│   ├── ValidationErrorResponse.java
│   └── GlobalExceptionHandler.java
├── repository/
│   ├── UserRepository.java
│   └── FriendshipRepository.java
└── service/
    └── FriendshipService.java

src/test/java/com/onemed1a/backend/
├── repository/
│   └── FriendshipRepositoryTest.java
└── service/
    └── FriendshipServiceTest.java
```

## Testing

The implementation includes comprehensive unit tests for:
- Repository layer queries
- Service layer business logic
- Exception handling
- Edge cases and validation

Run tests with:
```bash
mvn test
```

## Database Setup

1. Start PostgreSQL database
2. Create database: `CREATE DATABASE onemed1a;`
3. Update `application.properties` with your database credentials
4. Run the application - Flyway will automatically create the tables

## Development Notes

- The authentication system is not yet implemented, so a hardcoded user ID (1) is used
- Replace `TEMP_USER_ID` in `FriendshipController` with actual authenticated user ID when authentication is ready
- The `/api/v1` context path is configured in `application.properties`
- All timestamps use `LocalDateTime` with automatic creation timestamps

## Future Enhancements

1. Implement proper authentication and authorization
2. Add pagination for friends list and requests
3. Add friendship notifications
4. Implement friendship suggestions
5. Add mutual friends feature
6. Add privacy settings for friend visibility
