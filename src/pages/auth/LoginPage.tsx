import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  User,
  ShieldCheck,
  Wrench,
  ArrowLeft,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

// Admin login schema
const adminLoginSchema = z.object({
  password: z.string().refine((val) => val === "ADMINmic2025", {
    message: "Invalid admin password",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("user");
  const [adminError, setAdminError] = useState<string | null>(null);

  // Initialize user login form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Initialize technician login form
  const techForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Initialize admin login form
  const adminForm = useForm<{ password: string }>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      password: "",
    },
  });

  // User form submission handler
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    clearError();

    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by the auth context
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Technician form submission handler
  const onTechSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    clearError();

    try {
      // Add role=technician to the form data before submitting
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by the auth context
      console.error("Technician login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Admin form submission handler
  const onAdminSubmit = async (data: { password: string }) => {
    setIsLoading(true);
    setAdminError(null);

    try {
      if (data.password === "ADMINmic2025") {
        // Create admin user object
        const adminUser = {
          id: "admin",
          email: "admin@micservicelaser.com",
          name: "Administrator",
          role: "admin" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Store admin user in localStorage
        localStorage.setItem("authToken", "admin-token");
        localStorage.setItem("user", JSON.stringify(adminUser));

        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        setAdminError("Invalid admin password");
      }
    } catch (error) {
      setAdminError("Admin login failed. Please try again.");
      console.error("Admin login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Button>
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="user"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="user" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  User
                </TabsTrigger>
                <TabsTrigger
                  value="technician"
                  className="flex items-center gap-2"
                >
                  <Wrench className="h-4 w-4" />
                  Technician
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              {/* User Login Form */}
              <TabsContent value="user">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </Form>

                <div className="mt-4 text-center text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </TabsContent>

              {/* Technician Login Form */}
              <TabsContent value="technician">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Form {...techForm}>
                  <form
                    onSubmit={techForm.handleSubmit(onTechSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={techForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="technician@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={techForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Technician Sign In"}
                    </Button>
                  </form>
                </Form>

                <div className="mt-4 text-center text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </TabsContent>

              {/* Admin Login Form */}
              <TabsContent value="admin">
                {adminError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{adminError}</AlertDescription>
                  </Alert>
                )}

                <Form {...adminForm}>
                  <form
                    onSubmit={adminForm.handleSubmit(onAdminSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={adminForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admin Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter admin password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Admin Sign In"}
                    </Button>
                  </form>
                </Form>

                <div className="mt-4 text-sm text-muted-foreground">
                  This area is restricted to system administrators only.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
