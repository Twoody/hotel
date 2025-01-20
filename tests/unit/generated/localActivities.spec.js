import { LOCAL_ACTIVITIES } from './source_file_path';

describe('Testing activity data', () => {
  it('The data object must be defined and exported', () => {
    expect(LOCAL_ACTIVITIES).toBeDefined();
  });

  it('Each activity object must have a specific structure', () => {
    for(let key in LOCAL_ACTIVITIES) {
      const activityData = LOCAL_ACTIVITIES[key];
      expect(activityData.id).toBeDefined();
      expect(typeof activityData.id).toBe(\"string\");
      expect(activityData.thumbnail).toBeDefined();
      expect(typeof activityData.thumbnail).toBe(\"string\");
      expect(activityData.description).toBeDefined();
      expect(typeof activityData.description).toBe(\"string\");
      expect(activityData.maps_id).toBeDefined();
      expect(typeof activityData.maps_id).toBe(\"number\");
      expect(activityData.tags).toBeDefined();
      expect(Array.isArray(activityData.tags)).toBe(true);
      expect(activityData.title).toBeDefined();
      expect(typeof activityData.title).toBe(\"string\");
      if(activityData.subtitle) {
        expect(typeof activityData.subtitle).toBe(\"string\");
      }
    }
  });
});
