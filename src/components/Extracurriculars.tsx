import { Users, Sparkles, Briefcase } from 'lucide-react';

export default function Extracurriculars() {
  const activities = [
    {
      icon: Users,
      title: 'Computer Society of India (CSI)',
      role: 'Vice Chairperson',
      description: 'Leading technical initiatives, organizing workshops, coding competitions, and fostering a collaborative learning environment for students interested in technology.',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      icon: Briefcase,
      title: 'Training & Placement Cell',
      role: 'Deputy Secretary',
      description: 'Bridging the gap between industry and academia by organizing placement drives, training sessions, and career development workshops for students.',
      color: 'from-green-600 to-emerald-600',
    },
    {
      icon: Sparkles,
      title: 'Revive Cultural Fest',
      role: 'Hospitality Head',
      description: 'Managing hospitality operations for the annual cultural festival, coordinating with teams to ensure a memorable experience for all participants and guests.',
      color: 'from-orange-600 to-red-600',
    },
  ];

  return (
    <section id="extracurriculars" className="py-20 px-6 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Extracurricular Activities
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 group hover:scale-105"
            >
              <div className={`inline-flex p-4 bg-gradient-to-br ${activity.color} rounded-lg text-white mb-4 group-hover:scale-110 transition-transform`}>
                <activity.icon size={32} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {activity.title}
              </h3>

              <p className="text-blue-600 font-semibold mb-3">
                {activity.role}
              </p>

              <p className="text-slate-700 leading-relaxed">
                {activity.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-3xl mx-auto text-center">
          <p className="text-lg text-slate-700 leading-relaxed">
            Beyond academics, I actively participate in various campus organizations and events. These experiences have helped me develop strong leadership, communication, and organizational skills while contributing to a vibrant campus community.
          </p>
        </div>
      </div>
    </section>
  );
}
