export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-slate-900 to-bg flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto">
          <div className="w-full h-full border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-100">
            Loading Nexus Weaver
          </h2>
          <p className="text-gray-400">
            Connecting to your networks...
          </p>
        </div>
      </div>
    </div>
  );
}
