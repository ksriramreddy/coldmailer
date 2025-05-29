import { motion } from 'framer-motion';
import { MailCheck, Rocket, FileText, Users, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white px-6 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Welcome to ColdMailer
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-6">
          Your personal assistant for sending job application emails—fast, easy, and customizable.
        </p>
        <Link to="/compass">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white py-3 px-6 rounded-xl text-lg font-medium"
          >
            Get Started
          </motion.button>
        </Link>
      </motion.div>

      {/* Features Section */}
      <div className="mt-20 max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
        {[{
          icon: <Rocket size={36} className="mx-auto mb-2 text-blue-400" />,
          title: "Send Emails Fast",
          desc: "Launch job applications in seconds with one-click email sending."
        }, {
          icon: <FileText size={36} className="mx-auto mb-2 text-purple-400" />,
          title: "Resume Manager",
          desc: "Upload and reuse resumes for different job roles easily."
        }, {
          icon: <MailCheck size={36} className="mx-auto mb-2 text-green-400" />,
          title: "Templates Built-In",
          desc: "Save your favorite cover letters and body content to reuse anytime."
        }].map(({ icon, title, desc }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="p-6 bg-[#161b2c] rounded-xl shadow-lg"
          >
            {icon}
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-400">{desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Why Us Section */}
      <div className="mt-24 max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-8"
        >
          Why Choose ColdMailer?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {[
            {
              q: "Why ColdMailer?",
              a: "Because job hunting is hard enough—we make emails the easy part.",
              icon: <HelpCircle className="text-yellow-500 mr-2" size={20} />
            },
            {
              q: "Is it secure?",
              a: "Absolutely. Your data, resumes, and email credentials are encrypted.",
              icon: <Users className="text-red-400 mr-2" size={20} />
            },
            {
              q: "Can I customize emails?",
              a: "Yes! Use our editor to write or reuse title, body and attach specific resumes.",
              icon: <FileText className="text-blue-400 mr-2" size={20} />
            }
          ].map(({ q, a, icon }, idx) => (
            <div key={idx} className="bg-[#131824] p-6 rounded-lg border border-white/10">
              <div className="flex items-center text-lg font-semibold mb-2">
                {icon}
                <span>{q}</span>
              </div>
              <p className="text-gray-400">{a}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-32 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} ColdMailer. Built with 💙 to help job seekers.
      </div>
    </div>
  );
}
