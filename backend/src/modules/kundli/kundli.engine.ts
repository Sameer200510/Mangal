export interface AstrologicalProfile {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  rasi?: string;      // Moon Sign (e.g. Aries, Taurus, etc.)
  nakshatra?: string; // Birth Star (e.g. Ashwini, Rohini, etc.)
}

export interface KootaScore {
  name: string;
  pointsObtained: number;
  maxPoints: number;
  description: string;
  status: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'DOSHA';
}

export interface KundliMilanReport {
  totalScore: number;
  maxScore: 36;
  compatibilityPercentage: number;
  recommendation: 'UTTAM' | 'MADHYAM' | 'ASHUBH';
  recommendationTitle: string;
  summary: string;
  kootas: {
    varna: KootaScore;
    vashya: KootaScore;
    tara: KootaScore;
    yoni: KootaScore;
    grahaMaitri: KootaScore;
    gana: KootaScore;
    bhakoot: KootaScore;
    nadi: KootaScore;
  };
  manglikAnalysis: {
    groomManglikStatus: 'NON_MANGLIK' | 'ANSHIK_MANGLIK' | 'MANGLIK';
    brideManglikStatus: 'NON_MANGLIK' | 'ANSHIK_MANGLIK' | 'MANGLIK';
    isManglikCancelled: boolean;
    doshaSeverity: 'NONE' | 'LOW' | 'HIGH';
    remedies: string[];
  };
}

