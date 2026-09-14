import { prisma } from '../../database.js';
import { ApiError } from '../../middleware/errorHandler.js';
import { VerificationAdapter } from '../../adapters/verification/index.js';
import { DocumentType, VerificationStatus } from '@prisma/client';

export interface SubmitDocInput {
  documentType: DocumentType;
  documentNumber: string;
  documentUrl: string;
}

export interface TrustScoreBreakdown {
  score: number;
  maxScore: number;
  level: 'BASIC' | 'VERIFIED' | 'PREMIUM_TRUST' | 'ROYAL_SHIELD';
  breakdown: {
    email: boolean;
    phone: boolean;
    identityDoc: boolean;
    selfieLiveness: boolean;
  };
}

export class VerificationService {
  /**
   * Submit an Indian/Global Identity Document for KYC
   */
  static async submitDocument(userId: string, input: SubmitDocInput) {
    const { documentType, documentNumber, documentUrl } = input;

    // 1. Syntax & checksum validation
    const verification = VerificationAdapter.verifyDocument(documentType, documentNumber);
    if (!verification.isValid) {
      throw ApiError.badRequest(verification.error || 'Invalid document number provided');
    }

    // 2. Prevent document reuse across different accounts
    const existingSameHash = await prisma.identityVerification.findFirst({
      where: {
        documentHash: verification.documentHash,
        userId: { not: userId },
        status: { in: [VerificationStatus.VERIFIED, VerificationStatus.PENDING] },
      },
    });

    if (existingSameHash) {
      throw ApiError.badRequest('This identity document is already registered with another account');
    }

    // 3. Create or update user verification record
    const record = await prisma.identityVerification.create({
      data: {
        userId,
        documentType,
        documentNumberMasked: verification.maskedNumber,
        documentHash: verification.documentHash,
        documentUrl,
        status: VerificationStatus.VERIFIED, // Auto-verified in instant simulation mode
        reviewerNotes: 'Auto-verified via secure cryptographic checksum check',
        reviewedAt: new Date(),
      },
    });

    // 4. Update User's isVerified flag
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    // 5. Update Profile completeness bonus (+15%)
    await prisma.profile.updateMany({
      where: { userId },
      data: {
        completenessScore: { increment: 15 },
      },
    });

    return {
      recordId: record.id,
      documentType: record.documentType,
      maskedNumber: record.documentNumberMasked,
      status: record.status,
      trustScoreBonus: verification.trustScoreBonus,
      message: 'Document successfully verified and encrypted badge assigned',
    };
  }

  /**
   * Submit AI Selfie Liveness check
   */
  static async submitSelfie(userId: string, selfieUrl: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: { include: { photos: true } } },
    });

    if (!user) throw ApiError.notFound('User not found');

    const primaryPhoto = user.profile?.photos.find((p) => p.isPrimary)?.fileUrl;
    const selfieResult = VerificationAdapter.verifySelfieLiveness(selfieUrl, primaryPhoto);

    if (!selfieResult.livenessPassed) {
      throw ApiError.badRequest('Liveness test failed. Please take a clear selfie in good lighting.');
    }

    // Update latest pending/verified record with selfie
    const latestRecord = await prisma.identityVerification.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (latestRecord) {
      await prisma.identityVerification.update({
        where: { id: latestRecord.id },
        data: {
          selfieUrl,
        },
      });
    }

    return {
      success: true,
      livenessPassed: selfieResult.livenessPassed,
      faceMatchScore: `${(selfieResult.faceMatchScore * 100).toFixed(1)}%`,
      confidence: `${(selfieResult.confidenceScore * 100).toFixed(1)}%`,
      message: 'Selfie biometric verification successful! Blue Shield applied.',
    };
  }

  /**
   * Calculate Trust Score & Get Verification Status
   */
  static async getStatus(userId: string): Promise<{
    isVerified: boolean;
    trustScore: TrustScoreBreakdown;
    verifications: any[];
  }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        identityVerifications: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            documentType: true,
            documentNumberMasked: true,
            status: true,
            reviewerNotes: true,
            reviewedAt: true,
            createdAt: true,
            selfieUrl: true,
          },
        },
      },
    });

    if (!user) throw ApiError.notFound('User not found');

    const hasVerifiedDoc = user.identityVerifications.some((v) => v.status === VerificationStatus.VERIFIED);
    const hasSelfie = user.identityVerifications.some((v) => !!v.selfieUrl);

    let score = 25; // Base account creation
    if (user.phone) score += 25;
    if (hasVerifiedDoc) score += 35;
    if (hasSelfie) score += 15;

    let level: TrustScoreBreakdown['level'] = 'BASIC';
    if (score >= 90) level = 'ROYAL_SHIELD';
    else if (score >= 70) level = 'PREMIUM_TRUST';
    else if (score >= 50) level = 'VERIFIED';

    return {
      isVerified: user.isVerified || hasVerifiedDoc,
      trustScore: {
        score,
        maxScore: 100,
        level,
        breakdown: {
          email: true,
          phone: !!user.phone,
          identityDoc: hasVerifiedDoc,
          selfieLiveness: hasSelfie,
        },
      },
      verifications: user.identityVerifications,
    };
  }

  /**
   * Admin: List pending verifications
   */
  static async getAdminQueue() {
    return prisma.identityVerification.findMany({
      where: { status: VerificationStatus.PENDING },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Admin: Review and approve/reject verification
   */
  static async reviewVerification(
    id: string,
    reviewerId: string,
    status: VerificationStatus,
    reviewerNotes?: string
  ) {
    const record = await prisma.identityVerification.update({
      where: { id },
      data: {
        status,
        reviewerNotes,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
    });

    if (status === VerificationStatus.VERIFIED) {
      await prisma.user.update({
        where: { id: record.userId },
        data: { isVerified: true },
      });
    }

    return record;
  }
}
