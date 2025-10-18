import { Languages as LanguagesIcon } from 'lucide-react';

export default function Languages() {
  const languages = [
    {
      name: 'English',
      proficiency: 'Fluent',
      level: 100,
      color: 'from-teal-600 to-amber-600',
    },
    {
      name: 'Hindi',
      proficiency: 'Fluent',
      level: 100,
      color: 'from-green-600 to-emerald-600',
    },
  ];

  return (
    <section id="languages" className="py-20 px-6 bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Languages
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-amber-600 rounded-full mx-auto" />
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 md:p-10">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-gradient-to-br from-teal-600 to-amber-600 rounded-full text-white">
                <LanguagesIcon size={40} />
              </div>
            </div>

            <div className="space-y-8">
              {languages.map((language, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {language.name}
                    </h3>
                    <span className="text-lg font-semibold text-teal-600">
                      {language.proficiency}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${language.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${language.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 text-center">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Proficient in both English and Hindi, enabling effective communication in diverse environments and multicultural settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
