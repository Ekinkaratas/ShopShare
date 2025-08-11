🛒 ShopShare
ShopShare, kullanıcıların alışveriş listelerini kolayca oluşturabileceği, düzenleyebileceği ve diğer kullanıcılarla gerçek zamanlı olarak paylaşabileceği, React Native ile geliştirilmiş modern bir mobil uygulamadır.

🚀 Özellikler
Kullanıcı Kayıt & Giriş: Firebase Authentication ile güvenli oturum yönetimi.

Gerçek Zamanlı Senkronizasyon: Cloud Firestore sayesinde veriler anında güncellenir.

Liste Paylaşma: Arkadaşlarınızla veya ailenizle ortak listeler oluşturabilir ve yönetebilirsiniz.

Global State Yönetimi: Redux Toolkit ile performanslı ve ölçeklenebilir state yönetimi.

Modern UI & Animasyonlar: React Native Paper ve Reanimated kullanılarak şık bir kullanıcı arayüzü ve akıcı animasyonlar.

Responsive Tasarım: Hem iOS hem de Android cihazlarda sorunsuz bir deneyim sunar.

🛠 Kullanılan Teknolojiler
React Native

Redux Toolkit

Firebase Authentication & Cloud Firestore

React Navigation

React Native Paper

React Native Reanimated

📦 Kurulum
Projeyi yerel makinenize kurmak için aşağıdaki adımları izleyin.

1. Depoyu Klonlayın
Bash

git clone https://github.com/Ekinkaratas/ShopShare.git
cd ShopShare
2. Bağımlılıkları Yükleyin
Bash

npm install
3. Firebase Yapılandırmasını Ekleyin
Firebase projenizin yapılandırma bilgilerini bir .env dosyasına ekleyin. Bu proje react-native-dotenv paketini kullandığı için, yapılandırmayı .env dosyasından çağırabilirsiniz.

4. Uygulamayı Başlatın
Bash

npx expo start
🏗 Proje Mimarisi
src/
├── components/          # Ortak ve tekrar kullanılabilir UI bileşenleri
├── navigation/          # React Navigation ile oluşturulan navigasyon yapısı
├── redux/               # Redux Toolkit ile oluşturulan global state yönetimi (slices)
├── screens/             # Uygulama ekranları
└── config/              # Firebase ve diğer temel konfigürasyon dosyaları

📌 Yol Haritası
Gelecek planlanan özellikler ve iyileştirmeler:

Push bildirimleri eklenmesi.

Offline mod desteği.

Tema seçeneği (koyu/açık mod).

Liste kategorileri ekleme.

🤝 Katkıda Bulunma
Katkılarınız her zaman açığız! Projeye katkıda bulunmak isterseniz aşağıdaki adımları takip edebilirsiniz:

Bu depoyu (repository) kendi hesabınıza fork'layın.

Yeni bir özellik için branch oluşturun (git checkout -b feature/yeni-ozellik).

Değişikliklerinizi commit'leyin (git commit -m 'feat: yeni ozellik eklendi').

Branch'inizi push'layın (git push origin feature/yeni-ozellik).

Bir Pull Request (Çekme İsteği) açın.

📄 Lisans
Bu proje MIT lisansı ile lisanslanmıştır. Daha fazla bilgi için LICENSE dosyasına bakabilirsiniz.