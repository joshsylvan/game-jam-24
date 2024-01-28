const { createServer } = require("http");
const { Server } = require("socket.io");

let hostId = "";
const playerMap = {};
// Add a player if they are the first they are the host
function addPlayer(name, id) {
    // if (Object.keys(playerMap).length === 0) {
    //     hostId = id;
    // }
    playerMap[id] = { name };
}

let votingTimeout;
let votingInterval;
let isVoting = false;
// Map of name to an array of the people who have voted for them e.g. Record<string, string[]>
let voterMap = {}
// Set of user ids to stop people voting twice
const votedSet = new Set();

function removePlayer(id, io) {
    if (!playerMap[id]) {
        console.log("player does not exist");
        return;
    }
    console.log(playerMap[id].name + " has left the game.");
    delete playerMap[id];
    // If they were the host now reassign the host
    // if (hostId === id) {
    //     const playerIds = Object.keys(playerMap);
    //     if (playerIds.length > 0) {
    //         hostId = playerIds[0];
    //         io.emit("new-host", { id: hostId });
    //     } else {
    //         hostId = "";
    //     }
    // }
}

function createSocketServer() {
    console.log("Createing socket server server!");
    const httpServer = createServer();
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (client) => {
        client.on("join-game", ({ name }) => {
            if (name === '__host__') {
                if (hostId) {
                    console.log("there is already a host overriting things could get strange.");
                }
                hostId = client.id;
            } else {
                addPlayer(name, client.id);
            }


            client.emit("joined-game", {
                id: client.id,
                isHost: hostId === client.id,
            });

            console.log(`Player ${name} has joined the game.`);
            console.log(
                Object.values(playerMap)
                    .map((obj) => obj.name)
                    .join(", ")
            );

            io.emit('update-players', { players: Object.values(playerMap) });
        });

        client.on("start-game", ({ userId }) => {
            if (hostId !== userId) {
                console.log("If you are not the host you can not start the game.s");
                return;
            }

            // Chose a writer
            const playerIds = Object.keys(playerMap);
            const writerId = playerIds[Math.floor(Math.random() * playerIds.length)];
            io.emit("game-started", {
                writerId,
            });
        });

        client.on('start-voting', () => {
            if (client.id !== hostId) {
                console.error("only the host can start the voting");
                return;
            }

            votingTimeout = setTimeout(() => {
                clearTimeout(votingTimeout);
                clearInterval(votingInterval);
                io.emit('end-voting');
                isVoting = false;
            }, 30000);
            votingInterval = setInterval(() => {
                const playerCount = Object.keys(playerMap);
                const votedCount = Object.values(votes).reduce((acc, cur) => {
                    return acc + cur.length;
                }, 0);
                if (votedCount === playerCount) {
                    clearTimeout(votingTimeout);
                    clearInterval(votingInterval);
                    io.emit('end-voting');
                    isVoting = false;
                }

            }, 1000);
            isVoting = true;
            io.emit('wating-for-votes');
        });

        client.on('send-vote', ({ userName, vote }) => {
            if (!isVoting) {
                console.log("Voting has not started");
                return;
            }
            if (votedSet.has(client.id)) {
                console.log(`User ${client.id}:${userName} has already voted.`);
                client.emit('vote-error');
                return;
            }

            if (!voterMap[vote]) {
                console.error('Not a valid vote?');
                client.emit('vote-error');
                return;
            }
            // Add username to voter map
            voterMap[vote].push(userName);
            // Add client to the voted set
            votedSet.add(client.id);
            // Emit vote 
            client.emit('vote-received')
        });

        client.on("submit-script", ({ script }) => {
            // Create the names for the voter map
            script.characters.forEach(char => {
                voterMap[char.name] = [];
            });
            io.emit("begin-game", {
                script,
            });
        });

        client.on("disconnect", () => {
            if (client.id === hostId) {
                hostId = ''
            } else {
                removePlayer(client.id, io);
            }
        });
    });


    io.httpServer.listen(4000);

    return io;
}

module.exports = {
    createSocketServer,
};
