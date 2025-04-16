# UVW Mühendislik Görev Yönetimi Sistemi - Backend

Bu proje, UVW Mühendislik için geliştirilmiş görev yönetimi sisteminin backend kısmıdır. API hizmetleri, veritabanı işlemleri ve kullanıcı kimlik doğrulama işlevlerini sağlar.

## Canlı Demo

Backend API'si şu adreste çalışmaktadır: [https://backend-fv1y.onrender.com/api](https://backend-fv1y.onrender.com/api)

## Kullanılan Teknolojiler

- **Node.js**: Sunucu tarafı JavaScript runtime
- **Express.js**: Web API framework
- **MongoDB**: NoSQL veritabanı
- **Mongoose**: MongoDB nesne modelleme aracı
- **JWT (JSON Web Token)**: Kullanıcı kimlik doğrulaması için
- **bcryptjs**: Şifre hash'leme
- **CORS**: Cross-Origin Resource Sharing desteği
- **dotenv**: Ortam değişkenleri için

## Mimari Yapı

Proje, modern bir katmanlı mimariye sahiptir:

- **Routes**: HTTP isteklerini ilgili controller'lara yönlendirir
- **Controllers**: İş mantığını yönetir ve servisleri kullanır
- **Services**: Temel veri işlemleri ve iş mantığı
- **Models**: Veri modelleri ve şemaları
- **Middleware**: Kimlik doğrulama, hata işleme ve role kontrolü
- **Config**: Uygulama yapılandırması
- **Utils**: Yardımcı fonksiyonlar

```ascii
├── app.js               # Ana uygulama dosyası
├── server.js            # Sunucu başlatma
├── routes/              # API rotaları
│   ├── authRoutes.js
│   ├── projectRoutes.js
│   └── taskRoutes.js
├── controllers/         # İstek işleyicileri
│   ├── authController.js
│   ├── projectController.js
│   └── taskController.js
├── services/            # İş mantığı
│   ├── authService.js
│   └── ...
├── models/              # Veri modelleri
│   ├── User.js
│   ├── Project.js
│   └── Task.js
├── middleware/          # Ara yazılımlar
│   ├── auth.js
│   └── roleCheck.js
└── config/              # Yapılandırma
    ├── db.js
    └── seeder.js
```

## API Endpoints

### Kimlik Doğrulama

- **POST /api/auth/register**: Yeni kullanıcı kaydı
- **POST /api/auth/login**: Kullanıcı girişi
- **GET /api/auth/me**: Mevcut kullanıcı bilgilerini getir
- **GET /api/auth/users**: Tüm kullanıcıları getir (Admin)

### Projeler

- **GET /api/projects**: Tüm projeleri getir
- **POST /api/projects**: Yeni proje oluştur
- **GET /api/projects/:id**: Belirli bir projeyi getir
- **PUT /api/projects/:id**: Proje güncelle
- **DELETE /api/projects/:id**: Proje sil

### Görevler

- **GET /api/projects/:projectId/tasks**: Bir projenin tüm görevlerini getir
- **POST /api/projects/:projectId/tasks**: Yeni görev oluştur
- **GET /api/projects/:projectId/tasks/:id**: Belirli bir görevi getir
- **PUT /api/projects/:projectId/tasks/:id**: Görev güncelle
- **DELETE /api/projects/:projectId/tasks/:id**: Görev sil

## Kurulum

1. Repository'yi klonlayın:
   ```
   git clone <repo-url>
   cd uvw/backend
   ```

2. Bağımlılıkları yükleyin:
   ```
   npm install
   ```

3. `.env` dosyasını oluşturun:
   ```
   PORT=8080
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:3001
   ```

4. Sunucuyu başlatın:
   ```
   npm run dev
   ```

## Test Kullanıcıları

Sistem, aşağıdaki test kullanıcılarıyla birlikte gelir:

- **Admin**: admin@mail.com / adminpass
- **Manager**: manager@mail.com / managerpass
- **Developer 1**: dev1@mail.com / dev1pass
- **Developer 2**: dev2@mail.com / dev2pass
- **Developer 3**: dev3@mail.com / dev3pass

## Rol Temelli Erişim Kontrolü

Sistem üç farklı kullanıcı rolüne sahiptir:

- **Admin**: Tam yetki (kullanıcı yönetimi dahil)
- **Manager**: Proje ve görev oluşturma, düzenleme
- **Developer**: Kendisine atanmış görevleri görüntüleme ve güncelleme

## Ek Özellikler

- **Otomatik Veritabanı Seeding**: İlk başlatmada test verileri otomatik olarak yüklenir
- **JWT Kimlik Doğrulama**: Güvenli API erişimi için JWT tabanlı kimlik doğrulama
- **Rol Tabanlı Erişim Kontrolü**: Farklı kullanıcı rolleri için özelleştirilmiş erişim hakları
- **Hata İşleme**: Kapsamlı hata yakalama ve raporlama

## Mimari Diyagram

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │      │    API      │      │  Database   │
│  (Frontend) │<─────│  (Express)  │<─────│  (MongoDB)  │
└─────────────┘      └─────────────┘      └─────────────┘
                           │
                           ▼
         ┌─────────────────────────────────┐
         │           Middleware            │
         │ (Auth, Error Handling, CORS)    │
         └─────────────────────────────────┘
                           │
                           ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Routes    │      │ Controllers │      │  Services   │
└─────────────┘─────>└─────────────┘─────>└─────────────┘
                                                │
                                                ▼
                                          ┌─────────────┐
                                          │   Models    │
                                          └─────────────┘
``` 