import { type FC } from 'react';

interface ScheduleSectionProps {
  scheduleImages: string[];
}

const ScheduleSection: FC<ScheduleSectionProps> = ({ scheduleImages }) => {
  return (
    <section id="schedule" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Расписание занятий
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Актуальное расписание на февраль 2026
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {scheduleImages.map((image, index) => (
            <img key={index} src={image} alt={`Расписание ${index + 1}`} className="rounded-3xl shadow-2xl w-full h-[500px] object-cover" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
