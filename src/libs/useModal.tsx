import { useState, type ComponentPropsWithRef } from "react";

type ModalProps = Omit<ComponentPropsWithRef<"div">, "onClickCapture">;

export default function useModal(defaultOpen = false) {
  const [open, setOpen] = useState(defaultOpen);

  function Modal({ style, ...props }: ModalProps) {
    if (!open) return <></>;
    return (
      <div
        {...props}
        style={{
          ...style,
          position: "fixed",
          width: "100vw",
          height: "100vh",
        }}
        onClickCapture={(e) => {
          if (e.target != e.currentTarget) return;
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
        }}
      />
    );
  }

  return {
    Modal,
    setOpen,
  };
}
