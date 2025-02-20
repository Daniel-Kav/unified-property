// import { serve } from '@hono/node-server';
// import { Hono } from "hono";
// import 'dotenv/config';
// import { logger } from 'hono/logger';
// import { csrf } from 'hono/csrf';
// import { cors } from 'hono/cors';
// import { trimTrailingSlash } from 'hono/trailing-slash';
// import { timeout } from 'hono/timeout';
// import { HTTPException } from 'hono/http-exception';
// import { prometheus } from '@hono/prometheus';
// import { rateLimiter } from 'hono-rate-limiter';
// import dotenv from 'dotenv';
// import { PurchaseRouter } from './purchase/purchase.router';
// import { houseRouter } from './houses/house.router';
// import { landRouter } from './land/land.router';
// import { locationRouter } from './locations/locations.router';
// import { reviewsRouter } from './reviews/reviews.router';
// import { transactionsRouter } from './transaction/transaction.router';
// import { userRouter } from './users/user.router';
// import { vehicleRouter } from './vehicles/vehicle.router';
// import { authRouter } from './auth/auth.router';

// dotenv.config();

// const app = new Hono();

// app.use(cors({
//     origin: '*',
//     allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowHeaders: ['Content-Type', 'Authorization'],
//   }));
  
//   const limiter = rateLimiter({
//     windowMs: 1 * 60 * 1000,
//     limit: 3,
//     standardHeaders: "draft-6",
//     keyGenerator: (c) => "<unique_key>"
//   });
  
//   const customTimeoutException = () => new HTTPException(408, {
//     message: `Request timeout`,
//   });
  
//   const { printMetrics, registerMetrics } = prometheus();
  
  
// // Inbuilt middlewares
// app.use(logger()); // Logs request and response to the console
// app.use(csrf()); // Prevents CSRF attacks by checking request headers
// app.use(trimTrailingSlash()); // Removes trailing slashes from the request URL
// app.use('/', timeout(10000, customTimeoutException));

// // Third-party middlewares
// app.use('*', registerMetrics);

// // Default route
// app.get('/', (c) => {
//     return c.html(`
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Property Management System</title>
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             margin: 0;
//             padding: 0;
//             background-color: #f4f4f4;
//             color: #333;
//           }
//           header {
//             background-color: #007BFF;
//             color: white;
//             padding: 20px 0;
//             text-align: center;
//           }
//           .container {
//             max-width: 1200px;
//             margin: 20px auto;
//             padding: 20px;
//             background: white;
//             border-radius: 8px;
//             box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//           }
//           h1 {
//             color: #fff;
//           }
//           h2 {
//             color: #007BFF;
//           }
//           .btn {
//             display: inline-block;
//             padding: 10px 20px;
//             margin: 10px 0;
//             background-color: #007BFF;
//             color: white;
//             text-decoration: none;
//             border-radius: 5px;
//             font-size: 30px;
//           }
//           .btn a {
//             text-decoration: none;
//           }
//           .btn:hover {
//             background-color: #0056b3;
//           }
//           footer {
//             text-align: center;
//             padding: 20px 0;
//             background-color: #007BFF;
//             color: white;
//             position: fixed;
//             width: 100%;
//             bottom: 0;
//           }
//         </style>
//       </head>
//       <body>
//         <header>
//           <h1>Welcome to Digital Property system API</h1>
//         </header>
//         <div class="container">
//           <h2>About</h2>
//           <p>My API helps you access data of a property management system.</p>
//           <h2>Feel free to view the information by clicking the button below</h2>
//           <button class="btn"><a href="">Click here!</a></button>
//         </div>
//         <footer>
//           <p>&copy; Digital Property API. All rights reserved.</p>
//         </footer>
//       </body>
//       </html>
//     `);
//   });
  
//   app.get('/ok', (c) => {
//     console.log('hello')
//     return c.text('The server is running!');
//   });
  
//   app.get('/timeout', async (c) => {
//     await new Promise((resolve) => setTimeout(resolve, 11000));
//     return c.text("Data after 5 seconds", 200);
//   });
  
//   app.get('/metrics',printMetrics);
//   app.use(limiter);
//   // Custom routes
// app.route("/", userRouter); 
// app.route("/", authRouter);
// app.route("/",PurchaseRouter);
// app.route("/",houseRouter);
// app.route("/",landRouter);
// app.route("/",locationRouter);
// app.route("/",reviewsRouter);
// app.route("/",transactionsRouter);
// app.route("/",vehicleRouter);


//   serve({
//     fetch: app.fetch,
//     port: Number(process.env.PORT) || 3000,
//   });
  
//   console.log(`Server is running on port ${process.env.PORT || 3000}`);


import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handleClerkWebhook } from './webhooks/clerk';

const app = new Hono();

// Enable CORS
app.use('/*', cors());

// Clerk webhook endpoint
app.post('/api/webhooks/clerk', async (c) => {
  try {
    const response = await handleClerkWebhook(c.req.raw);
    return response;
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});

export default app;
