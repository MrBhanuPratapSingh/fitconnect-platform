export interface FeePlan {
  id: number;
  planName: string;
  amount: number;
  billingCycle: string;
}

export interface GymMedia {
  id: number;
  url: string;
  type: string;
  isCover: boolean;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  achievedOn: string;
}

export interface GymPublicResponse {
  id: number;
  name: string;
  description: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  openingTime: string | null;
  closingTime: string | null;
  contactPhone: string;
  contactEmail: string;
  establishedYear: number | null;
  media: GymMedia[];
  feePlans: FeePlan[];
  achievements: Achievement[];
}