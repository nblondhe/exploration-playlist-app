export class Track {
    id: string;
    artists: any[];
    track: string;
    album: string;
    coverLow: string;
    coverHigh: string;
    release: Date;
    addedToPlaylist: boolean;

    constructor(
        id,
        artists,
        track,
        album,
        coverLow,
        coverHigh,
        release
    ) {
        this.id = id;
        this.artists = artists;
        this.track = track;
        this.album = album;
        this.coverLow = coverLow;
        this.coverHigh = coverHigh;
        this.release = release;
    }
}
