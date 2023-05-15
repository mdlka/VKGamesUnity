using System;
using System.Runtime.InteropServices;
using AOT;

namespace Agava.VKGames
{
    public static class Billing
    {
        private static Action s_onPaySuccessCallback;
        private static Action s_onErrorCallback;

        public static void PurchaseItem(string itemName, Action onPaySuccessCallback = null, Action onErrorCallback = null)
        {
            s_onPaySuccessCallback = onPaySuccessCallback;
            s_onErrorCallback = onErrorCallback;

            ShowOrderBox(itemName, OnSuccessCallback, OnErrorCallback);
        }
        
        [DllImport("__Internal")]
        private static extern void ShowOrderBox(string itemName, Action onPaySuccessCallback, Action onErrorCallback);

        [MonoPInvokeCallback(typeof(Action))]
        private static void OnSuccessCallback()
        {
            s_onPaySuccessCallback?.Invoke();
        }

        [MonoPInvokeCallback(typeof(Action))]
        private static void OnErrorCallback()
        {
            s_onErrorCallback?.Invoke();
        }
    }
}
