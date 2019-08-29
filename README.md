# API Documentation

#### Backend delpoyed at [Heroku](http://roamly.herokuapp.com)

## Getting started

To get the server running locally:

- **git clone https://github.com/labs14-travel-website/backend.git** - Clone the repository
- **cd backend** - Change to the cloned directory
- **yarn install** - Install all required dependencies
- **yarn server** - Start the local server
- **yarn test** - Start server using testing environment

### Backend built with Node.js and Express

- Easy to learn
- Scalable
- Benefit of fullstack JS
- Fast / High Performance

## Endpoints

#### Authorization Route

| Method | Endpoint                | Access Control | Description                                |
| ------ | ----------------------- | -------------- | ------------------------------------------ |
| POST   | `/api/auth`             | all users      | Takes an auth token and verifies identity. |

### Places Routes

| Method | Endpoint                | Access Control | Description                                     |
| ------ | ----------------------- | -------------- | ----------------------------------------------- |
| GET    | `/details/:city`        | all users      | Gets details for a specific city.               |
| GET    | `/info/:attraction`     | all users      | Gets description information for an attraction. |

#### GraphQL Route

| Method | Endpoint                | Access Control | Description                                |
| ------ | ----------------------- | -------------- | ------------------------------------------ |
| GET    | `/gql`                  | authed users   | GraphQL endpoint to get attraction details, requires auth token in header |

# Data Model

#### GraphQL Resources

---

```
{
  type Query  {
        message: String,
        user: User,
        favorites: [Attraction],
        users: [User],
    },
    type Mutation {
      addFavorite(id: String!): Attraction,
      removeFavorite(id: Int!): Favorite,
    },
    type Favorite {
      id: Int,
      user_id: String,
      attraction_id: Int,
    },
    type User {
      id: String,
      name: String,
      email: String,
    },
}
```

## Actions

##### Global

`get([id])` -> Gets all records if no id is provided, otherwise gets the record for specified id.
`add(data, [returning])` -> Adds a record to the database, can optionally specify returned columns.
`update(id, data)` -> Updates a record for the provided id with the provided data.
`remove(id)` -> Removes record with the specified id.
`cb(method)` -> Executes a provided callback with the raw db connection passed as an argument.

##### User Favorites

`getAttractions(id)` -> Gets attraction data for a specified user_favorite record.
`getAttractionId(placeId)` -> Gets an attraction's record id for a specified placeId.

## Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.
Create a .env file that includes the following:

```
DATABASE_URL - This is the connection string for your database, such as postgres://[user]:[password]@localhost
PORT - Port you want the backend server to run on, default for local is 8000
OAUTH_GOOGLE_ID - OAuth credentials for Google login, should use separate id from production for dev
OAUTH_GOOGLE_SECRET - OAuth credentials secret for Google login
PLACES_API_KEY - Key for Google places API, create a personal key for dev environment through Google Console
```
    
## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

 **If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**
 - Check first to see if your issue has already been reported.
 - Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
 - Create a live example of the problem.
 - Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes,  where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See [Frontend Documentation](🚫link to your frontend readme here) for details on the fronend of our project.
🚫 Add DS iOS and/or Andriod links here if applicable.
