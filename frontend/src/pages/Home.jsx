import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">

      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Where Quality Meets Everyday Essentials
            </h1>

            <p className="text-gray-600 text-lg mb-8">
              Discover thoughtfully curated products designed to elevate
              your lifestyle with durability, comfort, and premium craftsmanship.
            </p>

            <button
              onClick={() => navigate("/shop")}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition"
            >
              Shop Now
            </button>
          </div>

          {/* Right Image Section */}
          <div className="hidden md:flex justify-center">
            <div className="relative w-96 h-96 rounded-3xl overflow-hidden shadow-2xl">

              <img
                src="/premium.jpg"
                alt="Premium Collection"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-semibold tracking-wide">
                  Premium Collection
                </h3>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Built on Trust. Backed by Quality.
          </h2>

          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Every product is selected with care to ensure long-lasting
            reliability and customer satisfaction.
          </p>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">
                Premium Materials
              </h3>
              <p className="text-gray-600 text-sm">
                Crafted with high-quality components built to last.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">
                Customer First Approach
              </h3>
              <p className="text-gray-600 text-sm">
                Your satisfaction is always our top priority.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">
                Secure & Fast Delivery
              </h3>
              <p className="text-gray-600 text-sm">
                Safe packaging and reliable shipping across locations.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-indigo-600 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Experience the Difference Today
        </h2>

        <p className="mb-8 text-indigo-100">
          Elevate your everyday with premium essentials.
        </p>

        <button
          onClick={() => navigate("/shop")}
          className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Explore Collection
        </button>
      </section>

    </div>
  );
}