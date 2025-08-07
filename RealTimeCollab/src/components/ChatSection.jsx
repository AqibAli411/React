function ChatSection() {
  return (
    <section className="flex min-h-[90vh] flex-1 gap-2 border-1 border-stone-500">
      <div className="flex flex-col items-center gap-4 p-2">
        <div className="h-10 w-10">
          <img
            className="h-full w-full rounded-full object-cover"
            src="/p1.jpg"
          />
        </div>
        <div className="h-10 w-10">
          <img
            className="h-full w-full rounded-full object-cover"
            src="/p2.jpg"
          />
        </div>
        <div className="h-10 w-10">
          <img
            className="h-full w-full rounded-full object-cover"
            src="/p3.jpg"
          />
        </div>
      </div>

      <div className="w-0.75 bg-stone-400/80"></div>

      <div className="flex flex-col gap-4 p-2">
        <div className="flex items-center gap-2 rounded-2xl p-1 shadow-md">
          <div className="h-10 w-10">
            <img
              className="h-full w-full rounded-full object-cover"
              src="/p2.jpg"
            />
          </div>
          <p>Ahmed Ali</p>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-3">
          <div className="flex flex-col gap-3.5">
            <div className="self-end rounded-tl-2xl rounded-b-2xl bg-blue-500 p-2 text-white">
              <p>Hey How are you</p>
            </div>
            <div className="self-start rounded-tr-2xl rounded-b-2xl bg-stone-200 p-2">
              <p>Fine What about you?</p>
            </div>
          </div>
          <div className="">
            <div className="rounded-xl outline-1 outline-stone-500">
              <input
                className="rounded-xl p-2 focus:outline-none"
                placeholder="Write a Message"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChatSection;
