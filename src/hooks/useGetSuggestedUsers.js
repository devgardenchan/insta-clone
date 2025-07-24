import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetSuggestedUsers = () => { // 추천 사용자 목록을 가져오는 커스텀 훅 : 로그인한 사용자의 following 목록에 없는 유저들 중에서 추천 유저를 가져옴

    const [isLoading, setIsLoading] = useState(true); // isLoading: 데이터 가져오는 중(true)인지 여부를 나타내는 상태
    const [suggestedUsers, setSuggestedUsers] = useState([]); // suggestedUsers: 추천 사용자 목록을 저장하는 배열 상태
    const authUser = useAuthStore((state) => state.user); // authUser: 현재 로그인한 사용자 정보(user)를 Zustand 스토어에서 가져옴
    const showToast = useShowToast();

    useEffect(() => {

        const getSuggestedUsers = async () => {
            setIsLoading(true);

            try {
                const userRef = collection(firestore, "users");
                const q = query(
                    userRef,
                    where("uid", "not-in", [authUser.uid, ...authUser.following]), // 현재 로그인한 user의 uid와 follow한 user의 uid -> 추천 목록에서 제외
                    orderBy("uid"), // uid를 기준으로 오름차순 정렬 (firestore에서 not-in 사용 시 orderBy 필수)
                    limit(3) // 최대 3명까지만 불러옴
                );

                const querySnapshot = await getDocs(q); // getDocs: 쿼리를 실행하여 일치하는 문서를 가져옴
                const users = []; // users: 추천 사용자 목록을 저장할 빈 배열

                querySnapshot.forEach((doc) => { // doc : 하나의 문서
                    users.push({ ...doc.data(), id: doc.id });
                });
                // doc.data() : 문서의 실제 데이터(사용자 정보)를 가져오고, 
                // doc.id : 문서의 고유 ID를 가져옴. users 배열에 저장
                // users.push({ ...doc.data(), id: doc.id }) : 문서의 데이터를 가져와서 id를 추가한 객체를 users 배열에 추가

                setSuggestedUsers(users); // users 배열을 suggestedUsers 상태에 저장

            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setIsLoading(false);
            }
        };

        if (authUser) getSuggestedUsers(); // authUser가 존재할 때만 추천 사용자 목록을 가져옴
    }, [authUser, showToast]); // authUser와 showToast가 변경될 때마다 추천 사용자 목록을 가져옴

    return { isLoading, suggestedUsers };
};

export default useGetSuggestedUsers;


// querySnapshot의 예시 결과 구조 (추상적으로 표현)
// querySnapshot = {
//    docs: [
//       { id : "abc123", data: () => ({ username: "jane", age: "25"}) 
//       { id : "bap243", data: () => ({ username: "john", age: "32"})
//    ]
// }