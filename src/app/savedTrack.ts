import { Track } from './track';

export class SavedTrack extends Track {
    addedOn: Date;
    albumId: string;
    constructor(id, artists, track, album, coverLow, coverHigh, release, addedOn, albumId) {
         super(id, artists, track, album, coverLow, coverHigh, release);
         this.addedOn = addedOn;
         this.albumId = albumId;
        }
}
