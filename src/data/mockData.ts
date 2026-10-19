import {
  Branch, Course, Room, Group, Student, AttendanceRecord,
  Homework, HomeworkSubmission, Lead, Contract, PaymentTransaction,
  CashRegister, Expense, TeacherSalary, StaffMember, StaffTask, AuditLog, SupportTicket
} from '../types';

export const initialBranches: Branch[] = [
  {
    id: 'br-1',
    name: 'Toshkent Bosh filiali (Amir Temur)',
    address: 'Toshkent sh., Yunusobod t., Amir Temur shoh ko‘chasi, 107B',
    phone: '+998 (71) 200-45-00',
    managerName: 'Farhod Qodirov',
    activeStudentsCount: 384,
    roomsCount: 8,
    monthlyRevenue: 285400000
  },
  {
    id: 'br-2',
    name: 'Chilonzor filiali',
    address: 'Toshkent sh., Chilonzor t., Qatortol ko‘chasi, 24',
    phone: '+998 (71) 200-45-02',
    managerName: 'Dilnoza Karimova',
    activeStudentsCount: 246,
    roomsCount: 6,
    monthlyRevenue: 182300000
  },
  {
    id: 'br-3',
    name: 'Samarqand filiali (Registon)',
    address: 'Samarqand sh., Dahbed ko‘chasi, 12-uy',
    phone: '+998 (66) 233-10-20',
    managerName: 'Jasur Bekmurodov',
    activeStudentsCount: 195,
    roomsCount: 5,
    monthlyRevenue: 134800000
  }
];

export const initialCourses: Course[] = [
  {
    id: 'crs-1',
    title: 'Frontend Web Dasturlash (React & Next.js)',
    subject: 'IT & Dasturlash',
    durationMonths: 6,
    pricePerMonth: 1200000,
    description: 'HTML, CSS, JavaScript, TypeScript, React, Tailwind CSS va real loyihalar yaratish.',
    level: 'Beginner',
    branchIds: ['br-1', 'br-2', 'br-3']
  },
  {
    id: 'crs-2',
    title: 'Python Backend & Sun’iy Intellekt',
    subject: 'IT & Dasturlash',
    durationMonths: 7,
    pricePerMonth: 1300000,
    description: 'Python, Django REST, PostgreSQL, Docker, FastAPI va AI integratsiyalari.',
    level: 'Intermediate',
    branchIds: ['br-1', 'br-2']
  },
  {
    id: 'crs-3',
    title: 'IELTS Intensive 7.5+',
    subject: 'Xorijiy tillar',
    durationMonths: 4,
    pricePerMonth: 950000,
    description: 'IELTS imtihoniga to‘liq tayyorgarlik: Writing, Reading, Speaking va Listening.',
    level: 'Advanced',
    branchIds: ['br-1', 'br-2', 'br-3']
  },
  {
    id: 'crs-4',
    title: 'General English (B1 - B2 daraja)',
    subject: 'Xorijiy tillar',
    durationMonths: 6,
    pricePerMonth: 750000,
    description: 'Grammatika, so‘z boyligi va erkin so‘zlashuv ko‘nikmalarini shakllantirish.',
    level: 'Intermediate',
    branchIds: ['br-1', 'br-2', 'br-3']
  },
  {
    id: 'crs-5',
    title: 'Grafik Dizayn & UI/UX (Figma & Adobe)',
    subject: 'Dizayn',
    durationMonths: 5,
    pricePerMonth: 1100000,
    description: 'Figma, Illustrator, Photoshop, brending, veb va mobil ilovalar dizayni.',
    level: 'All levels',
    branchIds: ['br-1', 'br-2']
  },
  {
    id: 'crs-6',
    title: 'Mental Arifmetika & Tez O‘qish',
    subject: 'Bolalar akademiyasi',
    durationMonths: 6,
    pricePerMonth: 600000,
    description: '6-12 yoshli bolalar uchun miya faoliyatini rivojlantirish va xotirani kuchaytirish.',
    level: 'Beginner',
    branchIds: ['br-1', 'br-3']
  }
];

