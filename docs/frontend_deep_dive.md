# Frontend Deep Dive

## Structure

The frontend is a React Native app built with Expo.

### Navigation Flow

1.  **Auth**: `WelcomeScreen` -> `LoginScreen` / `CreateAccountScreen` -> `OTPScreen`.
2.  **Payment Setup**: User must add a default payment method before being able to enter the main scanning flow.
3.  **Main**: `HomeScreen` (Dashboard).
4.  **Shopping**:
    - **Scanning**: `ScanProductScreen` uses the phone's NFC capabilities to read the tag on the clothes.
    - **Decision**: User chooses "Single Payment" (Buy Now) or "Add to Cart".
    - **Cart**: `CartScreen` manages selected items for bulk purchase.
    - **Checkout**: `PurchaseDetailsScreen` confirms payment details.
5.  **Post-Purchase**:
    - `ReleaseProductScreen`: The "Key" mode. Uses HCE to unlock tags.

### Key Technologies

- **NFC**: Uses `react-native-hce` to emulate a card (Host Card Emulation). This acts as the "key" to the physical lock.
- **Forms**: Uses `react-hook-form` for efficient form handling, validation (email, password complexity, etc.), and error management.
- **Data Management**:
  - **`react-query`**: Used with `axios` for fetching server data, caching, and background updates.
  - **`zustand`**: Used for global client-side state (User session, Cart).
- **Styling**: Uses Tailwind classes (via `nativewind`).

### Critical Components

#### `ReleaseProductScreen.js`

This screen is the bridge between digital payment and physical item release.

- **Logic**:
  - Initializes an HCE session (`HCESession`).
  - Emulates a `NFCTagType4` with content `"True password"`.
  - Listens for `HCE_STATE_READ` event to confirm the hardware read the tag.
- **Security**: Uses the default "True password" string for POC purposes.

#### Payment Flow

The app does not handle sensitive raw card data directly in API calls to the store backend (except to Braintree for Tokenization).

1.  **Tokenization**: User enters card details into Braintree UI.
2.  **Nonce Generation**: Braintree returns a payment method `nonce`.
3.  **Vaulting**: Client sends this nonce to the server (`/payment/methods/update`), which vaults it and sets it as default.
4.  **Charging**: When clicking "Purchase", the client just signals the intent for the server to charge the **Default Payment Method** associated with the User ID.

### API Interaction

- Located in `src/api`.
- Uses `axios` instances configured with base URLs and interceptors for token management.
