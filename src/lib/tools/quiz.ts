export type QuizQuestion = {
  id: string;
  text: string;
  reverse?: boolean;
};

export function scoreLikert(answers: Record<string, number>, questions: QuizQuestion[]): number {
  return questions.reduce((total, question) => {
    const value = answers[question.id] ?? 3;
    return total + (question.reverse ? 6 - value : value);
  }, 0);
}

export function bandScore(score: number, lowMax: number, highMin: number): 'low' | 'balanced' | 'high' {
  if (score <= lowMax) return 'low';
  if (score >= highMin) return 'high';
  return 'balanced';
}
