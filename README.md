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





