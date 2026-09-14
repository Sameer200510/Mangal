export interface BioInput {
  fullName: string;
  occupation: string;
  education: string;
  city: string;
  familyType: string;
  hobbies: string[];
  values: string;
}

export class AiService {
  /**
   * AI Matrimonial Bio Generator
   */
  static generateBio(input: BioInput): { bio: string; headline: string } {
    const hobbyList = input.hobbies && input.hobbies.length > 0 ? input.hobbies.join(', ') : 'traveling and reading';
    const valuesTxt = input.values || 'traditional values with a modern outlook';

    const headline = `Ambitious ${input.occupation || 'Professional'} based in ${input.city || 'Delhi'} | Rooted in Family Values`;

    const bio = `Warm greetings! I am a dedicated ${input.occupation || 'professional'} working in ${input.city || 'India'} after completing my ${input.education || 'degree'}. 
Raised in a warm ${input.familyType ? input.familyType.toLowerCase() : 'close-knit'} family, I hold deep respect for ${valuesTxt}. 

In my leisure hours, I find joy in ${hobbyList}, exploring new cuisines, and spending quality moments with loved ones. 

I am seeking an emotionally mature, thoughtful partner who believes in mutual respect, shared laughter, and building an inspiring life together. If this resonates with your journey, I would be delighted to connect.`;

    return { headline, bio };
  }

  /**
   * AI Compatibility Explainer
   */
  static explainCompatibility(userName: string, candidateName: string, userProf: any, candProf: any) {
    const commonCity = userProf?.city && candProf?.city && userProf.city.toLowerCase() === candProf.city.toLowerCase();
    const commonDiet = userProf?.diet === candProf?.diet;

    return {
      title: `Astrological & Lifestyle Synergy between ${userName} & ${candidateName}`,
      summary: `${userName} and ${candidateName} exhibit strong harmonic resonance across career ambition, spiritual values, and everyday lifestyle habits.`,
      strengths: [
        commonCity ? `Geographic synergy: Both established in ${userProf.city}` : 'Complementary geographical adaptability',
        commonDiet ? `Dietary harmony: Both share a ${userProf?.diet || 'balanced'} culinary lifestyle` : 'Mutual respect for lifestyle and dietary choices',
        'Balanced temperamental dynamics fostering peaceful communication and mutual support',
        'Aligned long-term family aspirations and respect for elders',
      ],
      conversationStarters: [
        `"I noticed you love ${candProf?.hobbies?.[0] || 'reading'} — what inspired your interest in that?"`,
        `"How do you like life in ${candProf?.city || 'your city'}? Any favorite weekend spots?"`,
        `"What values are most important to you when imagining your future home?"`,
      ],
    };
  }

  /**
   * AI Horoscope Insights
   */
  static generateHoroscopeInsight(score: number, recommendation: string) {
    if (score >= 28) {
      return {
        celestialVibe: 'Utkrishta (Supreme Planetary Alignment)',
        astrologicalAdvice: 'The planetary Lords of your respective Janma Rasis are placed in friendly trines. This indicates effortless companionship, mutual prosperity, and enduring joy.',
      };
    } else if (score >= 18) {
      return {
        celestialVibe: 'Samanvaya (Harmonious Balance)',
        astrologicalAdvice: 'The celestial bodies indicate strong foundational attraction with minor differences in daily temperament. Performing a simple Ganesha Vandana prior to major life steps will bring lasting peace.',
      };
    } else {
      return {
        celestialVibe: 'Shanti Apekshit (Remedies Recommended)',
        astrologicalAdvice: 'Planetary alignments indicate areas where intentional communication and patience will be essential. A personalized astrological review with a Vedic Pandit is advised.',
      };
    }
  }
}
