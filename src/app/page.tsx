import Chat from "@/components/Chat";

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-[#0f172a] relative">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 -left-1/4 w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 -right-1/4 w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full">
        <Chat />
      </div>
    </main>
  );
}
