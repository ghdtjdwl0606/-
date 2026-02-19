
export type TestType = 'EPT' | 'TOEFL_JR' | 'TOEFL' | 'TO';

export interface Student {
  id: string;
  name: string;
  score: string;
  score2?: string; // TOEFL JR. (S+W) 또는 TO (문법)
  assignedClass: string;
  testType: TestType;
}
