# Timesheet Management System

## Overview
The **Timesheet Management System** is a full-stack web application that facilitates efficient time tracking and management for projects, tasks, and users. It is designed for both employees and administrators to log work hours and monitor progress seamlessly.

## Features
### Frontend
- Built using **React** with **TypeScript**.
- State management handled by **Zustand**.
- Responsive UI powered by **Tailwind CSS**.
- Key pages:
    - **Login Page**
    - **Project Management**
    - **Time Log Management**
    - **User Management**

### Backend
- Developed using **Node.js** with **TypeScript**.
- Framework: **Express.js**.
- Authentication middleware for secure access.
- RESTful APIs for:
    - Projects
    - Tasks
    - Time Logs
    - Users
- Database interactions are managed via **Mongoose** (MongoDB ORM).

## Project Structure
### Backend



## Installation
### Prerequisites
- **Node.js** (v16 or later)
- **MongoDB** (running instance)

### Steps
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd timesheet-main
   ```
### Install dependencies:

- #### Backend:
    ```bash
      cd backend
      npm install
      npm run dev
    ```

- #### frontend:
    ```bash
      cd frontend
      npm install
      npm run dev
    ```

## Usage
### Admin Features:
 - Manage users, projects, and tasks.
 - View and analyze time logs.
### User Features:
 - Log work hours.
 - View assigned tasks and project details.


## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Zustand
- **Backend**: Node.js, Express.js, TypeScript, Mongoose
- **Database**: MongoDB
