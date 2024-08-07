# Inventory Management System

This project is a responsive inventory management system built with React, Next.js, Firebase Firestore, and Material-UI. The system allows users to add, update, delete, and search for inventory items. It also provides recipe suggestions based on available ingredients.

## Features

- Add, update, and delete inventory items.
- Search inventory items by name.
- Filter inventory items by category.
- Paginate through inventory items.
- Get recipe suggestions based on selected ingredients.
- Responsive design for various screen sizes.

## Technologies Used

- React
- Next.js
- Firebase Firestore
- Material-UI

## Setup and Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/inventory-management-system.git
cd inventory-management-system/pantry-management
```
2. Install the dependencies:
```
npm install
```
3. Set up Firebase:

Create a Firebase project in the Firebase Console.
Add a new web app to your project and copy the Firebase configuration.
Create a firebase.js file in the src directory and paste the configuration:
```js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
```
4. Add your OpenRouter API key and site information to the getRecipeSuggestions function in app/page.js.
```
const OPENROUTER_API_KEY = 'YOUR_API_KEY'; // Replace with your OpenRouter API key
const YOUR_SITE_URL = 'https://your-site-url.com'; // Replace with your site URL
const YOUR_SITE_NAME = 'Your Site Name'; // Replace with your site name
```
5. Start the development server:
```
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`.
