import { MAPS, MAP_FILTERS } from './maps.js';

test('MAPS has all properties', () => {
    const mapKeys = Object.keys(MAPS);
    const expectedKeys = [
        'BURNSIDE',
        'CANBY',
        'COLUMBIA_RIVER_GORGE',
        'EUGENE',
        'LAKE_OSWEGO',
        'LAVENDER_FARMS',
        'MADDOX',
        'MARKETS',
        'MSY',
        'MT_HOOD',
        'OREGON_CITY',
        'OREGON_COAST',
        'SAUVY_ISLAND',
        'STUB_STEWART',
        'TRYON',
        'WILAMETE_RIVER',
        'WILDNERNESS',
    ];
    expect(mapKeys.sort()).toEqual(expectedKeys.sort());
});

test('MAP_FILTERS has all properties', () => {
    const filterKeys = Object.values(MAP_FILTERS);
    const expectedValues = [
        \"Dog Friendly\",
        \"Food\",
        \"Groceries\",
        \"Child Friendly\",
        \"Running\",
        \"Hiking\",
        \"Exercise\",
        \"Attractions\",
        \"Drinks\",
        \"Walking\",
        \"Shopping\",
        \"Music\",
    ];
    expect(filterKeys.sort()).toEqual(expectedValues.sort());
});
