import generateUid from './generateUid';

describe('generateUid fn test', () => {
  it('should generate Unique id based on payload provided', () => {
    const uniqueId = generateUid({
      debtorName: 'Emmanuel C Okuchukwu',
      creditorName: 'Game',
    });

    expect(uniqueId).toBeTruthy();
  });
});
