const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });

// Add greetings
manager.addDocument("en", "hello", "greeting");
manager.addDocument("en", "hi", "greeting");
manager.addDocument("en", "hey you", "greeting");
manager.addDocument("en", "yo", "greeting");
manager.addDocument("en", "good morning", "greeting");
manager.addDocument("en", "good afternoon", "greeting");
manager.addDocument("en", "good day", "greeting");

// Add greetings responses
manager.addAnswer("en", "greeting", "Hey!");
manager.addAnswer("en", "greeting", "Hey there");
manager.addAnswer("en", "greeting", "Hi");
manager.addAnswer("en", "greeting", "Yo whatsup");

// Add car rental specific intents
manager.addDocument("en", "How can I rent a car?", "rental_query");
manager.addDocument("en", "What cars are available for rental?", "availability_query");
manager.addDocument("en", "Where is your location?", "location_query");
manager.addDocument("en", "How much does it cost to rent a car?", "cost_query");

// Add responses for car rental intents
manager.addAnswer("en", "rental_query", "You can rent a car by visiting our website or contacting our office.");
manager.addAnswer("en", "availability_query", "We have a variety of cars available. Please visit our website for the latest information.");
manager.addAnswer("en", "location_query", "Our main office is located in downtown CityX, but we have several branches. Check our website for the nearest one.");
manager.addAnswer("en", "cost_query", "The cost depends on the car model and rental duration. Please refer to our website for detailed pricing.");

//more questions
manager.addDocument("en", "Can I change my booking?", "modify_booking_query");
manager.addDocument("en", "I need to cancel my reservation", "cancel_booking_query");
manager.addDocument("en", "Do you offer any discounts?", "discount_query");
manager.addDocument("en", "Can I request a specific car model?", "specific_car_query");
manager.addDocument("en", "Are there any additional charges?", "extra_charges_query");
manager.addDocument("en", "How can I extend my rental period?", "extend_rental_query");
manager.addDocument("en", "Is insurance included?", "insurance_query");

// Responses for additional intents
manager.addAnswer("en", "modify_booking_query", "You can change your booking details through our website or by calling our support team.");
manager.addAnswer("en", "cancel_booking_query", "To cancel your reservation, please use the link provided in your booking confirmation email or contact our customer service.");
manager.addAnswer("en", "discount_query", "We offer various discounts throughout the year. Check out our promotions page or sign up for our newsletter to get the latest deals.");
manager.addAnswer("en", "specific_car_query", "You can request specific car models during the booking process. Availability may vary based on your rental location and date.");
manager.addAnswer("en", "extra_charges_query", "Additional charges may apply for extras like GPS, child seats, or additional drivers. These will be detailed during the booking process.");
manager.addAnswer("en", "extend_rental_query", "To extend your rental period, please contact our customer service before your rental ends to check availability.");
manager.addAnswer("en", "insurance_query", "Basic insurance is included with every rental. You can opt for additional coverage options during the booking process for extra peace of mind.");
// Train and save the model
manager.train().then(async () => {
  await manager.save();
  // Test with a sample query
  let response = await manager.process('en', 'How can I rent a car?');
  console.log(response.answer);  // Output: You can rent a car by visiting our website or contacting our office.
});
