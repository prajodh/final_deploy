# software_enginnering_rental_management_system_backend

# Rental & Services Management System

Rental & Services Management System is a platform for customers and management (renters/service providers) to interact efficiently regarding rental items and services. This system aims to simplify and organize tasks related to property management. 

## Overview

The system should encompass functionalities for different rental items such as apartments, cars, boats, and services like plumbing, pest control, etc. Here are the main views of the system:

1. **The Renter:**
   - Customers can choose items/places for rent, apply offers, make payments, cancel bookings, lodge complaints, and apply for refunds.

2. **The Owner:**
   - Renters can post items for rent and view information about customers who rented items/services.

3. **The Admin:**
   - Admin can approve items for rent, handle customer complaints, and issue refunds.

4. **Public Facing View:**
   - Landing page where anyone can view items for rent, search, filter, and see ratings & reviews.

## Core Features

### 1. Login & Registration (User Specific)
   - Automatically generate unique IDs for each user.
   - Login using email address or username.
   - OAuth login (Google, Facebook, etc.).
   - Forgot Password/Username feature with security questions, OTP, and image captcha.

### 2. Search, Filter & Recommendation
   - Users can search for rental items or services with various filters.
   - Recommendations based on rented items.

### 3. Maps & Multimedia
   - View item location on maps.
   - Upload/view images/videos of items.
   - View customer location for owners.

### 4. View Specific Functionalities
   - Different views for public, logged-in users, and admin.
   - Rate & review items, view past rentals, lodge complaints, etc.
   - Admin functionalities for item approval, complaint handling, refunds.
   - Payment, coupon code application, complaint lodging, refund requests.

### 5. Messaging & Chat
   - Chat between renter and owner.
   - Chat between renter and admin (bot simulation).
   - View message status (online, delivered, read, typing).
   - Group chat.

## Additional Features

### 1. Chat Bot
   - Admin chat bot for responding to requests using NLP libraries.

### 2. Dashboard for Admin & Owner
   - Admin dashboard with statistics on most rented items/services, top complainers, etc.
   - Owner dashboard for monitoring rented items.


