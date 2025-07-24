import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useLikePost = (post) => {

    const [isUpdating, setIsUpdating] = useState(false);
    const authUser = useAuthStore((state) => state.user); // 현재 로그인된 사용자
    const [likes, setLikes] = useState(post.likes.length); // likes : 현재 좋아요 수
    const [isLiked, setIsLiked] = useState(post.likes.includes(authUser?.uid));
    const showToast = useShowToast();

    const handleLikePost = async () => {
        if (isUpdating) return;
        if (!authUser) return showToast("Error", "You must be logged in to like a post", "error");
        setIsUpdating(true);

        try {
            const postRef = doc(firestore, "posts", post.id); // 해당 Post 문서 참조
            await updateDoc(postRef, {
                likes: isLiked ? arrayRemove(authUser.uid) : arrayUnion(authUser.uid),
            }); // likes 배열 업데이트 - 좋아요 상태라면 arrayRemove, 아니면 arrayUnion

            setIsLiked(!isLiked); // 좋아요 상태 토글 -> UI에 바로 반영
            isLiked ? setLikes(likes - 1) : setLikes(likes + 1); // 로컬 상태 업데이트 - 좋아요 수 증가/감소
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsUpdating(false);
        }
    };

    return { isLiked, likes, handleLikePost, isUpdating };
};

export default useLikePost;

// firestore에서 posts 컬렉션 안에 있는 해당 post 문서의 필드 likes
// -> likes: ["uid123", "uid234", ...] 형태로 저장

// React 컴포넌트 내에서 상태로 관리하는 좋아요 수 likes
// post.likes.length로 초기화

// 수동으로 setIsLiked(!isLiked)를 호출해야 하는 이유
// 좋아요 버튼을 누르면 firestore의 likes 배열은 바뀌지만, post.lieks에는 반영 되지 않음
// -> setIsLiked(!isLiked)를 수동으로 호출 -> UI에 즉시 반영
