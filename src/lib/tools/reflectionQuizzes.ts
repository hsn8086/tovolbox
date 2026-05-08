export type ReflectionQuizId =
  | 'big-five-lite'
  | 'work-style'
  | 'digital-wellbeing'
  | 'communication-style'
  | 'conflict-style'
  | 'learning-style'
  | 'career-interest'
  | 'productivity-style'
  | 'decision-making-style'
  | 'sleep-habit';

export type ReflectionQuizOption = {
  value: number;
  label: string;
};

export type ReflectionQuizQuestion = {
  id: string;
  text: string;
  dimension: string;
  reverse?: boolean;
};

export type ReflectionQuiz = {
  id: ReflectionQuizId;
  title: string;
  description: string;
  questions: ReflectionQuizQuestion[];
};

export type ReflectionQuizBand = 'lower' | 'steady' | 'higher';

export type ReflectionQuizDimensionScore = {
  dimension: string;
  score: number;
  maxScore: number;
  band: ReflectionQuizBand;
  summary: string;
};

export type ReflectionQuizResult = {
  quizId: ReflectionQuizId;
  title: string;
  score: number;
  maxScore: number;
  band: ReflectionQuizBand;
  summary: string;
  dimensions: ReflectionQuizDimensionScore[];
  disclaimer: string;
};

export const REFLECTION_QUIZ_OPTIONS: ReflectionQuizOption[] = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' },
];

export const REFLECTION_QUIZ_DISCLAIMER =
  'This reflection quiz is for personal insight and conversation only. It does not label people or evaluate health, and it should not replace support from a qualified professional.';

