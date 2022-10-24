import axios from "axios";
import React, { useState } from "react";

const JoinBlock = ({ onLogin, isLoading, dispatch }) => {
  const [{ roomId, userName }, setValues] = useState({
    roomId: "",
    userName: "",
  });

  const onEnter = () => {
    if (!roomId || !userName) return alert("Input all fields");
    dispatch({ type: "IS_LOADING", payload: true });
    axios.post("/rooms", { roomId, userName });
    onLogin({ roomId, userName });
  };

  return (
    <>
      <div className="form-outline mb-2">
        <input
          value={roomId}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, roomId: e.target.value }))
          }
          type="email"
          placeholder="ROOM ID"
          className="form-control"
        />
      </div>
      <div className="form-outline mb-2">
        <input
          value={userName}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, userName: e.target.value }))
          }
          type="text"
          placeholder="Your Name"
          className="form-control"
        />
      </div>
      <button
        disabled={isLoading}
        onClick={onEnter}
        type="button"
        className="btn btn-primary w-100 btn-block mb-2"
      >
        {isLoading ? "Singing..." : "Sign in"}
      </button>
    </>
  );
};

export default JoinBlock;
