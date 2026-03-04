import { Heart, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent mb-4">
              Omkar Kadam
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Full Stack Machine Learning Developer passionate about creating innovative solutions and driving technological advancement.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-4 text-center md:text-left">Quick Links</h4>
            <ul className="space-y-2 flex flex-col items-center md:items-start">
              {['About', 'Education', 'Skills', 'Projects', 'Experience', 'Extracurriculars', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      const element = document.getElementById(item.toLowerCase());
                      if (element) {
                        const offset = 80;
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                      }
                    }}
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex gap-4 mb-4 justify-center md:justify-start">
              <a
                href="https://linkedin.com/in/omkarrrr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800 rounded-full hover:bg-teal-600 transition-all hover:scale-110"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://github.com/omkarrr88"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 transition-all hover:scale-110"
              >
                <Github size={20} />
              </a>
              <a
                href="mailto:omkark2223@ternaengg.ac.in"
                className="p-3 bg-slate-800 rounded-full hover:bg-red-600 transition-all hover:scale-110"
              >
                <Mail size={20} />
              </a>
            </div>
            <p className="text-slate-400 text-sm">
              <a href="mailto:omkark2223@ternaengg.ac.in" className="hover:text-blue-400 transition-colors">
                omkark2223@ternaengg.ac.in
              </a>
            </p>
            <p className="text-slate-400 text-sm">
              +91 9987703661
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-400 flex items-center justify-center gap-2 flex-wrap">
            <span>&copy; {currentYear} Omkar Kadam. All rights reserved.</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1">
              Made with <Heart size={16} className="text-red-500 animate-pulse" /> and passion
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
