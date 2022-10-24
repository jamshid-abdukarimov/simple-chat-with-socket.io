import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar,
  ConversationList,
  Sidebar,
} from "@chatscope/chat-ui-kit-react";
import { socket } from "../socket";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

const Chat = ({ users, messages, userName, roomId, onAddMessage }) => {
  const [text, setText] = useState();

  const onSendMessage = (e) => {
    socket.emit("ROOM:NEW_MESSAGE", { text, userName, roomId });
    onAddMessage({ text, userName });
  };

  const messageRef = useRef(null);

  useEffect(() => {
    messageRef.current.scrollToBottom();
  }, [messages]);

  return (
    <div style={{ position: "relative", height: "500px" }}>
      <MainContainer>
        <Sidebar position="left" className="d-flex flex-column">
          <ConversationHeader>
            <ConversationHeader.Content userName={`Online (${users.length})`} />
          </ConversationHeader>
          <ConversationList>
            {users.map((user) => (
              <div
                key={Math.random()}
                className="d-flex justify-content-end w-100 my-2"
              >
                <Avatar
                  className="me-3"
                  active={false}
                  size={"md"}
                  status={"available"}
                  src={
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAA2VJREFUWEftlmlIVGEUht/rjLumoRiuaZo1miuIYWlamRIiFkliWoZLZCXkBpZQljWCSKtTVoIEioXV0CIVLj+yIstpUFEctRRFcUtN0Vwn7oUZJprlGxp/BPf7O+c757nveb9zhop5YiPFf3AoFlTHXWIV1bGgYBVlFdW1ArrOx3qUVZRUgd0b45DsXQgTfXNIpat4/b0C98R5Gq/vdY5HlFsaHMw3g0NxsSJdxvjcEJ733EVtb7nG+1p7NMnrIqLcUpli9GkdfYcLTYfUFopwOYbEbedhqm/xV1xdXyVKRZm6By3YWQNvm2BGTYrSw+jcAIo/paBnUqy0mDHXDIUhQmyy9FL6+5qAuq33RU7gA9iYOGJ6YRwWhtaYW5pBeWs+GvqrlYIE2O7DKf9rTOz88ixedJdB2C0AzyoQMe7pGJyREFlHq9bL/GnMNUXb2HvwrAPBpbhqfRrqFIs03yLQyg7OdCO3MZIB1vZoBZrmy0ekSxIWVn7hVe990N4zM7BU69Mg+2ic9Ctm4hZXFph7D9sva8up3Z8SmT8n5odRJs7Fca9LsDVzUetTWsmi0Fo4rdvCwNGvvX3sA6o6iiD50UIMTKyooj+/TbUiqyEcMnBNPo3j5eCA+xkYcAzlYLNLU3jadQvPJLeJYIlB9zjHI8W7EEZcUzQNClHSfAIyK9CVNM3TFJ8rCHdOgAHH6A/YirYC1PdVaYQlBpVB0a0TSgSo7OBjv2syEj3zYcQ1IZqnfhvCkOB5Di6WXqBAEc9hOpAYlL/rJbZaBaj8ck3zVHaR9my6fwl22Eczc5h0EhCBKvpTFakqn4Y4HkSAbQQEoiz5WFIcWfTDvPHlNNrGmtS2nwhUscWqsqna+zRUqs9VRjn64XRPinGYl40wp1hw9Qww8FOCjLpg3XhU5k+6VY39j3CzJUOe+IhHHrNh6KLK9r6iespomoffgP/xqG5AZf5cWl1ETdd1PO4skSdWHOjKfKoOdGJ+CAJRNkQj9f8O6mG9HZkBd2BlbMfs91LRWXwefitPbGfmivygSmbwK/Mp/XjiPHIR7BDD7Hs9isNsqL7pdlR3FuPrSKNGSK1ePVG2NQwiekxrWJ84NQtKLBVhIKsooVDEYayixFIRBrKKEgpFHMYqSiwVYSCrKKFQxGG/ASaFti45REuNAAAAAElFTkSuQmCC"
                  }
                />
                <ConversationHeader.Content
                  className="text-right"
                  userName={user}
                />
              </div>
            ))}
          </ConversationList>
        </Sidebar>
        <ChatContainer>
          <MessageList ref={messageRef}>
            {messages.map((message, index) => (
              <Message
                key={Math.random()}
                model={{
                  message: message.text,
                  sentTime: "10:00",
                  sender: message.userName,
                  direction:
                    messages[index].userName === userName
                      ? "outgoing"
                      : "incoming",
                }}
              />
            ))}
          </MessageList>
          <MessageInput
            attachButton={false}
            onChange={(e) => setText(e)}
            placeholder="Type message here"
            onSend={onSendMessage}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};
export default Chat;
