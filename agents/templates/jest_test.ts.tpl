import { {{className}} } from '../src/{{filePath}}';

describe('{{className}}', () => {
  it('should perform expected behavior', async () => {
    const instance = new {{className}}();
    const result = await instance.execute({ /* params */ });
    expect(result).toEqual(/* expected */);
  });
});
