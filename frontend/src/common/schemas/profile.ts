import { z } from 'zod';
import {
  Gender,
  MaritalStatus,
  Religion,
  ManglikStatus,
  FamilyType,
  DietPreference,
} from '../enums';

export const basicInfoSchema = z.object({
  gender: z.nativeEnum(Gender),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  heightCm: z.number().int().min(90).max(250),
  weightKg: z.number().int().min(30).max(300).optional(),
  maritalStatus: z.nativeEnum(MaritalStatus),
  motherTongue: z.string().min(2, 'Mother tongue is required'),
  bio: z.string().max(2000).optional(),
});

export const religiousAstrologySchema = z.object({
  religion: z.nativeEnum(Religion),
  caste: z.string().min(1, 'Caste is required').optional(),
  subCaste: z.string().optional(),
  gotra: z.string().optional(),
  manglikStatus: z.nativeEnum(ManglikStatus).default(ManglikStatus.DONT_KNOW),
  birthPlace: z.string().optional(),
  birthTime: z.string().optional(),
});

export const educationCareerSchema = z.object({
  highestEducation: z.string().min(2, 'Highest education degree is required'),
  collegeName: z.string().optional(),
  occupation: z.string().min(2, 'Occupation is required'),
  companyName: z.string().optional(),
  annualIncomeRange: z.string().min(2, 'Annual income range is required'),
});

export const locationFamilySchema = z.object({
  country: z.string().min(2, 'Country is required'),
  state: z.string().min(2, 'State is required'),
  city: z.string().min(2, 'City is required'),
  familyType: z.nativeEnum(FamilyType).default(FamilyType.NUCLEAR),
  fatherOccupation: z.string().optional(),
  motherOccupation: z.string().optional(),
  brothersCount: z.number().int().min(0).default(0),
  sistersCount: z.number().int().min(0).default(0),
  familyIncome: z.string().optional(),
});

export const lifestyleSchema = z.object({
  diet: z.nativeEnum(DietPreference).default(DietPreference.VEGETARIAN),
  smoking: z.boolean().default(false),
  drinking: z.boolean().default(false),
  hasDisability: z.boolean().default(false),
  disabilityDetails: z.string().optional(),
  languagesKnown: z.array(z.string()).default([]),
  hobbies: z.array(z.string()).default([]),
});

export const partnerPreferencesSchema = z.object({
  minAge: z.number().int().min(18).max(80).default(21),
  maxAge: z.number().int().min(18).max(80).default(35),
  minHeightCm: z.number().int().min(90).max(250).default(150),
  maxHeightCm: z.number().int().min(90).max(250).default(190),
  maritalStatus: z.array(z.nativeEnum(MaritalStatus)).default([]),
  religions: z.array(z.nativeEnum(Religion)).default([]),
  castes: z.array(z.string()).default([]),
  manglikPreference: z.nativeEnum(ManglikStatus).default(ManglikStatus.DONT_KNOW),
  preferredCities: z.array(z.string()).default([]),
  minIncome: z.string().optional(),
});

export type BasicInfoInput = z.infer<typeof basicInfoSchema>;
export type ReligiousAstrologyInput = z.infer<typeof religiousAstrologySchema>;
export type EducationCareerInput = z.infer<typeof educationCareerSchema>;
export type LocationFamilyInput = z.infer<typeof locationFamilySchema>;
export type LifestyleInput = z.infer<typeof lifestyleSchema>;
export type PartnerPreferencesInput = z.infer<typeof partnerPreferencesSchema>;
