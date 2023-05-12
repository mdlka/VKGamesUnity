using System;
using System.Runtime.InteropServices;
using AOT;
using UnityEngine.Device;

namespace Agava.VKGames
{
    public static class Storage
    {
        [DllImport("__Internal")]
        private static extern void GetUserData(string key, Action<string> onSuccessCallback, Action onErrorCallback);

        [DllImport("__Internal")]
        private static extern void SetUserData(string key, string value, Action onSuccessCallback, Action onErrorCallback);

        [DllImport("__Internal")]
        private static extern void GetAllDataKeys(int amount, int offset, Action<string> onSuccessCallback, Action onErrorCallback);
        
        private static Action s_onGetUserDataErrorCallback;
        private static Action<string> s_onGetUserDataSuccessCallback;
        private static Action s_onSetUserDataErrorCallback;
        private static Action s_onSetUserDataSuccessCallback;
        private static Action<string> s_onGetAllUserDataKeysSuccessCallback;
        private static Action s_onGetAllUserDataKeysErrorCallback;

        ///<param name="keysJson">
        /// Expects json string in format:
        /// {
        ///     "keys": [ "key1", "key2", ..., "keyN" ]
        /// }
        /// </param>
        /// <returns>
        /// Passes results to callback in json array string in order defined in keysJson parameter with format:
        /// {
        ///     "keys": [
        ///         {"key": "key1", "value": "value1"},
        ///         {"key": "key2", "value": "value2"},
        ///         ... ,
        ///         {"key": "keyN", "value": "valueN"}
        ///     ]
        /// }
        /// </returns>
        public static void GetUserDataByKeys(string keysJson, Action<string> onSuccessCallback, Action onErrorCallback = null)
        {
            s_onGetUserDataErrorCallback = onErrorCallback;
            s_onGetUserDataSuccessCallback = onSuccessCallback;

            GetUserData(keysJson, OnGetUserDataSuccessCallback, OnGetUserDataErrorCallback);
        }

        public static void SetUserDataByKey(string key, string value, Action onSuccessCallback = null, Action onErrorCallback = null)
        {
            s_onSetUserDataErrorCallback = onErrorCallback;
            s_onSetUserDataSuccessCallback = onSuccessCallback;
            
            SetUserData(key, value, OnSetUserDataSuccessCallback, OnSetUserDataErrorCallback);
        }
        
        /// <returns>
        /// Passes results to callback as json array with format:
        /// {
        ///     "keys": [ "key1", "key2", ..., "keyN" ]
        /// }
        /// </returns>
        public static void GetAllUserDataKeys(int count, int offset, Action<string> onSuccessCallback, Action onErrorCallback = null)
        {
            s_onGetAllUserDataKeysSuccessCallback = onSuccessCallback;
            s_onGetAllUserDataKeysErrorCallback = onErrorCallback;
            
            GetAllDataKeys(count, offset, OnGetAllUserDataKeysSuccessCallback, OnGetAllUserDataKeysErrorCallback);
        }

        [MonoPInvokeCallback(typeof(Action))]
        private static void OnGetUserDataErrorCallback()
        {
            s_onGetUserDataErrorCallback?.Invoke();
        }
        
        [MonoPInvokeCallback(typeof(Action<string>))]
        private static void OnGetUserDataSuccessCallback(string value)
        {
            s_onGetUserDataSuccessCallback?.Invoke(value);
        }
        
        [MonoPInvokeCallback(typeof(Action))]
        private static void OnSetUserDataErrorCallback()
        {
            s_onSetUserDataErrorCallback?.Invoke();
        }
        
        [MonoPInvokeCallback(typeof(Action))]
        private static void OnSetUserDataSuccessCallback()
        {
            s_onSetUserDataSuccessCallback?.Invoke();
        }
        
        [MonoPInvokeCallback(typeof(Action))]
        private static void OnGetAllUserDataKeysErrorCallback()
        {
            s_onGetAllUserDataKeysErrorCallback?.Invoke();
        }
        
        [MonoPInvokeCallback(typeof(Action<string>))]
        private static void OnGetAllUserDataKeysSuccessCallback(string jsonArray)
        {
            s_onGetAllUserDataKeysSuccessCallback?.Invoke(jsonArray);
        }
    }
}