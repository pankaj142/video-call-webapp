let myPeer;

export const connectWithMyPeer = () => {
    // Peer object we have imported in index.html file, so it gets added to windows Object
    
    myPeer = new window.Peer(undefined, { // first argument we can pass our own id, but if we pass undefined then Peer server will create Ids itself
        path: '/peerjs', // same path that we have added in backend
        host: '/',
        port: 5000 // express app port
    });

    // start connection with Peer server
    myPeer.on('open', (id) => {
        console.log("Successfully connected with peer server");
        console.log(id);
    })
}