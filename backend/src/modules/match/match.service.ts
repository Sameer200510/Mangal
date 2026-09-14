import { prisma } from '../../database.js';
import { ApiError } from '../../middleware/errorHandler.js';
import { Gender, Religion, MaritalStatus, DietPreference, ManglikStatus } from '@prisma/client';

export interface SearchCriteria {
  minAge?: number;
  maxAge?: number;
  minHeightCm?: number;
  maxHeightCm?: number;
  gender?: Gender;
  religion?: Religion;
  caste?: string;
  maritalStatus?: MaritalStatus;
  diet?: DietPreference;
  manglikStatus?: ManglikStatus;
  city?: string;
  state?: string;
  minIncome?: string;
  page?: number;
  limit?: number;
}

export class MatchService {
  /**
   * Deterministic Matrimonial Compatibility Algorithm (0 to 100)
   */
  static calculateCompatibility(
    userProfile: any,
    candidateProfile: any,
    preferences?: any
  ): { score: number; reasons: string[] } {
    let score = 30; // Baseline foundation
    const reasons: string[] = [];

    // 1. Religion & Culture Synergy (+15 pts)
    if (userProfile.religion === candidateProfile.religion) {
      score += 15;
      reasons.push(`Same Religious Faith (${userProfile.religion})`);
      if (userProfile.caste && candidateProfile.caste && userProfile.caste.toLowerCase() === candidateProfile.caste.toLowerCase()) {
        score += 5;
        reasons.push(`Community Harmony (${userProfile.caste})`);
      }
    }

    // 2. Age Preference Alignment (+15 pts)
    const candidateAge = new Date().getFullYear() - new Date(candidateProfile.dateOfBirth).getFullYear();
    const minAge = preferences?.minAge || 21;
    const maxAge = preferences?.maxAge || 35;
    if (candidateAge >= minAge && candidateAge <= maxAge) {
      score += 15;
      reasons.push(`Preferred Age Bracket (${candidateAge} yrs)`);
    }

    // 3. Height Preference (+10 pts)
    const minHeight = preferences?.minHeightCm || 150;
    const maxHeight = preferences?.maxHeightCm || 190;
    if (candidateProfile.heightCm >= minHeight && candidateProfile.heightCm <= maxHeight) {
      score += 10;
      reasons.push(`Height Match (${candidateProfile.heightCm} cm)`);
    }

    // 4. Dietary Lifestyle (+10 pts)
    if (userProfile.diet === candidateProfile.diet) {
      score += 10;
      reasons.push(`Shared Lifestyle Diet (${userProfile.diet})`);
    } else if (
      (userProfile.diet === 'VEGETARIAN' && candidateProfile.diet === 'EGGETARIAN') ||
      (userProfile.diet === 'NON_VEGETARIAN' && candidateProfile.diet === 'EGGETARIAN')
    ) {
      score += 5;
    }

    // 5. Horoscope / Manglik Compatibility (+10 pts)
    if (
      userProfile.manglikStatus === candidateProfile.manglikStatus ||
      candidateProfile.manglikStatus === 'NON_MANGLIK' ||
      candidateProfile.manglikStatus === 'DONT_KNOW'
    ) {
      score += 10;
      reasons.push('Auspicious Horoscope Alignment');
    }

    // 6. Location & City Proximity (+10 pts)
    if (userProfile.city && candidateProfile.city && userProfile.city.toLowerCase() === candidateProfile.city.toLowerCase()) {
      score += 10;
      reasons.push(`Same City (${userProfile.city})`);
    } else if (userProfile.state && candidateProfile.state && userProfile.state.toLowerCase() === candidateProfile.state.toLowerCase()) {
      score += 5;
      reasons.push(`Same State (${userProfile.state})`);
    }

    // 7. Verified Profile Bonus (+5 pts)
    if (candidateProfile.user?.isVerified) {
      score += 5;
      reasons.push('Identity Verified Profile (Royal Shield)');
    }

    return {
      score: Math.min(score, 100),
      reasons: reasons.slice(0, 4),
    };
  }

