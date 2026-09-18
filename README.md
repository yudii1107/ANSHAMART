\# AnshaMart 🛍️



A full-stack e-commerce website built as a student project using HTML, CSS, JavaScript, Node.js, Express.js, REST APIs, and PostgreSQL.



\## Features



\* Product listing and product details

\* Product search

\* Category filtering

\* Price sorting

\* User registration and login

\* Password hashing

\* Shopping cart

\* Checkout

\* Order management

\* Product reviews

\* Wishlist

\* PostgreSQL database integration

\* RESTful backend APIs

\* Responsive frontend



\## Tech Stack



\*\*Frontend\*\*



\* HTML5

\* CSS3

\* JavaScript



\*\*Backend\*\*



\* Node.js

\* Express.js

\* REST APIs



\*\*Database\*\*



\* PostgreSQL



\## Project Structure



```text

ANSHAMART/

├── backend/

│   ├── middleware/

│   ├── routes/

│   ├── db.js

│   ├── server.js

│   └── package.json

│

├── frontend/

│   ├── css/

│   ├── js/

│   ├── index.html

│   ├── products.html

│   ├── product.html

│   ├── cart.html

│   ├── checkout.html

│   ├── orders.html

│   ├── login.html

│   ├── register.html

│   ├── profile.html

│   └── wishlist.html

│

└── README.md

```



\## Running the Project



\### 1. Clone the repository



```bash

git clone https://github.com/yudii1107/ANSHAMART.git

cd ANSHAMART

```



\### 2. Install backend dependencies



```bash

cd backend

npm install

```



\### 3. Configure PostgreSQL



Create a PostgreSQL database named:



```text

ecommerce\_db

```



Configure your database credentials in the backend `.env` file.



\### 4. Start the backend



```bash

node server.js

```



The backend runs on:



```text

http://localhost:5000

```



\### 5. Start the frontend



Open the `frontend` folder using a local web server.



The frontend runs on:



```text

http://localhost:3000

```



\## API



Main API routes include:



```text

/api/products

/api/auth

/api/orders

/api/reviews

/api/wishlist

```



\## Purpose



AnshaMart was developed to practice and demonstrate full-stack web development concepts including frontend development, REST API development, authentication, database integration, CRUD operations, and e-commerce workflows.



\## Author



\*\*Yudhishthir\*\*



B.Tech Computer Science and Engineering Student



