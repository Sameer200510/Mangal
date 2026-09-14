import crypto from 'crypto';

export interface VerificationResult {
  isValid: boolean;
  maskedNumber: string;
  documentHash: string;
  error?: string;
  trustScoreBonus: number;
}

export interface SelfieMatchResult {
  livenessPassed: boolean;
  confidenceScore: number;
  faceMatchScore: number;
  status: 'VERIFIED' | 'REVIEW_NEEDED' | 'REJECTED';
}

export class VerificationAdapter {
  /**
   * Masks sensitive Indian & Global Identity Documents according to UIDAI & RBI guidelines
   */
  static maskDocument(type: 'AADHAAR' | 'PAN' | 'PASSPORT' | 'DRIVING_LICENSE', rawNumber: string): string {
    const cleaned = rawNumber.replace(/[\s-]/g, '').toUpperCase();
    
    switch (type) {
      case 'AADHAAR':
        // 12 digits: XXXX-XXXX-1234
        if (cleaned.length >= 12) {
          const last4 = cleaned.slice(-4);
          return `XXXX-XXXX-${last4}`;
        }
        return `XXXX-XXXX-${cleaned.slice(-4) || 'XXXX'}`;

      case 'PAN':
        // 10 chars: ABCDE1234F -> ABCDE****F
        if (cleaned.length === 10) {
          return `${cleaned.slice(0, 5)}****${cleaned.slice(-1)}`;
        }
        return `${cleaned.slice(0, 3)}****${cleaned.slice(-1)}`;

      case 'PASSPORT':
        // e.g. Z1234567 -> Z****567
        if (cleaned.length >= 8) {
          return `${cleaned[0]}****${cleaned.slice(-3)}`;
        }
        return `${cleaned.slice(0, 2)}****${cleaned.slice(-2)}`;

      case 'DRIVING_LICENSE':
        // e.g. DL-0120110012345 -> DL-**-****-2345
        if (cleaned.length >= 10) {
          return `${cleaned.slice(0, 4)}-****-${cleaned.slice(-4)}`;
        }
        return `${cleaned.slice(0, 2)}****${cleaned.slice(-4)}`;

      default:
        return `****${cleaned.slice(-4)}`;
    }
  }

  /**
   * Cryptographically hashes the document number with SHA-256 for deduplication checks
   */
  static hashDocument(rawNumber: string): string {
    const normalized = rawNumber.replace(/[\s-]/g, '').toUpperCase();
    return crypto.createHash('sha256').update(`MANGAL_DOC_SALT:${normalized}`).digest('hex');
  }

  /**
   * Validates document syntax and simulated sandbox verification
   */
  static verifyDocument(
    type: 'AADHAAR' | 'PAN' | 'PASSPORT' | 'DRIVING_LICENSE',
    rawNumber: string
  ): VerificationResult {
    const cleaned = rawNumber.replace(/[\s-]/g, '').toUpperCase();

    if (type === 'AADHAAR') {
      const aadhaarRegex = /^\d{12}$/;
      if (!aadhaarRegex.test(cleaned)) {
        return {
          isValid: false,
          maskedNumber: '',
          documentHash: '',
          error: 'Aadhaar must be exactly 12 numeric digits',
          trustScoreBonus: 0,
        };
      }
    } else if (type === 'PAN') {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(cleaned)) {
        return {
          isValid: false,
          maskedNumber: '',
          documentHash: '',
          error: 'PAN must follow standard format (5 letters, 4 digits, 1 letter, e.g. ABCDE1234F)',
          trustScoreBonus: 0,
        };
      }
    } else if (type === 'PASSPORT') {
      const passportRegex = /^[A-Z][0-9]{7}$/;
      if (!passportRegex.test(cleaned)) {
        return {
          isValid: false,
          maskedNumber: '',
          documentHash: '',
          error: 'Passport must be 1 letter followed by 7 digits',
          trustScoreBonus: 0,
        };
      }
    }

    const masked = this.maskDocument(type, cleaned);
    const hash = this.hashDocument(cleaned);

    return {
      isValid: true,
      maskedNumber: masked,
      documentHash: hash,
      trustScoreBonus: type === 'AADHAAR' ? 35 : 30,
    };
  }

  /**
   * AI Face Match & Liveness check simulation (production adapter hooks into AWS Rekognition / HyperVerge)
   */
  static verifySelfieLiveness(_selfieBase64OrUrl: string, _profilePhotoUrl?: string): SelfieMatchResult {
    // Highly accurate simulated AI confidence
    return {
      livenessPassed: true,
      confidenceScore: 0.985, // 98.5% liveness confidence
      faceMatchScore: 0.942,  // 94.2% facial similarity with photo
      status: 'VERIFIED',
    };
  }
}
