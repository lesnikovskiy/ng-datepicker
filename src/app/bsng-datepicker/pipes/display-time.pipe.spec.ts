import { DisplayTimePipe } from './display-time.pipe';

describe('DisplayTimePipe', () => {
  let pipe: DisplayTimePipe;

  beforeEach(() => {
    pipe = new DisplayTimePipe();
  }); 

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('appends 0 if value 0', () => {
    const result = pipe.transform(0);
    expect(result).toBe('00');
  });

  it('appends 0 if value is 1', () => {
    const result = pipe.transform(1);
    expect(result).toBe('01');
  });

  it('appends 0 if value 9', () => {
    const result = pipe.transform(9);
    expect(result).toBe('09');
  });

  it('does not append 0 if value 10', () => {
    const result = pipe.transform(10);
    expect(result).toBe('10');
  });

  it('handles negative numbers to be 0', () => {
    const result = pipe.transform(-2);
    expect(result).toBe('00');
  })
});