export const initialRooms: Room[] = [
  { id: 'rm-101', branchId: 'br-1', name: 'Smart Auditorium 101', capacity: 20, equipment: ['Proyektor', 'Smart Doska', 'Konditsioner'] },
  { id: 'rm-102', branchId: 'br-1', name: 'Coding Lab 102', capacity: 18, equipment: ['iMac Kompyuterlar', 'Optik Internet', 'Monitorlar'] },
  { id: 'rm-103', branchId: 'br-1', name: 'Language Room 103', capacity: 16, equipment: ['Akustika tizimi', 'Smart TV'] },
  { id: 'rm-201', branchId: 'br-2', name: 'Chilonzor Lab 201', capacity: 16, equipment: ['Kompyuterlar', 'Proyektor'] },
  { id: 'rm-202', branchId: 'br-2', name: 'English Room 202', capacity: 15, equipment: ['Whiteboard', 'Konditsioner'] },
  { id: 'rm-301', branchId: 'br-3', name: 'Registon Zali 301', capacity: 22, equipment: ['Smart TV', 'Konditsioner'] }
];

export const initialStaff: StaffMember[] = [
  {
    id: 'stf-1',
    fullName: 'Farhod Qodirov',
    phone: '+998 (90) 123-45-01',
    email: 'farhod@eduverse.uz',
    role: 'super_admin',
    branchId: 'br-1',
    salaryType: 'fixed',
    salaryRate: 15000000,
    status: 'active',
    joinedDate: '2023-01-15',
    avatarUrl: '/src/assets/images/avatar_director_1792036219459.jpg'
  },
  {
    id: 'stf-2',
    fullName: 'Dilnoza Karimova',
    phone: '+998 (93) 222-33-44',
    email: 'dilnoza@eduverse.uz',
    role: 'branch_manager',
    branchId: 'br-2',
    salaryType: 'fixed',
    salaryRate: 9000000,
    status: 'active',
    joinedDate: '2023-05-10',
    avatarUrl: '/src/assets/images/avatar_teacher_1792036219476.jpg'
  },
  {
    id: 'stf-3',
    fullName: 'Sardorbek Alimov',
    phone: '+998 (97) 345-67-89',
    email: 'sardor@eduverse.uz',
    role: 'teacher',
    branchId: 'br-1',
    salaryType: 'revenue_percent',
    salaryRate: 40, // 40% foiz
    status: 'active',
    joinedDate: '2023-08-01',
    avatarUrl: '/src/assets/images/avatar_teacher_1792036219476.jpg',
    assignedGroupIds: ['grp-1', 'grp-2'],
    specialty: 'Frontend (React, TypeScript, Next.js)',
    experienceYears: 5,
    rating: 4.9,
    bio: '5 yillik tajribaga ega Senior Frontend muhandisi. 120+ bitiruvchisi mahalliy va xorijiy IT kompaniyalarda muvaffaqiyatli ishlamoqda.'
  },
  {
    id: 'stf-4',
    fullName: 'Malika Rustamova',
    phone: '+998 (99) 876-54-32',
    email: 'malika.ielts@eduverse.uz',
    role: 'teacher',
    branchId: 'br-1',
    salaryType: 'per_student',
    salaryRate: 350000,
    status: 'active',
    joinedDate: '2023-09-15',
    avatarUrl: '/src/assets/images/avatar_teacher_1792036219476.jpg',
    assignedGroupIds: ['grp-3', 'grp-4'],
    specialty: 'IELTS Intensive 7.5+ & General English',
    experienceYears: 6,
    rating: 4.95,
    bio: 'IELTS 8.5 sohibasi, Cambridge CELTA sertifikati egasi. 300+ o‘quvchisi 7.0+ natija ko‘rsatgan.'
  },
  {
    id: 'stf-7',
    fullName: 'Jasurbek To‘xtayev',
    phone: '+998 (90) 811-22-33',
    email: 'jasur.python@eduverse.uz',
    role: 'teacher',
    branchId: 'br-2',
    salaryType: 'revenue_percent',
    salaryRate: 45,
    status: 'active',
    joinedDate: '2023-11-01',
    avatarUrl: '/src/assets/images/avatar_director_1792036219459.jpg',
    assignedGroupIds: ['grp-5'],
    specialty: 'Python Backend & Django API',
    experienceYears: 4,
    rating: 4.85,
    bio: 'Telegram botlar, REST API va AI modellarini integratsiya qilish bo‘yicha tajribali mutaxassis.'
  },
  {
    id: 'stf-8',
    fullName: 'Nigora Rahimova',
    phone: '+998 (93) 777-88-99',
    email: 'nigora.design@eduverse.uz',
    role: 'teacher',
    branchId: 'br-1',
    salaryType: 'per_student',
    salaryRate: 400000,
    status: 'active',
    joinedDate: '2024-01-15',
    avatarUrl: '/src/assets/images/avatar_teacher_1792036219476.jpg',
    assignedGroupIds: [],
    specialty: 'Grafik Dizayn & UI/UX Figma',
    experienceYears: 5,
    rating: 4.9,
    bio: 'Figma Community muallifi, xalqaro frilans loyihalar va brending bo‘yicha yetakchi mentor.'
  },
  {
    id: 'stf-9',
    fullName: 'Bobur Mirzayev',
    phone: '+998 (95) 123-99-00',
    email: 'bobur.math@eduverse.uz',
    role: 'teacher',
    branchId: 'br-3',
    salaryType: 'fixed',
    salaryRate: 7500000,
    status: 'active',
    joinedDate: '2024-03-01',
    avatarUrl: '/src/assets/images/avatar_director_1792036219459.jpg',
    assignedGroupIds: [],
    specialty: 'Mental Arifmetika & Olimpiada Matematikasi',
    experienceYears: 7,
    rating: 4.8,
    bio: 'Respublika fan olimpiadalari g‘oliblari ustozi, bolalar psixologiyasi bo‘yicha sertifikatlangan.'
  },
  {
    id: 'stf-5',
    fullName: 'Azizbek Rahmonov',
    phone: '+998 (91) 456-78-90',
    email: 'aziz.sales@eduverse.uz',
    role: 'crm_manager',
    branchId: 'br-1',
    salaryType: 'fixed',
    salaryRate: 6000000,
    status: 'active',
    joinedDate: '2024-02-01'
  },
  {
    id: 'stf-6',
    fullName: 'Shahnoza Usmonova',
    phone: '+998 (94) 555-12-34',
    email: 'shahnoza.cash@eduverse.uz',
    role: 'cashier',
    branchId: 'br-1',
    salaryType: 'fixed',
    salaryRate: 5000000,
    status: 'active',
    joinedDate: '2024-01-10'
  }
];

