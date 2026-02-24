# BACKEND API ENDPOINTS

All failure responses follow same format. Below is the table of all failure status code and error type.

| **Status Code** | **Error Type** |
|-----------------|---------------------------|
| 400             | Bad Request               |
| 401             | Unauthorized              |
| 403             | Forbidden                 |
| 404             | Not Found                 |
| 409             | Conflict                  |
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
}
```

## USER LOGOUT

### POST: /api/user/logout
To login in to the system.

Body:
```json
// No need to pass any data. Backend will retrieve userId from cookie
```

Success Response: 200 OK

```json
{
	"message": "Login succesful",
}
```



## USER PROFILE VIEW (SELF)

### GET: /api/user/profile/self
User self profile information view.

Query Parameter:
```json
// No need to pass any data. Backend will retrieve userId from cookie
```

Success Response: 200 OK

```json
{
	"message": "Profile retrieve successful",
	"data": {
		"userId": "cml0xbgse0000yidszof47ngz",
		"userName": "test1",
		"email": "email11@test.com",
		"avatarUrl": "../frontend/public/avatars/upload/a01a3dbf-39b6-4612-9894-0a6a4fbf1292.webp"
	}
}
```


## USER PROFILE UPDATE

### PUT: /api/user/profile/update
To update userName and email.

Body:
```json
{
	"userName": "newUsername",
	"email": "newEmail"
}
```

Success Response: 200 OK

```json
{
	"message": "Profile information update successful",
	"data": {
		"userId": "cmkxup8dg0000yiy581237kt5",
		"userName": "newUserName",
		"email": "newEmail"
	},
}
```


## USER PROFILE AVATAR UPDATE

### PUT: /api/user/avatar/set
To update profile avatar.

Body:
```json
// No need to pass any data. Fastify multipart will recognise from file upload
```

Success Response: 200 OK

```json
{
	"message": "Profile avatar change successful",
	"data": {
		"userId": "cml0xbgse0000yidszof47ngz",
		"userName": "test1",
		"avatarName": "a01a3dbf-39b6-4612-9894-0a6a4fbf1292.webp"
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

### GET: /api/friendlist/search
Search (keyword search, online status filter (ONLINE, OFFLINE, ALL)) for friend.

Query Parameter:
```json
// /api/friendlist/search?keyWord=te&onlineStatus=ALL&pageNo=1&limit=2
```

Success Response: 200 OK

```json
{
	"message": "Search List",
	"data": [
		{
			"friendRId": "j7cofp7",
			"userId": "cmj7cofp70000yiwd622qn61c",
			"userName": "test",
			"status": "ONLINE"
		},
		{
			"friendRId": "j7cofp7343",
			"userId": "cmj7cofp70000yiwd622qn621",
			"userName": "test2",
			"status": "OFFLINE"
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
