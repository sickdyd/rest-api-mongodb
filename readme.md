REST API + MongoDB CRUD project.

Movie genres.

Endpoints:

  Get the list of genres available (GET)
  http://localhost:3000/api/genres

  Update a genre (PUT)
  http://localhost:3000/api/genres/{id}

  Add a genre (POST)
  http://localhost:3000/api/genres + req.body { "genre": "Genre name" }

  Delete a genre (DEL)
  http://localhost:3000/api/genres/{id}