export const initialGroups: Group[] = [
  {
    id: 'grp-1',
    name: 'Frontend React #42',
    courseId: 'crs-1',
    branchId: 'br-1',
    teacherId: 'stf-3',
    roomId: 'rm-102',
    daysOfWeek: ['Dush', 'Chor', 'Jum'],
    startTime: '14:00',
    endTime: '16:00',
    capacity: 18,
    startDate: '2026-09-01',
    endDate: '2027-03-01',
    monthlyFee: 1200000,
    status: 'active'
  },
  {
    id: 'grp-2',
    name: 'Frontend Next.js #43',
    courseId: 'crs-1',
    branchId: 'br-1',
    teacherId: 'stf-3',
    roomId: 'rm-102',
    daysOfWeek: ['Sesh', 'Pay', 'Shan'],
    startTime: '16:30',
    endTime: '18:30',
    capacity: 18,
    startDate: '2026-09-15',
    endDate: '2027-03-15',
    monthlyFee: 1200000,
    status: 'active'
  },
  {
    id: 'grp-3',
    name: 'IELTS Intensive 7.5 #18',
    courseId: 'crs-3',
    branchId: 'br-1',
    teacherId: 'stf-4',
    roomId: 'rm-103',
    daysOfWeek: ['Dush', 'Chor', 'Jum'],
    startTime: '09:00',
    endTime: '11:00',
    capacity: 16,
    startDate: '2026-08-15',
    endDate: '2026-12-15',
    monthlyFee: 950000,
    status: 'active'
  },
  {
    id: 'grp-4',
    name: 'General English B2 #09',
    courseId: 'crs-4',
    branchId: 'br-1',
    teacherId: 'stf-4',
    roomId: 'rm-101',
    daysOfWeek: ['Sesh', 'Pay', 'Shan'],
    startTime: '10:00',
    endTime: '12:00',
    capacity: 16,
    startDate: '2026-09-01',
    endDate: '2027-03-01',
    monthlyFee: 750000,
    status: 'active'
  },
  {
    id: 'grp-5',
    name: 'Python Django Lab #12',
    courseId: 'crs-2',
    branchId: 'br-2',
    teacherId: 'stf-3',
    roomId: 'rm-201',
    daysOfWeek: ['Dush', 'Chor', 'Jum'],
    startTime: '18:30',
    endTime: '20:30',
    capacity: 16,
    startDate: '2026-10-01',
    endDate: '2027-05-01',
    monthlyFee: 1300000,
    status: 'active'
  }
];

