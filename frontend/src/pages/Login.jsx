import { useState } from 'react';
import { Mail, Lock, Eye, EyeClosed } from 'lucide-react';
import { loadFull } from 'tsparticles';
import Particles from 'react-tsparticles';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userStore';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.post('/login', form);
      localStorage.setItem('coldmailerUser', JSON.stringify(response.data.user));
      dispatch(setUser(response.data.user));
      toast.success('Login successful!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed!');
    }
    finally{
        setLoading(false);
    }
  };

//   const particlesInit = async (main) => {
//     await loadFull(main);
//   };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[#0b0f1a] overflow-hidden">
      {/* 🟣 Bubbles Animation */}
      {/* <Particles
        init={particlesInit}
        className="absolute inset-0 z-0"
        options={{
          fullScreen: false,
          background: { color: '#0b0f1a' },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'repulse' },
              resize: true,
            },
          },
          particles: {
            color: { value: '#66f' },
            links: {
              enable: true,
              color: '#aaa',
              distance: 120,
              opacity: 0.3,
              width: 1,
            },
            move: {
              enable: true,
              speed: 2,
              direction: 'none',
              outModes: 'bounce',
            },
            size: {
              value: { min: 2, max: 4 },
            },
            opacity: {
              value: 0.5,
            },
            number: {
              value: 50,
              density: { enable: true, area: 800 },
            },
          },
        }}
      /> */}

      {/* 🔲 Login Form */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="z-10 w-full max-w-md backdrop-blur-md bg-[#10121c]/70 border border-white/10 shadow-xl rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-white">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="pl-10 w-full py-2 bg-[#1a1e2c] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="pl-10 w-full py-2 bg-[#1a1e2c] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400"
            >
                {showPassword ? (
                    <Eye size={20} className="text-gray-400" />
                ) : (
                    <EyeClosed size={20} className="text-gray-400" />
                )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white py-2 rounded-lg transition"
          >
            {loading ? 'Loading...' : 'Log In'}
          </button>
          <p className='text-white'>Dont have a account? <a href="/signup" className='text-blue-500'>Signup</a></p>
        </form>
      </motion.div>
    </div>
  );
}
