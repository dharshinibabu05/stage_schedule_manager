import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { addNotification } from "../components/NotificationBell";

const SOCKET_URL = "http://localhost:5000";

let socketInstance = null;

export function getSocket() {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("token") },
      transports: ["websocket"],
    });
  }
  return socketInstance;
}

export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}

/**
 * useSocket(eventHandlers)
 * eventHandlers: object of { eventName: callback }
 *
 * Built-in events auto-show notifications:
 *   schedule_created, schedule_updated, schedule_deleted,
 *   task_updated, event_updated
 */
export function useSocket(eventHandlers = {}) {
  const handlersRef = useRef(eventHandlers);
  handlersRef.current = eventHandlers;

  useEffect(() => {
    const socket = getSocket();

    // Built-in notification listeners
    const builtIn = {
      schedule_created: (data) => {
        addNotification(`New schedule added: "${data.performanceName}"`, "success");
      },
      schedule_updated: (data) => {
        addNotification(`Schedule updated: "${data.performanceName}"`, "info");
      },
      schedule_deleted: (data) => {
        addNotification(`Schedule removed: "${data.performanceName || "item"}"`, "warning");
      },
      task_updated: (data) => {
        addNotification(`Task "${data.name}" was updated`, "info");
      },
      event_delayed: (data) => {
        addNotification(`⚠️ Event delayed: "${data.eventName}"`, "danger");
      },
    };

    // Register built-in handlers
    Object.entries(builtIn).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Register custom handlers from caller
    Object.entries(handlersRef.current).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      Object.keys(builtIn).forEach((event) => socket.off(event));
      Object.keys(handlersRef.current).forEach((event) => socket.off(event));
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);
}

export default useSocket;