import storyCopy from '../data/recreated-stories.json' with { type: 'json' };

const JOURNEYS_BY_ID = new Map(storyCopy.journeys.map((journey) => [journey.id, journey]));

export function getRecreatedJourney(journeyId) {
  const journey = JOURNEYS_BY_ID.get(journeyId);
  if (!journey) throw new Error(`Missing recreated story for journey "${journeyId}"`);
  return journey;
}

export function applyRecreatedChapter(chapter, journeyId, chapterIndex) {
  const content = getRecreatedJourney(journeyId).chapters[chapterIndex];
  if (!content) throw new Error(`Missing recreated chapter ${chapterIndex + 1} for journey "${journeyId}"`);
  return { ...chapter, ...content };
}
