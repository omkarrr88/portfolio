import { Briefcase, Calendar, MapPin, TrendingUp } from 'lucide-react';

export default function Experience() {
  const experiences = [
    {
      role: 'Vice Chairperson',
      organization: 'Computer Society of India (CSI)',
      location: 'Terna Engineering College',
      period: '2024 - 2025',
      description: 'Leading technical events, workshops, and student engagement initiatives at the Computer Society of India. Organizing coding competitions, seminars, and industry interaction sessions to foster learning and skill development among students.',
      achievements: [
        'Organized multiple technical workshops and coding competitions with 200+ participants',
        'Increased student participation in CSI activities by 40% through innovative engagement strategies',
        'Coordinated industry expert sessions and guest lectures from leading tech companies',
        'Led a team of 15+ committee members in executing technical and cultural events',
      ],
      color: 'from-teal-600 to-cyan-600',
    },
    {
      role: 'Deputy Secretary',
      organization: 'Training & Placement Cell',
      location: 'Terna Engineering College',
      period: '2024 - 2025',
      description: 'Managing placement readiness initiatives and serving as a liaison between campus and industry. Coordinating recruitment drives, organizing pre-placement training, and assisting students with career guidance and professional development.',
      achievements: [
        'Coordinated campus recruitment drives with 25+ companies across IT and core sectors',
        'Conducted resume building and interview preparation workshops for 300+ students',
        'Maintained strong industry-campus relationships resulting in increased placement opportunities',
        'Assisted in achieving a 15% improvement in placement statistics',
      ],
      color: 'from-amber-600 to-orange-600',
    },
    {
      role: 'Hospitality Head',
      organization: 'Revive Cultural Fest',
      location: 'Terna Engineering College',
      period: '2025',
      description: 'Led hospitality operations for the college\'s annual cultural festival, managing logistics for high-profile guests, coordinating accommodation, and ensuring smooth event execution. Responsible for creating a welcoming environment for all participants.',
      achievements: [
        'Successfully managed hospitality for 500+ attendees including VIP guests and performers',
        'Coordinated with vendors and external stakeholders for seamless service delivery',
        'Ensured exceptional experience for high-profile guests resulting in positive feedback',
        'Led a team of 20+ volunteers in executing hospitality operations',
      ],
      color: 'from-rose-600 to-pink-600',
    },
  ];

  return (
    <section id="experience" className="py-20 px-6 bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Leadership & Experience
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-amber-600 rounded-full mx-auto" />
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-3xl mx-auto">
            Demonstrated leadership across technical, placement, and cultural initiatives, driving innovation and fostering collaborative growth
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 md:p-8 group hover:scale-[1.02]"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 bg-gradient-to-br ${exp.color} rounded-lg text-white group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <Briefcase size={28} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {exp.role}
                      </h3>
                      <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                        {exp.organization}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                      <TrendingUp size={18} />
                      <span>Key Achievements</span>
                    </div>
                    <ul className="space-y-2 ml-6">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li
                          key={achIndex}
                          className="text-slate-700 dark:text-slate-300 flex items-start gap-2"
                        >
                          <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
