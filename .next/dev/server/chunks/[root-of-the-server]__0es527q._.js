module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectToDatabase",
    ()=>connectToDatabase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongodb$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs, [project]/node_modules/mongodb)");
;
const MONGODB_URI = process.env.MONGODB_URI;
let cachedClient = null;
let cachedDb = null;
async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return {
            client: cachedClient,
            db: cachedDb
        };
    }
    const client = await __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongodb$29$__["MongoClient"].connect(MONGODB_URI, {
        tls: true,
        tlsInsecure: true
    });
    const db = client.db();
    cachedClient = client;
    cachedDb = db;
    return {
        client,
        db
    };
}
}),
"[project]/src/app/api/seed/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mongodb.ts [app-route] (ecmascript)");
;
;
const SEED_DATA = {
    users: [
        {
            id: 'u001',
            name: 'Ahmad Fauzi',
            email: 'ahmad@demo.com',
            password: '123456',
            role: 'pendaftar'
        },
        {
            id: 'u002',
            name: 'Panitia Admin',
            email: 'panitia@demo.com',
            password: '123456',
            role: 'panitia'
        },
        {
            id: 'u003',
            name: 'Bendahara Utama',
            email: 'bendahara@demo.com',
            password: '123456',
            role: 'bendahara'
        },
        {
            id: 'u004',
            name: 'Kepala Sekolah',
            email: 'kepsek@demo.com',
            password: '123456',
            role: 'kepsek'
        }
    ],
    students: [
        {
            id: 's001',
            user_id: 'u001',
            nisn: '0081234567',
            name: 'Ahmad Fauzi',
            nik: '3201234567890001',
            tempat_lahir: 'Jakarta',
            tanggal_lahir: '2008-05-15',
            jenis_kelamin: 'Laki-laki',
            agama: 'Islam',
            alamat: 'Jl. Sudirman No. 12, Jakarta Selatan',
            telepon: '081234567890',
            asal_sekolah: 'SMP Negeri 1 Jakarta',
            pendaftaran_status: 'terverifikasi'
        },
        {
            id: 's002',
            user_id: null,
            nisn: '0087654321',
            name: 'Siti Nurhaliza',
            nik: '3201987654321002',
            tempat_lahir: 'Bandung',
            tanggal_lahir: '2008-08-20',
            jenis_kelamin: 'Perempuan',
            agama: 'Islam',
            alamat: 'Jl. Merdeka No. 45, Bandung',
            telepon: '085678901234',
            asal_sekolah: 'SMP Negeri 3 Bandung',
            pendaftaran_status: 'menunggu_verifikasi'
        },
        {
            id: 's003',
            user_id: null,
            nisn: '0081112223',
            name: 'Budi Santoso',
            nik: '3201112223334003',
            tempat_lahir: 'Surabaya',
            tanggal_lahir: '2008-03-10',
            jenis_kelamin: 'Laki-laki',
            agama: 'Kristen',
            alamat: 'Jl. Pemuda No. 88, Surabaya',
            telepon: '087890123456',
            asal_sekolah: 'SMP Negeri 5 Surabaya',
            pendaftaran_status: 'lulus'
        },
        {
            id: 's004',
            user_id: null,
            nisn: '0084445556',
            name: 'Dewi Lestari',
            nik: '3201444555666004',
            tempat_lahir: 'Yogyakarta',
            tanggal_lahir: '2008-11-25',
            jenis_kelamin: 'Perempuan',
            agama: 'Hindu',
            alamat: 'Jl. Malioboro No. 10, Yogyakarta',
            telepon: '081223344556',
            asal_sekolah: 'SMP Negeri 2 Yogyakarta',
            pendaftaran_status: 'belum_lengkap'
        }
    ],
    documents: [
        {
            id: 'd001',
            student_id: 's001',
            file_type: 'kk',
            file_path: 'kk_ahmad.pdf',
            verification_status: 'disetujui',
            rejection_note: null
        },
        {
            id: 'd002',
            student_id: 's001',
            file_type: 'akta',
            file_path: 'akta_ahmad.pdf',
            verification_status: 'disetujui',
            rejection_note: null
        },
        {
            id: 'd003',
            student_id: 's002',
            file_type: 'kk',
            file_path: 'kk_siti.pdf',
            verification_status: 'menunggu',
            rejection_note: null
        },
        {
            id: 'd004',
            student_id: 's002',
            file_type: 'akta',
            file_path: 'akta_siti.pdf',
            verification_status: 'ditolak',
            rejection_note: 'Foto akta tidak jelas, mohon upload ulang'
        },
        {
            id: 'd005',
            student_id: 's004',
            file_type: 'kk',
            file_path: 'kk_dewi.pdf',
            verification_status: 'menunggu',
            rejection_note: null
        }
    ],
    payments: [
        {
            id: 'p001',
            student_id: 's001',
            proof_file_path: 'bukti_ahmad.jpg',
            payment_status: 'lunas',
            verified_at: '2026-06-20T10:00:00'
        },
        {
            id: 'p002',
            student_id: 's002',
            proof_file_path: 'bukti_siti.jpg',
            payment_status: 'pending',
            verified_at: null
        },
        {
            id: 'p003',
            student_id: 's003',
            proof_file_path: 'bukti_budi.jpg',
            payment_status: 'lunas',
            verified_at: '2026-06-18T14:30:00'
        }
    ],
    quotas: [
        {
            id: 'q001',
            program: 'Kelas A',
            max_quota: 120,
            current_count: 85,
            deadline: '2026-07-31'
        },
        {
            id: 'q002',
            program: 'Kelas B',
            max_quota: 80,
            current_count: 52,
            deadline: '2026-07-31'
        },
        {
            id: 'q003',
            program: 'Kelas C',
            max_quota: 40,
            current_count: 18,
            deadline: '2026-07-31'
        }
    ],
    tariffs: [
        {
            id: 't001',
            component: 'SPP Bulanan',
            amount: 350000,
            description: 'Biaya SPP per bulan'
        },
        {
            id: 't002',
            component: 'Biaya Pendaftaran',
            amount: 250000,
            description: 'Biaya pendaftaran PPDB'
        },
        {
            id: 't003',
            component: 'Biaya Seragam',
            amount: 500000,
            description: 'Paket seragam lengkap'
        },
        {
            id: 't004',
            component: 'Biaya Praktikum',
            amount: 200000,
            description: 'Biaya laboratorium per semester'
        }
    ],
    announcements: [
        {
            id: 'a001',
            title: 'Pengumuman Kelulusan PPDB 2026',
            content: 'Selamat kepada seluruh siswa yang dinyatakan lulus. Silakan melakukan daftar ulang.',
            date: '2026-06-28',
            published: true
        },
        {
            id: 'a002',
            title: 'Perpanjangan Waktu Pendaftaran',
            content: 'Batas waktu pendaftaran diperpanjang hingga 31 Juli 2026.',
            date: '2026-06-25',
            published: true
        }
    ],
    auditLogs: [
        {
            id: 'l001',
            action: 'Pembayaran Diverifikasi',
            student: 'Ahmad Fauzi',
            amount: 'Rp 250.000',
            date: '2026-06-20 10:00',
            officer: 'Bendahara Utama'
        },
        {
            id: 'l002',
            action: 'Pembayaran Diverifikasi',
            student: 'Budi Santoso',
            amount: 'Rp 250.000',
            date: '2026-06-18 14:30',
            officer: 'Bendahara Utama'
        },
        {
            id: 'l003',
            action: 'Tarif Diubah',
            student: '-',
            amount: 'SPP: Rp 350.000',
            date: '2026-06-15 09:00',
            officer: 'Bendahara Utama'
        }
    ]
};
async function POST(req) {
    try {
        const { db } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        const collections = Object.keys(SEED_DATA);
        for (const col of collections){
            await db.collection(col).deleteMany({});
            await db.collection(col).insertMany(SEED_DATA[col]);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Database seeded successfully'
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: String(error)
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0es527q._.js.map