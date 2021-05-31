import net from 'net';
import cliSelect from 'cli-select';
import { models } from './models';
import readline from 'readline';

let partnerId: string | null = null;

const generateId = () => Math.random().toString().substring(3, 19);

const sendMessage = (socket: net.Socket, message: models.ClientMessage) => {
  socket.write(JSON.stringify(message));
};

const printMessage = (message: models.DefaultMessage) => {
  console.log(`${message.fromName} diz: ${message.message}`);
};

const waitMessage = () => {
  const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  input.question('>', (text) => {
    if (!me || !partnerId || !text) {
      return;
    }

    if (text.toUpperCase() === 'SAIR') {
      sendMessage(socket, {
        type: 'disconnect',
        fromId: me.id,
        id: generateId(),
        toId: partnerId,
      });

      socket.end();
      console.log('PROGRAMA FINALIZADO');
      return;
    }
    sendMessage(socket, {
      type: 'message',
      fromId: me.id,
      fromName: me.name,
      id: generateId(),
      message: text,
      toId: partnerId,
    });
    waitMessage();
  });
};

let me: models.User | null = null;

const socket = net.connect({ port: 8000 }, async () => {
  console.log('Conectado');

  const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  input.question('Digite um nome de usuário\n', (username) => {
    me = {
      hasConnection: false,
      id: generateId(),
      name: username,
      socket: socket,
    };

    sendMessage(socket, {
      type: 'connection',
      id: generateId(),
      from: me,
    });
    input.close();
  });
});

const handleData = async (data: Buffer) => {
  const message = JSON.parse(data.toString()) as
    | models.ClientMessage
    | models.ServerMessage;

  switch (message.type) {
    case 'greetings': {
      partnerId = message.fromId;
      console.clear();
      console.log('Voce está conversando com', message.fromName);
      waitMessage();
      break;
    }
    case 'message': {
      printMessage(message);
      break;
    }
    case 'disconnect': {
      if (!partnerId || !me) {
        return;
      }
      sendMessage(socket, {
        type: 'disconnect',
        fromId: me.id,
        toId: partnerId,
        id: generateId(),
      });
      partnerId = null;
      socket.end();
      console.log('PROGRAMA FINALIZADO');
      break;
    }
    case 'clientList': {
      console.log(`Bem vindo ${me?.name}`);
      if (message.message.length === 1) {
        console.log('Parece que você está sozinho aqui...');
        return;
      }
      console.log('Selecione alguem para conversar');
      const selected = await cliSelect({
        values: message.message
          .map((user) => user.name)
          .filter((user) => user !== me?.name),
      });
      partnerId =
        message.message.find((user) => user.name === selected.value)?.id ??
        null;

      if (partnerId && me) {
        sendMessage(socket, {
          type: 'greetings',
          id: generateId(),
          fromId: me.id,
          toId: partnerId,
          fromName: me.name,
        });
      }
      console.clear();
      console.log('Voce está conversando com', selected.value);
      waitMessage();
      break;
    }
  }
};

socket.setEncoding('utf8');
socket.on('data', (data) => handleData(data));
