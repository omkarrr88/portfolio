import { GraduationCap, Calendar, MapPin } from 'lucide-react';

export default function Education() {
  const education = [
    {
      degree: 'Bachelor of Engineering in Information Technology',
      institution: 'Terna Engineering College',
      location: 'Navi Mumbai, Maharashtra',
      period: 'November 2022 - June 2026',
      university: 'Mumbai University',
      description: 'Final year student specializing in software engineering, machine learning, and web technologies. Active participant in technical societies and leadership roles.',
    },
    {
      degree: 'Higher Secondary Education (CBSE)',
      institution: 'D.A.V. Public School',
      location: 'Airoli, Navi Mumbai',
      period: '2022',
      description: 'Completed higher secondary education with focus on science and mathematics.',
    },
    {
      degree: 'Secondary Education (CBSE)',
      institution: 'D.A.V. Public School',
      location: 'Airoli, Navi Mumbai',
      period: '2020',
      description: 'Completed secondary education with strong academic performance.',
    },
  ];

  return (
    <section id="education" className="py-20 px-6 bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Education
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-amber-600 rounded-full mx-auto" />
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {education.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 md:p-8 group hover:scale-[1.02]"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-teal-600 to-amber-600 rounded-lg text-white group-hover:scale-110 transition-transform flex-shrink-0">
                  <GraduationCap size={28} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {item.degree}
                  </h3>
                  <div className="flex flex-col gap-2 mb-4">
                    <p className="text-lg font-semibold text-teal-600">
                      {item.institution}
                    </p>
                    {item.university && (
                      <p className="text-sm text-slate-600 italic">
                        {item.university}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{item.period}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
