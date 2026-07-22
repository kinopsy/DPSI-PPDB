# SLB Monitoring — Sistem Monitoring Perkembangan Siswa Berkebutuhan Khusus

Aplikasi monitoring perkembangan siswa untuk **SLB Negeri Pembina Yogyakarta**. Dibangun dengan Flutter, mendukung platform **Web, Desktop (Windows), dan Android**.

## Daftar Isi

- [Fitur](#fitur)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Folder Structure](#folder-structure)
- [Architecture](#architecture)
- [Packages](#packages)
- [Routing](#routing)
- [Role-based Access](#role-based-access)
- [State Management](#state-management)
- [Repository Pattern](#repository-pattern)
- [How to Replace Mock Repository with API Repository](#how-to-replace-mock-repository-with-api-repository)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Fitur

| Role | Akses |
|------|-------|
| **ADMIN** | CRUD Guru, CRUD Siswa, CRUD Wali Murid |
| **GURU** | Input Perkembangan, Input Penilaian, Jurnal Harian, Monitoring Siswa, Riwayat Perkembangan, Panic Button |
| **WALI MURID** | Monitoring Siswa, Laporan Perkembangan |
| **SECURITY** | Panel Keamanan (alert dari panic button guru) |

### Seed Data (Mock)

| Entitas | Jumlah |
|---------|--------|
| Guru | 10 (GR-001 s/d GR-010) |
| Siswa | 19 (SIS-001 s/d SIS-019) dengan kategori SLB |
| Wali Murid | 15 (WM-001 s/d WM-015) |
| Security | 5 (SEC-001 s/d SEC-005) |
| Perkembangan | 63 record |
| Penilaian | 58 record |
| Jurnal | 30 record |

**Kredensial login:**
| ID | Password | Role |
|----|----------|------|
| `ADM-001` | `admin123` | ADMIN |
| `GR-001` | `guru123` | GURU |
| `WM-001` | `wali123` | WALI |
| `SEC-001` | `sec123` | SECURITY |

## Installation

### Prasyarat

- Flutter SDK **^3.11.4** ([download](https://docs.flutter.dev/get-started/install))
- Dart SDK (bundled with Flutter)
- Chrome (untuk Web) atau Windows SDK (untuk Desktop)

### Langkah

```bash
# 1. Clone repository
git clone <repository-url> slb_monitoring
cd slb_monitoring

# 2. Install dependencies
flutter pub get

# 3. Generate freezed & json_serializable code
dart run build_runner build --delete-conflicting-outputs

# 4. Jalankan di Web (default)
flutter run -d chrome

# 5. Atau di Windows Desktop
flutter run -d windows

# 6. Build production
flutter build web --release
```

## Folder Structure

```
slb_monitoring/
├── lib/
│   ├── main.dart                  # Entry point
│   ├── app.dart                   # Barrel exports
│   ├── core/
│   │   ├── constants/             # App & API constants
│   │   ├── di/
│   │   │   └── providers.dart     # Dependency injection (Riverpod providers)
│   │   ├── network/               # Dio HTTP client & endpoints
│   │   ├── router/
│   │   │   ├── app_router.dart    # GoRouter config + role redirects
│   │   │   └── route_names.dart   # Named route constants
│   │   ├── theme/                 # Colors, spacing, typography, theme
│   │   └── widgets/               # Shared widgets (sidebar, scaffold, buttons, tables, animations)
│   └── features/                  # Feature-first architecture
│       ├── auth/                  # Login, auth provider, user model
│       ├── dashboard/             # Dashboard page
│       ├── emergency/
│       │   ├── panic_button/      # Panic button provider
│       │   └── security_alert/    # Security panel page
│       ├── master_data/
│       │   ├── guru/              # CRUD guru
│       │   ├── siswa/             # CRUD siswa
│       │   └── wali_murid/        # CRUD wali murid
│       ├── monitoring/
│       │   ├── monitoring/        # Monitoring siswa page
│       │   ├── riwayat/           # Riwayat perkembangan page
│       │   └── laporan/           # Laporan perkembangan page
│       └── student_activity/
│           ├── perkembangan/      # Input perkembangan
│           ├── penilaian/         # Input penilaian
│           └── jurnal/            # Jurnal harian
├── test/
│   ├── auth/                      # Auth provider + login page tests
│   ├── helpers/                   # Fake repositories + TestApp harness
│   ├── master_data/               # CRUD + form validation tests
│   ├── navigation/                # Routing & auth guard tests
│   ├── providers/                 # Panic provider tests
│   └── widget_test.dart
├── web/                           # Web build output
└── pubspec.yaml
```

## Architecture

### Clean Architecture — Feature-First

Setiap fitur mengikuti pola 3-layer:

```
features/<feature>/
├── data/
│   ├── models/          # Freezed data classes + JSON serialization
│   └── repositories/    # Implementasi konkrit (saat ini: Mock)
├── domain/
│   └── repositories/    # Abstract interface (contract)
└── presentation/
    ├── pages/           # Widget halaman
    └── providers/       # Riverpod state providers
```

### Aliran Data

```
UI (Page)
  └─ watch() → Riverpod Provider
        └─ read() → Repository (abstract)
              └─ MockRepository / ApiRepository (concrete)
```

### Diagram Alur Login

```
LoginPage
  └─ authProvider.notifier.login(id, password)
        └─ AuthRepository.login(id, password)  →  UserModel
              └─ MockAuthRepository._users[]   →  validasi
        └─ state = AuthState(isAuthenticated: true, ...)
              └─ GoRouter redirect → /dashboard
```

## Packages

| Package | Versi | Fungsi |
|---------|-------|--------|
| `flutter_riverpod` | ^2.6.1 | State management & DI |
| `go_router` | ^14.8.1 | Routing dengan role-based redirect |
| `dio` | ^5.7.0 | HTTP client untuk API |
| `freezed_annotation` | ^2.4.4 | Immutable model classes |
| `json_annotation` | ^4.9.0 | JSON serialization |
| `flutter_secure_storage` | ^9.2.4 | Token storage |
| `intl` | ^0.20.2 | Date formatting |
| `web_socket_channel` | ^3.0.2 | Real-time monitoring (future) |
| `freezed` | ^2.5.7 | Code gen: freezed |
| `json_serializable` | ^6.9.4 | Code gen: JSON |
| `build_runner` | ^2.4.14 | Code generation runner |
| `flutter_lints` | ^6.0.0 | Linting rules |

## Routing

### Route Definitions

Semua route didefinisikan di `lib/core/router/app_router.dart` menggunakan **GoRouter**.

| Path | Nama | Role | Halaman |
|------|------|------|---------|
| `/login` | `login` | — | LoginPage |
| `/dashboard` | `dashboard` | Semua | DashboardPage |
| `/admin/master/guru` | `kelola-guru` | ADMIN | KelolaGuruPage |
| `/admin/master/siswa` | `kelola-siswa` | ADMIN | KelolaSiswaPage |
| `/admin/master/wali-murid` | `kelola-wali` | ADMIN | KelolaWaliPage |
| `/guru/pencatatan/perkembangan` | `input-perkembangan` | GURU | InputPerkembanganPage |
| `/guru/pencatatan/penilaian` | `input-penilaian` | GURU | InputPenilaianPage |
| `/guru/pencatatan/jurnal` | `jurnal-harian` | GURU | JurnalHarianPage |
| `/monitoring-siswa` | `monitoring-siswa` | GURU, WALI | MonitoringPage |
| `/guru/riwayat-perkembangan` | `riwayat-perkembangan` | GURU | RiwayatPerkembanganPage |
| `/wali/laporan-perkembangan` | `laporan-perkembangan` | WALI | LaporanPerkembanganPage |
| `/security/alert-panel` | `alert-panel` | SECURITY | SecurityAlertPage |

### Shell Route

Semua route kecuali `/login` menggunakan `ShellRoute` yang membungkus halaman dengan `AppScaffold` (sidebar + konten). Login page berada di luar shell.

### Animasi

Setiap transisi halaman menggunakan `CustomTransitionPage` dengan:
- **Fade** + **Slide** (0 → 0.03 offset)
- Durasi: 250ms forward, 150ms reverse
- `Curves.easeOut` untuk slide

### Auth Guard (Redirect)

```
GoRouter.redirect:
  if (!isLoggedIn && !isLoginRoute) → /login
  if (isLoggedIn && isLoginRoute)    → /dashboard
  if (/admin/* && role != ADMIN)     → /dashboard
  if (/guru/* && role != GURU)       → /dashboard
  if (/wali/... && role != WALI)      → /dashboard
  if (/security/... && role != SECURITY) → /dashboard
```

## Role-based Access

### ADMIN
- Sidebar: Master Data (Kelola Guru, Kelola Siswa, Kelola Wali Murid)
- Dashboard card: Kelola Guru, Kelola Siswa, Kelola Wali Murid

### GURU
- Sidebar: Pencatatan (Input Perkembangan, Input Penilaian, Jurnal Harian), Monitoring (Monitoring Siswa, Riwayat Perkembangan)
- Dashboard: Zona Darurat (Panic Button) + Akses Cepat (Input Perkembangan, Input Penilaian, Jurnal Harian, Monitoring Siswa)
- Dashboard: Input Perkembangan, Input Penilaian, Jurnal Harian, Monitoring Siswa

### WALI MURID
- Sidebar: Monitoring (Monitoring Siswa, Laporan Perkembangan)
- Dashboard: Monitoring Siswa, Laporan Perkembangan

### SECURITY
- Sidebar: Panel Alert
- Dashboard: Panel Keamanan

## State Management

Menggunakan **Riverpod** dengan dua pola utama:

### 1. `StateNotifierProvider` — Stateful logic

Digunakan untuk state yang kompleks dengan method async:

```dart
// auth_provider.dart
class AuthNotifier extends StateNotifier<AuthState> {
  Future<void> login(String username, String password) async {
    state = state.copyWith(isLoading: true);
    try {
      final user = await ref.read(authRepositoryProvider).login(username, password);
      state = AuthState(isAuthenticated: true, ...);
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>(...);
```

### 2. `FutureProvider` — Data fetching

Digunakan untuk list data dari repository:

```dart
final guruListProvider = FutureProvider<List<GuruModel>>((ref) async {
  final repo = ref.read(guruRepositoryProvider);
  return repo.getAll();
});
```

### 3. Invalidation Pattern

Setelah create/update/delete, form provider meng-invalidate list provider:

```dart
await repo.create(guru);
ref.invalidate(guruListProvider);  // Memuat ulang daftar
```

### 4. Freezed State

`AuthState` menggunakan `freezed` untuk immutable state dengan `copyWith`:

```dart
@freezed
class AuthState with _$AuthState {
  const factory AuthState({
    @Default(false) bool isAuthenticated,
    @Default('') String userId,
    @Default('') String name,
    @Default('') String role,
    @Default(false) bool isLoading,
    String? error,
    UserModel? user,
  }) = _AuthState;
}
```

## Repository Pattern

Setiap entitas memiliki:

```
domain/repositories/<entity>_repository.dart   → Abstract class (interface)
data/repositories/mock_<entity>_repository.dart → Implementasi Mock (saat ini aktif)
```

### Daftar Repository Interfaces

| Interface | Method |
|-----------|--------|
| `AuthRepository` | `login()`, `logout()`, `getCurrentUser()` |
| `GuruRepository` | `getAll()`, `getById()`, `create()`, `update()`, `delete()` |
| `SiswaRepository` | `getAll()`, `getById()`, `create()`, `update()`, `delete()`, `getByGuruId()` |
| `WaliMuridRepository` | `getAll()`, `getById()`, `create()`, `update()`, `delete()` |
| `PerkembanganRepository` | `getAll()`, `getBySiswaId()`, `create()`, `deleteBySiswaId()` |
| `PenilaianRepository` | `getAll()`, `getBySiswaId()`, `create()`, `deleteBySiswaId()` |
| `JurnalRepository` | `getAll()`, `getByGuruId()`, `create()` |

### Dependency Injection

Semua repository di-inject via `lib/core/di/providers.dart`:

```dart
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final storage = ref.watch(secureStorageProvider);
  return MockAuthRepository(storage);
});

final guruRepositoryProvider = Provider<GuruRepository>((ref) {
  return MockGuruRepository();
});
```

## How to Replace Mock Repository with API Repository

### 1. Buat class implementasi API

Buat file `data/repositories/api_<entity>_repository.dart`:

```dart
import 'package:dio/dio.dart';
import '../../domain/repositories/guru_repository.dart';
import '../../data/models/guru_model.dart';

class ApiGuruRepository implements GuruRepository {
  final Dio _dio;

  ApiGuruRepository(this._dio);

  @override
  Future<List<GuruModel>> getAll() async {
    final response = await _dio.get('/admin/guru');
    return (response.data as List)
        .map((json) => GuruModel.fromJson(json))
        .toList();
  }

  @override
  Future<GuruModel> create(GuruModel guru) async {
    final response = await _dio.post('/admin/guru', data: guru.toJson());
    return GuruModel.fromJson(response.data);
  }

  @override
  Future<GuruModel> update(GuruModel guru) async {
    await _dio.put('/admin/guru/${guru.idGuru}', data: guru.toJson());
    return guru;
  }

  @override
  Future<void> delete(String id) async {
    await _dio.delete('/admin/guru/$id');
  }

  @override
  Future<GuruModel?> getById(String id) async {
    final response = await _dio.get('/admin/guru/$id');
    return GuruModel.fromJson(response.data);
  }
}
```

### 2. Update DI Provider

Ubah `lib/core/di/providers.dart`:

```dart
import '../core/network/api_client.dart';

final apiClientProvider = Provider<ApiClient>((ref) {
  final storage = ref.watch(secureStorageProvider);
  return ApiClient(storage);
});

final guruRepositoryProvider = Provider<GuruRepository>((ref) {
  final client = ref.watch(apiClientProvider);
  return ApiGuruRepository(client.dio);
});
```

Ulangi untuk semua repository. Setelah perubahan, repository akan menggunakan API nyata tanpa perubahan kode di layer UI atau provider lain.

### 3. Endpoint yang Tersedia

Semua endpoint didefinisikan di `lib/core/network/api_endpoints.dart`:

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| POST | `/auth/login` | Login |
| GET | `/admin/guru` | List guru |
| POST | `/admin/guru` | Create guru |
| PUT | `/admin/guru/:id` | Update guru |
| DELETE | `/admin/guru/:id` | Delete guru |
| GET | `/admin/siswa` | List siswa |
| POST | `/admin/siswa` | Create siswa |
| PUT | `/admin/siswa/:id` | Update siswa |
| DELETE | `/admin/siswa/:id` | Delete siswa |
| GET | `/admin/wali-murid` | List wali murid |
| POST | `/pencatatan/perkembangan` | Create perkembangan |
| POST | `/pencatatan/penilaian` | Create penilaian |
| POST | `/pencatatan/jurnal` | Create jurnal |
| POST | `/emergency/panic` | Kirim panic alert |

## Testing

### Menjalankan Tes

```bash
flutter test
```

### Struktur Tes

```
test/
├── auth/
│   ├── auth_provider_test.dart     # 8 tests: login/logout state transitions
│   └── login_page_test.dart        # 9 tests: form validation, login flow
├── helpers/
│   ├── mocks.dart                  # Fake*Repository classes (in-memory)
│   └── test_helpers.dart           # TestApp harness & provider overrides
├── master_data/
│   ├── crud_guru_test.dart         # 9 tests: CRUD operations guru
│   └── form_validation_test.dart   # 7 tests: validation for guru/siswa/wali
├── navigation/
│   └── routing_test.dart           # 5 tests: auth guard, role redirects
├── providers/
│   └── panic_provider_test.dart    # 5 tests: panic state transitions
└── widget_test.dart                # 1 test: app bootstrap
```

**Total: 43 tests — semuanya passing.**

### Catatan Penting

- Tes menggunakan `Fake*Repository` (in-memory), bukan mock repository production, untuk menghindari dependency `flutter_secure_storage`.
- `TestHelpers.createApp()` membungkus `MaterialApp.router` dengan semua provider overrides.
- `TestHelpers.createContainer()` untuk provider-only tests tanpa widget tree.
- Login page tes navigasi menggunakan `testWidgets` untuk GoRouter yang membutuhkan widget tree.

## Deployment

### Web (Production)

```bash
# Build
flutter build web --release

# Output: build/web/
# Deploy seluruh folder build/web/ ke web server (nginx, Apache, dll.)
```

### Windows Desktop

```bash
# Build
flutter build windows --release

# Output: build/windows/x64/runner/Release/
# Jalankan slb_monitoring.exe
```

### Android

```bash
# Build APK
flutter build apk --release

# Output: build/app/outputs/flutter-apk/app-release.apk
```

### Konfigurasi API URL

Ubah `lib/core/constants/api_constants.dart`:

```dart
class ApiConstants {
  static const String baseUrl = 'https://api.slb-pembina-yogya.sch.id/api';
  // Ganti dengan URL server production
}
```

## Troubleshooting

### `flutter run` gagal di Web

```
Error: Could not find Chrome
```

Install Google Chrome atau jalankan dengan:
```bash
flutter run -d web-server
```

### Code generation error

```bash
# Hapus cache dan regenerate
dart run build_runner clean
dart run build_runner build --delete-conflicting-outputs
```

### `flutter analyze` error

Pastikan semua import menggunakan **package path**, bukan relative path:

```dart
// ✅ Benar
import 'package:slb_monitoring/core/theme/app_colors.dart';

// ❌ Salah
import '../../../../core/theme/app_colors.dart';
```

### RenderFlex overflow pada test

Jika test gagal dengan `A RenderFlex overflowed...`, tingkatkan ukuran surface test:

```dart
testWidgets('test name', (WidgetTester tester) async {
  tester.view.setPhysicalSize(const Size(1920, 1080));
  addTearDown(() => tester.view.resetPhysicalSize());
  // ...
});
```

### Flutter Secure Storage di Web

`flutter_secure_storage` memiliki keterbatasan di Web. Pastikan menggunakan `libsqlite3` atau `flutter_secure_storage_web` sebagai fallback. Saat ini repository mock tidak menggunakannya.

### GoRouter state null

`router.state` dapat mengembalikan `null` jika router belum selesai inisialisasi. Gunakan `testWidgets` (bukan `ProviderContainer.read`) untuk routing test.

## Lisensi

Hak cipta © 2026 SLB Negeri Pembina Yogyakarta.
