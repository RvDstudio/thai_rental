import Image from "next/image";


function Hero() {
  return (
    <div className=" bg-white mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-0">
        {/* Hero Image Container */}
        <div className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl mb-8">
          <Image src="/images/hero_bg.png" alt="Hero" width={1000} height={1000} className="object-cover w-full h-full" />

          {/* Gradient overlay for better contrast */}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-transparent"></div>

          {/* Hero Text Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                Find your perfect rental
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl drop-shadow-md pb-6">
                Discover amazing homes, apartments, and vacation rentals in your
                dream location
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
