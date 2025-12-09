# BACKEND API ENDPOINTS

All failure responses follow same format. Below is the table of all failure status code and error type.

| **Status Code** | **Error Type** |
|-----------------|---------------------------|
| 400             | Bad Request               |
| 401             | Unauthorized              |
| 403             | Forbidden                 |
| 404             | Not Found                 |
| 500             | Internal Server Error     |
| 501             | Not Implemented           |
| 503             | Service Unavailable       |


Failure Response Body Format:

```json
{
	"statusCode": "Status Code",
	"error": "Error Type",
	"message": "Custom message from backend",
}
```


## USER REGISTRATION

### POST: /api/user/registration
To register a new user to the system.

Body:
```json
{
	"userName": "username",
	"email": "email@test.com",
	"password": "password"
}
```

Success Response:

```json
Status: 201 CREATED
{
	"message": "Registration succesful",
	"data": {
		"userId": "ID as number",
		"userName": "username",
	},
}
```



## USER LOGIN

### POST: /api/user/login
To login in to the system.

Body:
```json
{
	"userName": "username",
	"password": "password"
}
```

Success Response:

```json
Status: 200 OK
{
	"message": "Login succesful",
	"data": {
		"userId": "ID as number",
		"userName": "username",
	},
}
```



## USER PROFILE SELF

### GET: /api/user/profile/self
User self profile information view.

Query Parameter:
```json

```

Success Response:

```json
Status: 200 OK
{
	"message": "Profile retrieve successful",
	"data": {
		"userId": "ID as number",
		"userName": "username",
		"email": "email"
	},
}
```



## USER PROFILE ALL

### GET: /api/user/profile/all
All user profile limited information view.

Query Parameter:
```json

/api/user/profile/all?pageNo=1&limit=10

[
	pageNo: Page number (total page = total user/ limit)
	limit: User data liimit per page
]
```

Success Response:

```json
Status: 200 OK
{
  "message": "All profiles retrieve successful",
  "data": [
    {
      "userId": 1,
      "userName": "User 1",
      "email": "user1@example.com"
    },
    {
      "userId": 2,
      "userName": "User 2",
      "email": "user2@example.com"
    }
  ],
  "pagination": {
    "pageNo": 1,
    "limit": 10,
    "totalUser": 2,
    "totalPage": 1
  }
}
```
