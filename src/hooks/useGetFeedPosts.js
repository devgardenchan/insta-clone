import { useEffect, useState } from "react";
import usePostStore from "../store/postStore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

// 사용자가 follow한 사용자들의 피드(Post)를 가져오는 커스텀 훅
const useGetFeedPosts = () => {

    const [isLoading, setIsLoading] = useState(true);
    const { posts, setPosts } = usePostStore();
    const authUser = useAuthStore((state) => state.user);
    const showToast = useShowToast();
    const { setUserProfile } = useUserProfileStore();

    useEffect(() => {
        const getFeedPosts = async () => {
            setIsLoading(true);
            if (authUser.following.length === 0) { // 사용자가 follow하는 사용자가 없을 경우,
                setIsLoading(false);
                setPosts([]); // 굳이 firestore를 쿼리하지 않고 빈 배열로 설정
                return;
            }
            const q = query(
                collection(firestore, "posts"), // "posts" 컬렉션에서
                where("createdBy", "in", authUser.following) // 사용자가 follow하는 사용자들의 문서만 가져오기
            ); // Fan-out Feed 설계로 추후 수정 필요
            try {
                const querySnapshot = await getDocs(q);
                const feedPosts = [];

                querySnapshot.forEach((doc) => {
                    feedPosts.push({ id: doc.id, ...doc.data() });
                }); // 쿼리 결과 -> 고유 ID 와 문서안의 모든 데이터 -> feedPosts 배열에 추가 => follow한 사용자들의 Post

                feedPosts.sort((a, b) => b.createdAt - a.createdAt); // 최신순으로 정렬
                setPosts(feedPosts); // 정렬된 결과를 postStore의 setPosts() 함수를 통해 전역 상태로 저장

            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setIsLoading(false);
            }
        };

        if (authUser) getFeedPosts();
    }, [authUser, showToast, setPosts, setUserProfile]);

    return { isLoading, posts };
};

export default useGetFeedPosts;


// authUser.following.length는 10 이하여야 함
// (firestore in 쿼리는 최대 10개의 항목만 지원)

// setUserProfile은 이 훅 내에서 사용되지 않음 - 아마 lint 오류 방지를 위한 목적

// firestore의 createdAt 필드가 Timestamp 객체라면 .toMillis()를 사용하여 숫자 비교하는 것이 안전함.
// feedPosts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());