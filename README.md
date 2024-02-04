# YT-Note-Taker

`yt-note-taker` is a note-taking application made exclusively
for YouTube videos

## Features
- LaTeX support
- Notes downloadable as pdf

## Usage

## Architecture
This application is designed using the Microservices principle and consists of
the following 3 services
- `notes-service`: The API-service
- `note-taker`: The UI
- `image-service`: The service which handles saving images which accompany the
  notes

## Setup

## `notes-service`
- This service is implemented with NodeJS and Postgres
- Most backend logic is handled here: Swagger API documentation can be accessed
  after this service's local setup.
```bash
# Install dependencies
npm install

# Setup the database (steps below)

# Start the service
npm run start
```
### DB-setup
- Create the DB in Postgres
  - The DB connection string can be found at `notes-service/database/db.js` -
    Modify as required
- Execute the script at `notes-service/database/db-creation.sql`
  - The DB contains only 3 tables and comments have been included in this script
    for the description of each table.
  - Caution: The script also includes some DROP commands. To ensure that there
    is no unintended deletion, create a separate DB for this service.

## `note-taker` 
- This service is implemented with ReactJS
```bash
# Install dependencies
npm install

# Start the service
npm run start
```

## `image-service`
- This service is implemented with NodeJS, Postgres and RabbitMQ
- It is used to save images to the file-system as opposed to saving images in
  the database which is not recommended - thus, only the path to the image will
  be saved in the DB.
- RabbitMQ is introduced to ensure that this action of saving will not block the
  main process (i.e.), `notes-service`
  - When the application was initially images were saved to cloud rather than
    the local file system. So queuing made more sense in that context.
### How images are actually saved
