import React from "react";

const Error = ({ text }) => {
  return (
    <div className="flex-center bg-red-300 py-2 rounded-xl cursor-default mt-1">
      <h1 className="text-red-500 font-bold text-[1rem]">{text}</h1>
    </div>
  );
};

export default Error;
