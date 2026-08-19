# E-Commerce App Backend setup

## Dependencies

- bcrypt
- jwt
- express
- multer
- sequelize

## Structure

# Project Structure

```text
src/
├── config/
│   └── config.cjs
├── controllers/
│   ├── auth.controller.js
│   ├── cart.controller.js
│   ├── category.controller.js
│   ├── order.controller.js
│   ├── product.controller.js
│   └── wishlist.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   └── uploads.middleware.js
├── migrations/
│   ├── 20250806135429-create-users-table.cjs
│   ├── 20250806135448-create-user-auth-token-table.cjs
│   ├── 20260812100000-create-categories-table.cjs
│   ├── 20260812100010-create-products-table.cjs
│   ├── 20260812100020-create-carts-table.cjs
│   ├── 20260812100030-create-cart-items-table.cjs
│   ├── 20260812100040-create-wishlists-table.cjs
│   ├── 20260812100050-create-orders-table.cjs
│   ├── 20260812100060-create-order-items-table.cjs
│   ├── 20260813092945-add-user-role.cjs
│   └── 20260819073113-add-profile-image-to-users.cjs
├── models/
│   ├── cart.js
│   ├── cart_item.js
│   ├── category.js
│   ├── index.js
│   ├── order.js
│   ├── order_item.js
│   ├── product.js
│   ├── user.js
│   ├── user_auth_token.js
│   └── wishlist.js
├── routes/
│   ├── auth.route.js
│   ├── cart.route.js
│   ├── category.route.js
│   ├── order.route.js
│   ├── product.route.js
│   └── wishlist.route.js
├── seeders/
│   ├── 20260813093533-users-seed.cjs
│   ├── 20260813094400-category-seed.cjs
│   ├── 20260813094430-product-seed.cjs
│   ├── 20260813100000-cart-seed.cjs
│   ├── 20260813100010-cart-item-seed.cjs
│   ├── 20260813100020-wishlist-seed.cjs
│   ├── 20260813100030-order-seed.cjs
│   └── 20260813100040-order-item-seed.cjs
├── services/
│   ├── auth.service.js
│   ├── cart.service.js
│   ├── category.service.js
│   ├── order.service.js
│   ├── product.service.js
│   └── wishlist.service.js
└── utils/
    ├── ApiError.js
    ├── ApiResponse.js
    ├── asyncHandler.js
    └── validator.js

index.js
.sequelizerc
.env
```

### run

```
npm start //static run
```
```
npm run dev //live run
```

### migrations

```
npm run migration:generate _migration-name_
```
```
npm run migration:run
```
### seeders

```
npm run seed:generate _seed-name_
```
```
npm run seed:run
```