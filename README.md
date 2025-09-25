# Advanced Multi-User Login System with OTP Verification (Backend)

## Overview
This backend system is built using the **MERN stack** and provides an advanced login system supporting multiple user types. It includes OTP-based authentication for secure access using **Twilio** or **Resend** frameworks for OTP delivery. An admin panel allows for dynamic creation and management of custom user types, ensuring scalability and flexibility in role-based access control.

## Features
- **Multi-User Login**: Supports different user roles (e.g., Admin, User, Moderator) with role-based access control.
- **OTP Verification**: Ensures secure login via one-time passwords delivered through **SMS (Twilio)** or **Nodemailer (Resend)**.
- **Dynamic User Types**: Admins can create, update, or delete custom user types from the admin panel.
- **Secure Authentication**: Implements password hashing using **bcrypt** and JWT-based session management.
- **Scalable API**: RESTful APIs for handling user authentication and role management.

## OTP Verification Frameworks
1. **Twilio**:  
   - Used for sending OTPs via SMS.  
   - Reliable and scalable for real-time delivery.  
   - Integrates seamlessly with mobile authentication workflows.

2. **Resend**:  
   - Used for sending OTPs via email.  
   - Supports customizable templates and ensures fast email delivery.  
   - Ideal for web-based workflows where email is the primary communication method.

### How It Works:
- During login or registration, the system generates a random OTP and sends it to the user's mobile number via **Twilio SMS** or their email via **Resend**.  
- The user must enter the OTP within the expiration period for successful authentication.  
- OTPs are securely verified using server-side validation to ensure security.

## Technologies Used
- **Node.js**: Runtime environment for building the backend.
- **Express.js**: Framework for creating RESTful APIs.
- **MongoDB**: Database for storing user data and roles.
- **Mongoose**: ORM for MongoDB to manage schema and relationships.
- **JWT (JSON Web Tokens)**: For secure session management.
- **bcrypt**: For secure password hashing.
- **Twilio**: For sending OTPs via SMS.
- **Resend**: For sending OTPs via email.


## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/subramanyamrekhandar/Advance-Multi-UserType-Login-with-OTP-Verification.git
    
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables in a `.env` file:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    TWILIO_PHONE_NUMBER=your_twilio_phone_number
    RESEND_API_KEY=your_resend_api_key
    EMAIL_FROM_ADDRESS=your_resend_email_address
    OTP_EXPIRATION_TIME=5 # in minutes
    ```

4. Start the server:
    ```bash
    npm run dev
    ```

## Future Enhancements
- **Frontend Integration**: Build a React-based admin panel and user interface.
- **Social Login**: Add support for Google, Facebook, and other third-party authentication.
- **Enhanced Security**: Implement 2FA using TOTP or biometric authentication.
- **Activity Logging**: Track user activities for auditing purposes.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