export const initialStudents: Student[] = [
  {
    id: 'stu-1',
    fullName: 'Javohir Tursunov',
    phone: '+998 (90) 845-21-99',
    birthDate: '2005-04-12',
    branchId: 'br-1',
    courseId: 'crs-1',
    groupId: 'grp-1',
    guardianName: 'Otabek Tursunov (Otasi)',
    guardianPhone: '+998 (90) 111-22-33',
    guardianRelation: 'Otasi',
    address: 'Toshkent sh., Yunusobod 14-mavze',
    enrolledDate: '2026-09-01',
    status: 'active',
    balance: 0,
    monthlyFee: 1200000,
    attendanceRate: 94,
    averageGrade: 88,
    notes: 'A’lochi o‘quvchi, loyihalar topshirishda faol.'
  },
  {
    id: 'stu-2',
    fullName: 'Madina Shokirova',
    phone: '+998 (93) 765-43-21',
    birthDate: '2006-11-20',
    branchId: 'br-1',
    courseId: 'crs-3',
    groupId: 'grp-3',
    guardianName: 'Zulayho Shokirova',
    guardianPhone: '+998 (93) 999-88-77',
    guardianRelation: 'Onasi',
    address: 'Toshkent sh., Mirzo Ulug‘bek t.',
    enrolledDate: '2026-08-15',
    status: 'active',
    balance: -450000, // Qarzdor
    monthlyFee: 950000,
    attendanceRate: 98,
    averageGrade: 92,
    notes: 'Speaking bo‘yicha yuqori ko‘rsatkichga ega.'
  },
  {
    id: 'stu-3',
    fullName: 'Bobur Mirzayev',
    phone: '+998 (97) 102-30-40',
    birthDate: '2004-02-18',
    branchId: 'br-1',
    courseId: 'crs-1',
    groupId: 'grp-1',
    guardianName: 'Mirza Mirzayev',
    guardianPhone: '+998 (97) 700-11-22',
    address: 'Toshkent sh., Shayxontohur t.',
    enrolledDate: '2026-09-01',
    status: 'active',
    balance: 600000, // Oldindan to‘lagan
    monthlyFee: 1200000,
    attendanceRate: 85,
    averageGrade: 79
  },
  {
    id: 'stu-4',
    fullName: 'Shahlo Qosimova',
    phone: '+998 (99) 321-65-48',
    birthDate: '2007-07-08',
    branchId: 'br-1',
    courseId: 'crs-4',
    groupId: 'grp-4',
    guardianName: 'Gulchehra Qosimova',
    guardianPhone: '+998 (99) 444-55-66',
    address: 'Toshkent sh., Sergeli t.',
    enrolledDate: '2026-09-10',
    status: 'active',
    balance: -750000, // Qarzdor
    monthlyFee: 750000,
    attendanceRate: 72,
    averageGrade: 70,
    notes: 'O‘tgan haftada dars qoldirgan, ota-onaga xabar berilgan.'
  },
  {
    id: 'stu-5',
    fullName: 'Bekzod Fayzullayev',
    phone: '+998 (91) 987-12-34',
    birthDate: '2003-09-25',
    branchId: 'br-2',
    courseId: 'crs-2',
    groupId: 'grp-5',
    address: 'Toshkent sh., Chilonzor 19-mavze',
    enrolledDate: '2026-10-01',
    status: 'trial',
    balance: 0,
    monthlyFee: 1300000,
    attendanceRate: 100,
    averageGrade: 85
  },
  {
    id: 'stu-6',
    fullName: 'Nargiza Yusupova',
    phone: '+998 (94) 811-22-33',
    birthDate: '2006-03-14',
    branchId: 'br-1',
    courseId: 'crs-1',
    groupId: 'grp-2',
    address: 'Toshkent sh., Olmazor t.',
    enrolledDate: '2026-09-15',
    status: 'active',
    balance: 0,
    monthlyFee: 1200000,
    attendanceRate: 91,
    averageGrade: 84
  },
  {
    id: 'stu-7',
    fullName: 'Akmal Zokirov',
    phone: '+998 (90) 333-44-55',
    birthDate: '2005-08-30',
    branchId: 'br-1',
    courseId: 'crs-3',
    groupId: 'grp-3',
    address: 'Toshkent sh., Yakkasaroy t.',
    enrolledDate: '2026-08-15',
    status: 'active',
    balance: -950000, // Qarzdor
    monthlyFee: 950000,
    attendanceRate: 88,
    averageGrade: 81
  },
  {
    id: 'stu-8',
    fullName: 'Nilufar Ergasheva',
    phone: '+998 (93) 123-98-76',
    birthDate: '2008-01-19',
    branchId: 'br-1',
    courseId: 'crs-4',
    groupId: 'grp-4',
    guardianName: 'Dilshod Ergashev',
    guardianPhone: '+998 (93) 555-77-99',
    address: 'Toshkent sh., Uchtepa t.',
    enrolledDate: '2026-09-01',
    status: 'active',
    balance: 200000,
    monthlyFee: 750000,
    attendanceRate: 96,
    averageGrade: 94
  }
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  { id: 'att-1', groupId: 'grp-1', studentId: 'stu-1', date: '2026-10-12', status: 'present', markedBy: 'Sardorbek Alimov', updatedAt: '2026-10-12 14:05' },
  { id: 'att-2', groupId: 'grp-1', studentId: 'stu-3', date: '2026-10-12', status: 'present', markedBy: 'Sardorbek Alimov', updatedAt: '2026-10-12 14:05' },
  { id: 'att-3', groupId: 'grp-1', studentId: 'stu-1', date: '2026-10-14', status: 'present', markedBy: 'Sardorbek Alimov', updatedAt: '2026-10-14 14:02' },
  { id: 'att-4', groupId: 'grp-1', studentId: 'stu-3', date: '2026-10-14', status: 'late', note: '15 daqiqa kechikib keldi', markedBy: 'Sardorbek Alimov', updatedAt: '2026-10-14 14:15' },
  { id: 'att-5', groupId: 'grp-3', studentId: 'stu-2', date: '2026-10-12', status: 'present', markedBy: 'Malika Rustamova', updatedAt: '2026-10-12 09:05' },
  { id: 'att-6', groupId: 'grp-3', studentId: 'stu-7', date: '2026-10-12', status: 'absent', note: 'Sababsiz darsga kelmadi', markedBy: 'Malika Rustamova', updatedAt: '2026-10-12 09:10' },
  { id: 'att-7', groupId: 'grp-3', studentId: 'stu-2', date: '2026-10-14', status: 'present', markedBy: 'Malika Rustamova', updatedAt: '2026-10-14 09:02' },
  { id: 'att-8', groupId: 'grp-3', studentId: 'stu-7', date: '2026-10-14', status: 'excused', note: 'Salomatligi tufayli ruxsat olgan', markedBy: 'Malika Rustamova', updatedAt: '2026-10-14 09:05' }
];

