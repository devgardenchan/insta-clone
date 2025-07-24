import { create } from "zustand";

const useUserProfileStore = create((set) => ({
    userProfile: null,
    setUserProfile: (userProfile) => set({ userProfile }), // 사용자의 프로필 정보를 상태에 저장
    addPost: (post) => set((state) => ({
        userProfile: { ...state.userProfile, posts: [post.id, ...state.userProfile.posts] },
    })), // 새로운 게시물 id를 기존 게시물 배열의 맨 앞에 추가하여 최신 게시물이 위에 오도록함
    deletePost: (postId) => set((state) => ({
        userProfile: { ...state.userProfile, posts: state.userProfile.posts.filter((id) => id !== postId), },
    })), // 게시물 id가 일치하지 않는 것만 남겨서 해당 게시물을 삭제
}));

export default useUserProfileStore;

// userProfile, posts 전역 관리, 저장소 by. zustand

// userProfile: 사용자의 프로필 정보
// setUserProfile(post): 사용자 프로필 정보를 설정하는 함수
// addPost(post): 게시물 id를 프로필의 게시물 배열에 추가
// deletePost(postId): 게시물 id를 프로필의 게시물 배열에서 제거