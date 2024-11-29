const Error = ({ error }) => {
  return (
    <div className="text-center py-2 bg-red-300 rounded-xl">
      <h1 className="text-[1.2rem] tracking-tight text-red-600 font-bold">{error}</h1>
    </div>
  );
};

export default Error;