export const initialHomeworks: Homework[] = [
  {
    id: 'hw-1',
    groupId: 'grp-1',
    title: 'React Custom Hooks va Context API yaratish',
    description: 'UseAuth va useLocalStorage custom hooklarini ishlab chiqish va to‘liq TypeScript tiplash.',
    deadline: '2026-10-18',
    createdAt: '2026-10-14',
    totalSubmissions: 14,
    evaluatedSubmissions: 9
  },
  {
    id: 'hw-2',
    groupId: 'grp-3',
    title: 'IELTS Writing Task 2: Artificial Intelligence in Education',
    description: 'Insho kamida 250 so‘zdan iborat bo‘lishi va aniq misollar bilan asoslanishi shart.',
    deadline: '2026-10-16',
    createdAt: '2026-10-12',
    totalSubmissions: 16,
    evaluatedSubmissions: 12
  }
];

export const initialSubmissions: HomeworkSubmission[] = [
  {
    id: 'sub-1',
    homeworkId: 'hw-1',
    studentId: 'stu-1',
    submittedAt: '2026-10-14 18:30',
    content: 'GitHub repozitoriy havola: https://github.com/javohir/react-auth-hook. Testlar yozildi.',
    grade: 95,
    feedback: 'A’lo darajada bajarilgan. TypeScript tiplari to‘g‘ri ajratilgan.',
    status: 'graded'
  },
  {
    id: 'sub-2',
    homeworkId: 'hw-2',
    studentId: 'stu-2',
    submittedAt: '2026-10-13 21:10',
    content: 'Task 2 inshosi docx formatda yuklandi. So‘zlar soni: 285 ta.',
    grade: 88,
    feedback: 'Fikrlar mantiqiy va grammatika kuchli. Band 7.5 talablariga mos keladi.',
    status: 'graded'
  }
];

