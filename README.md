# Invoice Generator Web Application

- This is a web application designed to help small businesses create invoices in PDF format.
- The application allows users to search for companies in the commercial register using the ARES API.
- Each saved document can be regenerated, edited, or deleted.
- Users can save their information, which will automatically fill in the invoice form.
- A future update will include a directory of saved contacts.

## Tech Stack
- React
- SASS
- Axios
- JSON Server

## Features

The application includes the following features:

- **Invoice Generation:** Users can create invoices in PDF format. This feature is currently in a basic version but will be expanded in future updates.

- **Company Search:** The application allows users to search for companies in the commercial register using the ARES API.

- **Document Management:** Users can save, regenerate, edit, and delete documents.

- **Auto-fill Forms:** Users can save their personal information, which will be automatically filled in the invoice form.

- **Basic Styling:** The application uses SASS for styling, currently in a basic form.

- **Temporary Database:** A provisional database is set up using JSON Server.

- **Database Connection:** The connection to the database is made using the Axios library.

## Future Updates

Planned features for future updates include:
- **Registration and Account Creation:** Users will be able to register and create their own accounts.
- **Personal Directory:** Each account will have a personal directory.
- **Multiple Company Profiles:** Users will be able to create multiple company profiles.
- **Additional Documentation:** More documentation necessary for accounting and customer communication will be added.

## Installation

1. Install [Node.js](https://nodejs.org/):
    - Download and install Node.js from the official website.

2. Clone the repository to your local machine:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

3. Install the required dependencies:
    ```bash
    npm install
    ```

4. Start the application:
    ```bash
    npm start
    ```

The application will automatically start.

The server will be available at `http://localhost:3001/`.

The spplication will be available at `http://localhost:5173/`.

## Note

This application is currently in development and is available in a basic version. More features will be added in the future.
