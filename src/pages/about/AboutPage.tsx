import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  User,
  Building,
  Target,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// Core value type
interface CoreValue {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const AboutPage = () => {
  // Core values
  const coreValues: CoreValue[] = [
    {
      title: "Innovation",
      description:
        "We constantly push the boundaries of what's possible in manufacturing intelligence.",
      icon: <Target className="h-8 w-8 text-indigo-600" />,
    },
    {
      title: "Reliability",
      description:
        "Our customers depend on our platform for critical operations—we take that responsibility seriously.",
      icon: <CheckCircle className="h-8 w-8 text-indigo-600" />,
    },
    {
      title: "Collaboration",
      description:
        "We work closely with our customers to understand their needs and build solutions together.",
      icon: <User className="h-8 w-8 text-indigo-600" />,
    },
    {
      title: "Efficiency",
      description:
        "We're obsessed with helping our customers achieve maximum operational efficiency.",
      icon: <Clock className="h-8 w-8 text-indigo-600" />,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-900 to-indigo-800 text-white py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">About MIC Service</h1>
            <p className="text-xl text-indigo-200 mb-6">
              We're on a mission to transform denim manufacturing with
              data-driven insights and intelligent automation.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-gray-600">
                  MIC Service was founded in 2018 by a team of manufacturing
                  experts and technologists who saw the potential for digital
                  transformation in the denim industry.
                </p>
                <p className="text-lg text-gray-600">
                  We noticed that while many industries were embracing data
                  analytics and IoT technologies, textile manufacturing was
                  lagging behind, relying on outdated methods and missing
                  opportunities for efficiency.
                </p>
                <p className="text-lg text-gray-600">
                  Our team set out to create a platform specifically designed
                  for the unique challenges of denim manufacturing—from fabric
                  production to finishing processes—that would provide real-time
                  insights and predictive capabilities.
                </p>
                <p className="text-lg text-gray-600">
                  Today, our solutions are used by leading denim manufacturers
                  around the world, helping them reduce downtime, improve
                  quality, and optimize operations.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-200 rounded-lg transform translate-x-3 translate-y-3"></div>
              <img
                src="https://images.unsplash.com/photo-1565847190996-2967aef7ac7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                alt="Denim manufacturing"
                className="relative z-10 rounded-lg shadow-lg w-full h-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://via.placeholder.com/600x400?text=Denim+Manufacturing";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Mission & Vision
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 mb-6">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg text-gray-600">
                To empower denim manufacturers with cutting-edge technology that
                transforms operations, reduces waste, and maximizes productivity
                while maintaining the highest quality standards.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 mb-6">
                <Building className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-lg text-gray-600">
                To be the global leader in manufacturing intelligence for the
                textile industry, creating a future where every aspect of
                production is optimized through data-driven insights and
                intelligent automation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do as we work to transform
              manufacturing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intentionally removed Team and Journey sections */}

      {/* CTA Section */}
      <section className="bg-indigo-900 text-white py-16">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Us in Transforming Manufacturing
          </h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-3xl mx-auto">
            Ready to see how our platform can revolutionize your operations?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-indigo-900 hover:bg-indigo-50"
            >
              <Link to="/contact">
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
