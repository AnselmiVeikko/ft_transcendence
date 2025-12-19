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

Success Response: 201 CREATED

```json
{
	"message": "Registration succesful",
	"data": {
		"userId": "ID as string(cuid)",
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

Success Response: 200 OK

```json
{
	"message": "Login succesful",
	"data": {
		"userId": "ID as string(cuid)",
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

Success Response: 200 OK

```json
{
	"message": "Profile retrieve successful",
	"data": {
		"userId": "ID as string(cuid)",
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

//	/api/user/profile/all?pageNo=1&limit=10
		// pageNo: Page number (total page = total user/ limit)
		// limit: User data liimit per page

```

Success Response: 200 OK

```json
{
  "message": "All profiles retrieve successful",
  "data": [
    {
      "userId": "cmj7cofp70000yiwd622qn61c",
      "userName": "User 1",
      "email": "user1@example.com"
    },
    {
      "userId": "cmj7cofp70000yiwd622qn61s",
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


## FRIEND LIST

### GET: /api/friendlist/current
Active friend list.

Query Parameter:
```json
// /api/friendlist/current?pageNo=1&limit=5
```

Success Response: 200 OK

```json
{
	"message": "Friends List",
	"data": [
		{
			"userId": "cmj7cofp70000yiwd622qn61c",
			"userName": "test"
		},
		{
			"userId": "cmj7cymbk0000yi0cwrv56pt3",
			"userName": "test1"
		},
		{
			"userId": "cmj7cytgg0001yi0covsdqv4m",
			"userName": "test2"
		}
	]
}
```

### GET: /api/friendlist/pending
List of pending friend request sent by other users.

Query Parameter:
```json
// No need to send any parameter. Backend will retrieve userId from cookie
```

Success Response: 200 OK

```json
{
	"message": "Friends Pending List",
	"data": [
		{
			"userId": "cmj7cymbk0000yi0cwrv56pt3",
			"userName": "test1"
		},
		{
			"userId": "cmj7cytgg0001yi0covsdqv4m",
			"userName": "test2"
		}
	]
}
```

### GET: /api/friendlist/suggestion
List of users who can be friend.

Query Parameter:
```json
// No need to send any parameter. Backend will retrieve userId from cookie
```

Success Response: 200 OK

```json
{
	"message": "Friends Suggestion List",
	"data": [
		{
			"userId": "cmj7cofp70000yiwd622qn61c",
			"userName": "test"
		},
		{
			"userId": "cmj7cymbk0000yi0cwrv56pt3",
			"userName": "test1"
		}
	]
}
```

## FRIEND REQUEST

### POST: /api/friendrequest/send
Endpoint to send a friend request

Body:
```json
{
	"receiverId": "userId of friend request receiver"
}
```

Success Response: 201 CREATED

```json
{
	"message": "Request sent",
	"data": {
		"friendRId": "friend request ID",
		"senderId": "sender userID",
		"receiverId": "receiver userId",
	},
}
```


### POST: /api/friendrequest/accept
Endpoint to send a friend request

Body:
```json
{
	"friendRId": "friend request unique id"
}
```

Success Response: 200 OK

```json
{
	"message": "Request Accepted",
	"data": {
		"friendRId": "friend request ID",
		"senderId": "sender userID",
		"receiverId": "receiver userId",
	},
}
```


### DELETE: /api/friendrequest/decline
Endpoint to send a friend request

Query String:
```json

	// /api/friendrequest/decline?friendRId=cmj8nhzmx0001yihlnkmz2bfg

```

Success Response: 200 OK

```json
{
	"message": "Request Declined",
	"data": {
		"friendRId": "friend request ID",
		"senderId": "sender userID",
		"receiverId": "receiver userId",
	},
}
```


### DELETE: /api/friendrequest/delete
Endpoint to send a friend request

Query String:
```json

	// /api/friendrequest/delete?friendRId=cmj8nhzmx0001yihlnkmz2bfg

```

Success Response: 200 OK

```json
{
	"message": "Request Deleted",
	"data": {
		"friendRId": "friend request ID",
		"senderId": "sender userID",
		"receiverId": "receiver userId",
	},
}
```
