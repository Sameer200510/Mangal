import { prisma } from '../../database.js';
import { ApiError } from '../../middleware/errorHandler.js';
import { storage } from '../../adapters/storage/index.js';
import {
  BasicInfoInput,
  ReligiousAstrologyInput,
  EducationCareerInput,
  LocationFamilyInput,
  LifestyleInput,
  PartnerPreferencesInput,
} from '../../common/index.js';
import {
  Gender,
  MaritalStatus,
  Religion,
  ManglikStatus,
  FamilyType,
  DietPreference,
} from '@prisma/client';

export class ProfileService {
  /**
   * Calculate completeness percentage based on populated sections
   */
  calculateCompleteness(profile: any, partnerPref?: any, photosCount = 0): number {
    let score = 0;
    if (profile.gender && profile.dateOfBirth && profile.heightCm) score += 15;
    if (profile.religion && profile.caste) score += 15;
    if (profile.highestEducation && profile.occupation && profile.annualIncomeRange) score += 20;
    if (profile.city && profile.state && profile.familyType) score += 15;
    if (profile.diet) score += 10;
    if (profile.bio && profile.bio.length > 20) score += 10;
    if (photosCount > 0) score += 15;
    return Math.min(score, 100);
  }

  /**
   * Get or initialize profile for user
   */
  async getOrCreateProfile(userId: string) {
    let profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        photos: { orderBy: { orderIndex: 'asc' } },
        partnerPreference: true,
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
            role: true,
            isVerified: true,
          },
        },
      },
    });

    if (!profile) {
      // Create empty initial profile
      profile = await prisma.profile.create({
        data: {
          userId,
          gender: Gender.FEMALE,
          dateOfBirth: new Date('2000-01-01'),
          heightCm: 165,
          completenessScore: 20,
        },
        include: {
          photos: true,
          partnerPreference: true,
          user: {
            select: {
              id: true,
              email: true,
              phone: true,
              firstName: true,
              lastName: true,
              role: true,
              isVerified: true,
            },
          },
        },
      });
    }

    return profile;
  }

  /**
   * Save Onboarding Step 1: Basic Info
   */
  async saveBasicInfo(userId: string, input: BasicInfoInput) {
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        gender: input.gender as unknown as Gender,
        dateOfBirth: new Date(input.dateOfBirth),
        heightCm: input.heightCm,
        weightKg: input.weightKg,
        maritalStatus: input.maritalStatus as unknown as MaritalStatus,
        motherTongue: input.motherTongue,
        bio: input.bio,
      },
      create: {
        userId,
        gender: input.gender as unknown as Gender,
        dateOfBirth: new Date(input.dateOfBirth),
        heightCm: input.heightCm,
        weightKg: input.weightKg,
        maritalStatus: input.maritalStatus as unknown as MaritalStatus,
        motherTongue: input.motherTongue,
        bio: input.bio,
      },
      include: { photos: true, partnerPreference: true },
    });

    const completeness = this.calculateCompleteness(profile, profile.partnerPreference, profile.photos.length);
    return prisma.profile.update({
      where: { id: profile.id },
      data: { completenessScore: completeness },
      include: { photos: true, partnerPreference: true },
    });
  }

  /**
   * Save Onboarding Step 2: Religious & Astrological
   */
  async saveReligiousInfo(userId: string, input: ReligiousAstrologyInput) {
    return prisma.profile.update({
      where: { userId },
      data: {
        religion: input.religion as unknown as Religion,
        caste: input.caste,
        subCaste: input.subCaste,
        gotra: input.gotra,
        manglikStatus: input.manglikStatus as unknown as ManglikStatus,
        birthPlace: input.birthPlace,
        birthTime: input.birthTime,
      },
      include: { photos: true, partnerPreference: true },
    });
  }

  /**
   * Save Onboarding Step 3: Education & Career
   */
  async saveEducationCareer(userId: string, input: EducationCareerInput) {
    return prisma.profile.update({
      where: { userId },
      data: {
        highestEducation: input.highestEducation,
        collegeName: input.collegeName,
        occupation: input.occupation,
        companyName: input.companyName,
        annualIncomeRange: input.annualIncomeRange,
      },
      include: { photos: true, partnerPreference: true },
    });
  }

  /**
   * Save Onboarding Step 4: Location & Family
   */
  async saveLocationFamily(userId: string, input: LocationFamilyInput) {
    return prisma.profile.update({
      where: { userId },
      data: {
        country: input.country,
        state: input.state,
        city: input.city,
        familyType: input.familyType as unknown as FamilyType,
        fatherOccupation: input.fatherOccupation,
        motherOccupation: input.motherOccupation,
        brothersCount: input.brothersCount,
        sistersCount: input.sistersCount,
        familyIncome: input.familyIncome,
      },
      include: { photos: true, partnerPreference: true },
    });
  }

  /**
   * Save Onboarding Step 5: Lifestyle & Habits
   */
  async saveLifestyle(userId: string, input: LifestyleInput) {
    return prisma.profile.update({
      where: { userId },
      data: {
        diet: input.diet as unknown as DietPreference,
        smoking: input.smoking,
        drinking: input.drinking,
        hasDisability: input.hasDisability,
        disabilityDetails: input.disabilityDetails,
        languagesKnown: input.languagesKnown,
        hobbies: input.hobbies,
      },
      include: { photos: true, partnerPreference: true },
    });
  }

  /**
   * Save Onboarding Step 6: Partner Preferences
   */
  async savePartnerPreferences(userId: string, input: PartnerPreferencesInput) {
    const profile = await this.getOrCreateProfile(userId);

    const pref = await prisma.partnerPreference.upsert({
      where: { profileId: profile.id },
      update: {
        minAge: input.minAge,
        maxAge: input.maxAge,
        minHeightCm: input.minHeightCm,
        maxHeightCm: input.maxHeightCm,
        maritalStatus: input.maritalStatus as unknown as MaritalStatus[],
        religions: input.religions as unknown as Religion[],
        castes: input.castes,
        manglikPreference: input.manglikPreference as unknown as ManglikStatus,
        preferredCities: input.preferredCities,
        minIncome: input.minIncome,
      },
      create: {
        profileId: profile.id,
        minAge: input.minAge,
        maxAge: input.maxAge,
        minHeightCm: input.minHeightCm,
        maxHeightCm: input.maxHeightCm,
        maritalStatus: input.maritalStatus as unknown as MaritalStatus[],
        religions: input.religions as unknown as Religion[],
        castes: input.castes,
        manglikPreference: input.manglikPreference as unknown as ManglikStatus,
        preferredCities: input.preferredCities,
        minIncome: input.minIncome,
      },
    });

    return pref;
  }

  /**
   * Upload Photo for Profile
   */
  async uploadPhoto(userId: string, buffer: Buffer, fileName: string, isPrimary = false) {
    const profile = await this.getOrCreateProfile(userId);

    const fileUrl = await storage.upload(fileName, buffer, {
      folder: `profiles/${userId}`,
      contentType: 'image/jpeg',
    });

    // If marked primary, unset other primaries
    if (isPrimary) {
      await prisma.profilePhoto.updateMany({
        where: { profileId: profile.id },
        data: { isPrimary: false },
      });
    }

    const photoCount = await prisma.profilePhoto.count({ where: { profileId: profile.id } });

    const photo = await prisma.profilePhoto.create({
      data: {
        profileId: profile.id,
        fileUrl,
        isPrimary: isPrimary || photoCount === 0,
        isApproved: true,
        orderIndex: photoCount,
      },
    });

    return photo;
  }

  /**
   * Delete Photo
   */
  async deletePhoto(userId: string, photoId: string) {
    const profile = await this.getOrCreateProfile(userId);
    const photo = await prisma.profilePhoto.findFirst({
      where: { id: photoId, profileId: profile.id },
    });

    if (!photo) {
      throw ApiError.notFound('Photo not found');
    }

    await storage.delete(photo.fileUrl);
    await prisma.profilePhoto.delete({ where: { id: photoId } });
  }

  /**
   * Update Privacy Controls
   */
  async updatePrivacy(userId: string, isProfilePublic: boolean, isPhotoVisible: boolean) {
    return prisma.profile.update({
      where: { userId },
      data: { isProfilePublic, isPhotoVisible },
    });
  }

  /**
   * Export All Profile Data (GDPR / Privacy requirement)
   */
  async exportData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            photos: true,
            partnerPreference: true,
          },
        },
        sentInterests: true,
        receivedInterests: true,
        memberships: true,
        bookings: true,
      },
    });

    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  /**
   * Delete Account & Data Wipe (Right to be Forgotten)
   */
  async deleteAccount(userId: string) {
    await prisma.user.delete({
      where: { id: userId },
    });
  }
}

export const profileService = new ProfileService();
