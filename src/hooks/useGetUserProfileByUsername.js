import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useUserProfileStore from "../store/userProfileStore"; //zustand로 만든 전역 프로필 상태 hook

const useGetUserProfileByUsername = (username) => { // 사용자 프로필을 username으로 가져오는 커스텀 훅

    const [isLoading, setIsLoading] = useState(true);
    const showToast = useShowToast();
    const { userProfile, setUserProfile } = useUserProfileStore();

    useEffect(() => {
        const getUserProfile = async () => {
            setIsLoading(true);
            try { // Firestore의 "users" 컬렉션에서 username이 일치하는 문서를 찾기 위한 쿼리
                const q = query(collection(firestore, "users"), where("username", "==", username));
                const querySnapshot = await getDocs(q); // 위 쿼리 결과를 querySnapshot에 저장

                if (querySnapshot.empty) return setUserProfile(null); // 아무 문서도 없으면 전역 상태를 null로 설정하고 종료

                let userDoc;
                querySnapshot.forEach((doc) => {
                    userDoc = doc.data();
                }); // 쿼리 결과에서 유저 데이터만 추출해서 userDoc에 저장

                setUserProfile(userDoc); // 그 유저 정보(userDoc)를 setUserProfile() 으로 전역 상태에 저장
                console.log(userDoc); // 디버깅용 콘솔

            } catch (error) {
                showToast("Error", error.message, "error");

            } finally {
                setIsLoading(false); // 로딩 끝 -> 무한 루프 방지
            }
        };

        getUserProfile();
    }, [setUserProfile, username, showToast]); // username이 바뀌거나 상태 함수가 바뀔 때마다 useEffect 다시 실행

    return { isLoading, userProfile };
};

export default useGetUserProfileByUsername;
