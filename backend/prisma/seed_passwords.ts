import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/security.js';

const prisma = new PrismaClient();

async function main() {
  const hash = await hashPassword('Password@123');
  console.log('Generated hash for Password@123');

  const emails = [
    'admin@mangal.com',
    'shastri.ramesh@mangal.com',
    'ananya.sharma@example.com',
    'rohit.verma@example.com',
  ];

  for (const email of emails) {
    await prisma.user.updateMany({
      where: { email },
      data: { passwordHash: hash },
    });
    console.log(`Updated password for ${email}`);
  }

  // Also ensure vendor profile exists for organizer
  const organizerUser = await prisma.user.upsert({
    where: { email: 'weddings@royalpalace.com' },
    update: { passwordHash: hash },
    create: {
      email: 'weddings@royalpalace.com',
      phone: '+919876543299',
      passwordHash: hash,
      firstName: 'Vikram',
      lastName: 'Singhania',
      role: 'ORGANIZER',
      status: 'ACTIVE',
      isVerified: true,
      organizerProfile: {
        create: {
          businessName: 'The Royal Palace Destination & Banquet',
          city: 'Udaipur',
          rating: 4.95,
          isVerified: true,
          listings: {
            create: [
              {
                title: 'Royal Lakefront Heritage Palace Palace Lawns',
                serviceType: 'VENUE',
                description: 'Magnificent 500-year-old heritage palace on Lake Pichola with luxury suites, royal mandap, and 1500-guest banquet grounds.',
                startingPrice: 350000.00,
                images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800'],
              },
              {
                title: 'Candid Moments & Cinematic 4K Wedding Films',
                serviceType: 'PHOTOGRAPHY',
                description: 'Celebrity-grade wedding photography, drone coverage, and candid cinematography albums.',
                startingPrice: 85000.00,
                images: ['https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800'],
              },
            ],
          },
        },
      },
    },
  });
  console.log(`Organizer & listings verified: ${organizerUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
