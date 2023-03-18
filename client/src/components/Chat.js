import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import queryString from "query-string";
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";

let socket;

const Chat = () => {
  const { search } = useLocation();
  const { name, room } = queryString.parse(search);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    socket = io("http://localhost:4000");
    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    socket.on("message", (message) => {
      setMessages((existingMsgs) => [...existingMsgs, message]);
    });

    socket.on("userList", ({ roomUsers }) => {
      setUsers(roomUsers);
    });

    socket.on("userTyping", ({ user, isTyping }) => {
      setUser(user);
      setIsTyping(isTyping);
    });

    return () => {
      socket.disconnect();
    };
  }, [name, room]);

  const sendMessage = (e) => {
    if (e.key === "Enter" && e.target.value) {
      socket.emit("message", e.target.value);
      e.target.value = "";
      setIsTyping(false);
    }
  };

  const handleTyping = (e) => {
    if (e.target.value) {
      setIsTyping(true);
      socket.emit("typing", { name, isTyping: true });
    } else {
      setIsTyping(false);
      socket.emit("typing", { name, isTyping: false });
    }
  };

  return (
    <div className="chat">
      <div className="user-list">
        <div>User Name</div>
        {users.map((user) => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
      <div className="chat-section">
        <div className="chat-head">
          <div className="room">{room}</div>
          <Link to="/">X</Link>
        </div>
        <div className="chat-box">
          <ScrollToBottom className="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${name === message.user ? "self" : ""}`}
              >
                <span className="user">{message.user}</span>
                <span className="message-text">{message.text}</span>
              </div>
            ))}
            {isTyping && (
              <div className="message typing">{user} is typing...</div>
            )}
          </ScrollToBottom>
          <input
            placeholder="message"
            onKeyDown={sendMessage}
            onKeyUp={handleTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