export const initialLeads: Lead[] = [
  {
    id: 'ld-101',
    fullName: 'Sherzodbek Mahmudov',
    phone: '+998 (90) 555-44-33',
    courseId: 'crs-1',
    branchId: 'br-1',
    source: 'instagram',
    stage: 'yangi',
    assignedManager: 'Azizbek Rahmonov',
    nextFollowUpDate: '2026-10-15',
    notes: 'Instagram story orqali reklama ko‘rib murojaat qildi. Dasturlashga qiziqadi.',
    createdAt: '2026-10-14 10:20',
    estimatedValue: 1200000
  },
  {
    id: 'ld-102',
    fullName: 'Umida Xolmatova',
    phone: '+998 (93) 444-11-22',
    courseId: 'crs-3',
    branchId: 'br-1',
    source: 'telegram',
    stage: 'boglanildi',
    assignedManager: 'Azizbek Rahmonov',
    nextFollowUpDate: '2026-10-15',
    notes: 'Ingliz tili B2 darajada, dekabrda IELTS topshirmoqchi. Guruh vaqtini surishtirdi.',
    createdAt: '2026-10-13 14:15',
    estimatedValue: 950000
  },
  {
    id: 'ld-103',
    fullName: 'Diyorbek Karimov',
    phone: '+998 (99) 777-88-99',
    courseId: 'crs-2',
    branchId: 'br-1',
    source: 'website',
    stage: 'sinov_darsiga_yozildi',
    assignedManager: 'Azizbek Rahmonov',
    nextFollowUpDate: '2026-10-16',
    notes: 'Juma kuni soat 18:30 dagi Python sinov darsiga yozildi.',
    createdAt: '2026-10-12 11:00',
    estimatedValue: 1300000
  },
  {
    id: 'ld-104',
    fullName: 'Sabina Vohidova',
    phone: '+998 (97) 234-56-78',
    courseId: 'crs-5',
    branchId: 'br-2',
    source: 'referral',
    stage: 'shartnoma_yuborildi',
    assignedManager: 'Azizbek Rahmonov',
    nextFollowUpDate: '2026-10-15',
    notes: 'Sinov darsida qatnashdi, kurs yoqdi. Elektron shartnoma havolasi yuborildi.',
    createdAt: '2026-10-10 16:45',
    estimatedValue: 1100000
  },
  {
    id: 'ld-105',
    fullName: 'Muhriddin Ismoilov',
    phone: '+998 (91) 888-99-00',
    courseId: 'crs-1',
    branchId: 'br-1',
    source: 'walk_in',
    stage: 'shartnoma_tasdiqlandi',
    assignedManager: 'Azizbek Rahmonov',
    nextFollowUpDate: '2026-10-15',
    notes: 'SMS orqali shartnomani tasdiqladi. Bugun Payme orqali to‘lov qilmoqchi.',
    createdAt: '2026-10-09 15:30',
    estimatedValue: 1200000
  },
  {
    id: 'ld-106',
    fullName: 'Lobar Saidova',
    phone: '+998 (94) 111-33-22',
    courseId: 'crs-4',
    branchId: 'br-3',
    source: 'ads',
    stage: 'faol_oquvchi',
    assignedManager: 'Jasur Bekmurodov',
    notes: 'Muvaffaqiyatli to‘lov qilib faol o‘quvchiga aylandi.',
    createdAt: '2026-10-05 09:10',
    estimatedValue: 750000
  }
];

export const initialContracts: Contract[] = [
  {
    id: 'cnt-101',
    contractNumber: 'EDU-2026-0849',
    studentId: 'stu-1',
    courseId: 'crs-1',
    groupId: 'grp-1',
    branchId: 'br-1',
    guardianName: 'Otabek Tursunov',
    guardianPhone: '+998 (90) 111-22-33',
    guardianPassport: 'AA 1234567',
    totalAmount: 7200000,
    monthlyAmount: 1200000,
    startDate: '2026-09-01',
    endDate: '2027-03-01',
    status: 'officialized',
    termsAccepted: true,
    smsVerifiedAt: '2026-08-28 14:32',
    verificationPhone: '+998 (90) 845-21-99',
    verificationIp: '213.230.82.15',
    verificationAuditHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    createdAt: '2026-08-28 14:20'
  },
  {
    id: 'cnt-102',
    contractNumber: 'EDU-2026-0850',
    studentId: 'stu-2',
    courseId: 'crs-3',
    groupId: 'grp-3',
    branchId: 'br-1',
    guardianName: 'Zulayho Shokirova',
    guardianPhone: '+998 (93) 999-88-77',
    guardianPassport: 'AB 7654321',
    totalAmount: 3800000,
    monthlyAmount: 950000,
    startDate: '2026-08-15',
    endDate: '2026-12-15',
    status: 'officialized',
    termsAccepted: true,
    smsVerifiedAt: '2026-08-14 11:05',
    verificationPhone: '+998 (93) 765-43-21',
    verificationIp: '84.54.80.12',
    verificationAuditHash: 'SHA256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    createdAt: '2026-08-14 10:50'
  },
  {
    id: 'cnt-103',
    contractNumber: 'EDU-2026-0855',
    studentId: 'stu-5',
    courseId: 'crs-2',
    groupId: 'grp-5',
    branchId: 'br-2',
    totalAmount: 9100000,
    monthlyAmount: 1300000,
    startDate: '2026-10-01',
    endDate: '2027-05-01',
    status: 'sent',
    termsAccepted: false,
    createdAt: '2026-10-12 16:30'
  }
];

