# hack2sec
Hack2Sec

## Deployment Procedures

### Dependencies
- Run the following to install dependencies
    ```
    npm i
    ```

### Environment Variables
- Create a `.env` file in project directory
- Add the following
    ```
    ACCESS_TOKEN_SECRET=<secret value>
    REFRESH_TOKEN_SECRET=<secret value>
    ```
    - Obtain secret value for token secrets through
        ```
        node> require('crypto').randomBytes(64).toString('hex')
        ```

### Deploy
- To start server, run
    ```
    node server
    ```
- To start development server, run
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
- Always add 'Debug' comment before debug code segment
    ```
    /* Debug: <description> */
    ```
- Always add 'TBD' comment to mark future scope
    ```
    /* TBD: <future scope> */
    ```