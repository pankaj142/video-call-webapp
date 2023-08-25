# Video Call Webapp
Video call webApp. Clone of Google meet (not exactly).

Please excuse for the UI part, as intent of doing the project was to learn webRTC and build video call app only and not UI part.

## APP URL 
https://video-call-webapp-ck29a1cvx-pankaj142.vercel.app

## Tech stack 
    WebRTC
    socket.io
    Peerjs
    Nodejs
    Reactjs
    Redux toolkit


## Note => Kindly on your webcamera while using this app

## Features

### Join
    - Once user Join then he is added to list of online people(right side list) 

### Direct call (One-to-One Call)
    - User can call to anyone from online list, just by clicking on person name from the list

    In Direct call user can do following things:
        a. user can show / hide his video to other person
        b. user can speak / mute his audio to other person
        c. user can share his screen
        d. user can send messages to other person


### Group call ( Conference Call )
    - User can create a room, that room will be visible on list downside
    - Online users can see all rooms
    - anyone can join that room, just by clicking on the room name
    - once user join the room, that's conference call

    In Group call user can do following things:
        a. user can show / hide his video to other persons
        b. user can speak / mute his audio to other persons


## Deployment
### Backend
Backend is deployed in Heroku platform using Heroku CLI

### Frontend
Frontend is deployed in Vercel platform

### APP URL 
https://video-call-webapp-ck29a1cvx-pankaj142.vercel.app


## Learning from this Video chat app project
1. working of webRTC in theory, and in practise like, establishing webRTC connection between peers via signaling server, sending / receiving audio and video tracks between peers, sending / receiving data messages over webRTC connection  

2. Implementaion of webRTC for Direct call (one-to-one call)
3. Implementation of Group Call / Conference call using Peerjs 
4. Integration of socket.io in Direct call and Group call 
5. Setting up TURN server for ICE candidates on Twilio platform
6. Integration of TURN server ICE candidates servers into our backend and frontend (client)
7. deploy frontend (reactjs) on Vercel 
8. Deploying backend (nodejs) on Heroku


## Questions

### Why we need TURN servers?

When a webRTC direct connection is not possible using the STUN server. (due to any reason)

So, in that case, communication can happens through TURN servers.

we can use TURN servers as relying server, means TURN server will act as intermediatory server.

than means, in this case, commutation between peers happens through TURN servers.


### How to use and deploy this project ?

1. Clone this repo
2. goto main branch
3. goto frontend directory
    do npm install
    add .env file in main directory and add this content in that file
        REACT_APP_SERVER_URL=http://localhost:5000
    run the app, npm start
4. goto backend directory
    do npm install
    add .env file in main directory and add this content in that file    
        PORT=5000
        ACCOUNT_SID={ get it from any TURN server platform ex. Twilio }
        AUTH_TOKEN={ get it from any TURN server platform ex. Twilio }

    npm start

**You are done**
