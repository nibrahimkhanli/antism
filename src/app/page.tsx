export default function Page() {
  return (
    <div>

      {/* HERO */}

      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-6">

        <h1 className="text-6xl font-bold">
          Antism
        </h1>

        <p className="text-xl text-muted-foreground">
          Creator marketplace for athletes, podcasts and events
        </p>

        <div className="flex gap-4">

          <button className="px-6 py-3 bg-primary text-black rounded-lg">
            For Brands
          </button>

          <button className="px-6 py-3 border border-border rounded-lg">
            For Creators
          </button>

        </div>

      </div>


      {/* HOW IT WORKS */}

      <section className="py-24 bg-card text-foreground">

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

              <p className="text-muted-foreground">
                Athletes, podcasts and events create profiles.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold mb-4">2</div>

              <h3 className="text-xl font-semibold mb-2">
                Brands Discover
              </h3>

              <p className="text-muted-foreground">
                Brands explore creators and find partners.
              </p>
            </div>

            <div>
              <div className="text-4xl font-bold mb-4">3</div>

              <h3 className="text-xl font-semibold mb-2">
                Deals Happen
              </h3>

              <p className="text-muted-foreground">
                Campaigns are launched and collaborations start.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* CREATOR CATEGORIES */}

      <section className="py-24 bg-background text-foreground">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold mb-12">
            Creator Categories
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="p-8 border border-border rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">🏅</div>
              <h3 className="text-xl font-semibold mb-2">Athletes</h3>
              <p className="text-muted-foreground">
                Partner with brands and promote campaigns.
              </p>
            </div>

            <div className="p-8 border border-border rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">🎙️</div>
              <h3 className="text-xl font-semibold mb-2">Podcasts</h3>
              <p className="text-muted-foreground">
                Integrate sponsorships into episodes.
              </p>
            </div>

            <div className="p-8 border border-border rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Events</h3>
              <p className="text-muted-foreground">
                Work with sponsors to promote events.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="py-24 bg-primary text-black">

        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-6">
            Start Collaborating Today
          </h2>

          <p className="mb-10">
            Join Antism to connect brands with creators.
          </p>

          <div className="flex justify-center gap-6">

            <button className="px-8 py-3 bg-black text-white rounded-lg">
              Join as Creator
            </button>

            <button className="px-8 py-3 border border-black rounded-lg">
              Find Creators
            </button>

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="bg-card border-t border-border py-12">

        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">

          <h3 className="text-lg font-semibold text-foreground mb-4 md:mb-0">
            Antism
          </h3>

          <div className="flex gap-6 text-muted-foreground text-sm">

            <a href="#" className="hover:text-foreground">
              About
            </a>

            <a href="#" className="hover:text-foreground">
              Creators
            </a>

            <a href="#" className="hover:text-foreground">
              Brands
            </a>

            <a href="#" className="hover:text-foreground">
              Contact
            </a>

          </div>

          <p className="text-xs text-muted-foreground mt-6 md:mt-0">
            © 2026 Antism. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  )
}