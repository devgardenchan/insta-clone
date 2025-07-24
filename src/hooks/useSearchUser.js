import { useState } from "react";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useSearchUser = () => {
    // 사용자가 입력한 username을 기반으로 Firestore에서 사용자 프로필을 검색하는 커스텀 훅
    const [isLoading, setIsLoading] = useState(false); // firestore에서 유저 검색중인지 나타내는 상태
    const [user, setUser] = useState(null);
    const showToast = useShowToast();

    const getUserProfile = async (username) => { // username을 받아서 firestore에서 해당 사용자의 프로필을 검색하는 비동기 함수
        setIsLoading(true); // 검색 시작 전에 로딩 상태를 true로 설정
        setUser(null); // 이전 검색 결과를 초기화

        try {
            const q = query(
                collection(firestore, "users"),
                where("username", "==", username)); // firestore의 "users" 컬렉션에서 "username" 필드가 입력된 username과 일치하는 문서를 검색하는 쿼리 생성

            const querySnapshot = await getDocs(q); // 쿼리를 실행하여 일치하는 문서를 가져옴
            if (querySnapshot.empty) return showToast("Error", "User not found", "error");

            querySnapshot.forEach((doc) => {
                setUser(doc.data()); // 검색 결과가 있으면 doc.data()로 데이터를 꺼내 user 상태에 저장
            });

        } catch (error) {
            showToast("Error", error.message, "error");
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };



    return { isLoading, getUserProfile, user, setUser };
};

export default useSearchUser;


// 사용자 데이터 { username: "testuser", email: "testuser@..." } : 내가 저장한 진짜 데이터
// 문서 메타 데이터 doc.id, doc.ref, doc.exists 등 : firestore가 자동으로 관리하는 부가 정보 (문서 위치, 존재 여부 등)