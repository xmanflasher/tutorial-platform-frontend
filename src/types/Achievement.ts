// src/types/Achievement.ts

export interface Certificate {
    id: number;
    verificationCode: string;
    issuedAt: string;
    metadata: {
        skillSnapshot: Record<string, number>;
        instructorName: string;
        journeyName: string;
        memberDisplayName: string;
    };
    journey?: {
        name: string;
        slug: string;
    };
}

export interface MemberAchievements {
    skillRating: Record<string, number>;
    certificates: Certificate[];
}
