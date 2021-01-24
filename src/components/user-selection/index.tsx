import { ChatAppContext } from "Context";
import { useContext } from "react";
import { Form } from "react-bootstrap";

const USERS = [
  {
    label: "Joyse",
    value: "Joyse",
  },
  {
    label: "Sam",
    value: "Sam",
  },
  {
    label: "Russell",
    value: "Russell",
  },
];

const UserSelection = () => {
  const chatAppContext = useContext(ChatAppContext);
  return (
    <Form.Group controlId="form.userSelect">
      <Form.Label>1. Choose your user</Form.Label>
      <Form.Control
        value={chatAppContext.chatInfo.currentUser}
        as="select"
        onChange={(e) => {
          if (e.currentTarget) {
            chatAppContext.setCurrentUser(e.currentTarget.value);
          }
        }}
      >
        <option value={""} disabled>
          Please, select a user.
        </option>
        {USERS.map(({ label, value }, index) => {
          return (
            <option key={index} value={value}>
              {label}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
};

export default UserSelection;
