export default function Page() {
  return (
    <div>

      {/* HERO */}
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
        <h1 className="text-6xl font-bold">Antism</h1>

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

      {/* HOW IT WORKS */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold mb-12">
            How Antism Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div>
              <div className="text-4xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">
                Creators Join
              </h3>
              <p className="text-gray-400">
                Athletes, podcasts and events create their profiles.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">
                Brands Discover
              </h3>
              <p className="text-gray-400">
                Brands explore creators and find the right partners.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">
                Deals Happen
              </h3>
              <p className="text-gray-400">
                Campaigns are created and collaborations begin.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CREATOR CATEGORIES */}

<section className="py-24 bg-white text-black">
  <div className="max-w-6xl mx-auto px-6 text-center">

    <h2 className="text-3xl font-bold mb-12">
      Creator Categories
    </h2>

    <div className="grid md:grid-cols-3 gap-10">

      {/* ATHLETES */}
      <div className="p-8 border rounded-xl hover:shadow-lg transition">

        <div className="text-4xl mb-4">🏅</div>

        <h3 className="text-xl font-semibold mb-2">
          Athletes
        </h3>

        <p className="text-gray-500">
          Partner with brands and promote campaigns to your fans.
        </p>

      </div>


      {/* PODCASTS */}
      <div className="p-8 border rounded-xl hover:shadow-lg transition">

        <div className="text-4xl mb-4">🎙️</div>

        <h3 className="text-xl font-semibold mb-2">
          Podcasts
        </h3>

        <p className="text-gray-500">
          Integrate sponsorships and brand promotions into episodes.
        </p>

      </div>


      {/* EVENTS */}
      <div className="p-8 border rounded-xl hover:shadow-lg transition">

        <div className="text-4xl mb-4">📅</div>

        <h3 className="text-xl font-semibold mb-2">
          Events
        </h3>

        <p className="text-gray-500">
          Work with sponsors to promote and support your events.
        </p>

      </div>

    </div>

  </div>
</section>

    </div>
  )
}