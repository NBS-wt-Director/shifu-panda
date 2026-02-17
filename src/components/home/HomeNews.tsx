'use client';
import Image from 'next/image';
import styles from './HomeNews.module.css';

interface NewsItem {
  id: number;
  image: string;
  title:string,
  text: string;
  description: string;
}

interface HomeNewsProps {
  news: NewsItem[];
  openImageModal: (url: string, alt: string) => void;
}

export default function HomeNews({
  news = [],
  openImageModal
}: HomeNewsProps) {
  const safeNews: NewsItem[] = Array.isArray(news) ? news : [];

  return (
    <section id="news" className={styles.news}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl md:text-6xl font-black text-center mb-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-2xl">
         Наши события. 
        </h2>
        
        {safeNews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safeNews.map((item: NewsItem) => (
              <div key={item.id} className="group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                <div 
                  className="w-full h-96 bg-gray-100 rounded-br-[1%] overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 relative"
                  onClick={() => openImageModal(item.image, item.text)}
                >
                  <Image
                    src={item.image}
                    alt={item.text}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-4 leading-relaxed text-lg">
                    {item.text}
                  </p>
                  {/* ✅ ТЕКСТ ПОД ЗАГОЛОВКОМ ВЕРНУТ */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">Новостей пока нет</p>
          </div>
        )}
      </div>
    </section>
  );
}
