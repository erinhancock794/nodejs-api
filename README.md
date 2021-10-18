# API for Todo App


## Todo Endpoints

### List of Todos
`GET /todos`

Returns all todo items and metadata for each item. 

### List of Todos by Category
`GET /todos/{category}`

Returns all todo items within a specified category.

### Add a Todo
`POST /todos/add`

Adds a new todo item. It will return an error if the new task is a duplicate of an existing task or the category is invalid.
#### Parameters
Name | Type | Description
------------ | ------------- | -------------
Task (required) | String | The task for the new todo item
Category | String | The category that the new task belongs to. If left blank, the category will be set to the default ("Uncategorized").

#### Example 
```
Request
{
        "task": "do homework",
        "category": "school"
}
Response 
{
    "message": "success",
    "newTodo": {
        "id": 1634516703038,
        "task": "do homework",
        "category": "school",
        "complete": false
    }
}
```

### Edit a Todo
`PUT /todos/{id}`

Edits specified parameters for an existing Todo item. If any parameters are not passed in the request, they will not be updated.


#### Parameters
Name | Type | Description
------------ | ------------- | -------------
Task | String | The task for the new todo item.
Category | String | The category for the updated task.
Complete | Boolean | The status of the todo.

#### Example 
```
Endpoint: /todos/1

Request {

        "task": "read book",
        "complete": true
}

Response {
    "message": "success",
    "updatedTodo": {
        "id": 1,
        "task": "read book",
        "category": "school",
        "complete": true
    },
    "previousTodo": {
        "id": 1,
        "task": "go to school",
        "category": "school",
        "complete": false
    }
}
```

### Delete a Todo
`DELETE /todos/{id}`

Removes a Todo. 


## Categories Endpoints
### List of Categories
`GET /categories`

Returns an array of categories.

### Add a New Category
`POST /categories/add`

Adds a new category.
#### Parameters
Name | Type | Description
------------ | ------------- | -------------
Category | String | The name of the category to be added.

#### Example
```
Endpoint: /categories

Request Body {
    "category": "fun"
}
Response {
    "message": "success",
    "categories": [
        "school",
        "work",
        "health",
        "fun"
    ]
}

```

### Update a Category
`PUT /categories/{currentCategory}`

Updates an existing category by adding the name of the current category to the endpoint and passing a new category name on the body.
#### Parameters
Name | Type | Description
------------ | ------------- | -------------
Category | String | The updated name of the existing category.

#### Example 
```
Endpoint: /categories/update/health

Request Body {
    "category": "fun"
}
Response {
    "message": "success",
    "previousCategory": "health",
    "updatedCategory": "fun",
    "categories": [
        "school",
        "work",
        "fun"
    ]
}
```

### Delete a Category
`DELETE /categories/{currentCategory}`
Removes a category.

#### Example
```
Endpoint: /categories/work

Response {
    "message": "success",
    "categories": [
        "school",
        "clean",
        "sleep"
    ]
}
```

## Responses
Status | Meaning | Description
------------ | ------------- | -------------
200 | OK | Success
404 | Not Found | Category or Item not found
409 | Conflict | Invalid Category or Todo Already Exists

