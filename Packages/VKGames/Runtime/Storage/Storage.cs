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

        private static Action s_onGetUserDataErrorCallback;
        private static Action<string> s_onGetUserDataSuccessCallback;
        private static Action s_onSetUserDataErrorCallback;
        private static Action s_onSetUserDataSuccessCallback;

        public static void GetUserDataByKey(string key, Action<string> onSuccessCallback, Action onErrorCallback = null)
        {
            s_onGetUserDataErrorCallback = onErrorCallback;
            s_onGetUserDataSuccessCallback = onSuccessCallback;

            GetUserData(key, OnGetUserDataSuccessCallback, OnGetUserDataErrorCallback);
        }

        public static void SetUserDataByKey(string key, string value, Action onSuccessCallback = null, Action onErrorCallback = null)
        {
            s_onSetUserDataErrorCallback = onErrorCallback;
            s_onSetUserDataSuccessCallback = onSuccessCallback;
            
            SetUserData(key, value, OnSetUserDataSuccessCallback, OnSetUserDataErrorCallback);
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
    }
}
