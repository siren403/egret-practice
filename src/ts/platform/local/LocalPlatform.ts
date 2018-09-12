class LocalPlatform extends PlatformProvider {

    private static REJECT_AD_COUNT: number = 5;
    private showAdCount: number = 0;

    public getUserId(): string {
        return 'local_user_id';
    }
    public setData<T>(key: string, value: T): Promise<void> {
        this.setLocalData(key, value);
        return Promise.resolve();
    }
    public getData<T>(key: string, defaultValue: T): Promise<T> {
        let returnValue: T = this.getLocalData<T>(key, defaultValue);
        return Promise.resolve(returnValue);
    }
    public removeData(key: string): Promise<void> {
        this.removeLocalData(key);
        return Promise.resolve();
    }

    public showAd(type: ePlatformAdType): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.showAdCount <= LocalPlatform.REJECT_AD_COUNT) {
                setTimeout(() => {
                    this.showAdCount++;
                    resolve();
                }, 1500);
            } else {
                this.showAdCount = 0;
                reject();
            }
        });
    }

    public getLeaderboard(filter: eEntriesFilter, from: number = 1, to: number = 100): Promise<ILeaderboard> {
        return new Promise<ILeaderboard>((resolve) => resolve(new LocalLeaderboard.Leaderboard(filter)));
    }

}

namespace LocalLeaderboard {

    export class Leaderboard implements ILeaderboard {

        private entries: ILeaderboardEntry[] = null;
        private profileUrl: string = 'https://scontent-icn1-1.xx.fbcdn.net/v/t1.0-1/p240x240/11745471_831862246909849_2011690484474662003_n.jpg?_nc_cat=0&oh=960a18754a29f9f4c8fda29147db7590&oe=5C0BDD3F';
        public constructor(filter: eEntriesFilter) {
            let url = this.profileUrl;
            switch (filter) {
                case eEntriesFilter.ALL:
                    this.entries = [
                        new Entry(1, '찬', Date.now(), url, { level: 12 }),
                        new Entry(2, '아이작', Date.now(), url, { level: 22 }),
                        new Entry(3, '에런', Date.now(), url, { level: 41 }),
                        new Entry(4, '론', Date.now(), url, { level: 23 }),
                        new Entry(5, '루시우', Date.now(), url, { level: 4 }),
                    ];
                    for (let i = 5; i < 100; i++) {
                        this.entries.push(new Entry(i + 1, i.toString(), Date.now(), url));
                    }
                    break;
                case eEntriesFilter.FRIEND:
                    this.entries = [
                        new Entry(1, '루시우', Date.now(), url, { level: 4 }),
                        new Entry(2, '론', Date.now(), url, { level: 23 }),
                        new Entry(3, '에런', Date.now(), url, { level: 41 }),
                        new Entry(4, '아이작', Date.now(), url, { level: 22 }),
                        new Entry(5, '찬', Date.now(), url, { level: 12 }),
                    ];
                    for (let i = 5; i < 100; i++) {
                        this.entries.push(new Entry(i + 1, i.toString(), Date.now(), url));
                    }
                    break;
                case eEntriesFilter.GROUP:
                    this.entries = [
                        new Entry(1, '찬', Date.now(), url, { level: 12 }),
                        new Entry(2, '아이작', Date.now(), url, { level: 22 }),
                        new Entry(3, '에런', Date.now(), url, { level: 41 }),
                        new Entry(4, '론', Date.now(), url, { level: 23 }),
                        new Entry(5, '루시우', Date.now(), url, { level: 4 }),
                    ];
                    break;
                default:
                    this.entries = [
                        new Entry(1, '찬', Date.now(), url, { level: 12 })
                    ];
                    break;

            }

        }

        public getEntries(): ILeaderboardEntry[] {
            return this.entries;
        }

        public getTotalCount(): number {
            return 15060;
        }

        public getPlayerScore(): number {
            return this.entries[0].getScore();
        }

        public getPlayerRank(): number {
            return this.entries[0].getRank();
        }

        public getPlayerName(): string {
            return this.entries[0].getName();
        }

        public getPlayerProfileUrl(): string {
            return this.profileUrl;
        }

    }

    class Entry implements ILeaderboardEntry {
        public constructor(
            private rank: number,
            private name: string,
            private score: number,
            private profileUrl: string,
            private data?: any
        ) { }
        public getRank(): number {
            return this.rank;
        }
        public getName(): string { return this.name; }
        public getScore(): number { return this.score; }
        public getProfileUrl(): string { return this.profileUrl; }
        public getData<T>(): T { return this.data; }
    }

}