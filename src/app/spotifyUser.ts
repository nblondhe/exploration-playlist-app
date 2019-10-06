export class SpotifyUser {
    id: string;
    displayName: string;
    constructor(userId, name) {
        this.id = userId;
        this.displayName = name;
    }
}
