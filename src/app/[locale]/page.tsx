export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">

      <h1 className="text-6xl font-bold">
        Antism
      </h1>

      <p className="text-xl text-gray-400">
        Creator marketplace for athletes, podcasts and events
      </p>

      <div className="flex gap-4">
        <button className="px-6 py-3 bg-white text-black rounded-lg">
          For Brands
        </button>

        <button className="px-6 py-3 border border-white rounded-lg">
          For Creators
        </button>
      </div>

    </div>
  )
}