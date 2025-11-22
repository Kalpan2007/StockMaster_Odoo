import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private eventHandlers: Map<string, Function[]> = new Map();

  // Connect to socket server
  connect(userId?: string): void {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      
      // Join user room if userId provided
      if (userId && this.socket) {
        this.socket.emit('join_room', userId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Setup event handlers that were registered before connection
    this.eventHandlers.forEach((handlers, event) => {
      handlers.forEach((handler) => {
        this.socket?.on(event, handler as any);
      });
    });
  }

  // Disconnect from socket server
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Socket disconnected manually');
    }
  }

  // Subscribe to an event
  on(event: string, handler: Function): void {
    // Store handler for reconnection scenarios
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(handler);

    // Register with socket if connected
    if (this.socket) {
      this.socket.on(event, handler as any);
    }
  }

  // Unsubscribe from an event
  off(event: string, handler?: Function): void {
    if (handler) {
      // Remove specific handler
      const handlers = this.eventHandlers.get(event);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
      this.socket?.off(event, handler as any);
    } else {
      // Remove all handlers for event
      this.eventHandlers.delete(event);
      this.socket?.off(event);
    }
  }

  // Emit an event
  emit(event: string, data?: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit:', event);
    }
  }

  // Join a room
  joinRoom(roomId: string): void {
    this.emit('join_room', roomId);
  }

  // Leave a room
  leaveRoom(roomId: string): void {
    this.emit('leave_room', roomId);
  }

  // Check if socket is connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Get socket instance
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Create singleton instance
const socketService = new SocketService();

// Socket event types from backend
export const SOCKET_EVENTS = {
  // Stock events
  STOCK_UPDATE: 'stock:update',
  STOCK_LOW_ALERT: 'stock:low_alert',
  
  // Receipt events
  RECEIPT_CREATED: 'receipt:created',
  RECEIPT_UPDATED: 'receipt:updated',
  RECEIPT_PROCESSED: 'receipt:processed',
  
  // Delivery events
  DELIVERY_CREATED: 'delivery:created',
  DELIVERY_UPDATED: 'delivery:updated',
  DELIVERY_PROCESSED: 'delivery:processed',
  
  // Transfer events
  TRANSFER_CREATED: 'transfer:created',
  TRANSFER_UPDATED: 'transfer:updated',
  TRANSFER_PROCESSED: 'transfer:processed',
  
  // Adjustment events
  ADJUSTMENT_CREATED: 'adjustment:created',
  ADJUSTMENT_PROCESSED: 'adjustment:processed',
  
  // Product events
  PRODUCT_CREATED: 'product:created',
  PRODUCT_UPDATED: 'product:updated',
  PRODUCT_DELETED: 'product:deleted',
};

export default socketService;
