import { Code, Lightbulb, Users, Award } from 'lucide-react';

export default function About() {
  const highlights = [
    {
      icon: Code,
      title: 'Full Stack Developer',
      description: 'Expertise in building end-to-end web applications with modern technologies',
    },
    {
      icon: Lightbulb,
      title: 'ML Enthusiast',
      description: 'Passionate about machine learning, NLP, and deep learning applications',
    },
    {
      icon: Users,
      title: 'Team Leader',
      description: 'Leading technical and cultural initiatives at Terna Engineering College',
    },
    {
      icon: Award,
      title: 'Certified Professional',
      description: 'Multiple certifications in cloud computing and emerging technologies',
    },
  ];

  return (
    <section id="about" className="py-20 px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            About Me
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-amber-600 rounded-full mx-auto" />
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed text-center">
            I am an aspiring Full Stack Machine Learning Developer and proactive leader, currently pursuing my final year of Information Technology Engineering at Terna Engineering College, Mumbai University. With a strong foundation in Python, Java, and web development, I bring hands-on experience in building innovative solutions that bridge software engineering and artificial intelligence.
          </p>

          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed text-center">
            Beyond coding, I actively lead and organize technical, cultural, and placement activities on campus. As Vice Chairperson of the Computer Society of India (CSI) and Deputy Secretary of the Training & Placement Cell, I drive innovation and help fellow students reach their potential. My goal is to create impactful technology solutions while fostering a collaborative learning environment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-teal-600 to-amber-600 rounded-lg text-white group-hover:scale-110 transition-transform">
                    <item.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
