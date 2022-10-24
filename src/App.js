import axios from "axios";
import React, { useEffect, useReducer } from "react";
import Chat from "./components/Chat";
import JoinBlock from "./components/JoinBlock";
import reducer from "./reducer";
import { socket } from "./socket";

function App() {
  const [{ joined, isLoading, users, messages, userName, roomId }, dispatch] =
    useReducer(reducer, {
      joined: false,
      isLoading: false,
      roomId: null,
      userName: null,
      users: [],
      messages: [],
    });

  const setUsers = (users) => {
    dispatch({ type: "SET_USERS", payload: users });
  };

  const addMessage = (payload) => {
    dispatch({ type: "NEW_MESSAGE", payload: payload });
  };

  const onLogin = async ({ roomId, userName }) => {
    dispatch({ type: "JOINED", payload: { roomId, userName } });
    socket.emit("ROOM:JOIN", { roomId, userName });
    await axios.get(`/rooms/${roomId}`).then(({ data }) => {
      setUsers(data.users);
    });
  };

  useEffect(() => {
    socket.on("ROOM:SET_USERS", setUsers);
    socket.on("ROOM:NEW_MESSAGE", addMessage);
  }, []);

  return (
    <div className="container mt-5 w-50 m-auto">
      {!joined ? (
        <JoinBlock
          dispatch={dispatch}
          isLoading={isLoading}
          onLogin={onLogin}
        />
      ) : (
        <Chat
          userName={userName}
          users={users}
          messages={messages}
          roomId={roomId}
          onAddMessage={addMessage}
        />
      )}
    </div>
  );
}

export default App;