export const initialPayments: PaymentTransaction[] = [
  {
    id: 'pay-1',
    receiptNumber: 'RCP-2026-1001',
    studentId: 'stu-1',
    groupId: 'grp-1',
    branchId: 'br-1',
    amount: 1200000,
    paymentMethod: 'payme',
    date: '2026-10-02 10:15',
    cashierName: 'Avtomatik (Payme API)',
    note: 'Oktabr oyi uchun to‘liq to‘lov',
    status: 'completed'
  },
  {
    id: 'pay-2',
    receiptNumber: 'RCP-2026-1002',
    studentId: 'stu-3',
    groupId: 'grp-1',
    branchId: 'br-1',
    amount: 1800000,
    paymentMethod: 'click',
    date: '2026-10-04 14:40',
    cashierName: 'Avtomatik (Click API)',
    note: '1.5 oylik to‘lov (oldindan)',
    status: 'completed'
  },
  {
    id: 'pay-3',
    receiptNumber: 'RCP-2026-1003',
    studentId: 'stu-2',
    groupId: 'grp-3',
    branchId: 'br-1',
    amount: 500000,
    paymentMethod: 'cash',
    date: '2026-10-05 16:20',
    cashierName: 'Shahnoza Usmonova',
    note: 'Qisman to‘lov, qoldiq qarz: 450 000 so‘m',
    status: 'completed'
  },
  {
    id: 'pay-4',
    receiptNumber: 'RCP-2026-1004',
    studentId: 'stu-8',
    groupId: 'grp-4',
    branchId: 'br-1',
    amount: 950000,
    paymentMethod: 'uzum',
    date: '2026-10-08 11:30',
    cashierName: 'Avtomatik (Uzum Bank)',
    note: 'Oktabr oyi to‘lovi va qo‘shimcha 200 000 so‘m depozit',
    status: 'completed'
  },
  {
    id: 'pay-5',
    receiptNumber: 'RCP-2026-1005',
    studentId: 'stu-6',
    groupId: 'grp-2',
    branchId: 'br-1',
    amount: 1200000,
    paymentMethod: 'terminal',
    date: '2026-10-14 09:45',
    cashierName: 'Shahnoza Usmonova',
    note: 'Humo karta terminali orqali to‘landi',
    status: 'completed'
  }
];

export const initialCashRegisters: CashRegister[] = [
  {
    id: 'cr-1',
    branchId: 'br-1',
    name: 'Bosh bino asosiy kassa (Shahnoza)',
    currentBalance: 18450000,
    status: 'open',
    openedAt: '2026-10-14 08:30',
    openedBy: 'Shahnoza Usmonova'
  },
  {
    id: 'cr-2',
    branchId: 'br-2',
    name: 'Chilonzor kassa (Dilnoza)',
    currentBalance: 9800000,
    status: 'open',
    openedAt: '2026-10-14 08:45',
    openedBy: 'Dilnoza Karimova'
  },
  {
    id: 'cr-3',
    branchId: 'br-3',
    name: 'Samarqand kassa (Jasur)',
    currentBalance: 7200000,
    status: 'open',
    openedAt: '2026-10-14 09:00',
    openedBy: 'Jasur Bekmurodov'
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp-1',
    branchId: 'br-1',
    category: 'rent',
    amount: 35000000,
    description: 'Amir Temur bino 1 oylik ijara haqi',
    date: '2026-10-01',
    approvedBy: 'Farhod Qodirov'
  },
  {
    id: 'exp-2',
    branchId: 'br-1',
    category: 'marketing',
    amount: 14500000,
    description: 'Instagram va Telegram target reklama kampaniyasi',
    date: '2026-10-05',
    approvedBy: 'Farhod Qodirov'
  },
  {
    id: 'exp-3',
    branchId: 'br-1',
    category: 'utilities',
    amount: 3800000,
    description: 'Elektr energiyasi va yuqori tezlikdagi optik internet',
    date: '2026-10-08',
    approvedBy: 'Farhod Qodirov'
  },
  {
    id: 'exp-4',
    branchId: 'br-2',
    category: 'equipment',
    amount: 12000000,
    description: 'Lab uchun 2 ta yangi monitor va klaviaturalar',
    date: '2026-10-10',
    approvedBy: 'Dilnoza Karimova'
  }
];

