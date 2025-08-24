export interface Question {
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  description: string;
  link: string;
}

export interface Challenge {
  $id: string;
  day: number;
  date: string; // Stored as ISO string
  title: string;
  description: string;
  questions: Question[];
}

export interface ChallengeCompletion {
  $id?: string; // Document ID from Appwrite
  userEmail: string;
  challengeId: string;
  questionTitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  code: string;
  githubLink?: string;
  language: string;
  completedAt: string;
  review?: {
    feedback: string;
    grade: string;
  };
}

export interface UserProfile {
    $id: string; // Document ID
    email: string;
    name: string;
    isAdmin: boolean;
    password?: string; // Added password field
    phone?: string;
    batch?: string;
    course?: string;
    section?: string;
    githubRepo?: string;
    enroll?: string;
}