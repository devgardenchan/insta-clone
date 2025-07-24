import { useEffect, useState } from "react";
import usePostStore from "../store/postStore";
import useShowToast from "./useShowToast";
import useUserProfileStore from "../store/userProfileStore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

// 현재 사용자의 Post 목록을 가져오는 커스텀 훅
const useGetUserPosts = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { posts, setPosts } = usePostStore(); // PostStore(zustand store)에서 posts와 setPosts를 가져옴
    const showToast = useShowToast();
    const userProfile = useUserProfileStore((state) => state.userProfile); // 현재 사용자 프로필 정보를 가져옴

    useEffect(() => {
        const getPosts = async () => {
            if (!userProfile) return;
            setIsLoading(true);
            setPosts([]);

            try {
                const q = query(
                    collection(firestore, "posts"),
                    where("createdBy", "==", userProfile.uid)
                ); // "posts" 컬렉션에서 createdBy 필드가 현재 사용자 프로필의 uid와 일치하는 문서들만 가져옴(쿼리)
                const querySnapshot = await getDocs(q);

                const posts = [];
                querySnapshot.forEach((doc) => {
                    posts.push({ ...doc.data(), id: doc.id });
                }); // 쿼리 결과로 반환된 각 문서들(현재 사용자의 post들만)을 posts라는 배열에 추가. 
                // firestore에서 가져온 각 문서의 데이터를 doc.data()로 가져오고, 문서의 id는 doc.id로 가져와서 새로운 객체를 생성하여 배열에 추가

                posts.sort((a, b) => b.createdAt - a.createdAt); // 최신 게시물이 위에 오도록 (createdAt 필드를 기준으로 내림차순) 정렬
                setPosts(posts);

            } catch (error) {
                showToast("Error", error.message, "error");
                setPosts([]);
            } finally {
                setIsLoading(false);
            }

        };

        getPosts();
    }, [setPosts, userProfile, showToast]); // userProfile가 변경될 때마다 getPosts()를 다시 실행

    return { isLoading, posts };
};

export default useGetUserPosts;
