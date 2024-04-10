import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import Modal from "react-bootstrap/Modal";

const MainModal = forwardRef(function MainModal({ children }, ref) {
  const [show, setShow] = useState(false);
  const modalState = useRef({
    header: "",
    isEditable: true,
    size: ""
  });


  useImperativeHandle(
    ref,
    () => {
      return {
        show({ isEditable, header }) {
          modalState.current.header = header;
          modalState.current.isEditable = isEditable;
          setShow(true);
        },
        close() {
          modalState.current.isEditable = false;
          setShow(() => {
            return false;
          });
        },
        isEditable() {
          return modalState.current.isEditable;
        },
        isLarge(){
          modalState.current.size = "lg";
        }
      };
    },
    []
  );

  function closeHandler() {
    setShow(() => {
      return false;
    });
  }

  return (
    <Modal show={show} onHide={closeHandler} centered size={modalState.current.size}>
      <Modal.Header closeButton style={{ height: "50px" }}>
        <Modal.Title>{modalState.current.header}</Modal.Title>
      </Modal.Header>
      {children}
    </Modal>
  );
});

export default MainModal;
