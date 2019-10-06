import { Track } from './track';

export class RecommendedTrack extends Track {
    basedOn: string;
    seedId: string;
    constructor(id, artists, track, album, coverLow, coverHigh, release, basedOn, seedId) {
         super(id, artists, track, album, coverLow, coverHigh, release);
         this.basedOn = basedOn;
         this.seedId = seedId;
        }
}
