function Background({ children }) {
  return (
    <div className="relative mx-auto h-135 max-w-330">
      <div className="dotted-background h-full w-full items-center justify-center gap-4 rounded-4xl">
        <div className="flex h-full w-full items-center justify-center gap-9">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Background;
