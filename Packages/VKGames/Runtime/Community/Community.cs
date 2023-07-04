using System.Runtime.InteropServices;
using System;
using AOT;

namespace Agava.VKGames
{
    public static class Community
    {
        [DllImport("__Internal")]
        private static extern void JoinGroup(long groupId, Action onSuccessCallback, Action onErrorCallback);

        private static Action s_onRewardedCallback;
        private static Action s_onErrorCallback;

        public static void InviteToGroup(long groupId = 84861196, Action onRewardedCallback = null, Action onErrorCallback = null)
        {
            s_onRewardedCallback = onRewardedCallback;
            s_onErrorCallback = onErrorCallback;

            JoinGroup(groupId, OnSuccessCallback, OnErrorCallback);
        }

        [MonoPInvokeCallback(typeof(Action))]
        private static void OnSuccessCallback()
        {
            s_onRewardedCallback?.Invoke();
        }

        [MonoPInvokeCallback(typeof(Action))]
        private static void OnErrorCallback()
        {
            s_onErrorCallback?.Invoke();
        }
    }
}

