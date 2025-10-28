import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Clock,
  Shield,
  Users,
  Calendar,
  Activity,
  ArrowRight,
  CheckCircle,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  // Check if user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-md transition-transform group-hover:scale-110">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MediQueue
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/hospitals">
              <Button variant="ghost" className="font-medium">Find Hospitals</Button>
            </Link>
            {user ? (
              // Show when user is logged in
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="font-medium">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/appointments">
                  <Button className="shadow-md">My Appointments</Button>
                </Link>
              </>
            ) : (
              // Show when user is not logged in
              <>
                <Link href="/login">
                  <Button variant="ghost" className="font-medium">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="shadow-md">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-2.5 shadow-sm">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Smart Queue Management for Healthcare</span>
            </div>
            <h1 className="mb-8 text-5xl font-extrabold leading-tight text-gray-900 md:text-6xl lg:text-7xl">
              Book Same-Day Hospital Appointments{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                with Emergency Priority
              </span>
            </h1>
            <p className="mb-12 text-xl text-gray-600 md:text-2xl">
              Skip the wait. Access a network of hospitals instantly. Get emergency care
              prioritized. All from one platform.
            </p>
            <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
              <Link href={user ? "/hospitals" : "/register"}>
                <Button size="lg" className="group w-full px-8 py-6 text-lg shadow-lg sm:w-auto">
                  {user ? "Book Appointment" : "Get Started"}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/emergency">
                <Button size="lg" variant="destructive" className="w-full px-8 py-6 text-lg shadow-lg sm:w-auto">
                  Emergency Booking 🚨
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div className="group">
                <div className="text-4xl font-extrabold text-blue-600 transition-transform group-hover:scale-110">100+</div>
                <div className="mt-2 text-sm font-medium text-gray-600">Network Hospitals</div>
              </div>
              <div className="group">
                <div className="text-4xl font-extrabold text-blue-600 transition-transform group-hover:scale-110">&lt;30min</div>
                <div className="mt-2 text-sm font-medium text-gray-600">Average Wait Time</div>
              </div>
              <div className="group">
                <div className="text-4xl font-extrabold text-blue-600 transition-transform group-hover:scale-110">&lt;5min</div>
                <div className="mt-2 text-sm font-medium text-gray-600">Emergency Response</div>
              </div>
              <div className="group">
                <div className="text-4xl font-extrabold text-blue-600 transition-transform group-hover:scale-110">24/7</div>
                <div className="mt-2 text-sm font-medium text-gray-600">Service Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">Why Choose MediQueue?</h2>
            <p className="text-xl text-gray-600">
              Everything you need for seamless healthcare access
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-xl bg-white p-8 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Same-Day Booking</h3>
              <p className="text-gray-600 leading-relaxed">
                Book appointments instantly across a vast network of hospitals. Real-time
                availability updates.
              </p>
            </div>

            <div className="group rounded-xl bg-white p-8 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-400 to-red-600 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Emergency Priority</h3>
              <p className="text-gray-600 leading-relaxed">
                Automated triage system prioritizes critical cases. Get immediate attention
                when you need it most.
              </p>
            </div>

            <div className="group rounded-xl bg-white p-8 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Multi-Hospital Network</h3>
              <p className="text-gray-600 leading-relaxed">
                Access 100+ hospitals with a single account. Your medical history travels
                with you.
              </p>
            </div>

            <div className="group rounded-xl bg-white p-8 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Real-Time Queue Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                See your position in queue live. Get notified when it's your turn. No more
                waiting room anxiety.
              </p>
            </div>

            <div className="group rounded-xl bg-white p-8 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Flexible Cancellation</h3>
              <p className="text-gray-600 leading-relaxed">
                Cancel or reschedule easily. Automatic waitlist management ensures no slot
                goes unused.
              </p>
            </div>

            <div className="group rounded-xl bg-white p-8 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Smart Notifications</h3>
              <p className="text-gray-600 leading-relaxed">
                Multi-channel reminders via SMS, email, and app. Never miss an appointment
                again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600">Book your appointment in 3 simple steps</p>
          </div>

          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="relative text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-3xl font-bold text-white shadow-xl">
                  1
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">Choose Hospital</h3>
                <p className="text-gray-600 leading-relaxed">
                  Browse nearby hospitals, compare availability, and select your preferred
                  facility.
                </p>
                <div className="mt-6 hidden md:block absolute top-10 -right-6 text-4xl text-blue-200">→</div>
              </div>

              <div className="relative text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-3xl font-bold text-white shadow-xl">
                  2
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">Book Appointment</h3>
                <p className="text-gray-600 leading-relaxed">
                  Select time slot, fill emergency triage if needed, and confirm your
                  booking.
                </p>
                <div className="mt-6 hidden md:block absolute top-10 -right-6 text-4xl text-blue-200">→</div>
              </div>

              <div className="relative text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-3xl font-bold text-white shadow-xl">
                  3
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">Visit Hospital</h3>
                <p className="text-gray-600 leading-relaxed">
                  Check in with QR code, track your queue position, and get treated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 py-24">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="container relative mx-auto px-4 text-center">
          {user ? (
            <>
              <h2 className="mb-6 text-5xl font-extrabold text-white">Welcome Back!</h2>
              <p className="mb-10 text-2xl text-blue-50">
                Continue managing your appointments and healthcare journey
              </p>
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="group px-10 py-7 text-lg font-semibold shadow-2xl hover:shadow-xl">
                  Go to Dashboard 
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <h2 className="mb-6 text-5xl font-extrabold text-white">Ready to Get Started?</h2>
              <p className="mb-10 text-2xl text-blue-50">
                Join thousands of patients who trust MediQueue for their healthcare needs
              </p>
              <Link href="/register">
                <Button size="lg" variant="secondary" className="group px-10 py-7 text-lg font-semibold shadow-2xl hover:shadow-xl">
                  Create Free Account 
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">MediQueue</span>
              </div>
              <p className="text-sm text-gray-600">
                Smart queue management for healthcare. Making hospital visits stress-free.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/hospitals">Find Hospitals</Link>
                </li>
                <li>
                  <Link href="/emergency">Emergency Booking</Link>
                </li>
                <li>
                  <Link href="/features">Features</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li>
                  <Link href="/careers">Careers</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/hipaa">HIPAA Compliance</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} MediQueue. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

