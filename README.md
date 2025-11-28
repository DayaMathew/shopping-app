🛍️ Shopping App 
📌 Overview

This is a responsive and dynamic Online Shopping Web Application built using HTML, CSS, Bootstrap, Material Design, JavaScript, and LocalStorage.
The system allows users to browse products, manage a cart, register/login, and admins can add/edit/delete products.

📑 Short Documentation
🧭 Explanation of Each Page
1️⃣ index.html (Home Page)

Displays the homepage layout.

Shows categories or featured products.

Navigation to all other pages.

Fully responsive using Bootstrap grid.

2️⃣ products.html (Products Listing Page)

Fetches product list from products.json or LocalStorage.

Displays each product in a Bootstrap card.

"Add to Cart" button for each item.

3️⃣ cart.html (Shopping Cart Page)

Displays all products added to the cart.

Users can increase/decrease quantity or remove items.

Total price is automatically calculated.

4️⃣ login.html

User login form with validation.

Checks user credentials stored in LocalStorage.

5️⃣ register.html

User registration form.

Saves new user details to LocalStorage.

6️⃣ add-product.html

Admin-only page.

Allows adding new products (Create).

Saves the data to LocalStorage.

7️⃣ edit-product.html

Admin-only edit page.

Allows modifying existing products (Update).

Linked through product list.

8️⃣ app.js

Contains all JavaScript logic:

Product CRUD operations

Cart functions

Login/Logout

Data handling in LocalStorage

9️⃣ products.json

Default JSON file containing product data.

Loaded initially into LocalStorage.

🔄 CRUD Operations Used in the Project
Create

Add new products (add-product.html)

Register new users (register.html)

Read

Display products from LocalStorage/products.json

Load cart items

Load user login credentials

Update

Edit product details (edit-product.html)

Update cart quantities

Delete

Delete a product (admin panel)

Remove item from cart

🎨 Bootstrap Elements Used

Navbar

Grid system (rows, columns)

Cards

Buttons

Forms

Alerts

Modal dialogs

Responsive utilities

Tables (optional depending on cart layout)

🎨 Material Design Components Used

Material text fields

Material buttons

Material icons

Responsive form layout

Card shadows and elevation

Floating labels

(If using Material CDN components, they are included in each form page.)

🔐 Login & Registration Workflow
📝 Registration

User enters details → name, email, password.

Form validates input.

Data is stored in LocalStorage inside users array.

User is redirected to login page.

🔓 Login

User enters email & password.

System checks values against LocalStorage.

If match → login successful, save currentUser.

Redirect to home/products page.

If incorrect → show error message.

🔏 Logout

Clears currentUser in LocalStorage.

Redirects to login page.