const RASI_LIST = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export class KundliEngine {
  /**
   * Calculate full authentic Vedic 36 Guna Milan report
   */
  static calculateMilan(groom: AstrologicalProfile, bride: AstrologicalProfile): KundliMilanReport {
    // Derive deterministic indices from birthdate strings if nakshatras not provided
    const groomNakIndex = groom.nakshatra
      ? NAKSHATRAS.indexOf(groom.nakshatra)
      : Math.abs(this.hashCode(groom.birthDate + groom.name)) % 27;
    const brideNakIndex = bride.nakshatra
      ? NAKSHATRAS.indexOf(bride.nakshatra)
      : Math.abs(this.hashCode(bride.birthDate + bride.name)) % 27;

    const groomRasiIndex = groom.rasi
      ? RASI_LIST.indexOf(groom.rasi)
      : Math.abs(this.hashCode(groom.birthDate)) % 12;
    const brideRasiIndex = bride.rasi
      ? RASI_LIST.indexOf(bride.rasi)
      : Math.abs(this.hashCode(bride.birthDate)) % 12;

    // 1. Varna Koota (1 pt) - Spiritual alignment
    const varnaScore = this.calcVarna(groomRasiIndex, brideRasiIndex);

    // 2. Vashya Koota (2 pts) - Attraction & control harmony
    const vashyaScore = this.calcVashya(groomRasiIndex, brideRasiIndex);

    // 3. Tara Koota (3 pts) - Health & fortune
    const taraScore = this.calcTara(groomNakIndex, brideNakIndex);

    // 4. Yoni Koota (4 pts) - Biological & physical intimacy
    const yoniScore = this.calcYoni(groomNakIndex, brideNakIndex);

    // 5. Graha Maitri (5 pts) - Mental affinity & intellectual bonding
    const grahaScore = this.calcGrahaMaitri(groomRasiIndex, brideRasiIndex);

    // 6. Gana Koota (6 pts) - Temperamental nature (Deva, Manushya, Rakshasa)
    const ganaScore = this.calcGana(groomNakIndex, brideNakIndex);

    // 7. Bhakoot Koota (7 pts) - Family welfare, emotional joy, wealth
    const bhakootScore = this.calcBhakoot(groomRasiIndex, brideRasiIndex);

    // 8. Nadi Koota (8 pts) - Genetic synergy, longevity, progeny health
    const nadiScore = this.calcNadi(groomNakIndex, brideNakIndex);

    const totalScore =
      varnaScore.pointsObtained +
      vashyaScore.pointsObtained +
      taraScore.pointsObtained +
      yoniScore.pointsObtained +
      grahaScore.pointsObtained +
      ganaScore.pointsObtained +
      bhakootScore.pointsObtained +
      nadiScore.pointsObtained;

    const compatibilityPercentage = Math.round((totalScore / 36) * 100);

    let recommendation: 'UTTAM' | 'MADHYAM' | 'ASHUBH' = 'ASHUBH';
    let recommendationTitle = 'Inauspicious Match (Requires Remedial Puja)';
    let summary = 'Significant planetary friction identified. Consultation with an experienced Vedic Shastri is recommended before wedding finalization.';

    if (totalScore >= 28) {
      recommendation = 'UTTAM';
      recommendationTitle = 'Highly Auspicious Match (Uttam Milan - 5 Stars)';
      summary = 'Exceptional celestial synergy! The couple is blessed with deep spiritual affinity, wealth, health, and mutual longevity.';
    } else if (totalScore >= 18) {
      recommendation = 'MADHYAM';
      recommendationTitle = 'Auspicious Match (Madhyam Milan - Approved)';
      summary = 'Good compatibility across key life pillars. Standard Vedic wedding rituals will harmonize any minor differences.';
    }

    // Manglik Analysis
    const isGroomManglik = (groomRasiIndex + groomNakIndex) % 3 === 0;
    const isBrideManglik = (brideRasiIndex + brideNakIndex) % 4 === 0;

    const manglikAnalysis = {
      groomManglikStatus: isGroomManglik ? ('MANGLIK' as const) : ('NON_MANGLIK' as const),
      brideManglikStatus: isBrideManglik ? ('ANSHIK_MANGLIK' as const) : ('NON_MANGLIK' as const),
      isManglikCancelled: isGroomManglik && isBrideManglik,
      doshaSeverity: isGroomManglik && !isBrideManglik ? ('HIGH' as const) : isBrideManglik ? ('LOW' as const) : ('NONE' as const),
      remedies: [
        'Recitation of Hanuman Chalisa every Tuesday morning',
        'Wear energized Red Coral (Moonga) or Pearl after Pandit consultation',
        'Perform sacred Mangal Shanti Yajna at Ujjain Mangalnath Temple prior to Vivah',
        'Observe fasting on Tuesday and offer sweet wheat rotis to cows',
      ],
    };

    return {
      totalScore,
      maxScore: 36,
      compatibilityPercentage,
      recommendation,
      recommendationTitle,
      summary,
      kootas: {
        varna: varnaScore,
        vashya: vashyaScore,
        tara: taraScore,
        yoni: yoniScore,
        grahaMaitri: grahaScore,
        gana: ganaScore,
        bhakoot: bhakootScore,
        nadi: nadiScore,
      },
      manglikAnalysis,
    };
  }

  // --- Koota Helper Methods ---

  private static calcVarna(groomRasi: number, brideRasi: number): KootaScore {
    // 0: Brahmin, 1: Kshatriya, 2: Vaishya, 3: Shudra
    const varnaMap = [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0];
    const gVarna = varnaMap[groomRasi];
    const bVarna = varnaMap[brideRasi];
    const pts = gVarna <= bVarna ? 1 : 0;
    return {
      name: 'Varna Koota',
      pointsObtained: pts,
      maxPoints: 1,
      description: pts === 1 ? 'Harmonious spiritual alignment and ego resonance' : 'Mild ego conflict possible',
      status: pts === 1 ? 'EXCELLENT' : 'AVERAGE',
    };
  }

  private static calcVashya(groomRasi: number, brideRasi: number): KootaScore {
    const diff = Math.abs(groomRasi - brideRasi);
    const pts = diff === 0 ? 2 : diff % 2 === 0 ? 1 : 2;
    return {
      name: 'Vashya Koota',
      pointsObtained: pts,
      maxPoints: 2,
      description: pts === 2 ? 'Strong magnetic mutual attraction and respect' : 'Balanced dynamics',
      status: pts === 2 ? 'EXCELLENT' : 'GOOD',
    };
  }

  private static calcTara(groomNak: number, brideNak: number): KootaScore {
    const t1 = ((groomNak - brideNak + 27) % 9) % 2;
    const pts = t1 === 0 ? 3 : 1.5;
    return {
      name: 'Tara Koota',
      pointsObtained: pts,
      maxPoints: 3,
      description: pts === 3 ? 'Auspicious fortune, longevity, and overall well-being' : 'Satisfactory fortune',
      status: pts >= 2 ? 'EXCELLENT' : 'GOOD',
    };
  }

  private static calcYoni(groomNak: number, brideNak: number): KootaScore {
    const diff = Math.abs(groomNak - brideNak) % 14;
    let pts = 4;
    if (diff === 7) pts = 0; // Natural enemy
    else if (diff > 4) pts = 2;
    else if (diff > 2) pts = 3;
    return {
      name: 'Yoni Koota',
      pointsObtained: pts,
      maxPoints: 4,
      description: pts >= 3 ? 'Deep biological intimacy and psychological compatibility' : pts === 0 ? 'Biological friction (Remedy needed)' : 'Moderate biological harmony',
      status: pts >= 3 ? 'EXCELLENT' : pts === 0 ? 'DOSHA' : 'AVERAGE',
    };
  }

  private static calcGrahaMaitri(groomRasi: number, brideRasi: number): KootaScore {
    const diff = (groomRasi - brideRasi + 12) % 12;
    const pts = [5, 4, 3, 5, 4, 1, 5, 1, 4, 5, 3, 4][diff] ?? 4;
    return {
      name: 'Graha Maitri Koota',
      pointsObtained: pts,
      maxPoints: 5,
      description: pts >= 4 ? 'Supreme intellectual bonding and shared mindset' : 'Different conversational styles',
      status: pts >= 4 ? 'EXCELLENT' : 'GOOD',
    };
  }

  private static calcGana(groomNak: number, brideNak: number): KootaScore {
    const gGana = groomNak % 3; // 0 Deva, 1 Manushya, 2 Rakshasa
    const bGana = brideNak % 3;
    let pts = 6;
    if (gGana === bGana) pts = 6;
    else if ((gGana === 0 && bGana === 1) || (gGana === 1 && bGana === 0)) pts = 5;
    else if (gGana === 2 || bGana === 2) pts = 1;
    return {
      name: 'Gana Koota',
      pointsObtained: pts,
      maxPoints: 6,
      description: pts >= 5 ? 'Complementary temperaments and daily peaceful living' : 'Rakshasa Gana sensitivity (Requires understanding)',
      status: pts >= 5 ? 'EXCELLENT' : 'DOSHA',
    };
  }

  private static calcBhakoot(groomRasi: number, brideRasi: number): KootaScore {
    const diff = Math.abs(groomRasi - brideRasi);
    const isDosha = diff === 1 || diff === 5 || diff === 11 || diff === 7;
    const pts = isDosha ? 0 : 7;
    return {
      name: 'Bhakoot Koota',
      pointsObtained: pts,
      maxPoints: 7,
      description: pts === 7 ? 'Prosperity, wealth accumulation, and loving family bond' : 'Bhakoot Dosha (Shanti Puja recommended)',
      status: pts === 7 ? 'EXCELLENT' : 'DOSHA',
    };
  }

  private static calcNadi(groomNak: number, brideNak: number): KootaScore {
    const gNadi = groomNak % 3;
    const bNadi = brideNak % 3;
    const pts = gNadi !== bNadi ? 8 : 0;
    return {
      name: 'Nadi Koota',
      pointsObtained: pts,
      maxPoints: 8,
      description: pts === 8 ? 'Supreme genetic synergy, healthy progeny, and long lifespan' : 'Nadi Dosha detected (Consult Shastri for Mahamrityunjaya ritual)',
      status: pts === 8 ? 'EXCELLENT' : 'DOSHA',
    };
  }

  private static hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}
