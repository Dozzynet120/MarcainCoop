import { io } from 'socket.io-client';
import { getToken } from './api';

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

let socket = null;

/**
 * Initialize Socket.io connection
 */
export const initSocket = () => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ['websocket', 'polling']
  });

  return socket;
};

/**
 * Connect to admin room for notifications
 */
export const joinAdminRoom = () => {
  if (!socket) initSocket();

  const token = getToken();
  if (!token) return;

  if (!socket.connected) {
    socket.connect();
  }

  socket.emit('join-admin', { token });
};

/**
 * Leave admin room
 */
export const leaveAdminRoom = () => {
  if (socket) {
    socket.emit('leave-admin');
    socket.disconnect();
  }
};

/**
 * Listen for new application events
 * @param {Function} callback - (data) => void
 */
export const onNewApplication = (callback) => {
  if (!socket) initSocket();
  socket.on('new-application', callback);
};

/**
 * Listen for status update events
 * @param {Function} callback - (data) => void
 */
export const onStatusUpdate = (callback) => {
  if (!socket) initSocket();
  socket.on('status-update', callback);
};

/**
 * Remove event listeners
 */
export const offNewApplication = (callback) => {
  if (socket) socket.off('new-application', callback);
};

export const offStatusUpdate = (callback) => {
  if (socket) socket.off('status-update', callback);
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
