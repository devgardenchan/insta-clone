import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/userProfileStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useFollowUser = (userId) => { // userId의 정보를 받아서 Follow/Unfollow 기능을 구현하는 커스텀 훅

    const [isUpdating, setIsUpdating] = useState(false); // Follow/Unfollow 작업이 진행 중인지 나타내는 상태
    const [isFollowing, setIsFollowing] = useState(false); // 현재 사용자가 해당 userId를 팔로우하고 있는지 여부를 나타내는 상태
    const authUser = useAuthStore((state) => state.user); // 현재 로그인한 사용자 정보를 Zustand 스토어에서 가져옴
    const setAuthUser = useAuthStore((state) => state.setUser); // 현재 로그인한 사용자 정보를 업데이트하는 함수 setAuthUser : 전역 저장소에서 새로운 사용자 정보를 저장(set) 할 수 있게 해주는 setter 함수
    const { userProfile, setUserProfile } = useUserProfileStore(); // 상대방 프로필 정보를 Zustand 스토어에서 가져옴

    const showToast = useShowToast();

    const handleFollowUser = async () => { // userId를 팔로우하거나 언팔로우하는 함수

        setIsUpdating(true); // Follow/Unfollow 작업이 진행 중임을 나타내는 상태를 true로 설정

        try {
            const currentUserRef = doc(firestore, "users", authUser.uid); // 현재 로그인한 사용자의 Firestore 문서 참조를 가져옴
            const userToFollowOrUnfollowRef = doc(firestore, "users", userId); // 대상 사용자의 Firestore 문서 참조를 가져옴
            await updateDoc(currentUserRef, {
                following: isFollowing ? arrayRemove(userId) : arrayUnion(userId),
            }); // 현재 사용자의 following 배열에 userId를 추가하거나 제거

            await updateDoc(userToFollowOrUnfollowRef, {
                followers: isFollowing ? arrayRemove(authUser.uid) : arrayUnion(authUser.uid),
            }); // 대상 사용자의 followers 배열에 현재 사용자의 uid를 추가하거나 제거

            if (isFollowing) {
                // Unfollow the user
                setAuthUser({
                    ...authUser,
                    following: authUser.following.filter((uid) => uid !== userId),
                }); // 상태 업데이트 : 현재 사용자의 following 배열에서 userId를 제거
                if (userProfile)
                    setUserProfile({
                        ...userProfile,
                        followers: userProfile.followers.filter((uid) => uid !== authUser.uid),
                    }); // 상태 업데이트 : 대상 사용자의 followers 배열에서 현재 사용자의 uid를 제거

                localStorage.setItem("user-info", JSON.stringify({
                    ...authUser,
                    following: authUser.following.filter((uid) => uid !== userId),
                }) // 로컬 스토리지 업데이트 : 현재 사용자의 following 배열에서 userId를 제거
                );
                setIsFollowing(false); // 현재 사용자가 해당 userId를 팔로우하지 않음으로 상태를 false로 업데이트
            } else {
                // Follow the user
                setAuthUser({
                    ...authUser,
                    following: [...authUser.following, userId],
                }); // 상태 업데이트 : 현재 사용자의 following 배열에 userId를 추가

                if (userProfile)
                    setUserProfile({
                        ...userProfile,
                        followers: [...userProfile.followers, authUser.uid],
                    }); // 상태 업데이트 : 대상 사용자의 followers 배열에 현재 사용자의 uid를 추가

                localStorage.setItem("user-info", JSON.stringify({
                    ...authUser,
                    following: [...authUser.following, userId],
                }) // 로컬 스토리지 업데이트 : 현재 사용자의 following 배열에 userId를 추가
                );
                setIsFollowing(true); // 현재 사용자가 해당 userId를 팔로우함으로 상태를 true로 업데이트
            }

        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsUpdating(false); // Follow/Unfollow 작업이 완료되었음을 나타내는 상태를 false로 설정
        }
    };

    useEffect(() => { // isFollowing 상태인지 아닌지 정의
        if (authUser) {
            const isFollowing = authUser.following.includes(userId);
            setIsFollowing(isFollowing); // 현재 사용자가 해당 userId를 팔로우하고 있는지 여부를 확인하여 isFollowing 상태를 업데이트
        }
    }, [authUser, userId]); // authUser나 userId가 변경될 때마다 useEffect가 실행되어 isFollowing 상태를 업데이트

    return { isUpdating, isFollowing, handleFollowUser };
};

export default useFollowUser;


// authUser : 현재 로그인한 사용자 기존 정보
// setAuthUser : 현재 로그인한 사용자 정보를 업데이트하는 함수 -> setAuthUser(...)으로 전역적으로 갱신해야 UI도 자동으로 반영됨.

// 로컬 스토리지는 문자열만 저장할 수 있기 때문에, 객체나 배열 같은 복잡한 데이터를 저장하려면 JSON.stringify()를 사용하여 문자열로 변환해야 함.

// ...authUser : 스프레드 문법(spread syntax) : authUser 객체 안에 있는 모든 속성을 그대로 가져와서 새로운 객체에 복사 -> 기존 authUser 정보는 유지됨.
// authUser.uid : 현재 로그인한 사용자의 고유 ID
// authUser.following : 현재 로그인한 사용자의 following 배열
// .filter((uid) => uid !== userId) : 배열의 filter() 메서드는 주어진 조건을 만족하는 요소들로 새로운 배열을 만듦. 
// 여기서는 userId와 일치하지 않는 요소들만 남김 -> 언팔로우 시 해당 userId를 현재 사용자의 following 배열에서 제거함.


// useEffect(() => { ... }, [authUser, userId]); : authUser나 userId가 변경될 때마다 useEffect가 실행됨.
// authUser.following : 현재 사용자가 팔로우하고 있는 사용자들의 ID 배열
// .includes(userId) : 배열에 특정 값이 포함되어 있는지 확인하는 메서드 -> authUser.following 배열 안에 userId 값이 포함되어 있는지 확인하고 있으면 true, 없으면 false 반환 
// -> 현재 사용자가 해당 userId를 팔로우하고 있는지 여부를 확인함.