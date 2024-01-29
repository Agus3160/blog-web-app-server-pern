# Blog PERN Stack

A dynamic web application, the PERN Stack Blog utilizes the powerful combination of PostgreSQL, Express.js, React, Node.js, and Prisma as its ORM to deliver a feature-rich blogging platform. With a strong emphasis on functionality and ease of use, this project incorporates various cutting-edge technologies to provide a seamless and enjoyable user experience.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Installation](#installation)
- [Usage](#usage)

## Introduction

The PERN Stack Blog is a web application designed to offer a dynamic and feature-rich blogging experience. Leveraging the power of PERN (PostgreSQL, Express.js, React, Node.js) and utilizing Prisma as its ORM, this platform provides a robust and efficient solution for bloggers and content creators. The incorporation of TypeScript ensures a type-safe and maintainable codebase, while a session management system using React context enhances user interactions.

## Features

- **CRUD Operations**: Perform Create, Read, Update, and Delete operations for blog posts with and users.
- **Session Management**: Uses jwt system to authenticate the session and the calls to the endpoints. 
- **Protected Routes**: Uses middlewares to check the auth of the req and to check if the req is the real owner of a certain post.
- **Fire Base Storage**: It allows to storage images for psots and profiles. 

## Getting Started

To set up the server Blog locally, follow the step-by-step guide below.

### Installation

0. You need the [client side](https://github.com/Agus3160/blog-web-app-client-pern) of this application to interact with the endpoints or configure the origin.
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using the package manager of your choice:

  ```bash
   npm install
  ```

4. Run the next command to enable the creation of models
  ```bash
    npx prisma init
  ```

  Models:
  ```prisma
    model Post {
    id        String   @id @default(uuid())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    title     String   @db.VarChar(255)
    imageUrl  String  
    imagePath String 
    content   String
    author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
    authorId  String
  }

  model User {
    id        String   @id @default(uuid())
    email     String   @unique
    username  String   @unique
    password  String
    imageUrl  String
    imagePath String
    posts     Post[]
  }
  ```

5. Set up all the env variables that the project needs as FIREBASE config and JWT config.

6. Run the next code to start the server
  ```bash
   npm run dev
  ```

## Usage

To use this web service I recommend to use the client side to manage the data in a easy way.