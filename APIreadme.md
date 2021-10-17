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
#### Parameters
Name | Type | Description
------------ | ------------- | -------------
Task (required) | String | The task for the new todo item
Category | String | The category that the new task belongs to. If left blank, the category will be set to the default ("Uncategorized").

