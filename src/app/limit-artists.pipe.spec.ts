import { LimitArtistsPipe } from './limit-artists.pipe';

describe('LimitArtistsPipe', () => {
  it('create an instance', () => {
    const pipe = new LimitArtistsPipe();
    expect(pipe).toBeTruthy();
  });
});
