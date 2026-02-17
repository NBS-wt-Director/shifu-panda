import HomeSocialButtons from './HomeSocialButtons';
import HomeContactForm  from '@/components/ui/HomeContactForm';
import styles from './HomeContacts.module.css';

interface Contacts {
  address: string;
  email: string;
  phone: string;
  social: Array<{id: string; title: string; url: string}>;
}

export default function HomeContacts({ contacts }: { contacts: Contacts }) {
  return (
    <section id="contacts" className={styles.contacts}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-2xl">
            Контакты
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Контактная информация */}
          <div className="lg:col-span-2 space-y-6">
            <a href="https://yandex.ru/maps/?profile=CPQK4QYu" target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
              <h3>📍 Адрес</h3>
              <p className="font-semibold">{contacts.address}</p>
            </a>
            
            <a href={`mailto:${contacts.email}`} className={styles.contactItem}>
              <h3>✉️ Email</h3>
              <p className="underline">{contacts.email}</p>
            </a>
            
            <a href={`tel:${contacts.phone.replace(/\D/g, '')}`} className={styles.contactItem}>
              <h3>📞 Телефон</h3>
              <p className="font-bold text-2xl">{contacts.phone}</p>
            </a>
          </div>

          {/* Карта */}
          <div className="lg:col-span-3 relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-700 to-gray-800 h-[400px]">
            <a href="https://yandex.ru/maps/?profile=CPQK4QYu" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://api-maps.yandex.ru/services/constructor/1.0/static/?um=constructor%3A2630c3036e9771a5f944cd6a91245b9db19c793cad92778467244ac6f382aec9&width=600&height=450&lang=ru_RU"
                alt="Карта до Шифу Панда"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </a>
          </div>
        </div>

        {/* Соцсети */}
        <div className="mt-20">
          <HomeSocialButtons social={contacts.social} />
        </div>
      </div>
    <div className="border-t border-white/10 pt-12 mt-16">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left">
            <p className="text-gray-400 text-lg font-medium">
              © 2026 <span className="font-black text-white">Шифу Панда</span>.Екатеринбург. Все права защищены. 
            </p>
            <div className="flex gap-4 text-gray-400 text-sm">
            </div>
          </div>
        </div>
      
    </section>
  );
}