  /**
   * Get Curated Daily Recommendations for User
   */
  static async getRecommendations(userId: string, page = 1, limit = 12) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: { partnerPreference: true },
        },
      },
    });

    if (!user || !user.profile) {
      throw ApiError.badRequest('Please complete your profile onboarding to receive recommendations');
    }

    // Exclude self and users already swiped
    const swipedIds = await prisma.swipe.findMany({
      where: { swiperId: userId },
      select: { swipedId: true },
    });
    const excludedIds = [userId, ...swipedIds.map((s) => s.swipedId)];

    // Target opposite gender by default
    const targetGender = user.profile.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE;

    const candidates = await prisma.profile.findMany({
      where: {
        userId: { notIn: excludedIds },
        gender: targetGender,
        user: { status: 'ACTIVE' },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isVerified: true,
            createdAt: true,
          },
        },
        photos: {
          where: { isApproved: true },
          orderBy: { isPrimary: 'desc' },
        },
      },
      take: 40,
    });

    // Score and rank candidates
    const ranked = candidates.map((cand) => {
      const comp = this.calculateCompatibility(user.profile, cand, user.profile?.partnerPreference);
      return {
        profile: cand,
        compatibilityScore: comp.score,
        matchReasons: comp.reasons,
      };
    });

    // Sort descending by score
    ranked.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginated = ranked.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      meta: {
        total: ranked.length,
        page,
        limit,
        totalPages: Math.ceil(ranked.length / limit),
      },
    };
  }

  /**
   * Advanced Discovery Search with 15+ Filter Criteria
   */
  static async searchProfiles(userId: string, criteria: SearchCriteria) {
    const page = criteria.page || 1;
    const limit = criteria.limit || 12;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    const whereClause: any = {
      userId: { not: userId },
      user: { status: 'ACTIVE' },
    };

    if (criteria.gender) whereClause.gender = criteria.gender;
    if (criteria.religion) whereClause.religion = criteria.religion;
    if (criteria.maritalStatus) whereClause.maritalStatus = criteria.maritalStatus;
    if (criteria.diet) whereClause.diet = criteria.diet;
    if (criteria.manglikStatus) whereClause.manglikStatus = criteria.manglikStatus;
    if (criteria.city) whereClause.city = { contains: criteria.city, mode: 'insensitive' };
    if (criteria.state) whereClause.state = { contains: criteria.state, mode: 'insensitive' };
    if (criteria.caste) whereClause.caste = { contains: criteria.caste, mode: 'insensitive' };

    if (criteria.minHeightCm || criteria.maxHeightCm) {
      whereClause.heightCm = {};
      if (criteria.minHeightCm) whereClause.heightCm.gte = criteria.minHeightCm;
      if (criteria.maxHeightCm) whereClause.heightCm.lte = criteria.maxHeightCm;
    }

    if (criteria.minAge || criteria.maxAge) {
      const now = new Date();
      whereClause.dateOfBirth = {};
      if (criteria.maxAge) {
        const minDob = new Date(now.getFullYear() - criteria.maxAge - 1, now.getMonth(), now.getDate());
        whereClause.dateOfBirth.gte = minDob;
      }
      if (criteria.minAge) {
        const maxDob = new Date(now.getFullYear() - criteria.minAge, now.getMonth(), now.getDate());
        whereClause.dateOfBirth.lte = maxDob;
      }
    }

    const total = await prisma.profile.count({ where: whereClause });

    const profiles = await prisma.profile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isVerified: true,
          },
        },
        photos: {
          where: { isApproved: true },
          orderBy: { isPrimary: 'desc' },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { completenessScore: 'desc' },
    });

    const scored = profiles.map((p) => {
      const comp = user?.profile
        ? this.calculateCompatibility(user.profile, p)
        : { score: 75, reasons: ['Profile verified'] };
      return {
        profile: p,
        compatibilityScore: comp.score,
        matchReasons: comp.reasons,
      };
    });

    return {
      data: scored,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get Mutual Matches (Both users swiped like or accepted interest)
   */
  static async getMutualMatches(userId: string) {
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isVerified: true,
            profile: {
              include: { photos: { where: { isPrimary: true } } },
            },
          },
        },
        user2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isVerified: true,
            profile: {
              include: { photos: { where: { isPrimary: true } } },
            },
          },
        },
        conversation: {
          select: { id: true, lastMessageAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return matches.map((m) => {
      const partner = m.user1Id === userId ? m.user2 : m.user1;
      return {
        matchId: m.id,
        conversationId: m.conversation?.id,
        partner,
        compatibilityScore: m.compatibilityScore,
        matchReasons: m.matchReasons,
        createdAt: m.createdAt,
      };
    });
  }
}
