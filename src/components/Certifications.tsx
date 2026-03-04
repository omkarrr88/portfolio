import { Award, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Certifications() {
  const certifications = [
    {
      title: 'Generative AI Mastermind',
      issuer: 'Outskill',
      year: '2025',
      description: 'Comprehensive certification covering Generative AI technologies and applications.',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      title: 'Google Cloud Skills Boost Arcade',
      issuer: 'Google Cloud',
      year: '2024',
      description: 'Completed multiple hands-on labs and challenges in Google Cloud Platform services and technologies.',
      color: 'from-teal-600 to-amber-600',
    },
    {
      title: 'Oracle Cloud Infrastructure',
      issuer: 'Oracle',
      year: '2023',
      description: 'Comprehensive certification covering Oracle Cloud Infrastructure services, architecture, and best practices.',
      color: 'from-red-600 to-orange-600',
    },
  ];

  return (
    <section id="certifications" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Certifications & Awards
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-amber-600 rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {certifications.map((cert, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.4, delay: index * 0.1 }}
              key={index}
              className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 group hover:scale-105"
            >
              <div className={`inline-flex p-4 bg-gradient-to-br ${cert.color} rounded-lg text-white mb-4 group-hover:scale-110 transition-transform`}>
                <Award size={32} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {cert.title}
              </h3>

              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold mb-3">
                <span>{cert.issuer}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-4">
                <Calendar size={16} />
                <span>{cert.year}</span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {cert.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
