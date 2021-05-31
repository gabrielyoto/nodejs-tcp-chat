import net from 'net';
import { models } from './models';

const tcpServer = net.createServer();
const users: models.User[] = [];

const generateId = () => Math.random().toString().substring(3, 19);

const getUser = (socket: net.Socket) =>
  users.find((user) => user.socket === socket);

const sendMessage = (
  socket: net.Socket,
  message: models.ServerMessage | models.ClientMessage
) => {
  socket.write(JSON.stringify(message));
};

const handleData = (data: Buffer, socket: net.Socket) => {
  const message = JSON.parse(data.toString()) as models.ClientMessage;

  switch (message.type) {
    case 'connection':
      users.push({
        id: message.from.id,
        name: message.from.name,
        socket,
        hasConnection: false,
      });
      sendMessage(socket, {
        type: 'clientList',
        id: generateId(),
        message: users,
      });
      console.log(
        'usuarios conectados',
        users.map((user) => user.name)
      );

      break;
    case 'greetings': {
      const receiver = users.find((user) => user.id === message.toId);
      const user = getUser(socket);
      if (!user) {
        return;
      }
      if (!receiver || receiver.hasConnection) {
        sendMessage(socket, {
          type: 'connectionRefused',
          id: generateId(),
        });
        break;
      }
      sendMessage(receiver.socket, {
        id: generateId(),
        type: 'greetings',
        fromId: user.id,
        toId: receiver.id,
        fromName: user.name,
      });
      break;
    }
    case 'message': {
      const receiver = users.find((user) => user.id === message.toId);
      const user = getUser(socket);
      if (!user) {
        return;
      }
      if (!receiver || receiver.hasConnection) {
        sendMessage(socket, {
          type: 'connectionRefused',
          id: generateId(),
        });
        break;
      }
      sendMessage(receiver.socket, {
        id: generateId(),
        type: 'message',
        fromId: user.id,
        fromName: user.name,
        message: message.message,
        toId: receiver.id,
      });
      break;
    }
    case 'disconnect': {
      const receiver = users.find((user) => user.id === message.toId);
      const user = getUser(socket);
      if (!user) {
        return;
      }
      if (!receiver || receiver.hasConnection) {
        sendMessage(socket, {
          type: 'connectionRefused',
          id: generateId(),
        });
        break;
      }
      sendMessage(receiver.socket, {
        id: generateId(),
        type: 'disconnect',
        fromId: user.id,
        toId: receiver.id,
      });
      socket.end();
      break;
    }
    default:
      break;
  }
};

tcpServer.on('connection', (socket) => {
  socket.setEncoding('utf8');
  socket.on('data', (data) => handleData(data, socket));

  socket.on('end', () => {
    const disconnectUserIndex = users.findIndex(
      (user) => user.socket === socket
    );
    users.splice(disconnectUserIndex, 1);
  });
});

tcpServer.listen(8000, () => console.log('ONLINE 8000'));
