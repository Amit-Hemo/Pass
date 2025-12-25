# Hardware Specification

## Component: Security product

The security product is a custom-designed, all-in-one security device attached to clothing items. It integrates the locking mechanism and the digital security logic into a single shell.

## Internal Architecture

### Parts

- **Microcontroller**: Arduino Mini (handles logic).
- **NFC Shield**: PN532 (handles communication with phone).
- **Locking Mechanism**: Solenoid (controlled via MOSFET loop).
- **Power**: Internal battery.

### Wiring (Electricity Model)

- **NFC**: Connected via I2C (SDA/SCL) to the Arduino.
- **Solenoid**:
  - Positive terminal connected to VCC.
  - Negative terminal connected to MOSFET Drain.
  - MOSFET Gate connected to Arduino Pin D6 (PWM).

## Logic (`smartTag.ino`)

1.  **Initialization**:
    - Sets up Serial.
    - Initializes PN532 NFC reader.
    - Cycles the lock on startup to indicate readiness.
2.  **Loop**:
    - Checks for NFC tag presence (`nfc.tagPresent()`).
    - **Read**: If a tag (phone) is present, it reads the NDEF message.
    - **Extract**: Parses the payload to extraction the text content (Password).
    - **Authenticate**: Compares the read password with the stored password.
    - **Unlock**: If match is found, calls `open_lock()`.
3.  **Unlock Mechanism**:
    - `open_lock()` sends a HIGH signal to Pin D6.
    - This triggers the MOSFET, completing the Solenoid circuit.
    - The Solenoid retracts the pin, releasing the security product from the clothes.

## Security Note

- The current POC uses a static password string `"True password"` embedded in the Arduino code.
- In a production version, this would be replaced by unique per-tag passwords or rolling keys.
