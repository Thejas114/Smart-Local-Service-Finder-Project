
ServyLocal 

A smart, dynamic dual-sided marketplace application solving local service discovery (plumbers, electricians, cleaners, etc.). Built as a startup-level product, it demonstrates complex frontend architecture and a premium user interface.

Core Features
*   **Dual-Sided Portals**: Independent UI flows and Dashboards for both Customers and Service Providers, seamlessly synced.
*   **Provider Booking CRM**: Providers can toggle their real-time "Online" availability, track simulated lifetime earnings, and elegantly Accept, Reject, or Complete incoming work requests.
*   **Client Service Discovery**: Consumers can browse local providers dynamically and book categorized time-slots natively.
*   **Geolocation Proximity**: Integrates `navigator.geolocation` browser APIs to actively capture location state and mathematically recalculate service distances upon dashboard rendering.
*   **Premium Interface Design**: Hand-crafted Vanilla CSS utilizing glassmorphism themes, immersive dark mode components, and fluid micro-animations without relying on heavy framework templates.
*   **Live Chat Simulator**: Booked consumers interact natively with an overlay mimicking active WebSocket-driven conversation delays.

Technology Stack
*   **Frontend Framework**: React.js with Vite 
*   **Global State Management**: React Context API (`AuthContext`)
*   **Routing Network**: React Router DOM v6
*   **UI Assets**: Lucide React Icons, Google Fonts (Inter)
*   **Abstracted Data Layer**: Advanced completely-local 'MockApi' service engine processing JavaScript `Promises`. Simulates distinct server response latencies and database operations.

## Running Locally
To launch the project on your machine within seconds:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone this repository to your local machine.
2. Open your terminal in the cloned directory and install the necessary dependencies:

```bash
npm install
```

3. Spin up the development server:

```bash
npm run dev
```

4. The application will immediately be hosted on your local network. Simply navigate your browser to the URL printed in the terminal (usually `http://localhost:5173` or `http://localhost:5174`).

## Demo Authentication
Feel free to interact natively with tracking features inside the mock database using these existing profiles! Use the 'Login' navigation link to begin:

### 👤 Customer Perspective
*   **Role Setup:** Make sure "Customer" is selected on the login toggle.
*   **Email**: `user@test.com`
*   **Password**: `password`

### 🛠️ Provider Perspective
*   **Role Setup:** Click the "Provider" toggle on the login overlay.
*   **Email**: `rahul@test.com`
*   **Password**: `password`

---
Built with  utilizing React & Vite.
=======
# Smart-Local-Service-Finder-Project
>>>>>>> cd442097ad2e161aeb68bf03a19fb0f274c707d9
