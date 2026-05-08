import { useMemo, useState } from 'react';
import { REFLECTION_QUIZ_DISCLAIMER, REFLECTION_QUIZ_OPTIONS, reflectionQuizzes, scoreReflectionQuiz, type ReflectionQuizId } from '@/lib/tools/reflectionQuizzes';

type Props = {
  component: string;
};

export function selectQuizByComponent(component: string): ReflectionQuizId {
  const id = component.replace(/^quiz-/, '') as ReflectionQuizId;
  return reflectionQuizzes.some((quiz) => quiz.id === id) ? id : 'big-five-lite';
}

export default function ReflectionQuizTool({ component }: Props) {
  const quizId = selectQuizByComponent(component);
  const quiz = reflectionQuizzes.find((item) => item.id === quizId)!;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const completed = quiz.questions.filter((question) => answers[question.id] !== undefined).length;
  const result = useMemo(() => scoreReflectionQuiz(quizId, answers), [answers, quizId]);

  return (
    <section className="card" style={{ padding: '1.25rem' }}>
      <h2 style={{ marginTop: 0 }}>{quiz.title}</h2>
      <p style={{ color: 'var(--muted)', lineHeight: 1.65 }}>{quiz.description}</p>
      <aside className="card" style={{ padding: '1rem', borderColor: '#fbbf24', marginBottom: '1rem' }}>{REFLECTION_QUIZ_DISCLAIMER}</aside>
      <p style={{ color: 'var(--muted)' }}>{completed} / {quiz.questions.length} answered</p>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {quiz.questions.map((question, index) => (
          <fieldset key={question.id} className="card" style={{ padding: '1rem', border: '1px solid var(--border)' }}>
            <legend style={{ fontWeight: 800 }}>{index + 1}. {question.text}</legend>
            <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', marginTop: '.75rem' }}>
              {REFLECTION_QUIZ_OPTIONS.map((option) => (
                <label key={option.value} style={{ display: 'inline-flex', gap: '.35rem', alignItems: 'center' }}>
                  <input type="radio" name={question.id} value={option.value} checked={answers[question.id] === option.value} onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.value }))} />
                  {option.value}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <section className="card" style={{ padding: '1rem', marginTop: '1rem' }}>
        <h3>Reflection result</h3>
        <p><strong>{result.band}</strong>: {result.summary}</p>
        <ul>{result.dimensions.map((dimension) => <li key={dimension.dimension}>{dimension.summary} ({dimension.score}/{dimension.maxScore})</li>)}</ul>
        <p style={{ color: 'var(--muted)' }}>{result.disclaimer}</p>
      </section>
    </section>
  );
}
