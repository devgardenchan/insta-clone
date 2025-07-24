import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetUserProfileById = (userId) => {

    const [isLoading, setIsLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const showToast = useShowToast();

    useEffect(() => {
        const getUserProfile = async () => {
            // 초기화
            setIsLoading(true);
            setUserProfile(null);
            try {
                const userRef = await getDoc(doc(firestore, "users", userId)); // firestore에서 "users" 컬렉션의 특정 userId 문서를 가져옴
                if (userRef.exists()) { // 문서가 존재할 경우
                    setUserProfile(userRef.data()); // userRef.data()로 가져온 데이터를 userProfile 상태에 저장
                }
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setIsLoading(false);
            }
        };
        getUserProfile();
    }, [showToast, setUserProfile, userId]);

    return { isLoading, userProfile, setUserProfile };
};

export default useGetUserProfileById;


// doc(firestore, "users", userId) : firestore에서 "users" 컬렉션의 특정 문서(userId)를 참조하는 함수.

// getDoc(doc(...)) : 해당 문서의 데이터를 비동기적으로 가져오는 함수.

// 안전을 위해 showToast, setUserProfile을 의존성 배열에 추가하여, 이 값들이 변경될 때마다 useEffect가 다시 실행되도록 함.(권장사항)