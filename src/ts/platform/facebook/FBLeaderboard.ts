namespace FBLeaderboard {

    export enum eFilterType {
        total,
        friend
    }

    interface ILeaderboardCache {
        board: Leaderboard;
        total: LeaderboardEntry[];
        friend: LeaderboardEntry[];
        entryCount: number;
    }

    const UPDATE_INTERVAL: number = 60;//sec

    const latestLeaderboard: IMap<ILeaderboardCache> = {};
    const cachedLeaderboard: IMap<Promise<ILeaderboardCache>> = {};
    const latestUpdateTime: IMap<number> = {};

    export function getLeaderboard(name: string, filter: eFilterType): Promise<ILeaderboardCache> {
        let asyncObject = cachedLeaderboard[name];
        let updatedTime = latestUpdateTime[name];

        if ((asyncObject === undefined || updatedTime === undefined) ||
            (Date.now() - updatedTime) / 1000 > UPDATE_INTERVAL) {

            latestUpdateTime[name] = Date.now();

            let cacheObject: ILeaderboardCache = {
                board: null,
                friend: null,
                total: null,
                entryCount: 0
            }

            let currentApi: string = 'getLeaderboardAsync';
            cachedLeaderboard[name] = FBInstant.getLeaderboardAsync(name).then((board) => {
                cacheObject.board = board;
                currentApi = 'getEntryCountAsync';
                return board.getEntryCountAsync();
            }).then((count) => {
                cacheObject.entryCount = count;
                currentApi = 'getEntriesAsync, getConnectedPlayerEntriesAsync';
                return Promise.all([cacheObject.board.getEntriesAsync(100, 0), cacheObject.board.getConnectedPlayerEntriesAsync(100, 0)]);
            }).then((entries) => {
                cacheObject.total = entries[0];
                cacheObject.friend = entries[1];
                latestLeaderboard[name] = cacheObject;
                return Promise.resolve(cacheObject);
            });

            cachedLeaderboard[name].catch((e) => {
                // console.error(currentApi, e);
                // console.log('leader board error');
                return Promise.resolve(latestLeaderboard[name]);
            });
        }

        return cachedLeaderboard[name];
    }

}