import { Loader2 } from "lucide-react";

const Loader = ({ text, size }) => {
  return (
    <div className="flex items-center gap-2">
      <Loader2 size={size} className="animate-spin" />
      <h1>{text}</h1>
    </div>
  );
};

export default Loader;
