if (typeof FBInstant !== 'object') {

    //https://developers.facebook.com/docs/games/instant-games/sdk/fbinstant6.2
    var MockObject = {
        data: {},
        signature: 'Eii6e636mz5J47sfqAYEK40jYAwoFqi3x5bxHkPG4Q4.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImlzc3VlZF9hdCI6MTUwMDM5ODY3NSwicGxheWVyX2lkIjoiMTI0OTUyNTMwMTc1MjIwMSIsInJlcXVlc3RfcGF5bG9hZCI6Im15X2ZpcnN0X3JlcXVlc3QifQ',
        showAdCount: 0
    }
    var FBInstant = {
        //(): string
        getLocale: function () {
            return 'ko_KR'
        },
        //(): string
        //"IOS" | "ANDROID" | "WEB" | "MOBILE_WEB"
        getPlatform: function () {
            return 'ANDROID';
        },
        //(): string
        getSDKVersion: function () {
            return '6.2'
        },
        //(): Promise<void>
        initializeAsync: function () {
            return Promise.resolve();
        },
        //(percentage: number): void
        setLoadingProgress: function (progress) {
            // console.log('progress', progress, '%');
            if (progress === 100) {
                console.log('progress complete');
            }
        },
        //(): Array<string>
        getSupportedAPIs: function () {
            if (!MockObject.apis) {
                MockObject.apis = [];
                for (let key in this) {
                    if (typeof (this[key]) == 'function') {
                        MockObject.apis.push(key);
                    }
                }
            }
            return MockObject.apis;
        },
        //(): Object
        getEntryPointData: function () {
            return 'mock entry point';
        },
        //(): Promise<string>
        getEntryPointAsync: function () {
            return new Promise(function (resolve, reject) {
                resolve('mock entry point');
            });
        },
        /**
         * (sessionData: Object): void
         * 게임에서 현재 세션 데이터를 업데이트하고자 할 때마다 이 함수를 호출해야 합니다. 
         * 이 세션 데이터는 게임 이용 webhooks 등 다양한 페이로드를 채우기 위해 사용할 수도 있습니다.
         * 문자열로 만들 때 1,000자 이하여야 합니다.
         */
        setSessionData: function (sessionData) {
            console.log('sessionData : ', sessionData);
        },
        //(): Promise<void>
        startGameAsync: function () {
            return new Promise(function (resolve, reject) {
                console.log('wait for 1sec start game');
                setTimeout(function () {
                    console.log('start game');
                    resolve();
                }, 1000);
            });
        },
        /**
         * (payload: SharePayload): Promise<void>
         * 반환된 프라미스는 사용자가 실제로 콘텐츠를 공유했는지, 
         * 공유하지 않았는지에 관계없이 대화 상자가 닫힐 때 확정됩니다.
         */
        shareAsync: function (payload) {
            return new Promise(function (resolve, reject) {
                console.log('show share ui and closes in 1 second.');
                setTimeout(function () {
                    console.log('close share ui');
                    resolve();
                }, 1000);
            });
            //exception
            //return Promise.reject('INVALID_PARAM');
            //return Promise.reject('NETWORK_FAILURE');
            //return Promise.reject('PENDING_REQUEST');
            //return Promise.reject('CLIENT_UNSUPPORTED_OPERATION');
            //return Promise.reject('INVALID_OPERATION');
        },
        //(payload: UpdatePayload): Promise<void>
        updateAsync: function (payload) {
            return Promise.resolve('update success');
        },
        //(): void
        quit: function () {
            console.log('game quit');
        },
        //(eventName: string, valueToSum: number, parameters: Object): APIError
        logEvent: function (eventName, valueToSum, parameters) {
            console.log('success');
            return null;
            // console.log('error');
            // return new APIError('error code','message');
        },
        //(func: Function): void
        onPause: function (func) {
            console.log('add pause listener');
        },
        //(placementID: string): Promise<AdInstance | APIError>
        getInterstitialAdAsync: function (placementID) {
            // return Promise.resolve(new APIError('not support platform', 'not ios, android'));
            return Promise.resolve(new AdInstance(placementID = placementID));
        },
        //(placementID: string): Promise<AdInstance | APIError>
        getRewardedVideoAsync: function (placementID) {
            // return Promise.resolve(new APIError('not support platform', 'not ios, android'));
            return Promise.resolve(new AdInstance());
        },
        //(matchTag?: string): Promise<void>
        matchPlayerAsync: function (matchTag, switchContextWhenMatched) {
            MockObject.context.id = '87654321';
            console.log('change context : ', FBInstant.context.getID());
            return Promise.resolve();
        },
        //(): Promise<boolean>
        checkCanPlayerMatchAsync: function () {
            console.log('not support api');
            return Promise.resolve(false);
        },
        //(name: string): Promise<Leaderboard>
        getLeaderboardAsync: function (name) {
            if (!MockObject.leaderboard) {
                MockObject.leaderboard = {};
            }
            if (!MockObject.leaderboard[name]) {
                let board = new Leaderboard();
                board.name = name;
                MockObject.leaderboard[name] = board;
            }
            return Promise.resolve(MockObject.leaderboard[name]);
            // return Promise.reject("not support local client");
        },
        /**
         * (appID: string, data?: string): Promise<void>
         * 크로스 프로모션 API
         * @param appID 전환할 인스턴트 게임의 앱 ID입니다. 앱은 인스턴트 게임이어야 하고 
         *              현재 게임과 같은 비즈니스에 속해야 합니다. 
         *              여러 게임을 한 비즈니스에 연결하려면 비즈니스 관리자
         *              (https://developers.facebook.com/docs/apps/business-manager#update-business)를 사용해야 합니다.
         * @param data 선택적인 데이터 페이로드입니다. 
         *             전환 중인 게임의 진입점 데이터로 설정됩니다. 문자열로 만들 때 1,000자 이하여야 합니다.
         */
        //
        switchGameAsync: function (appID, data) {
            console.log('success switch game : ', appID);
            return Promise.resolve();
            // return Promise.reject('USER_INPUT'|'INVALID_PARAM'|'PENDING_REQUEST'|'CLIENT_REQUIRES_UPDATE');
        },
        //(): Promise<boolean>;
        canCreateShortcutAsync: function () {
            console.log('no using shortcut');
            return Promise.resolve(true);
        },
        //(canCreateShortcutAsync: boolean): Promise<void>;
        createShortcutAsync: function () {
            return new Promise(function (resolve, reject) {
                setTimeout(() => {
                    console.log("create Shotcut");
                    resolve();
                }, 1000);
            });
        },
        player: {
            //(): string
            getID: function () {
                return '11112222_mock_player';
            },
            //(): Promise<SignedPlayerInfo>
            getSignedPlayerInfoAsync: function () {
                return Promise.resolve(new SignedPlayerInfo());
            },
            //(): Promise<boolean>
            canSubscribeBotAsync: function () {
                console.log('no using bot');
                return Promise.resolve(false);
            },
            //(): Promise<void>
            subscribeBotAsync: function () {
                return Promise.resolve();
            },
            //(): string
            getName: function () {
                return 'mock player';
            },
            //(): string
            getPhoto: function () {
                return null;
            },
            //(keys: Array<string>): Promise<Object>
            getDataAsync: function (keys) {
                return new Promise(function (resolve, reject) {
                    let platform = Container.resolve(PlatformProvider);
                    console.log('get data : ', keys);
                    let object = {};
                    for (let key of keys) {

                        let data = platform.getLocalData(key, {});
                        object[key] = data;

                        // if (MockObject.data[key]) {
                        //     object[key] = MockObject.data[key];
                        // }
                    }
                    resolve(object);
                });
            },
            //(data: Object): Promise<void>
            setDataAsync: function (data) {
                return new Promise(function (resolve, reject) {
                    let platform = Container.resolve(PlatformProvider);
                    for (let key in data) {
                        // MockObject.data[key] = data[key];
                        platform.setLocalData(key, data[key]);
                    }
                    // MockObject.data = data;

                    resolve();
                });
            },
            /**
             * (): Promise<void>
             * 게이머 데이터의 모든 변경 사항을 지정된 클라우드 저장소에 즉시 플러시합니다. 
             * 중요한 변경점을 클라우드에 저장 할 시 Set API 후 사용.
             * 이 함수의 결과가 대기 중인 동안은 player.setDataAsync 호출이 거부됩니다.
             */
            flushDataAsync: function () {
                console.log('flush cloud data');
                return Promise.resolve();
            },
            //(keys: Array<string>): Promise<Object>
            //현재 게이머 전용 클라우드 저장소에서 통계를 가져옵니다.
            getStatsAsync: function (keys) {
                let data = {};
                if (!MockObject.stats) {
                    MockObject.stats = {};
                }
                for (let key of keys) {
                    if (MockObject.stats[key]) {
                        data[key] = MockObject.stats[key];
                    }
                }
                return Promise.resolve(data);
            },
            //(stats: Object): Promise<void>
            //개체에는 숫자 값만 포함해야 합니다. 숫자가 아닌 값을 포함할 경우 전체 수정 내용이 거부됩니다.
            setStatsAsync: function (stats) {
                if (!MockObject.stats) {
                    MockObject.stats = {};
                }
                for (let key in stats) {
                    MockObject.stats[key] = stats[key];
                }
                return Promise.resolve();
            },
            //(increments: Object): Promise<Object>
            //개체에는 숫자 값만 포함해야 합니다. 숫자가 아닌 값을 포함할 경우 전체 수정 내용이 거부됩니다.
            incrementStatsAsync: function (increments) {
                let data = {};
                if (!MockObject.stats) {
                    MockObject.stats = {};
                }
                for (let key of increments) {
                    if (MockObject.stats[key]) {
                        MockObject.stats[key] += increments[key];
                        data[key] = MockObject.stats[key];
                    }
                }
                return Promise.resolve(data);
            },
            //(): Promise<Array<ConnectedPlayer>>
            getConnectedPlayersAsync: function () {
                return new Promise(function (resolve, reject) {
                    let array = [];
                    array.push(new ConnectedPlayer('id_1', 'player_1', 'photo_1'));
                    array.push(new ConnectedPlayer('id_2', 'player_2', 'photo_2'));
                    array.push(new ConnectedPlayer('id_3', 'player_3', 'photo_3'));
                    resolve(array);
                });
            }
        },
        context: {
            //(): string
            getID: function () {
                if (!MockObject.context.id) {
                    MockObject.context.id = '12345678';
                }
                return MockObject.context.id;
            },
            //(): string
            //"POST" | "THREAD" | "GROUP" | "SOLO"
            getType: function () {
                return 'SOLO';
            },
            //(minSize: number, maxSize: number): { answer: boolean, minSize: number, maxSize: number }
            //현재 게임 컨텍스트의 참가자 수가 지정된 최소값과 최대값 사이(최소값과 최대값 포함)에 있는지 확인합니다. 
            //Context Size가 null일 경우에는 null 반환
            isSizeBetween: function (minSize, maxSize) {
                if (!MockObject.context.size) {
                    MockObject.context.size = null;
                    return null;
                } else {
                    let size = MockObject.context.size;
                    if (minSize <= size && maxSize >= size) {
                        return new ContextSizeResponse(true, minSize, maxSize);
                    } else {
                        return new ContextSizeResponse(false, minSize, maxSize);
                    }
                }
            },
            /**
             * (id: string): Promise<void>
             * @param id contextid
             * 해당 컨텍스트에 들어갈 수 있는 권한이 없을 경우 거부.
             */
            switchAsync: function (id) {
                console.log('request switch context id : ', id);
                MockObject.context.id = id;
                return Promise.resolve();
            },
            //(options?: ChooseAsyncOptions): Promise<void>
            //게이머가 메뉴를 종료하거나 클라이언트가 새 컨텍스트로 전환하지 못하는 경우 이 함수가 거부됩니다.
            chooseAsync: function (options) {
                console.log('choose options : ', options);
                return Promise.resolve();
            },
            //(playerID: string): Promise<void>
            //지정된 게이머와 현재 게이머 사이에 컨텍스트를 만들거나 전환하려고 시도한다.
            createAsync: function (playerID) {
                return Promise.resolve();
            },
            //(): Promise<Array<ContextPlayer>>
            getPlayersAsync: function () {
                return new Promise(function (resolve, reject) {
                    let players = [];
                    players.push(new ContextPlayer('id_1', 'player_1', 'photo_1'));
                    players.push(new ContextPlayer('id_2', 'player_2', 'photo_2'));
                    players.push(new ContextPlayer('id_3', 'player_3', 'photo_3'));
                    resolve(players);
                });
            }
        },
        payments: {
            //(): Promise<Array<Product>>
            getCatalogAsync: function () {
                return new Promise(function (resolve, reject) {
                    let products = [];
                    products.push(new Product(
                        title = "item 01",
                        productID = 'id_1111',
                        price = '1300',
                        priceCurrencyCode = '???'
                    ));
                    products.push(new Product(
                        title = "item 02",
                        productID = 'id_2222',
                        price = '3200',
                        priceCurrencyCode = '???'
                    ));
                    products.push(new Product(
                        title = "item 03",
                        productID = 'id_3333',
                        price = '45667',
                        priceCurrencyCode = '???'
                    ));
                    resolve(products);
                });
            },
            //(purchaseConfig: PurchaseConfig): Promise<Purchase>
            purchaseAsync: function (purchaseConfig) {
                return new Promise(function (resolve, reject) {
                    let purchase = new Purchase();
                    purchase.productID = purchaseConfig.productID; //구매할 제품의 식별자
                    purchase.paymentID = 'paymentid.' + purchaseConfig.productID; //구매 거래의 식별자
                    purchase.purchaseTime = Math.floor(new Date().getTime() / 1000);
                    purchase.purchaseToken = 'token.' + purchaseConfig.productID; //구매한 제품의 유니크한 값
                    purchase.developerPayload = purchaseConfig.developerPayload;
                    purchase.signedRequest = MockObject.signature;
                });
            },
            //(): Promise<Array<Purchase>>
            //게이머의 대기 중인 모든 구매를 가져옵니다. (구매 후 소비하지 않은 항목으로 보임)
            getPurchasesAsync: function () {
                return new Promise(function (resolve, reject) {
                    let purchases = [];
                    for (let i = 0; i < 3; i++) {
                        let purchase = new Purchase();
                        let productID = 'productID.' + i;
                        purchase.productID = productID; //구매할 제품의 식별자
                        purchase.paymentID = 'paymentid.' + productID; //구매 거래의 식별자
                        purchase.purchaseTime = Math.floor(new Date().getTime() / 1000);
                        purchase.purchaseToken = 'token.' + productID; //구매한 제품의 유니크한 값
                        purchase.developerPayload = 'developerPayload.' + i;
                        purchase.signedRequest = MockObject.signature;
                        purchases.push(purchase);
                    }
                    resolve(purchases);
                });
            },
            //(purchaseToken: string): Promise<void>
            consumePurchaseAsync: function (purchaseToken) {
                return Promise.resolve('purchase successfully consumed : ', purchaseToken);
            },
            //(callback: Function): void
            onReady: function (callback) {
                callback();
            }
        }
    }
    function APIError(code, message) { //(code:string, message:string)
        this.code = code;
        this.message = message;
    }

    function AdInstance(placementID) {
        this.placementID = placementID;
        //(): string
        this.getPlacementID = function () {
            return this.placementID;
        }

        //(): Promise<void>
        this.loadAsync = function () {
            return new Promise((resolve, reject) => {
                console.log('loading ad');
                setTimeout(() => {
                    resolve();
                }, 1000);
            });
        }

        //(): Promise<void>
        this.showAsync = function () {
            if (++MockObject.showAdCount > 3) {
                MockObject.showAdCount = 0;
                let error = {
                    code: "no_fill",
                    message: "no fill"
                };
                return Promise.reject(error);
            } else {
                return new Promise((resolve, reject) => {
                    console.log('showing ad');
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                });
            }
        }
    }

    // using FBInstant
    function Leaderboard(name) {
        this.name = name;

        //(): string;
        this.getName = function () {
            return this.name;
        }

        //(): string | null;
        this.getContextID = function () {
            return "";
        }

        //(): Promise<number>;
        this.getEntryCountAsync = function () {
            return Promise.resolve(0);
        }

        //(score: number, extraData?: string): Promise<LeaderboardEntry>;
        this.setScoreAsync = function (score, extraData) {
            return Promise.resolve(new LeaderboardEntry(score = score));
        }

        //(): Promise<LeaderboardEntry | null>;
        this.getPlayerEntryAsync = function () {
            return Promise.resolve(new LeaderboardEntry());
        }

        //(count?: number, offset?: number): Promise<Array<LeaderboardEntry>>;
        this.getEntriesAsync = function (count, offset) {
            let array = [];
            for (let i = offset; i < offset + count; i++) {
                array.push(new LeaderboardEntry(rank = i, score = rank * 1000, name = 'player_' + i));
            }
            return Promise.resolve(array);
        }

        //(count: number, offset: number): Promise<Array<LeaderboardEntry>>;
        this.getConnectedPlayerEntriesAsync = function (count, offset) {
            let array = [];
            for (let i = offset; i < offset + count; i++) {
                array.push(new LeaderboardEntry(rank = i, score = rank * 1000, name = 'player_' + i));
            }
            return Promise.resolve(array);
        }
    }
    function LeaderboardEntry(score, rank, name) {
        this.score = score;
        this.rank = rank;
        //(): number;
        this.getScore = function () {
            return this.score;
        }

        //(): string;
        this.getFormattedScore = function () {
            return "";
        }

        //(): number;
        this.getTimestamp = function () {
            return 0;
        }

        //(): number;
        this.getRank = function () {
            return this.rank;
        }

        //(): string | null;
        this.getExtraData = function () {
            return "";
        }

        //(): LeaderboardPlayer;
        this.getPlayer = function () {
            return new LeaderboardPlayer(name = name);
        }
    }
    function LeaderboardPlayer(name) {
        this.name = name
        //(): string;
        this.getName = function () {
            return this.name;
        }

        //(): string;
        this.getPhoto = function () {
            return "";
        }

        //(): string;
        this.getID = function () {
            return "";
        }
    }
    function SharePayload() {
        //string, "INVITE" | "REQUEST" | "CHALLENGE" | "SHARE"
        this.intent = "";
        //string
        this.image = "";
        //string
        this.text = "";
        //Object
        //공유에 첨부할 데이터의 Blob입니다. 공유에서 시작된 모든 게임 세션에서 
        //FBInstant.getEntryPointData()를 통해 이 Blob에 액세스할 수 있습니다.
        this.data = null;
    }
    function ContextSizeResponse(answer, minSize, maxSize) {
        //현재 컨텍스트 크기가 개체에 지정된 minSize와 maxSize 사이이면 true이고, 
        //그렇지 않으면 false입니다.
        this.answer = answer;
        this.minSize = minSize;
        this.maxSize = maxSize;
    }

    //using FBPlayer
    function ConnectedPlayer(id, name, photo) {
        this.id = id;
        this.name = name;
        this.photo = photo;
        //(): string
        this.getID = function () {
            return this.id;
        }
        //(): string
        this.getName = function () {
            return this.name;
        }
        // /(): string
        this.getPhoto = function () {
            return this.photo;
        }
    }
    function SignedPlayerInfo() {
        //(): string
        this.getPlayerID = function () {
            return "signed player id";
        }
        //(): string
        this.getSignature = function () {
            return "Eii6e636mz5J47sfqAYEK40jYAwoFqi3x5bxHkPG4Q4.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImlzc3VlZF9hdCI6MTUwMDM5ODY3NSwicGxheWVyX2lkIjoiMTI0OTUyNTMwMTc1MjIwMSIsInJlcXVlc3RfcGF5bG9hZCI6Im15X2ZpcnN0X3JlcXVlc3QifQ";
        }
    }

    //using Context
    function ContextPlayer(id, name, photo) {
        this.id = id;
        this.name = name;
        this.photo;

        //(): string;
        this.getID = function () {
            return this.id;
        }
        //(): string;
        this.getName = function () {
            return this.name;
        }
        // /(): string;
        this.getPhoto = function () {
            return this.photo;
        }
    }
    function ChooseAsyncOptions() {
        /**
         * array<string>
         * '컨텍스트 선택' 작업에 적용할 수 있는 필터.
         * 'NEW_CONTEXT_ONLY' - 게임이 아직 이용되지 않은 컨텍스트만 표시합니다.
         *  'INCLUDE_EXISTING_CHALLENGES' - 게이머가 일부인, 적극적으로 이용된 컨텍스트를 
         *                                  표시하는 '기존 도전' 섹션이 포함됩니다.
         * 'NEW_PLAYERS_ONLY' - 개인이 포함되는 섹션에 게임을 아직 이용하지 않은 사람을 표시합니다.
         */
        this.filters = null;
        //number
        this.maxSize = null;
        //number
        this.minSize = null;
    }

    //using Payments
    function Product(title, productID, description, imageURI, price, priceCurrencyCode) {
        //string
        this.title = title;
        //string
        this.productID = productID;
        //string
        this.description = description;
        //string
        this.imageURI = imageURI;
        //string
        this.price = price;
        //string
        this.priceCurrencyCode = priceCurrencyCode;
    }
    function PurchaseConfig() {
        //string
        this.productID = "";
        //string
        this.developerPayload = "";
    }
    function Purchase() {
        //string
        this.developerPayload = "";
        //string
        this.paymentID = "";
        //string
        this.productID = "";
        //string
        this.purchaseTime = "";
        //string
        this.purchaseToken = "";
        //string
        this.signedRequest = "";
    }

    //using update payload 
    function CustomUpdatePayload() {
        //string, 
        //'CUSTOM' - 게임에서 지정된 모든 콘텐츠가 포함된 맞춤 업데이트입니다.
        this.action = "CUSTOM";
        //string | LocalizableContent(로컬라이즈가 필요한 경우)
        //ex) 'Join The Fight'
        this.cta = "";
        //string, base64Picture
        this.image = "";
        //string | LocalizableContent(로컬라이즈가 필요한 경우)
        this.text = "";
        //string
        //이 맞춤 업데이트에서 사용하는 템플릿의 ID입니다. 템플릿은 fbapp-config.json에서 미리 정의해야 합니다.
        this.template = "";
        /**
         * Object
         * 업데이트에 첨부할 데이터의 Blob입니다. 
         * 업데이트에서 시작된 모든 게임 세션에서 
         * FBInstant.getEntryPointData()를 통해 이 Blob에 액세스할 수 있습니다.
         * 문자열로 만들 때 1,000자 이하여야 합니다.
         */
        this.data = null;

        /**
         * string
         * 업데이트가 전달되는 방식을 지정합니다.
         * 'IMMEDIATE' - 업데이트가 즉시 게시되어야 합니다.
         * 'LAST' - 게임 세션이 종료될 때 업데이트가 게시되어야 합니다. 
         *          'LAST' 전략을 사용하여 전송된 최근의 업데이트가 전송됩니다.
         * 'IMMEDIATE_CLEAR' - 업데이트가 즉시 게시되며 대기 중인 다른 업데이트
         *                     (예: 'LAST' 전략을 사용하여 전송된 업데이트)를 모두 지웁니다. 
         *                     전략이 지정되지 않으면 'IMMEDIATE'로 기본 설정됩니다.
         */
        this.strategy = "";

        /**
         * string
         * 맞춤 업데이트의 알림 설정을 지정합니다.
         *  'NO_PUSH' - default | 'PUSH'
         */
        this.notification = "";
    }
    function LeaderboardUpdatePayload() {
        //string
        //'LEADERBOARD' - 인스턴트 게임 리더보드와 연결된 업데이트입니다.
        //기본적으로 현지화된 'Play Now'가 버튼 텍스트로 사용됩니다.
        this.action = "LEADERBOARD";
        //string
        //업데이트에 포함할 리더보드의 이름입니다.
        this.name = "";
        //string
        //선택적 텍스트 메시지입니다. 지정하지 않으면 현지화된 폴백 메시지가 대신 제공됩니다.
        this.text = "";
    }

    //using CustomUpdatePayload
    function LocalizableContent() {

        //string
        //ex) 'X just invaded Y\'s village!'
        this.default = "";
        /**
         * Object
         * ex)
         * {
         * ar_AR: 'X \u0641\u0642\u0637 \u063A\u0632\u062A ' + '\u0642\u0631\u064A\u0629 Y!',
         * en_US: 'X just invaded Y\'s village!',
         * es_LA: '\u00A1X acaba de invadir el pueblo de Y!',
         * }
         */
        this.localizations = {};
    }
}
