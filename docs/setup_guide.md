# Setup Guide

## Prerequisites

- Node.js v12.x+
- Expo CLI
- MongoDB v4.x+
- Android Studio (for Emulation/HCE support)
- Braintree Sandbox Account

## Backend Setup

1.  Navigate to `server`: `cd server`
2.  Install dependencies: `npm install`
3.  Configure Environment:
    - Create `.env` file based on `.env.example`.
    - Add Braintree credentials (Merchant ID, Public Key, Private Key).
    - Add MongoDB connection string.
4.  Start Server: `npm start` (or `node index.js`).

## Frontend Setup

1.  Navigate to `client`: `cd client`
2.  Install dependencies: `npm install`
3.  Start App: `npx expo start`
    - Use `a` to open in Android Emulator.
    - **Note**: NFC functionality (HCE) requires a physical device or a specific emulator configuration capable of NFC simulation.

## Hardware Setup

1.  Connect Arduino to PC.
2.  Connect PN532 shield to Arduino (I2C mode).
3.  Connect Lock mechanism to Pin 6.
4.  Upload `smartTag.ino` using Arduino IDE.
5.  Open Serial Monitor (115200 baud) to view logs.

## Testing the Flow

1.  Ensure Server is running and DB is connected.
2.  Make sure Hardware is powered.
3.  Open App on Phone.
4.  "Purchase" an item.
5.  Go to Release screen.
6.  Tap Phone to Hardware Tag.
7.  Verify Solenoid activates.
