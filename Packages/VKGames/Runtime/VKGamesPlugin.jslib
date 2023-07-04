const library = {
    $vkGames: {
        bridge: undefined,

        isInitialized: false,

        vkWebAppInit: function (onInitializedCallback, onErrorCallback, isTest) {

            if (vkGames.isInitialized) {
                return;
            }

            function setupVkBridge() {
                function invokeSuccess() {
                    vkGames.isInitialized = true;
                    vkGames.bridge = window['vkBridge'];
                    dynCall('v', onInitializedCallback);
                }

                function invokeFailure(error) {
                    dynCall('v', onErrorCallback);
                    console.error(error);
                }

                if (isTest) {
                    window['vkBridge'] = {
                        send: function () {
                            return new Promise(function (resolve, reject) {
                                setTimeout(function () {
                                    reject(new Error('Error returned for testing purposes.'));
                                }, 0);
                            });
                        }
                    };
                    invokeSuccess();
                } else {
                    window['vkBridge'].send("VKWebAppInit", {})
                        .then(function (data) {
                            if (data.result) {
                                invokeSuccess();
                            } else {
                                invokeFailure(new Error('vkBridge failed to initialize.'));
                            }
                        })
                        .catch(function (error) {
                            invokeFailure(error);
                        });
                }
            }

            if (window['vkBridge'] == null) {
                const sdkScript = document.createElement('script');
                sdkScript.src = 'https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js';
                document.head.appendChild(sdkScript);

                sdkScript.onload = setupVkBridge;
                return;
            }

            setupVkBridge();
        },

        throwIfSdkNotInitialized: function () {
            if (!vkGames.isInitialized) {
                throw new Error('SDK is not initialized. Invoke VKGamesSdk.Initialize() coroutine and wait for it to finish.');
            }
        },

        vkWebAppShowRewardedAd: function (onRewardedCallback, onErrorCallback) {
            vkGames.bridge.send("VKWebAppShowNativeAds", { ad_format: "reward" })
                .then(function (data) {
                    if (data.result)
                        dynCall('v', onRewardedCallback);
                })
                .catch(function (error) {
                    dynCall('v', onErrorCallback);
                    console.log(error);
                });
        },

        vkWebAppShowInterstitialAd: function (onOpenCallback, onErrorCallback) {
            vkGames.bridge.send("VKWebAppShowNativeAds", { ad_format: "interstitial" })
                .then(function (data) {
                    if (data.result)
                        dynCall('v', onOpenCallback);
                })
                .catch(function (error) {
                    dynCall('v', onErrorCallback);
                    console.log(error);
                });
        },

        vkWebAppShowLeaderboardBox: function (playerScore, onErrorCallback) {
            vkGames.bridge.send("VKWebAppShowLeaderBoardBox", { user_result: playerScore })
                .then(function (data) {
                    console.log(data.success);
                })
                .catch(function (error) {
                    dynCall('v', onErrorCallback);
                    console.log(error);
                });
        },

        vkWebAppShowInviteBox: function (onSuccessCallback, onErrorCallback) {
            vkGames.bridge.send("VKWebAppShowInviteBox", {})
                .then(function (data) {
                    if (data.success)
                        dynCall('v', onSuccessCallback);
                })
                .catch(function (error) {
                    dynCall('v', onErrorCallback);
                    console.log(error);
                });
        },

        vkWebAppJoinGroup: function (groupId, onSuccessCallback, onErrorCallback) {
            vkGames.bridge.send("VKWebAppJoinGroup", { "group_id": groupId })
                .then(function (data) {
                    if (data.result)
                        dynCall('v', onSuccessCallback);
                })
                .catch(function (error) {
                    dynCall('v', onErrorCallback);
                    console.log(error);
                });
        },
        
        vkWebAppShowOrderBox: function (itemId, onPaySuccessCallback, onErrorCallback) {
            vkGames.bridge.send('VKWebAppShowOrderBox', { 
                    type: 'item', 
                    item: UTF8ToString(itemId)
                })
                .then((data) => {
                    if (data.success) {
                        dynCall('v', onPaySuccessCallback);
                }})
                .catch((error) => {
                    dynCall('v', onErrorCallback);
                    console.log(error);
                });
        },

        vkWebAppGetCloudSaveData: function (keysJsonArray, onSuccessCallback, onErrorCallback) {
            const jsonArray = JSON.parse(keysJsonArray);
            console.log(jsonArray);
            vkGames.bridge.send("VKWebAppStorageGet", jsonArray)
                .then(function (data) {
                    if(data.keys)
                    {
                        console.log(data);
                        const result = JSON.stringify(data);
                        const bridgeDataUnmanagedStringPtr = vkGames.allocateUnmanagedString(result);
                        dynCall('vi', onSuccessCallback, [bridgeDataUnmanagedStringPtr]);
                        _free(bridgeDataUnmanagedStringPtr);
                    }
                })
                .catch(function (error) {
                    dynCall('v', onErrorCallback);
                    console.log(error);
                });
        },
        
        vkWebAppSetCloudSaveData: function (key, value, onSuccessCallback, onErrorCallback) {
            vkGames.bridge.send("VKWebAppStorageSet", { "key": key.toString(), "value": value.toString() })
                .then(function (data) {
                    if(data.result)
                        dynCall('v', onSuccessCallback);
                })
                .catch(function (error) {
                    dynCall('v', onErrorCallback);
                    console.log(error);
                });
        },

        vkWebAppStorageGetKeys: function (amount, offset, onSuccessCallback, onErrorCallback) {
            vkGames.bridge.send("VKWebAppStorageGetKeys", { "count": amount, "offset": offset })
                .then(function (data) {
                    if(data.keys)
                    {
                        var serialized = JSON.stringify(data);
                        var bridgeDataUnmanagedStringPtr = vkGames.allocateUnmanagedString(serialized);
                        dynCall('vi', onSuccessCallback, [bridgeDataUnmanagedStringPtr]);
                        _free(bridgeDataUnmanagedStringPtr);
                    }
                })
                .catch(function (error) {
                    dynCall('v', onErrorCallback);
                    console.log(error);
                });
        },

        allocateUnmanagedString: function (string) {
            const stringBufferSize = lengthBytesUTF8(string) + 1;
            const stringBufferPtr = _malloc(stringBufferSize);
            stringToUTF8(string, stringBufferPtr, stringBufferSize);
            return stringBufferPtr;
        }
    },

    // C# calls

    WebAppInit: function (onInitializedCallback, onErrorCallback, isTest) {
        isTest = !!isTest;
        vkGames.vkWebAppInit(onInitializedCallback, onErrorCallback, isTest);
    },

    IsInitialized: function () {
        return vkGames.isInitialized;
    },

    ShowRewardedAds: function (onRewardedCallback, onErrorCallback) {
        vkGames.throwIfSdkNotInitialized();

        vkGames.vkWebAppShowRewardedAd(onRewardedCallback, onErrorCallback);
    },

    ShowInterstitialAds: function (onOpenCallback, onErrorCallback) {
        vkGames.throwIfSdkNotInitialized();

        vkGames.vkWebAppShowInterstitialAd(onOpenCallback, onErrorCallback);
    },

    ShowLeaderboardBox: function (playerScore, onErrorCallback) {
        vkGames.throwIfSdkNotInitialized();

        vkGames.vkWebAppShowLeaderboardBox(playerScore, onErrorCallback);
    },

    ShowInviteBox: function (onSuccessCallback, onErrorCallback) {
        vkGames.throwIfSdkNotInitialized();

        vkGames.vkWebAppShowInviteBox(onSuccessCallback, onErrorCallback);
    },

    JoinGroup: function (groupId, onSuccessCallback, onErrorCallback) {
        vkGames.throwIfSdkNotInitialized();
        
        vkGames.vkWebAppJoinGroup(groupId, onSuccessCallback, onErrorCallback);
    },

    ShowOrderBox: function (itemId, onPaySuccessCallback, onErrorCallback) {
        vkGames.throwIfSdkNotInitialized();

        vkGames.vkWebAppShowOrderBox(itemId, onPaySuccessCallback, onErrorCallback);
    },
    
    StorageGetCloudSaveData: function (keysJsonArrayPtr, onSuccessCallback, onErrorCallback) {
        vkGames.throwIfSdkNotInitialized();

        const keysJsonArray = UTF8ToString(keysJsonArrayPtr);
        
        vkGames.vkWebAppGetCloudSaveData(keysJsonArray, onSuccessCallback, onErrorCallback);
    },
    
    StorageSetCloudSaveData: function (keyStringPtr, valueStringPtr, onSuccessCallback, onErrorCallback) {
        vkGames.throwIfSdkNotInitialized();

        const key = UTF8ToString(keyStringPtr);
        const value = UTF8ToString(valueStringPtr);

        vkGames.vkWebAppSetCloudSaveData(key, value, onSuccessCallback, onErrorCallback);
    },

    StorageGetAllKeys: function (amount, offset, onSuccessCallback, onErrorCallback) {
        vkGames.throwIfSdkNotInitialized();

        vkGames.vkWebAppStorageGetKeys(amount, offset, onSuccessCallback, onErrorCallback);
    }
}

autoAddDeps(library, '$vkGames');
mergeInto(LibraryManager.library, library);
