import { BiLoaderAlt } from "react-icons/bi";

const Loader = ({ size, text }) => {
  return (
    <div className="flex-center">
      <BiLoaderAlt size={size} className="mr-2 animate-spin" />
      <h1>{text}</h1>
    </div>
  );
};

export default Loader;