export const initialSalaries: TeacherSalary[] = [
  {
    id: 'sal-1',
    teacherId: 'stf-3',
    branchId: 'br-1',
    month: '2026-09',
    salaryType: 'revenue_percent',
    baseAmount: 18400000,
    bonusAmount: 1500000,
    deductions: 0,
    totalCalculated: 19900000,
    status: 'paid',
    paidAt: '2026-10-05'
  },
  {
    id: 'sal-2',
    teacherId: 'stf-4',
    branchId: 'br-1',
    month: '2026-09',
    salaryType: 'per_student',
    baseAmount: 11200000,
    bonusAmount: 1000000,
    deductions: 0,
    totalCalculated: 12200000,
    status: 'paid',
    paidAt: '2026-10-05'
  }
];

export const initialTasks: StaffTask[] = [
  {
    id: 'tsk-1',
    title: 'Frontend #44 yangi guruhini ochish va xona tayyorlash',
    description: '101-auditoriyadagi kompyuterlarni tekshirish va o‘quvchilarga SMS taklif yuborish.',
    assignedTo: 'stf-5',
    dueDate: '2026-10-18',
    priority: 'high',
    status: 'in_progress',
    createdBy: 'Farhod Qodirov',
    createdAt: '2026-10-14'
  },
  {
    id: 'tsk-2',
    title: 'Qarzdor o‘quvchilar ota-onalari bilan telefon muloqoti',
    description: 'To‘lov muddati 5 kundan oshgan o‘quvchilar ro‘yxati bo‘yicha eslatma berish.',
    assignedTo: 'stf-6',
    dueDate: '2026-10-16',
    priority: 'urgent',
    status: 'pending',
    createdBy: 'Farhod Qodirov',
    createdAt: '2026-10-14'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-14 14:05:12',
    userName: 'Sardorbek Alimov',
    userRole: 'teacher',
    action: 'Davomat belgilandi',
    entityType: 'Attendance',
    entityId: 'grp-1',
    details: 'Frontend React #42 guruhi uchun 18 nafar o‘quvchi davomati qayd etildi.',
    ipAddress: '213.230.82.15'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-14 09:45:30',
    userName: 'Shahnoza Usmonova',
    userRole: 'cashier',
    action: 'To‘lov qabul qilindi',
    entityType: 'Payment',
    entityId: 'pay-5',
    details: 'Nilufar Ergasheva uchun 1 200 000 so‘m terminal orqali qabul qilindi.',
    ipAddress: '213.230.82.10'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-13 16:10:04',
    userName: 'Azizbek Rahmonov',
    userRole: 'crm_manager',
    action: 'Lid bosqichi o‘zgartirildi',
    entityType: 'Lead',
    entityId: 'ld-104',
    details: 'Sabina Vohidova "Sinov qatnashdi" dan "Shartnoma yuborildi" bosqichiga o‘tkazildi.',
    ipAddress: '213.230.82.11'
  }
];

export const initialSupportTickets: SupportTicket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'TCK-2026-0042',
    subject: 'Payme integratsiyasi webhook tekshiruvi',
    description: 'Payme orqali to‘lov amalga oshirilganda kvitansiya avtomatik yaratilishini sinovdan o‘tkazish.',
    priority: 'high',
    status: 'resolved',
    submittedBy: 'Farhod Qodirov',
    createdAt: '2026-10-11 12:00',
    replyMessage: 'Webhook muvaffaqiyatli sinovdan o‘tdi va ishlab turibdi.'
  },
  {
    id: 'tkt-2',
    ticketNumber: 'TCK-2026-0043',
    subject: 'Yangi filial (Buxoro) uchun ma’lumotlar bazasi shablonini tayyorlash',
    description: 'Yil yakunida Buxoro filialini ulash rejalashtirilmoqda.',
    priority: 'normal',
    status: 'in_review',
    submittedBy: 'Farhod Qodirov',
    createdAt: '2026-10-14 09:30',
    replyMessage: 'Filiallar moduliga yangi filial kiritish uchun ruxsatlar tayyorlanmoqda.'
  }
];
