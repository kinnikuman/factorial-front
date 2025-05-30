# Factorial front-end
Front-end for Factorial challenge. Note that this is not a complete solution.

This front-end consumes the API served by https://github.com/kinnikuman/factorial-back. 
Please follow the instructions in the README of the back repository to serve the API.

# Requirements

- Docker & Docker-compose

# Installation

1. Clone this repo 😀

2. From the root folder run:
   ```
   docker-compose build --no-cache
   docker-compose up --build -d
   ```
3. You can access now to http://localhost:8080

## sections
Home: a dummy home page for our e-commerce

Products: the list of products that our e-commerce have. It consumes the backend API to fetch the list of products

Product Page: every product in the product list page contains a button to configure the product that redirect the user to the product page. In this page you can configure every piece of the bike. It will show to the user the information about the product and a set of selectors for every type of configurable option.
Every time you select and option, the rest of selectors are updated to show the available options, taking in account the restrictions for every option.
Also an button to add the product to the cart appears.

Cart: section to show all the products added to the cart and pay. Not implemented

## Code Structure

You can find the code under the src folder. Two bounded contexts have been created:
- **Catalog**: Contains all code related to products
- **Cart**: Contains code related to adding products to cart


Every bounded context contains Application, Domain, and Infrastructure folders.

The App.vue is the initial component. It contains the menu that loads the different sections under src/views (Home.vue, Cart.vue, ProductEdit.vue, Products.vue)

The components use the uses cases needed, located in the src/catalog/application and src/cart/application folders.