import { DisplayTimePipe } from './display-time.pipe';

describe('DisplayTimePipe', () => {
  let pipe: DisplayTimePipe;

  beforeEach(() => {
    pipe = new DisplayTimePipe();
  }); 

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