export const reflectionQuizzes: ReflectionQuiz[] = [
  {
    id: 'big-five-lite',
    title: 'Big Five Lite Reflection',
    description: 'A brief self-reflection on everyday preferences across five broad personality-style themes.',
    questions: [
      { id: 'bfl-curious', text: 'I enjoy exploring ideas that are unfamiliar to me.', dimension: 'Openness' },
      { id: 'bfl-routine', text: 'I prefer familiar routines over trying new approaches.', dimension: 'Openness', reverse: true },
      { id: 'bfl-plan', text: 'I usually make a plan before starting important work.', dimension: 'Conscientiousness' },
      { id: 'bfl-follow-through', text: 'I follow through on commitments even when they become tedious.', dimension: 'Conscientiousness' },
      { id: 'bfl-social-energy', text: 'Time with groups often gives me energy.', dimension: 'Extraversion' },
      { id: 'bfl-speak-up', text: 'I am comfortable sharing my view in a group discussion.', dimension: 'Extraversion' },
      { id: 'bfl-cooperative', text: 'I look for cooperative solutions when preferences differ.', dimension: 'Agreeableness' },
      { id: 'bfl-patient', text: 'I can stay calm when someone works differently from me.', dimension: 'Agreeableness' },
      { id: 'bfl-calm', text: 'I usually stay steady when plans change unexpectedly.', dimension: 'Composure' },
      { id: 'bfl-recover', text: 'After a demanding day, I can usually reset with a simple routine.', dimension: 'Composure' },
    ],
  },
  {
    id: 'work-style',
    title: 'Work Style Reflection',
    description: 'A quick look at how you tend to organize focus, collaboration, decisions, and follow-through.',
    questions: [
      { id: 'ws-priorities', text: 'I define the most important outcome before I begin a task.', dimension: 'Focus' },
      { id: 'ws-deep-work', text: 'I protect blocks of time for focused work.', dimension: 'Focus' },
      { id: 'ws-context', text: 'I ask clarifying questions before moving fast on ambiguous work.', dimension: 'Collaboration' },
      { id: 'ws-updates', text: 'I share useful progress updates before others need to ask.', dimension: 'Collaboration' },
      { id: 'ws-decisions', text: 'I can make a practical decision with incomplete information.', dimension: 'Decision Style' },
      { id: 'ws-revisit', text: 'I revisit decisions when new information changes the tradeoffs.', dimension: 'Decision Style' },
      { id: 'ws-finish', text: 'I keep visible next steps until work is complete.', dimension: 'Follow-through' },
      { id: 'ws-reflect', text: 'I take time to learn from completed work.', dimension: 'Follow-through' },
    ],
  },
  {
    id: 'digital-wellbeing',
    title: 'Digital Wellbeing Reflection',
    description: 'A non-clinical check-in on attention, boundaries, and recovery in everyday technology use.',
    questions: [
      { id: 'dw-intent', text: 'I usually know why I am opening an app or site.', dimension: 'Intentional Use' },
      { id: 'dw-autopilot', text: 'I often keep scrolling after I have found what I needed.', dimension: 'Intentional Use', reverse: true },
      { id: 'dw-notifications', text: 'My notification settings support the way I want to spend my time.', dimension: 'Boundaries' },
      { id: 'dw-offline', text: 'I set aside regular time away from screens.', dimension: 'Boundaries' },
      { id: 'dw-sleep', text: 'My evening device habits leave room for winding down.', dimension: 'Recovery' },
      { id: 'dw-refresh', text: 'After using digital media, I usually feel ready for the next part of my day.', dimension: 'Recovery' },
      { id: 'dw-choice', text: 'I choose online spaces that match my values and goals.', dimension: 'Choicefulness' },
      { id: 'dw-compare', text: 'I often compare my day with what I see online.', dimension: 'Choicefulness', reverse: true },
    ],
  },
  {
    id: 'communication-style',
    title: 'Communication Style Reflection',
    description: 'A quick reflection on how you share ideas, listen, and adjust messages in everyday conversations.',
    questions: [
      { id: 'cs-clear', text: 'I try to make my main point easy to understand.', dimension: 'Clarity' },
      { id: 'cs-examples', text: 'I use examples or context when a topic could be unclear.', dimension: 'Clarity' },
      { id: 'cs-listen', text: 'I give people room to finish their thoughts before responding.', dimension: 'Listening' },
      { id: 'cs-check', text: 'I check whether I understood someone before moving on.', dimension: 'Listening' },
      { id: 'cs-tone', text: 'I adapt my tone to fit the setting and relationship.', dimension: 'Adaptability' },
      { id: 'cs-feedback', text: 'I can offer feedback in a way that stays specific and respectful.', dimension: 'Feedback' },
    ],
  },
  {
    id: 'conflict-style',
    title: 'Conflict Style Reflection',
    description: 'A non-clinical look at how you tend to handle disagreement, tension, and repair.',
    questions: [
      { id: 'cf-pause', text: 'I can pause before reacting when a disagreement feels tense.', dimension: 'Composure' },
      { id: 'cf-direct', text: 'I name the issue clearly instead of hoping it disappears.', dimension: 'Directness' },
      { id: 'cf-curious', text: 'I ask what matters to the other person before proposing a solution.', dimension: 'Curiosity' },
      { id: 'cf-win', text: 'I look for options that protect the relationship and the outcome.', dimension: 'Collaboration' },
      { id: 'cf-avoid', text: 'I put off hard conversations longer than is useful.', dimension: 'Directness', reverse: true },
      { id: 'cf-repair', text: 'After friction, I am willing to revisit what happened and reset expectations.', dimension: 'Repair' },
    ],
  },
  {
    id: 'learning-style',
    title: 'Learning Style Reflection',
    description: 'A practical reflection on how you explore, practice, and retain new skills or ideas.',
    questions: [
      { id: 'ls-goal', text: 'I learn best when I know what I want to be able to do afterward.', dimension: 'Direction' },
      { id: 'ls-hands-on', text: 'Trying something myself helps me understand it faster.', dimension: 'Practice' },
      { id: 'ls-notes', text: 'I capture notes or examples that I can revisit later.', dimension: 'Retention' },
      { id: 'ls-discuss', text: 'Explaining an idea to someone else helps me refine it.', dimension: 'Processing' },
      { id: 'ls-variety', text: 'I benefit from using more than one source or format.', dimension: 'Exploration' },
      { id: 'ls-review', text: 'I schedule time to review what I learned after the first pass.', dimension: 'Retention' },
    ],
  },
  {
    id: 'career-interest',
    title: 'Career Interest Reflection',
    description: 'A broad reflection on the kinds of work activities and environments that may feel engaging.',
    questions: [
      { id: 'ci-build', text: 'I enjoy turning ideas into useful systems, tools, or finished work.', dimension: 'Making' },
      { id: 'ci-help', text: 'I feel engaged when my work directly supports other people.', dimension: 'Helping' },
      { id: 'ci-analyze', text: 'I like breaking complex questions into patterns and evidence.', dimension: 'Analyzing' },
      { id: 'ci-create', text: 'I am drawn to work that leaves room for original expression.', dimension: 'Creating' },
      { id: 'ci-lead', text: 'I enjoy coordinating people around a shared goal.', dimension: 'Leading' },
      { id: 'ci-stability', text: 'I prefer work where expectations and progress markers are clear.', dimension: 'Structure' },
      { id: 'ci-explore', text: 'I am energized by learning about unfamiliar fields or roles.', dimension: 'Exploration' },
    ],
  },
  {
    id: 'productivity-style',
    title: 'Productivity Style Reflection',
    description: 'A practical check-in on how you plan, focus, manage energy, and complete everyday work.',
    questions: [
      { id: 'ps-prioritize', text: 'I choose a small number of priorities before adding more tasks.', dimension: 'Prioritization' },
      { id: 'ps-start', text: 'I can start a task before every detail is fully settled.', dimension: 'Momentum' },
      { id: 'ps-batches', text: 'Grouping similar tasks helps me stay efficient.', dimension: 'Workflow' },
      { id: 'ps-breaks', text: 'I use breaks in a way that helps me return with focus.', dimension: 'Energy' },
      { id: 'ps-visibility', text: 'I keep commitments visible so they do not rely only on memory.', dimension: 'Tracking' },
      { id: 'ps-overload', text: 'I often say yes before checking my current capacity.', dimension: 'Prioritization', reverse: true },
    ],
  },
  {
    id: 'decision-making-style',
    title: 'Decision Making Style Reflection',
    description: 'A short reflection on how you weigh options, tradeoffs, timing, and input from others.',
    questions: [
      { id: 'dm-criteria', text: 'I define what a good decision needs to accomplish.', dimension: 'Criteria' },
      { id: 'dm-options', text: 'I compare a few realistic options before choosing.', dimension: 'Options' },
      { id: 'dm-tradeoffs', text: 'I can name what I am giving up when I choose one path.', dimension: 'Tradeoffs' },
      { id: 'dm-input', text: 'I seek input from people who see the situation differently.', dimension: 'Perspective' },
      { id: 'dm-timing', text: 'I notice when waiting for more information is no longer useful.', dimension: 'Timing' },
      { id: 'dm-review', text: 'I review important choices later to learn from the outcome.', dimension: 'Learning' },
    ],
  },
  {
    id: 'sleep-habit',
    title: 'Sleep Habit Reflection',
    description: 'A non-clinical reflection on evening routines, rest cues, and morning patterns.',
    questions: [
      { id: 'sh-consistent', text: 'My bedtime and wake time are fairly consistent across the week.', dimension: 'Consistency' },
      { id: 'sh-wind-down', text: 'I have a simple routine that helps me shift out of the day.', dimension: 'Wind-down' },
      { id: 'sh-screens', text: 'My evening screen use leaves room for rest.', dimension: 'Boundaries' },
      { id: 'sh-environment', text: 'My sleep space usually supports quiet, comfort, and low distraction.', dimension: 'Environment' },
      { id: 'sh-caffeine', text: 'I pay attention to how late-day drinks or snacks affect my rest.', dimension: 'Awareness' },
      { id: 'sh-morning', text: 'My morning routine helps me start the day without rushing.', dimension: 'Morning Rhythm' },
    ],
  },
];

