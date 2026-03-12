import { useEffect } from "react";

export default function useFileInput(
  cb: (f: FileList | null) => void,
  accept = "*",
) {
  const input = document.createElement("input");
  input.type = "file";
  input.hidden = true;
  input.accept = accept;

  input.onchange = () => {
    cb(input.files);
  };

  useEffect(() => {
    document.body.appendChild(input);
    return () => {
      document.body.removeChild(input);
    };
  }, []);

  return () => input.click();
}
