import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitArtists'
})
export class LimitArtistsPipe implements PipeTransform {

  transform(artists, limit): string {
    let limitedArtists;
    if (limit > 1) {
      const filtered = artists.filter((item, index) => index < limit).map(artist => artist.name);
      limitedArtists = filtered.join(', ');
    } else if (artists.length > 1) {
      limitedArtists = artists[0].name + ', Other artists'
    } else {
      limitedArtists = artists[0].name;
    }
    return limitedArtists;
  }

}
