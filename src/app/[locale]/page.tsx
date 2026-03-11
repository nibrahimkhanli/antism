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
}<section className="py-24 bg-white text-black">
  <div className="max-w-6xl mx-auto px-6 text-center">

    <h2 className="text-3xl font-bold mb-12">
      Creator types on Antism
    </h2>

    <div className="grid md:grid-cols-3 gap-8">

      <div className="p-6 border rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Athletes</h3>
        <p className="text-gray-500">
          Work with brands and promote campaigns.
        </p>
      </div>

      <div className="p-6 border rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Podcasts</h3>
        <p className="text-gray-500">
          Integrate sponsorships into episodes.
        </p>
      </div>

      <div className="p-6 border rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Events</h3>
        <p className="text-gray-500">
          Partner with brands for event promotions.
        </p>
      </div>

    </div>

  </div>
</section>

