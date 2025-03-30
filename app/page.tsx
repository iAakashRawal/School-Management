'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [animateLogin, setAnimateLogin] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [navbarBg, setNavbarBg] = useState(false);

  useEffect(() => {
    // Trigger animations after component mount
    setAnimateLogin(true);
    
    // Add scroll animations to sections
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          const id = entry.target.getAttribute('id');
          if (id) setActiveSection(id);
        }
      });
    }, { threshold: 0.3 });
    
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });
    
    // Change navbar background on scroll
    const handleScroll = () => {
      setNavbarBg(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(formData);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      {/* Fixed Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Image 
                src="/school-logo.svg" 
                alt="Inspire Academy Logo" 
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className={`ml-2 text-xl font-bold ${navbarBg ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                Inspire Academy
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['home', 'about', 'programs', 'faculty', 'gallery', 'testimonials', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    activeSection === section 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : navbarBg ? 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400' : 'text-white hover:text-indigo-200'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <a
                href="#"
                onClick={() => scrollToSection('contact')}
                className="hidden md:inline-block px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen pt-16 relative bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-purple-900">
        <div className="absolute inset-0 overflow-hidden">
          {/* Decorative shapes */}
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white opacity-10"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 20}s infinite ease-in-out`
              }}
            ></div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center justify-between relative z-10">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Excellence in <span className="text-yellow-300">Education</span> for the Future
            </h1>
            <p className="text-xl text-indigo-100 mb-10 max-w-xl mx-auto lg:mx-0">
              Nurturing minds and building character in a supportive and innovative learning environment.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => scrollToSection('programs')}
                className="px-8 py-3 rounded-md bg-white text-indigo-700 font-semibold shadow-lg hover:bg-indigo-50 transition-colors"
              >
                Explore Programs
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="px-8 py-3 rounded-md bg-transparent border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
          
          {/* Login Card */}
          <div className="w-full lg:w-5/12">
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 transform transition-all duration-700 ${
              animateLogin ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}>
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center">
                  Login to Portal
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                  Access your dashboard to manage your academic journey
                </p>
              </div>
              
              {error && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email address
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
                
                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Demo accounts</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-center">
                    <div className="border dark:border-gray-600 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors" 
                         onClick={() => setFormData({ email: 'admin@school.com', password: 'password123' })}>
                      <div className="font-semibold text-gray-900 dark:text-white">Admin</div>
                      <div className="text-gray-500 dark:text-gray-400">admin@school.com</div>
                    </div>
                    <div className="border dark:border-gray-600 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                         onClick={() => setFormData({ email: 'teacher@school.com', password: 'password123' })}>
                      <div className="font-semibold text-gray-900 dark:text-white">Teacher</div>
                      <div className="text-gray-500 dark:text-gray-400">teacher@school.com</div>
                    </div>
                    <div className="border dark:border-gray-600 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                         onClick={() => setFormData({ email: 'student@school.com', password: 'password123' })}>
                      <div className="font-semibold text-gray-900 dark:text-white">Student</div>
                      <div className="text-gray-500 dark:text-gray-400">student@school.com</div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 opacity-0 transition-opacity duration-1000">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">About Inspire Academy</h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-xl overflow-hidden shadow-xl h-96">
              <Image 
                src="/school-building.jpg" 
                alt="Inspire Academy Campus"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <p className="text-xl font-semibold">Our Beautiful Campus</p>
                  <p>Established in 1995</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                At Inspire Academy, we are dedicated to providing a comprehensive education that nurtures intellectual curiosity, creativity, and character development. 
                Our mission is to prepare students to succeed in a rapidly changing world by fostering critical thinking skills, emotional intelligence, 
                and a lifelong love of learning.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="text-indigo-600 dark:text-indigo-400 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Safe Environment</h4>
                  <p className="text-gray-600 dark:text-gray-400">We provide a secure and supportive environment where students can learn and grow with confidence.</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="text-indigo-600 dark:text-indigo-400 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Modern Facilities</h4>
                  <p className="text-gray-600 dark:text-gray-400">State-of-the-art classrooms, labs, and recreational spaces designed for optimal learning experiences.</p>
                </div>
              </div>
              
              <div className="mt-8">
                <button 
                  onClick={() => scrollToSection('programs')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors font-medium"
                >
                  Discover Our Programs
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800 opacity-0 transition-opacity duration-1000">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Academic Programs</h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto"></div>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Inspire Academy offers a diverse range of academic programs designed to meet the varied needs and interests of our students.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Elementary Program */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 border border-gray-100 dark:border-gray-700">
              <div className="relative h-48">
                <Image 
                  src="/elementary.jpg" 
                  alt="Elementary Program" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                  Ages 5-10
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Elementary Program</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Our elementary program focuses on building strong foundational skills in literacy, mathematics, science, and social studies while nurturing creativity and curiosity.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 mb-6">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Phonics-based reading
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Hands-on mathematics
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Inquiry-based science
                  </li>
                </ul>
                <button className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
                  Learn more &rarr;
                </button>
              </div>
            </div>
            
            {/* Middle School Program */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 border border-gray-100 dark:border-gray-700">
              <div className="relative h-48">
                <Image 
                  src="/middle-school.jpg" 
                  alt="Middle School Program" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                  Ages 11-13
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Middle School Program</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Our middle school program helps students transition to more advanced studies while supporting their emotional and social development.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 mb-6">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Subject specialization
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Critical thinking skills
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Leadership opportunities
                  </li>
                </ul>
                <button className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
                  Learn more &rarr;
                </button>
              </div>
            </div>
            
            {/* High School Program */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 border border-gray-100 dark:border-gray-700">
              <div className="relative h-48">
                <Image 
                  src="/high-school.jpg" 
                  alt="High School Program" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                  Ages 14-18
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">High School Program</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Our comprehensive high school program prepares students for college and careers through rigorous academics and specialized pathways.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400 mb-6">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Advanced Placement courses
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    College counseling
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Internship opportunities
                  </li>
                </ul>
                <button className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
                  Learn more &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 px-8 animate-on-scroll opacity-0 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-indigo-900 dark:text-indigo-100">Our Facilities</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: "Modern Classrooms",
                description: "Spacious, well-lit classrooms equipped with interactive whiteboards and multimedia systems."
              },
              {
                title: "Science Laboratories",
                description: "Fully equipped physics, chemistry, and biology labs for practical experiments and research."
              },
              {
                title: "Computer Labs",
                description: "State-of-the-art computer labs with high-speed internet and the latest software."
              },
              {
                title: "Library & Resource Center",
                description: "Extensive collection of books, journals, and digital resources for research and leisure reading."
              }
            ].map((facility, index) => (
              <div 
                key={index}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 dark:text-indigo-300 font-bold">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-800 dark:text-indigo-300">{facility.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{facility.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 opacity-0 transition-opacity duration-1000">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Community Says</h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md relative">
              <div className="text-indigo-500 dark:text-indigo-400 mb-4">
                <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                "The dedicated teachers at Inspire Academy have made a profound impact on my child's academic journey. The personalized attention and innovative teaching methods have helped them excel beyond our expectations."
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image src="/parent-1.jpg" alt="Parent" width={48} height={48} />
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white font-semibold">Rebecca Johnson</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Parent of 8th Grader</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md relative">
              <div className="text-indigo-500 dark:text-indigo-400 mb-4">
                <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                "Attending Inspire Academy has been transformative. The supportive environment, challenging curriculum, and wealth of extracurricular opportunities have helped me discover my passions and prepare for college."
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image src="/student-1.jpg" alt="Student" width={48} height={48} />
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white font-semibold">Marcus Williams</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Class of 2023</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md relative">
              <div className="text-indigo-500 dark:text-indigo-400 mb-4">
                <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                "Being part of the faculty at Inspire Academy has been incredibly rewarding. The collaborative atmosphere among educators and the focus on holistic student development makes this a truly special place to teach."
              </p>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image src="/teacher-1.jpg" alt="Teacher" width={48} height={48} />
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white font-semibold">Amanda Turner</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">English Teacher</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-50 dark:bg-gray-800 opacity-0 transition-opacity duration-1000">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto"></div>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Have questions or want to schedule a visit? Reach out to us and we'll be happy to assist you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="How can we help you?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                
                <div>
                  <button 
                    type="submit"
                    className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-md transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">School Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Address</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        1234 Education Avenue<br />
                        Cityville, State 12345<br />
                        United States
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Phone</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Main Office: (123) 456-7890<br />
                        Admissions: (123) 456-7891
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        info@inspireacademy.edu<br />
                        admissions@inspireacademy.edu
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">School Hours</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Monday - Friday:</span>
                    <span className="text-gray-900 dark:text-white font-medium">8:00 AM - 3:30 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Administrative Office:</span>
                    <span className="text-gray-900 dark:text-white font-medium">7:30 AM - 4:30 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Weekend:</span>
                    <span className="text-gray-900 dark:text-white font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Image 
                  src="/school-logo.svg" 
                  alt="Inspire Academy Logo" 
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="ml-2 text-xl font-bold">Inspire Academy</span>
              </div>
              <p className="text-gray-400 mb-4">
                Nurturing minds and building character in a supportive and innovative learning environment since 1995.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.416 2H7.584C4.505 2 2 4.505 2 7.584v8.832C2 19.495 4.505 22 7.584 22h8.832C19.495 22 22 19.495 22 16.416V7.584C22 4.505 19.495 2 16.416 2zm-4.416 14.25a4.25 4.25 0 110-8.5 4.25 4.25 0 010 8.5zm5.792-9.165a1.335 1.335 0 01-2.67 0 1.335 1.335 0 012.67 0z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.33 29 29 0 00-.46-5.33z"></path>
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 15.02l5.25-3.27-5.25-3.27v6.54z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Programs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Admissions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Events</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Parent Portal</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Student Portal</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Library</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Academic Calendar</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">School News</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Subscribe to Updates</h3>
              <p className="text-gray-400 mb-4">Stay up to date with our latest news and events.</p>
              <form className="space-y-2">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md placeholder-gray-500 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button 
                  type="submit"
                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Inspire Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Back to top button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
      
      {/* Add this style for scroll animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out forwards;
          opacity: 1 !important;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
} 