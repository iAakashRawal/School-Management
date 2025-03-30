'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mount
    setIsLoaded(true);

    // Add some randomness to cloud movements
    const clouds = document.querySelectorAll('.cloud');
    clouds.forEach(cloud => {
      const speed = 20 + Math.random() * 30;
      (cloud as HTMLElement).style.animationDuration = `${speed}s`;
    });
    
    // Add randomness to flying letters
    const letters = document.querySelectorAll('.flying-letter');
    letters.forEach((letter) => {
      const delay = Math.random() * 5;
      const duration = 10 + Math.random() * 15;
      (letter as HTMLElement).style.animationDelay = `${delay}s`;
      (letter as HTMLElement).style.animationDuration = `${duration}s`;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(formData);
      if (user) {
        // Show success animation before redirect
        document.querySelector('.students-group')?.classList.add('students-enter-school');
        
        // Wait for animation to complete before redirecting
        setTimeout(() => {
          localStorage.setItem('user', JSON.stringify(user));
          router.push('/dashboard');
        }, 2000);
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Sky background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-200 dark:from-indigo-900 dark:to-blue-900">
        {/* Sun */}
        <div className="absolute top-16 right-20 w-24 h-24 bg-yellow-300 dark:bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50 sun-rays" />
        
        {/* Clouds */}
        <div className="cloud cloud-1 absolute top-10 left-10 opacity-90 dark:opacity-30">
          <div className="w-16 h-16 bg-white dark:bg-gray-100 rounded-full" />
          <div className="w-20 h-16 bg-white dark:bg-gray-100 rounded-full absolute -top-6 left-8" />
          <div className="w-16 h-16 bg-white dark:bg-gray-100 rounded-full absolute -top-4 left-16" />
        </div>
        
        <div className="cloud cloud-2 absolute top-20 right-1/4 opacity-80 dark:opacity-20">
          <div className="w-20 h-20 bg-white dark:bg-gray-100 rounded-full" />
          <div className="w-24 h-20 bg-white dark:bg-gray-100 rounded-full absolute -top-8 left-10" />
          <div className="w-20 h-20 bg-white dark:bg-gray-100 rounded-full absolute -top-6 left-24" />
        </div>
        
        <div className="cloud cloud-3 absolute top-40 left-1/3 opacity-70 dark:opacity-10">
          <div className="w-14 h-14 bg-white dark:bg-gray-100 rounded-full" />
          <div className="w-16 h-14 bg-white dark:bg-gray-100 rounded-full absolute -top-6 left-6" />
          <div className="w-14 h-14 bg-white dark:bg-gray-100 rounded-full absolute -top-4 left-14" />
        </div>
        
        {/* Flying Alphabets */}
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
          <div 
            key={letter} 
            className={`flying-letter absolute text-xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-300 
                      select-none letter-${letter}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 40}%`,
              transform: `rotate(${Math.random() * 40 - 20}deg)`,
              opacity: 0.8,
              zIndex: 5
            }}
          >
            {letter}
          </div>
        ))}
      </div>
      
      {/* School Building */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-amber-100 dark:bg-amber-900 flex items-end justify-center">
        <div className="relative w-full max-w-2xl h-56 bg-amber-700 dark:bg-amber-800 rounded-t-3xl flex justify-center">
          {/* School Entrance */}
          <div className="absolute bottom-0 w-28 h-40 bg-amber-900 dark:bg-amber-950 rounded-t-lg flex flex-col items-center">
            <div className="w-20 h-16 bg-cyan-200 dark:bg-cyan-800 rounded-t-lg mt-3 flex justify-center items-center text-amber-950 text-xl font-bold">
              SMS
            </div>
            <div className="mt-auto w-16 h-20 bg-amber-800 dark:bg-amber-950 border-t-2 border-amber-600"></div>
          </div>
          
          {/* Windows */}
          <div className="absolute top-10 left-20 grid grid-cols-2 gap-10">
            <div className="w-12 h-12 bg-cyan-200 dark:bg-cyan-800 rounded-sm"></div>
            <div className="w-12 h-12 bg-cyan-200 dark:bg-cyan-800 rounded-sm"></div>
            <div className="w-12 h-12 bg-cyan-200 dark:bg-cyan-800 rounded-sm"></div>
            <div className="w-12 h-12 bg-cyan-200 dark:bg-cyan-800 rounded-sm"></div>
          </div>
          
          <div className="absolute top-10 right-20 grid grid-cols-2 gap-10">
            <div className="w-12 h-12 bg-cyan-200 dark:bg-cyan-800 rounded-sm"></div>
            <div className="w-12 h-12 bg-cyan-200 dark:bg-cyan-800 rounded-sm"></div>
            <div className="w-12 h-12 bg-cyan-200 dark:bg-cyan-800 rounded-sm"></div>
            <div className="w-12 h-12 bg-cyan-200 dark:bg-cyan-800 rounded-sm"></div>
          </div>
        </div>
        
        {/* Ground/Grass */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-green-600 dark:bg-green-800"></div>
      </div>
      
      {/* Students walking to school */}
      <div className={`students-group absolute bottom-14 left-10 transition-transform duration-2000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="student student-1 absolute bottom-0 left-0 w-8 h-16 bg-blue-500 rounded-t-full flex flex-col items-center animate-walk">
          <div className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-300 -mt-2"></div>
        </div>
        <div className="student student-2 absolute bottom-0 left-16 w-8 h-14 bg-pink-500 rounded-t-full flex flex-col items-center animate-walk" style={{ animationDelay: '0.2s' }}>
          <div className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-300 -mt-2"></div>
        </div>
        <div className="student student-3 absolute bottom-0 left-32 w-8 h-16 bg-purple-500 rounded-t-full flex flex-col items-center animate-walk" style={{ animationDelay: '0.4s' }}>
          <div className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-300 -mt-2"></div>
        </div>
      </div>
            
      {/* Login Card */}
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 z-10">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gradient-rainbow mb-2">Inspire Academy</h1>
                <p className="text-gray-600 dark:text-gray-300">School Management System</p>
              </div>
              
              {error && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm"
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm"
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
                    className="w-full py-2 px-4 border-0 rounded-md shadow-md text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative overflow-hidden group"
                  >
                    <span className="absolute right-0 top-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40"></span>
                    <span className="relative">
                      {loading ? 'Signing in...' : 'Sign in'}
                    </span>
                  </button>
                </div>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-neutral-800 text-gray-500 dark:text-gray-400">Demo accounts</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-center">
                    <div className="border border-transparent rounded-md p-2 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer" 
                         onClick={() => setFormData({ email: 'admin@school.com', password: 'password123' })}>
                      <div className="font-semibold text-gray-900 dark:text-white">Admin</div>
                      <div className="text-gray-500 dark:text-gray-400">admin@school.com</div>
                    </div>
                    <div className="border border-transparent rounded-md p-2 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
                         onClick={() => setFormData({ email: 'teacher@school.com', password: 'password123' })}>
                      <div className="font-semibold text-gray-900 dark:text-white">Teacher</div>
                      <div className="text-gray-500 dark:text-gray-400">teacher@school.com</div>
                    </div>
                    <div className="border border-transparent rounded-md p-2 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer"
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
      </div>
      
      {/* Add this CSS */}
      <style jsx>{`
        @keyframes float-cloud {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        
        @keyframes float-letter {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotate(${Math.random() * 360}deg);
            opacity: 0;
          }
        }
        
        @keyframes walk {
          0% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-3px);
          }
          50% {
            transform: translateY(0);
          }
          75% {
            transform: translateY(-3px);
          }
          100% {
            transform: translateY(0);
          }
        }
        
        .sun-rays::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 140%;
          height: 140%;
          background: radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(255,215,0,0) 70%);
          transform: translate(-50%, -50%);
          border-radius: 50%;
          z-index: -1;
        }
        
        .cloud {
          animation: float-cloud linear infinite;
        }
        
        .cloud-1 {
          animation-duration: 35s;
        }
        
        .cloud-2 {
          animation-duration: 45s;
        }
        
        .cloud-3 {
          animation-duration: 30s;
        }
        
        .flying-letter {
          animation: float-letter 15s infinite alternate;
        }
        
        .animate-walk {
          animation: walk 1s infinite;
        }
        
        .students-enter-school {
          transform: translateX(45vw);
          transition: transform 2s;
        }
      `}</style>
    </div>
  );
} 