const bandSummaries: Record<ReflectionQuizBand, string> = {
  lower: 'This area may be less central in your current habits or preferences.',
  steady: 'This area appears present in a balanced, situational way.',
  higher: 'This area appears to be a more consistent part of your current style.',
};

export function scoreReflectionQuiz(quizId: ReflectionQuizId, answers: Record<string, number>): ReflectionQuizResult {
  const quiz = reflectionQuizzes.find((item) => item.id === quizId);

  if (!quiz) {
    throw new Error(`Unknown reflection quiz: ${quizId}`);
  }

  const dimensions = Array.from(new Set(quiz.questions.map((question) => question.dimension))).map((dimension) => {
    const questions = quiz.questions.filter((question) => question.dimension === dimension);
    const score = questions.reduce((total, question) => total + scoreQuestion(question, answers[question.id]), 0);
    const maxScore = questions.length * 5;
    const band = bandScore(score, maxScore);

    return {
      dimension,
      score,
      maxScore,
      band,
      summary: `${dimension}: ${bandSummaries[band]}`,
    };
  });

  const score = dimensions.reduce((total, dimension) => total + dimension.score, 0);
  const maxScore = quiz.questions.length * 5;
  const band = bandScore(score, maxScore);

  return {
    quizId: quiz.id,
    title: quiz.title,
    score,
    maxScore,
    band,
    summary: bandSummaries[band],
    dimensions,
    disclaimer: REFLECTION_QUIZ_DISCLAIMER,
  };
}

function scoreQuestion(question: ReflectionQuizQuestion, answer: number | undefined): number {
  const value = clampLikert(answer ?? 3);
  return question.reverse ? 6 - value : value;
}

function clampLikert(value: number): number {
  if (!Number.isFinite(value)) return 3;
  if (value < 1) return 1;
  if (value > 5) return 5;
  return Math.round(value);
}

function bandScore(score: number, maxScore: number): ReflectionQuizBand {
  const ratio = score / maxScore;

  if (ratio < 0.45) return 'lower';
  if (ratio > 0.7) return 'higher';
  return 'steady';
}
