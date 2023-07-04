using UnityEngine;
using System.Collections;
using System.Linq;
using UnityEngine.UI;

namespace Agava.VKGames.Samples.Playtesting
{
    public class PlaytestingCanvas : MonoBehaviour
    {
        private const string DataSaveKey = "DataSaveKey";
        
        [SerializeField] private InputField _userDataInputField;
        
        private IEnumerator Start()
        {
#if !UNITY_WEBGL || UNITY_EDITOR
            yield break;
#endif

            yield return VKGamesSdk.Initialize(onSuccessCallback: () => Debug.Log($"Initialized: {VKGamesSdk.Initialized}"));
        }

        public void ShowInterstitialButtonClick()
        {
            Interstitial.Show(onOpenCallback: () => Debug.Log("Interstitial showed"));
        }

        public void ShowRewardedAdsButtonClick()
        {
            VideoAd.Show(onRewardedCallback: () => Debug.Log("RewardedAd showed"));
        }

        public void InviteFriendsButtonClick()
        {
            SocialInteraction.InviteFriends(onRewardedCallback: () => Debug.Log("Friends invited"));
        }

        public void InviteToCommunityButtonClick()
        {
            Community.InviteToIJuniorGroup(onRewardedCallback: () => Debug.Log("Added to community"));
        }

        public void ShowLeaderboardButtonClick()
        {
            Leaderboard.ShowLeaderboard(100);
        }

        public void OnGetUserDataButtonClick()
        {
            string keys = JsonUtility.ToJson(new StorageKeys { keys = new string[] { DataSaveKey } });
            
            Storage.GetUserDataByKeys(keys, onSuccessCallback: value =>
            {
                var save = JsonUtility.FromJson<StorageValues>(value).keys.ToDictionary(pair => pair.key, pair => pair.value);
                _userDataInputField.text = save[DataSaveKey];
            });
        }

        public void OnSetUserDataButtonClick()
        {
            Storage.SetUserDataByKey(DataSaveKey, _userDataInputField.text);
        }
    }
}
