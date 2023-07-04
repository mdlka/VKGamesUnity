using System;
using System.Runtime.InteropServices;
using AOT;
using UnityEngine.Scripting;

namespace Agava.VKGames
{
    public static class Storage
    {
        private static Action s_onSetCloudSaveDataErrorCallback;
        private static Action s_onSetCloudSaveDataSuccessCallback;
        
        private static Action s_onGetCloudSaveDataErrorCallback;
        private static Action<string> s_onGetCloudSaveDataSuccessCallback;

        private static Action<string> s_onGetAllKeysSuccessCallback;
        private static Action s_onGetAllKeysErrorCallback;
        
        public static void SetCloudSaveData(string key, string value, Action onSuccessCallback = null, Action onErrorCallback = null)
        {
            s_onSetCloudSaveDataSuccessCallback = onSuccessCallback;
            s_onSetCloudSaveDataErrorCallback = onErrorCallback;

            StorageSetCloudSaveData(key, value, OnSetCloudSaveDataSuccessCallback, OnSetCloudSaveDataErrorCallback);
        }
        
        [DllImport("__Internal")]
        private static extern void StorageSetCloudSaveData(string key, string value, Action successCallback, Action errorCallback);
        
        [MonoPInvokeCallback(typeof(Action))]
        private static void OnSetCloudSaveDataSuccessCallback()
        {
            s_onSetCloudSaveDataSuccessCallback?.Invoke();
        }
        
        [MonoPInvokeCallback(typeof(Action))]
        private static void OnSetCloudSaveDataErrorCallback()
        {
            s_onSetCloudSaveDataErrorCallback?.Invoke();
        }
        
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
        public static void GetCloudSaveData(string keysJson, Action<string> onSuccessCallback, Action onErrorCallback = null)
        {
            s_onGetCloudSaveDataSuccessCallback = onSuccessCallback;
            s_onGetCloudSaveDataErrorCallback = onErrorCallback;

            StorageGetCloudSaveData(keysJson, OnGetCloudSaveDataSuccessCallback, OnGetCloudSaveDataErrorCallback);
        }
        
        [DllImport("__Internal")]
        private static extern void StorageGetCloudSaveData(string key, Action<string> successCallback, Action errorCallback);
        
        [MonoPInvokeCallback(typeof(Action<string>))]
        private static void OnGetCloudSaveDataSuccessCallback(string value)
        {
            s_onGetCloudSaveDataSuccessCallback?.Invoke(value);
        }
        
        [MonoPInvokeCallback(typeof(Action))]
        private static void OnGetCloudSaveDataErrorCallback()
        {
            s_onGetCloudSaveDataErrorCallback?.Invoke();
        }

        /// <returns>
        /// Passes results to callback as json array with format:
        /// {
        ///     "keys": [ "key1", "key2", ..., "keyN" ]
        /// }
        /// </returns>
        public static void GetAllKeys(int count, int offset, Action<string> onSuccessCallback, Action onErrorCallback = null)
        {
            s_onGetAllKeysSuccessCallback = onSuccessCallback;
            s_onGetAllKeysErrorCallback = onErrorCallback;
            
            StorageGetAllKeys(count, offset, OnGetAllKeysSuccessCallback, OnGetAllKeysErrorCallback);
        }
        
        [DllImport("__Internal")]
        private static extern void StorageGetAllKeys(int amount, int offset, Action<string> successCallback, Action errorCallback);

        [MonoPInvokeCallback(typeof(Action))]
        private static void OnGetAllKeysErrorCallback()
        {
            s_onGetAllKeysErrorCallback?.Invoke();
        }
        
        [MonoPInvokeCallback(typeof(Action<string>))]
        private static void OnGetAllKeysSuccessCallback(string jsonArray)
        {
            s_onGetAllKeysSuccessCallback?.Invoke(jsonArray);
        }
    }

    public class StorageKeys
    {
        [field: Preserve] public string[] keys;
    }

    public class StorageValues
    {
        [field: Preserve] public StringKeyValuePair[] keys;
    }

    [Serializable]
    public class StringKeyValuePair
    {
        public string key;
        public string value;
    }
}