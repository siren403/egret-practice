if (typeof SG !== 'object') {
    let keys = [
        "latestBoardState",
        "remainderAlignCount",
        "dailyGiftTime"
    ];

    var SG = {

        IN_GAMETAB: false,
        VERSION: "2.3.0",

        init: function (data, callback) {
            let result = {
                playerId: "playerid",
                bestScore: "",
                nickname: "nickname",
                profileImageUrl: ""
            };
            callback(200, result);
        },
        login: function (callback) {
            callback(200, Debug.log(true));
        },
        isLoggedIn: function (callback) {
            let result = {
                success: true
            };
            callback(200, result);
        },
        getUrlParameter(urlKey) {
            let result = {
                qa
            };
            callback(200, result);
        },
        getUrlParameters() { // ??
            return "urls";
        },
        Profile: {
            getMyProfile: {
                playerId: "playerid",
                bestScore: "",
                nickname: "nickname",
                profileImageUrl: ""
            },
            getSaveData: function (callback) {
                let result = {
                    appId: "appid",
                    playerId: "playerid",
                    saveData: {},
                    snackId: "snackid"
                };
                let savedKeys = window.localStorage.getItem("savedKeys");
                if (savedKeys === null) {
                    savedKeys = [];
                    window.localStorage.setItem("savedKeys", JSON.stringify(savedKeys));
                } else {
                    savedKeys = JSON.parse(savedKeys);
                }

                for (let key of savedKeys) {
                    let platform = Container.resolve(PlatformProvider);
                    // let data = window.localStorage.getItem(key);
                    let data = platform.getLocalData(key, {});
                    if (data) {
                        result.saveData[key] = data;
                    }
                }

                callback(200, result);
            },
            setSaveData: function (data, callback) {
                let saveData = data['saveData'];
                if (saveData !== undefined) {
                    if (typeof (saveData) === 'object') {

                        let savedKeys = window.localStorage.getItem("savedKeys");
                        if (savedKeys === null) {
                            savedKeys = [];
                            window.localStorage.setItem("savedKeys", JSON.stringify(savedKeys));
                        } else {
                            savedKeys = JSON.parse(savedKeys);
                        }

                        for (let key in saveData) {
                            // window.localStorage.setItem(key, saveData[key]);
                            let platform = Container.resolve(PlatformProvider);
                            platform.setLocalData(key, saveData[key]);

                            if (savedKeys.indexOf(key) === -1) {
                                savedKeys.push(key);
                            }
                        }

                        window.localStorage.setItem("savedKeys", JSON.stringify(savedKeys));

                        callback(200, {});
                    } else {
                        callback(-1, {});
                    }
                } else {
                    callback(400, { desc: "not found parameter : saveData" });
                }
            },
            removeSaveData: function (callback) {
                callback(200, window.localStorage.clear());
            }
        },
        Friend: {
            loadRegisteredFriends: function (callback) {
                callback(200);
            },
            REGISTERED_FRIENDS: {
                nickname: "nickname",
                profileImageUrl: "profileimageurl",
                uuId: "uuid",
                playerId: "playerid"
            },
            INVITABLE_FRIENDS: {
                nickname: "nickname",
                profileImageUrl: "profileimageurl",
                uuId: "uuid",
                playerId: "playerid"
            }
        },
        Leaderboard: {
            loadRank: function (data, callback) {
                callback(200);
            },
            reportScores: function (data, callback) {
                callback(200);
            },
            getRank: function (callback) {
                let result = {
                    playerId: "playerid",
                    rank: 1,
                    score: 1,
                    cardinality: 1,
                    highscore: 1,
                    property: {
                        nickname: "nicname",
                        profileImageUrl: "profileimageurl"
                    },
                    seasonSeq: 1,
                    nextResetTime: 1,
                    lastRank: 1,
                    lastScore: 1,
                    lastCardinality: 1
                };
                callback(200, result);
            },
            getRankedScores: function (data, callback) {
                let result = {
                    seasonSeq: 1,
                    cardinality: 1,
                    scores: [{
                        rank: 1,
                        playerId: "playerid",
                        score: 1,
                        property: {
                            nickname: "nickname",
                            profileImageUrl: "profileimageurl"
                        }
                    }],
                    nextResetTime: 1,
                    myRank: 1,
                    myScore: 1
                };
                callback(200, result);
            },
            makeLink: function (callback) {
                let result = {
                    linkId: "linkid",
                    linkLeaderboardId: "linkLeaderboardid"
                };
                callback(200, result);
            },
            getLinkId: "",
            hasLinkId: function () {
                return false;
            }

        },
        Message: { // ??
            sendGameTalkMessage: function (data, callback) {
                callback(200);
            },
            sendInvitationTalkMessage: function (data, callback) {
                callback(200);
            },
            talkShare: function (data, callback) {
                callback(200);
            }
        },
        Game: { // ??
            roundStart: function (callback) {
                callback(200);
            },
            gameStart: function (callback) {
                callback(200);
            },
            roundFinish: function (data, callback) {
                callback(200);
            }
        },
        Log: { // ??
            actionLog: function (data, callback) {
                callback(200);
            }
        },
        Ads: { // ??
            showFrontBanner: function (callback) {
                callback(200, {});
            },
            showEndingBanner: function (callback) {
                callback(200);
            },
            removeEndingBanner: function (callback) {
                callback(200);
            },
            ad250x250: function (callback) {
                callback(200, {});
            },
            ad320x100: function (callback) {
                callback(200, {});
            },
            removeAd320x100: function (callback) {
                callback(200, {});
            },
            googleFrontAd: function (callback) {
                callback(200, {});
            },
            google320x50: function (callback) {
                callback(200, {});
            },
            removeGoogle320x50: function (callback) {
                callback(200, {});
            }
        },
        UI: {
            setFloatingPos: function (data, callback) {
                callback(200, {});
            },
            setFloatingVisible: function (data, callback) {
                let result = {
                    setVisible: "true"
                };

                callback(200, result);
            },
            setOrientation: function (data, callback) {
                callback(200);
            },
            removeOrientation: function (callback) {
                callback(200);
            }
        },
        Delivery: {
            sendMessage: function (data, callback) {
                let result = {
                    messageId: "messageid"
                };
                callback(200, result);
            },
            getMessages: function (messageBoxId, callback) {
                let result = {
                    "nextPageKey": -1,
                    "messages": [{
                        "appId": "appid",
                        "senderId": "senderid",
                        "receiverId": "receiverid",
                        "message": {
                            "deliverySeq": 1,
                            "messageId": "messageid",
                            "messageBoxId": "messageboxid",
                            "senderAppId": "senderappid",
                            "senderId": "senderid",
                            "receiverAppId": "recevierappid",
                            "receiverId": "receiverid",
                            "title": null,
                            "body": null,
                            "resourceMap": {},
                            "state": "unread",
                            "regTime": 1,
                            "modTime": 1,
                            "readTime": null,
                            "expiredTime": 1,
                            "expiryTime": 1
                        },
                        "items": [{
                            "itemId": "itemid",
                            "itemCode": "itemcode",
                            "itemName": "itemname",
                            "quantity": 1,
                            "state": "registered",
                            "sentCount": 0,
                            "regTime": 1,
                            "modTime": 1,
                            "sentTime": null,
                            "confirmedTime": null,
                            "expiredTime": 1,
                            "expiryTime": 1,
                            "validityTime": -1
                        }],
                        "existUnconfirmedItems": true
                    }]
                };

                callback(200, result);
            },
            claimMessageItems: function (messageIds, callback) {
                let result = {
                    "results": [{
                        "messageId": "6b3cc191-9550-441a-94d7-7c6df3022e05",
                        "status": 200,
                        "receiverId": "998921942266",
                        "senderId": "998921942266",
                        "resourceMap": {},
                        "items": [{
                            "appId": "122193",
                            "itemCode": "20006_testitem",
                            "quantity": 1,
                            "itemId": "23a4d5f3-32b2-4541-9c52-2dfa2f70fb0f",
                            "validityTime": -1,
                            "senderId": "998921942266"
                        }]
                    }]
                };
                callback(200, result);
            },
            finishMessage: function (messageids, callback) {
                let result = {
                    "results": [{
                        "messageId": "6b3cc191-9550-441a-94d7-7c6df3022e05",
                        "status": 200
                    }]
                };

                callback(200, result);
            }
        },
        Util: {
            createShortcut() {
                Debug.log("");
            },
            openInAppBrowser: function (url) {
                Debug.log(url);
            },
            openExternalBrowser: function (url) {
                Debug.log(url);
            },
            getSharedLinks() {
                Debug.log("https://to.kakaogame.com/snack/20136/");
            }
        }
    }
}