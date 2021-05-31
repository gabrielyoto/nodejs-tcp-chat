import { Socket } from 'net';

namespace models {
  export type ClientMessageType =
    | 'connection'
    | 'greetings'
    | 'message'
    | 'disconnect';
  export type ServerMessageType =
    | 'clientList'
    | 'shuttingDown'
    | 'connectionRefused'
    | 'message';

  export interface Message<T> {
    id: string;
    type: T;
  }

  export interface User {
    id: string;
    name: string;
    socket: Socket;
    hasConnection: boolean;
  }

  export interface ConnectionMessage extends Message<ClientMessageType> {
    type: 'connection';
    from: User;
  }

  export interface GreetingsMessage extends Message<ClientMessageType> {
    type: 'greetings';
    fromId: string;
    fromName: string;
    toId: string;
  }

  export interface DefaultMessage extends Message<ClientMessageType> {
    type: 'message';
    fromId: string;
    fromName: string;
    toId: string;
    message: string;
  }

  export interface DisconnectMessage extends Message<ClientMessageType> {
    type: 'disconnect';
    fromId: string;
    toId: string;
  }

  export type ClientMessage =
    | GreetingsMessage
    | DefaultMessage
    | DisconnectMessage
    | ConnectionMessage;

  export interface ClientListMessage extends Message<ServerMessageType> {
    type: 'clientList';
    message: Omit<User, 'socket'>[];
  }

  export interface ShuttingDownMessage extends Message<ServerMessageType> {
    type: 'shuttingDown';
  }

  export interface RefuseMessage extends Message<ServerMessageType> {
    type: 'connectionRefused';
  }

  export type ServerMessage =
    | ClientListMessage
    | ShuttingDownMessage
    | RefuseMessage;
}
