import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const Join = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.on("roomList", ({ rooms }) => {
      setRooms(rooms);
    });
  }, []);

  return (
    <div className="join">
      {rooms.length > 0 && (
        <div className="join-list">
          <div style={{ fontWeight: "bold" }}>Room Name: </div>
          {rooms.map((rm, index) => (
            <p key={index} onClick={() => setRoom(rm)}>
              {rm}
            </p>
          ))}
        </div>
      )}
      <div className="join-form">
        <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input placeholder="Room" value={room} onChange={(e) => setRoom(e.target.value)} />
        <Link to={`/chat?name=${name}&room=${room}`}>Join</Link>
      </div>
    </div>
  );
};

export default Join;
