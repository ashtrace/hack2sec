# hack2sec
Backend to 'Hack2Sec', a Capture-The-Flag platform created to seamlessly integrate practical cybersecurity exercises into university curricula, thereby reducing the learning curve associated with these activities.

## Deployment Procedures

### Dependencies
- Run the following to install dependencies.
    ```
    npm i
    ```

### Database
- Install mongoDB community edition locally.
- Create a database named `hack2sec`.

### Environment Variables
- Create a `.env` file in project directory.
- Add the following:
    ```
    ACCESS_TOKEN_SECRET=<secret value>
    REFRESH_TOKEN_SECRET=<secret value>
    DATABASE_URI=mongodb://localhost:27017/hack2sec?retryWrites=true
    ```
    - Obtain secret value for token secrets through:
        ```
        node> require('crypto').randomBytes(64).toString('hex')
        ```

### Deploy
- Pre-requisite: Start the mongoDB service.
- To start server
    ```
    node server
    ```
- To start development server
    ```
    npm run dev
    ```

## Development Guidlines

### Comment & Documentation
- Always use following comment format.
    ```
    /* Single line comment */

    /* Multi
     * line comment
     */ 
    ```
- Always add 'Debug' comment before debug code segment.
    ```
    /* Debug: <description> */
    ```
- Always add 'TBD' comment to mark future scope.
    ```
    /* TBD: <future scope> */
    ```