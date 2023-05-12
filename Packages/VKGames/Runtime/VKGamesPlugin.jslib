const library = {
    $vkSDK: {
        bridge: undefined,

        isInitialized: false,

        vkWebAppInit: function (onInitializedCallback, onErrorCallback, isTest) {

            if (vkSDK.isInitialized) {
                return;
            }
                
            const sdkScript = document.createElement('script');
            sdkScript.src = 'https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js';
            document.head.appendChild(sdkScript);

            sdkScript.onload = function () {
                function invokeSuccess() {
                    vkSDK.isInitialized = true;
                    vkSDK.bridge = window['vkBridge'];
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
        },

        throwIfSdkNotInitialized: function () {
            if (!vkSDK.isInitialized) {
                throw new Error('SDK is not initialized. Invoke VKGamesSdk.Initialize() coroutine and wait for it to finish.');
            }
        },

        vkWebSAppShowRewardedAd: function (onRewardedCallback, onErrorCallback) {
            vkSDK.bridge.send("VKWebAppShowNativeAds", { ad_format: "reward" })
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
            vkSDK.bridge.send("VKWebAppShowNativeAds", { ad_format: "interstitial" })
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
            vkSDK.bridge.send("VKWebAppShowLeaderBoardBox", { user_result: playerScore })
                .then(function (data) {
                    console.log(data.success);
                })
                .catch(function (error) {
                    dynCall('v', onErrorCallback);
                    console.log(error);
                });
        },

        vkWebAppShowInviteBox: function (onSuccessCallback, onErrorCallback) {
            vkSDK.bridge.send("VKWebAppShowInviteBox", {})
                .then(function (data) {
                    if (data.success)
                        dynCall('v', onSuccessCallback);
                })
                .catch(function (error) {
                    dynCall('v', onErrorCallback);
                    console.log(error);
                });
        },

        vkWebJoinGroup: function (onSuccessCallback, onErrorCallback) {
            vkSDK.bridge.send("VKWebAppJoinGroup", { "group_id": 84861196 })
                .then(function (data) {
                    if (data.result)
                        dynCall('v', onSuccessCallback);
                })
                .catch(function (error) {
                    dynCall('v', onErrorCallback);
                    console.log(error);
                });
        },
        
        getUserData: function (key, onSuccessCallback, onErrorCallback) {
            vkSdk.bridge.send("VKWebAppStorageGet", { "key": key })
                .then(function (data) {
                    const result = data.keys[0];
                    const bridgeDataUnmanagedStringPtr = vkSDK.allocateUnmanagedString(result);
                    dynCall('vi', onSuccessCallback, [bridgeDataUnmanagedStringPtr]);
                    _free(bridgeDataUnmanagedStringPtr);
                })
                .catch(function (error) {
                    dynCall('v', onErrorCallback);
                    console.log(error);
                });
        },
        
        setUserData: function (key, value, onSuccessCallback, onErrorCallback) {
            vkSdk.bridge.send("VKWebAppStorageSet", { "key": key, "value": value })
                .then(function (data) {
                    if(data.result)
                        dynCall('v', onSuccessCallback);
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
        vkSDK.vkWebAppInit(onInitializedCallback, onErrorCallback, isTest);
    },

    ShowRewardedAds: function (onRewardedCallback, onErrorCallback) {
        vkSDK.throwIfSdkNotInitialized();

        vkSDK.vkWebSAppShowRewardedAd(onRewardedCallback, onErrorCallback);
    },

    ShowInterstitialAds: function (onOpenCallback, onErrorCallback) {
        vkSDK.throwIfSdkNotInitialized();

        vkSDK.vkWebAppShowInterstitialAd(onOpenCallback, onErrorCallback);
    },

    ShowLeaderboardBox: function (playerScore, onErrorCallback) {
        vkSDK.throwIfSdkNotInitialized();

        vkSDK.vkWebAppShowLeaderboardBox(playerScore, onErrorCallback);
    },

    ShowInviteBox: function (onSuccessCallback, onErrorCallback) {
        vkSDK.throwIfSdkNotInitialized();

        vkSDK.vkWebAppShowInviteBox(onSuccessCallback, onErrorCallback);
    },

    JoinIjuniorGroup: function (onSuccessCallback, onErrorCallback) {
        vkSDK.throwIfSdkNotInitialized();
        
        vkSDK.vkWebJoinGroup(onSuccessCallback, onErrorCallback);
    },
    
    GetUserData: function (key, onSuccessCallback, onErrorCallback) {
        vkSDK.throwIfSdkNotInitialized();
        
        vkSDK.getUserData(key, onSuccessCallback, onErrorCallback);
    },
    
    SetUserData: function (key, value, onSuccessCallback, onErrorCallback) {
        vkSDK.throwIfSdkNotInitialized();

        vkSDK.setUserData(key, value, onSuccessCallback, onErrorCallback);
    },

    IsInitialized: function () {
        return vkSDK.isInitialized;
    }
}

autoAddDeps(library, '$vkSDK');
mergeInto(LibraryManager.library, library);
