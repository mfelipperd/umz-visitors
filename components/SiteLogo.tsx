export default function SiteLogo() {
  return (
    <div className="fixed top-0 left-0 pl-6 pt-6 z-50 pointer-events-none">
      <div className="pointer-events-auto bg-white/60 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-black/5">
        <div className="h-14 md:h-16 flex items-center justify-center p-1">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH6W6SrWYdcFvHr8bZACcEg3swkioidWunUw&s"
            alt="Logo IASD"
            className="h-full w-auto object-contain mix-blend-multiply"
          />
        </div>
      </div>
    </div>
  );
}
