function Background({ children }) {
  return (
    <div className="mx-auto h-[85vh] max-w-330 relative">
      <div className="dotted-background flex h-full w-full flex-col items-center justify-center gap-4 rounded-4xl">
        {children}
      </div>
    </div>
  );
}

export default Background;
