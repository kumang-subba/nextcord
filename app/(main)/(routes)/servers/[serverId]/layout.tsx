import ServerSidebar from "@/components/Server/ServerSidebar";

const Layout = ({ children, params }: { children: React.ReactNode; params: { serverId: string } }) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-screen md:pl-60 bg-[#393b3e]">{children}</main>
    </div>
  );
};

export default Layout;
