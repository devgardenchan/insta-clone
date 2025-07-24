import { useState } from "react";
import useShowToast from "./useShowToast";
import usePostStore from "../store/postStore";
import useAuthStore from "../store/authStore";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const usePostComment = () => {

    const [isCommenting, setIsCommenting] = useState(false);
    const showToast = useShowToast();
    const authUser = useAuthStore((state) => state.user);
    const addComment = usePostStore((state) => state.addComment);
    // 댓글 작성 함수
    const handlePostComment = async (postId, comment) => {
        if (isCommenting) return;
        if (!authUser) return showToast("Error", "You must be logged in to comment", "error");
        setIsCommenting(true);

        const newComment = { // 댓글 객체 생성. firestore에 저장될 댓글 형식
            comment,
            createdAt: Date.now(),
            createdBy: authUser.uid,
            postId,
        };

        try {
            await updateDoc(doc(firestore, "posts", postId), { // firestore의 "posts" 컬렉션에서 해당 postId의 문서를 업데이트
                comments: arrayUnion(newComment), // 해당 문서의 comments 필드에 newComment를 추가. 
            });
            addComment(postId, newComment);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsCommenting(false);
        }
    };

    return { isCommenting, handlePostComment };
};

export default usePostComment;


// arrayUnion : firestore에서 제공하는 함수로, 배열 필드에 새로운 값을 추가할 때 사용.(중복 없이 추가)

// doc(firestore, "posts", postId) : firestore에서 "posts" 컬렉션의 특정 문서를 참조하는 함수.(경로 생성기) 
// -> "posts" 컬렉션에 있는 postId 값과 같은 ID를 가진 하나의 문서(document).

// posts (컬렉션)
// |--- abc123 (문서 = postId)
// |    |--- caption: "Nice day!" 
// |    |--- imageURL: "..."
// |    |--- comments: [ {comment: "...", createdAt: ..., ... }, ... ]
// |    |--- createdBy: "user123"

