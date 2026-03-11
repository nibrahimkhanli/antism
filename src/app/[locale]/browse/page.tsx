export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-white text-black py-24">

      <div className="max-w-6xl mx-auto px-6">

        <h1 className="text-4xl font-bold mb-12">
          Browse Creators
        </h1>

        <div className="grid md:grid-cols-3 gap-8">

          {/* CREATOR CARD */}
          <div className="border rounded-xl p-6 hover:shadow-lg transition">

            <img
              src="https://i.pravatar.cc/200?img=5"
              className="w-20 h-20 rounded-full mb-4"
            />

            <h3 className="text-xl font-semibold">
              Alex Carter
            </h3>

            <p className="text-gray-500">
              Athlete
            </p>

            <p className="text-sm text-gray-400 mt-2">
              120K followers
            </p>

            <button className="mt-4 px-4 py-2 bg-black text-white rounded">
              View Profile
            </button>

          </div>


          <div className="border rounded-xl p-6 hover:shadow-lg transition">

            <img
              src="https://i.pravatar.cc/200?img=6"
              className="w-20 h-20 rounded-full mb-4"
            />

            <h3 className="text-xl font-semibold">
              Sarah Johnson
            </h3>

            <p className="text-gray-500">
              Podcast Host
            </p>

            <p className="text-sm text-gray-400 mt-2">
              80K listeners
            </p>

            <button className="mt-4 px-4 py-2 bg-black text-white rounded">
              View Profile
            </button>

          </div>


          <div className="border rounded-xl p-6 hover:shadow-lg transition">

            <img
              src="https://i.pravatar.cc/200?img=7"
              className="w-20 h-20 rounded-full mb-4"
            />

            <h3 className="text-xl font-semibold">
              Tech Events Hub
            </h3>

            <p className="text-gray-500">
              Event Organizer
            </p>

            <p className="text-sm text-gray-400 mt-2">
              50K attendees
            </p>

            <button className="mt-4 px-4 py-2 bg-black text-white rounded">
              View Profile
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}