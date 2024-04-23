const express = require("express");
const supertest = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();
const authenticateUser = require("./middleware/authentication")

const app = express();
app.use(express.json());

// Import route handlers
const router = require("./routes/login");
const carsListings = require("./routes/carsListings");
const ticketSystem = require("./routes/ticketingSystem")
// Setup routes
app.use("/api/v1/auth", router);
app.use("/api/v1/cars", authenticateUser, carsListings);
app.use("/api/v1/ticketingSystem/", authenticateUser, ticketSystem)

// Use environment variable or fallback for MongoDB URI
const MONGO_URI = process.env.MONGO_URI;

// Test variables
let authToken;
let car_id;

// Function to register and login a user
async function registerAndLoginUser() {
    // User registration details
    const newUser = {
        username: "testuser",
        email: "testuser@gmail.com",
        password: "testpassword",
        question1: "testUser",
        question2: "testUser"
    };

    // Register the user
    await supertest(app)
        .post("/api/v1/auth/register")
        .send(newUser);

    // User credentials for login
    const credentials = {
        email: "testuser@gmail.com",
        password: "testpassword"
    };

    // Login the user
    const response = await supertest(app)
        .post("/api/v1/auth/login")
        .send(credentials);
    authToken = response.body.data.token; // Adjust according to your actual response structure
}

// Connect to database and authenticate before running tests
beforeAll(async () => {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await registerAndLoginUser();
});

// Disconnect from the database after tests are completed
afterAll(async () => {
    await mongoose.connection.close();
});


// Describe block for login-related routes
// describe("Login Routes", () => {
//   it("should register a user", async () => {
//     const newUser = { username: "testuser", email: "testuser@gmail.com", password: "testpassword", question1: "testUser", question2: "testUser" };
//     const response = await supertest(app)
//       .post("/api/v1/auth/register")
//       .send(newUser);
//     expect(response.status).toBe(200);
//   });

//   it("should delete the test user", async () => {
//     const credentials = { email: "testuser@gmail.com" };
//     const response = await supertest(app)
//       .delete("/api/v1/auth/deleteUserForTest")
//       .send(credentials);
//     expect(response.status).toBe(200);
//   });
// });

// Describe block for car listing API routes
describe('Car Listing API', () => {
  describe('GET /api/v1/cars/getAllCarsListings', () => {
    test('should fetch all car listings', async () => {
      const response = await supertest(app)
        .get('/api/v1/cars/getAllCarsListings')
        .set('Authorization', `Bearer ${authToken}`) // Use authToken for authenticated endpoint
        .expect(200)
        .expect('Content-Type', /json/);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/v1/cars/createCarListings', () => {
    test('should create a new car listing', async () => {
      const carData = {
    carMake: "Toyota",
    carModel: "Corolla",
    year: 2021,
    mileage: 15000,
    transmission: "Automatic",
    fuelType: "Hybrid",
    seats: 5,
    pricePerDay: 50,
    availableFrom: "2024-05-01T00:00:00.000Z",
    availableTo: "2024-05-31T00:00:00.000Z",
    location: {
        lat: 34.0522,
        lng: -118.2437
    },
    ownerId: "62bc277f0077ad001f3b58aa",  // Example ObjectId for mongoose
    image_url: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
    ]
}

      console.log(authToken)
      const response = await supertest(app)
        .post('/api/v1/cars/createCarListings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(carData)
        .expect(201)
        .expect('Content-Type', /json/);
      expect(response.body.data.make).toEqual(carData.make);
      car_id = response.body.data._id
 
    });
  });
describe('GET /api/v1/cars/getSingleCarListings', () => {
    test('should fetch all car listings', async () => {
      const response = await supertest(app)
        .get(`/api/v1/cars/getSingleCarListings/${car_id}`)
        .set('Authorization', `Bearer ${authToken}`) // Use authToken for authenticated endpoint
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });
describe('DELETE /api/v1/cars/deleteCarListings', () => {
    test('should fetch all car listings', async () => {
      const response = await supertest(app)
        .delete(`/api/v1/cars/deleteCarListings/${car_id}`)
        .set('Authorization', `Bearer ${authToken}`) // Use authToken for authenticated endpoint
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });
  
 it("should delete the test user", async () => {
    const credentials = {email: "testuser@gmail.com"};
    const response = await supertest(app)
      .delete("/api/v1/auth/deleteUserForTest")
      .send(credentials);
    expect(response.status).toBe(200);
    // Add more assertions as needed
  });


  // Continue adding more tests for update and delete operations
});

        