import { PrismaClient, Role, UserStatus, Gender, Religion, ManglikStatus, MaritalStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Mangal Platform...');

  // 1. Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mangal.com' },
    update: {},
    create: {
      email: 'admin@mangal.com',
      phone: '+919876543210',
      // Precomputed hash for password "MangalAdmin@2026"
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dGVzdHNhbHQxMjM0NTY3OA$9v3PqQeP1M4yF4T5q0Y5yM3B1Q5eP1M4yF4T5q0Y5yM',
      firstName: 'Super',
      lastName: 'Admin',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // 2. Pandit User & Profile
  const panditUser = await prisma.user.upsert({
    where: { email: 'shastri.ramesh@mangal.com' },
    update: {},
    create: {
      email: 'shastri.ramesh@mangal.com',
      phone: '+919876543211',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dGVzdHNhbHQxMjM0NTY3OA$9v3PqQeP1M4yF4T5q0Y5yM3B1Q5eP1M4yF4T5q0Y5yM',
      firstName: 'Acharya',
      lastName: 'Ramesh Shastri',
      role: Role.PANDIT,
      status: UserStatus.ACTIVE,
      isVerified: true,
      panditProfile: {
        create: {
          experienceYears: 18,
          languages: ['Hindi', 'Sanskrit', 'English'],
          bio: 'Gold Medalist in Vedic Astrology from Sampurnanand Sanskrit University. Expert in Kundli Milan, Gun Milan, and Mangal Dosha Nivarana.',
          perConsultationFee: 1100.00,
          rating: 4.95,
          isVerified: true,
        },
      },
    },
  });
  console.log(`✅ Pandit created: ${panditUser.email}`);

  // 3. Bride Profile
  const brideUser = await prisma.user.upsert({
    where: { email: 'ananya.sharma@example.com' },
    update: {},
    create: {
      email: 'ananya.sharma@example.com',
      phone: '+919876543212',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dGVzdHNhbHQxMjM0NTY3OA$9v3PqQeP1M4yF4T5q0Y5yM3B1Q5eP1M4yF4T5q0Y5yM',
      firstName: 'Ananya',
      lastName: 'Sharma',
      role: Role.BRIDE,
      status: UserStatus.ACTIVE,
      isVerified: true,
      profile: {
        create: {
          gender: Gender.FEMALE,
          dateOfBirth: new Date('1998-06-15'),
          heightCm: 165,
          weightKg: 56,
          maritalStatus: MaritalStatus.NEVER_MARRIED,
          religion: Religion.HINDU,
          caste: 'Brahmin',
          gotra: 'Kashyap',
          manglikStatus: ManglikStatus.NON_MANGLIK,
          highestEducation: 'M.Tech in Computer Science',
          collegeName: 'IIT Delhi',
          occupation: 'Senior Software Engineer',
          companyName: 'Microsoft India',
          annualIncomeRange: '₹30 - 45 Lakhs',
          country: 'India',
          state: 'Karnataka',
          city: 'Bangalore',
          motherTongue: 'Hindi',
          bio: 'Forward-thinking, culturally rooted software engineer who enjoys classical music, trekking, and spending time with family.',
          completenessScore: 95,
          photos: {
            create: [
              {
                fileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                isPrimary: true,
                isApproved: true,
              },
            ],
          },
          partnerPreference: {
            create: {
              minAge: 26,
              maxAge: 32,
              minHeightCm: 172,
              maxHeightCm: 190,
              religions: [Religion.HINDU],
              manglikPreference: ManglikStatus.NON_MANGLIK,
              preferredCities: ['Bangalore', 'Delhi', 'Mumbai'],
              minIncome: '₹25 Lakhs',
            },
          },
        },
      },
    },
  });
  console.log(`✅ Bride created: ${brideUser.email}`);

  // 4. Groom Profile
  const groomUser = await prisma.user.upsert({
    where: { email: 'rohit.verma@example.com' },
    update: {},
    create: {
      email: 'rohit.verma@example.com',
      phone: '+919876543213',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dGVzdHNhbHQxMjM0NTY3OA$9v3PqQeP1M4yF4T5q0Y5yM3B1Q5eP1M4yF4T5q0Y5yM',
      firstName: 'Rohit',
      lastName: 'Verma',
      role: Role.GROOM,
      status: UserStatus.ACTIVE,
      isVerified: true,
      profile: {
        create: {
          gender: Gender.MALE,
          dateOfBirth: new Date('1995-11-22'),
          heightCm: 178,
          weightKg: 72,
          maritalStatus: MaritalStatus.NEVER_MARRIED,
          religion: Religion.HINDU,
          caste: 'Kayastha',
          gotra: 'Kashyap',
          manglikStatus: ManglikStatus.NON_MANGLIK,
          highestEducation: 'MBA in Finance',
          collegeName: 'IIM Ahmedabad',
          occupation: 'Vice President, Investment Banking',
          companyName: 'Goldman Sachs',
          annualIncomeRange: '₹50 - 75 Lakhs',
          country: 'India',
          state: 'Maharashtra',
          city: 'Mumbai',
          motherTongue: 'Hindi',
          bio: 'Ambitious finance professional, fitness enthusiast, passionate about world cinema and traditional culinary arts.',
          completenessScore: 90,
          photos: {
            create: [
              {
                fileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
                isPrimary: true,
                isApproved: true,
              },
            ],
          },
        },
      },
    },
  });
  console.log(`✅ Groom created: ${groomUser.email}`);

  console.log('🎉 Seeding complete successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
