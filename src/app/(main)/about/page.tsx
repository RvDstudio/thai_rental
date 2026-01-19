import Image from "next/image";
import Link from "next/link";
import { Home, Users, MapPin, Shield, Heart, Star, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-6 lg:px-0 pt-8">
          <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            {/* Background with gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#122B45] via-[#1a3d5c] to-[#0d1f33]" />
            
            {/* Decorative elements */}
            <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm font-medium mb-6">
                Welcome to ThaiRental
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl">
                Your Gateway to
                <span className="text-amber-400"> Paradise Living</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl">
                Connecting dreams with destinations since 2020. We help thousands find their perfect home in the Land of Smiles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "2,500+", label: "Properties Listed", icon: Home },
              { number: "15,000+", label: "Happy Renters", icon: Users },
              { number: "50+", label: "Locations", icon: MapPin },
              { number: "4.9", label: "Average Rating", icon: Star },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#122B45]/5 rounded-2xl mb-4 group-hover:bg-[#122B45] group-hover:scale-110 transition-all duration-300">
                  <stat.icon className="w-6 h-6 text-[#122B45] group-hover:text-white transition-colors" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-[#122B45] mb-1">{stat.number}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-0">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amber-500 font-semibold text-sm tracking-wider uppercase">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#122B45] mt-3 mb-6">
                Making Thai Living Accessible to Everyone
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Thailand has always been a dream destination for travelers and expats alike. 
                We started ThaiRental with a simple goal: to make finding quality rental 
                properties in Thailand as easy and stress-free as possible.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Whether you're looking for a beachfront villa in Phuket, a modern condo in 
                Bangkok, or a peaceful retreat in Chiang Mai, we've got you covered with 
                verified listings and transparent pricing.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[#122B45]">
                  <Shield className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">Verified Listings</span>
                </div>
                <div className="flex items-center gap-2 text-[#122B45]">
                  <Heart className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">24/7 Support</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/images/rentals/rental2.jpg"
                  alt="Beautiful Thai property"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl max-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-white text-xs font-bold">T</div>
                    <div className="w-8 h-8 rounded-full bg-[#122B45] flex items-center justify-center text-white text-xs font-bold">R</div>
                  </div>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <p className="text-sm text-gray-600">Trusted by thousands of happy renters</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-0">
          <div className="text-center mb-16">
            <span className="text-amber-500 font-semibold text-sm tracking-wider uppercase">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#122B45] mt-3">
              Built on Trust & Transparency
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Curated Selection",
                description: "Every property is personally verified by our team to ensure quality and accuracy of listings.",
                icon: "🏠",
                color: "bg-blue-50",
              },
              {
                title: "Local Expertise",
                description: "Our team lives and breathes Thailand. We know the best neighborhoods, the hidden gems, and the areas to avoid.",
                icon: "🌴",
                color: "bg-green-50",
              },
              {
                title: "Seamless Experience",
                description: "From browsing to booking, we've streamlined every step to make your rental journey effortless.",
                icon: "✨",
                color: "bg-amber-50",
              },
            ].map((value, index) => (
              <div
                key={index}
                className={`${value.color} p-8 rounded-3xl hover:shadow-lg transition-shadow duration-300 group`}
              >
                <span className="text-4xl mb-6 block">{value.icon}</span>
                <h3 className="text-xl font-bold text-[#122B45] mb-3 group-hover:text-amber-600 transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-[#122B45]">
        <div className="container mx-auto px-6 lg:px-0">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-semibold text-sm tracking-wider uppercase">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
              The People Behind ThaiRental
            </h2>
            <p className="text-white/70 mt-4 max-w-2xl mx-auto">
              A diverse team of expats and locals united by our love for Thailand and helping people find their perfect home.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Sarah Chen", role: "Founder & CEO", initial: "S" },
              { name: "Somchai P.", role: "Head of Operations", initial: "S" },
              { name: "Michael Torres", role: "Property Manager", initial: "M" },
              { name: "Nattaya K.", role: "Customer Success", initial: "N" },
            ].map((member, index) => (
              <div key={index} className="text-center group">
                <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white text-3xl font-bold group-hover:scale-105 transition-transform shadow-lg">
                  {member.initial}
                </div>
                <h4 className="text-white font-semibold">{member.name}</h4>
                <p className="text-white/60 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-0">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#122B45] mb-4">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Browse our curated collection of properties across Thailand. 
              Your perfect rental is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#122B45] text-white rounded-full font-semibold hover:bg-[#1a3d5c] transition-colors shadow-lg hover:shadow-xl"
              >
                Browse Properties
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#122B45] rounded-full font-semibold hover:bg-gray-50 transition-colors border border-gray-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
