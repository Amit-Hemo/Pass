# Pass

Final project in software engineering

## Requirements
- Node.js v12.x or higher
- Expo CLI v6.x or higher
- MongoDB v4.x or higher
- Android Studio for building and running the app on a simulator or device
- Braintree sandbox account : https://www.braintreepayments.com/sandbox

## Getting Started
1. Clone this repository: ```https://github.com/NadavBuchwalter/Pass.git```
2. Install the necessary dependencies for the React Native app by navigating to the `PASS/client` directory and running: `npm i`
3. Install the necessary dependencies for the React Native app by navigating to the `PASS/server` directory and running: `npm i`
4. Navigate to the following path: `Pass/client/api/index.js`:
>- In line 4 replace the ip to your own ip : 
```Js
// for development
const baseURL = 'http://<Your localhost ip>:5000';
```
5. Navigate to the following path: `Pass/client/src/screens/ProfileScreen.js`:
>- In line 15 replace the ip to your own ip : 
```Js
// for development
const HOST = 'http://<Your localhost ip>:5000';
```
6. Navigate to the following path: `Pass/server` :
>- Create .env file based on the example from `Pass/server/.env.example` 

7. Open your emulator through Android Studio

8. Navigate to the following path: `Pass/server` :
>- Start the Node.js server by running: `npm start`

9. Navigate to the following path: `Pass/client` :
>- Start the React Native app by running: `npm start`
> Type `a` inside the terminal in order to load the application in your emulator

## Architecture
The following diagram describes the Pass server structure according to the MVC (Model-View-Controller) model:
![server module](images/Server%20Module%20Diagram.png)

- index.js, app.js - the main entry point of the application, the main file in which the server is started.

- config- a folder that contains the configuration and initialization files for server-side tools such as the payment service against Braintree, the initialization of the database, and the initialization of the email sending service.

- middlewares- the folder containing functions used as an "intermediate layer" between the client and the server, the functions perform actions on the client requests/server responses such as checking the integrity of the requests arriving at the server and authentication tests.

- The controllers folder contains functions responsible for handling the logic of the various APIs.

- The routes folder contains functions that link the type of HTTP request (Get, Post, Put, Delete) in combination with the path to the server and a corresponding function from the controllers folder.

- logs- files that contain data for requests that arrived and were handled by the server or errors that resulted from the server running.

- utils - folder containing general utility functions.

- The models folder contains the schemas that define the arrangement of information in the database.

This diagram describes the division of files into client-side modules according to the structure of a standard project using React Native:
  ![frontend module](images/Frontend%20Module%20Diagram.png)

- App.js - the main file in which all the settings and libraries that run in our application are initialized, here the main UI component of the application is also created and the rest of the components are derived from it.

- screens - the main UI components for each screen in the application, each file is for a different screen.

- components – UI components that are reused on different screens. Each file contains one UI component.

- hooks – auxiliary functions that contain, among other things, functions that interface with the life cycle of projects in React. Each file contains one method.

- utils – general utility functions. Each file contains one method.

- stores – files that contain objects that are used globally in different components and dynamically control the UI components and methods for them.

- api - files that contain all the HTTP requests to the Pass server according to the resources that the Pass server contains when index.js initializes an object that knows how to send the requests and adds additional definitions that are sent with the requests such as http headers such as authorization when it comes to requests for a protected resource and functions that are called before or after making the requests .


## Built With

- [React Native](https://reactnative.dev/) - A framework for building mobile apps with React
- [Node.js](https://nodejs.org/) - A JavaScript runtime for building server-side applications
- [Expo](https://expo.io/) - An open-source platform for building and deploying mobile apps with JavaScript and React Native
- [Braintree](https://www.braintreepayments.com/) - A payment gateway for securely handling transactions
- [MongoDB](https://www.mongodb.com/) - A document-based database for storing and retrieving data
- [Mongoose](https://mongoosejs.com/) - An Object Data Modeling (ODM) library for MongoDB

## Authors

- **Nadav Buchwalter** 
- **Amit Hemo**





