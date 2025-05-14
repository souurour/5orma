import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  BarChart3,
  Bell,
  Clock,
  Shield,
  Users,
  Database,
} from "lucide-react";

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-900 to-indigo-800 text-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Smart Manufacturing{" "}
                <span className="text-indigo-300">BI Platform</span> for Denim
                Industry
              </h1>
              <p className="text-xl text-indigo-200 max-w-lg">
                Optimize your denim manufacturing operations with our
                comprehensive business intelligence solution.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-indigo-900 hover:bg-indigo-50"
                >
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-indigo-800"
                >
                  <Link to="/login" className="text-[#36309c]">
                    Login
                  </Link>
                </Button>
              </div>
            </div>
            {/* Hero section right side - can be replaced with an image later if needed */}
            <div className="hidden md:block rounded-lg bg-indigo-800/30 h-[400px] flex items-center justify-center">
              <div className="text-center p-6">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Smart Manufacturing Solutions
                </h3>
                <p className="text-indigo-200">
                  Leverage our BI platform to transform your denim manufacturing
                  operations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to monitor, maintain, and optimize your
              manufacturing processes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Alerts</h3>
              <p className="text-gray-600">
                Get instant notifications when machines need attention or
                maintenance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Performance Metrics
              </h3>
              <p className="text-gray-600">
                Track OEE, availability, and quality metrics across all
                machinery.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Maintenance Tracking
              </h3>
              <p className="text-gray-600">
                Schedule and monitor maintenance activities to minimize
                downtime.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Comprehensive Reports
              </h3>
              <p className="text-gray-600">
                Generate detailed reports with exportable PDF and Excel formats.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Role-based Access</h3>
              <p className="text-gray-600">
                Secure system with customized access for different team members.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Enable seamless communication between operators, technicians,
                and management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-900 text-white py-16">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to optimize your denim production?
          </h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-3xl mx-auto">
            Join leading denim manufacturers who have improved efficiency and
            reduced downtime with our platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-indigo-900 hover:bg-indigo-50"
            >
              <Link to="/register">Start</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Optional spacing section */}
      <div className="py-8 bg-gray-50"></div>
    </div>
  );
};

export default HomePage;
