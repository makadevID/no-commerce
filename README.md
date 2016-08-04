# NOCOMMERCE
a dead simple e-commerce playground build on top of NodeJS. 😉

**IMPORTANT NOTE:** There is no admin page for this playground. I use fakerjs to seed the data.

## STACK USED
- ExpressJS
- PassportJS
- EJS for templating
- Redis for storing session
- Elasticsearch
- MongoDB

## FEATURES
- [x] Signup & Login
- [x] Add item to cart & remove item from cart
- [x] Checkout with Stripe Payment
- [x] Live search with Elasticsearch
- [x] Payment history
- [x] Save user recent searches
- [x] Wishlist

## HOW TO INSTALL?

1. clone this repo `git clone https://github.com/alfrcr/no-commerce.git`
2. `$ cd no-commerce && npm install`
3. Run `$ npm start` (automatically seeding category to DB)
4. **There is no product in this app.** You have to **seed the products manually** by uncommenting line 39 - 47 on `server.js` and restart the server.
5. Finish.

## FOUND A BUG?
Open a [new issue.](https://github.com/alfrcr/no-commerce/issues)

## LICENSE
NOCOMMERCE is licensed under [WTFPL.](http://www.wtfpl.net/txt/copying/)

## MOTIVATION
*I made this app for learning purpose.*
