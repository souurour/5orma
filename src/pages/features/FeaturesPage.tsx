import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Bell,
  Clock,
  Shield,
  Users,
  Database,
  LineChart,
  Wrench,
  BellRing,
  LucideIcon,
} from "lucide-react";

interface FeatureProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const Feature = ({ title, description, icon: Icon, color }: FeatureProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
    <div
      className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}
    >
      <Icon className="h-6 w-6 text-white" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const features: FeatureProps[] = [
  {
    title: "Real-time Dashboards",
    description:
      "Interactive visualizations provide instant insights into production metrics, machine health, and overall efficiency.",
    icon: BarChart3,
    color: "bg-indigo-600",
  },
  {
    title: "Predictive Maintenance",
    description:
      "AI-powered predictions to identify potential machine failures before they occur, reducing costly downtime.",
    icon: LineChart,
    color: "bg-blue-600",
  },
  {
    title: "Role-Based Access",
    description:
      "Secure, customized views for operators, technicians, and administrators with appropriate permissions.",
    icon: Shield,
    color: "bg-green-600",
  },
  {
    title: "Maintenance Management",
    description:
      "Schedule, track, and manage maintenance activities with comprehensive reporting and history.",
    icon: Wrench,
    color: "bg-amber-600",
  },
  {
    title: "Alert Notifications",
    description:
      "Instant notifications for critical events, machine issues, and maintenance reminders via app and email.",
    icon: BellRing,
    color: "bg-red-600",
  },
  {
    title: "Production Analytics",
    description:
      "Deep insights into production metrics, bottlenecks, and improvement opportunities with historical trending.",
    icon: Database,
    color: "bg-purple-600",
  },
  {
    title: "Team Collaboration",
    description:
      "Built-in communication tools to coordinate between operators, technicians, and management.",
    icon: Users,
    color: "bg-teal-600",
  },
  {
    title: "Automated Reporting",
    description:
      "Schedule and generate reports automatically in multiple formats for stakeholders at any level.",
    icon: Clock,
    color: "bg-orange-600",
  },
];

const FeaturesPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-900 to-indigo-800 text-white py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Modern Manufacturing
            </h1>
            <p className="text-lg text-indigo-200 mb-6">
              Our platform provides comprehensive tools designed specifically
              for the denim industry to optimize operations, reduce downtime,
              and increase productivity.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to monitor, maintain, and optimize your
              manufacturing processes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Feature key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Seamless Integration
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our platform seamlessly integrates with your existing
                manufacturing systems, including:
              </p>
              <ul className="space-y-3">
                {[
                  "Enterprise Resource Planning (ERP) systems",
                  "Manufacturing Execution Systems (MES)",
                  "Industrial IoT sensors and devices",
                  "Legacy machine control systems",
                  "Data warehouses and analytics platforms",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-10"></div>
                <div className="relative p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Integration Benefits
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-bold">1</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium">
                          Minimal Disruption
                        </h4>
                        <p className="text-gray-600">
                          Deploy without disrupting existing operations
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-bold">2</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium">
                          Data Consolidation
                        </h4>
                        <p className="text-gray-600">
                          Bring all your manufacturing data into one platform
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-bold">3</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium">Real-time Sync</h4>
                        <p className="text-gray-600">
                          Keep all systems updated with bidirectional data flow
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-900 text-white py-16">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to transform your manufacturing operations?
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
              <Link to="/register">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-indigo-800"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
