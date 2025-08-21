function Background({ children }) {
  return (
    <div className="relative mx-auto h-135 max-w-330 mb-10">
      <div className="dotted-background h-full w-full items-center justify-center rounded-4xl">
        <div className="flex h-full w-full items-center justify-between">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Background;
