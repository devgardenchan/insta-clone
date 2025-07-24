import { create } from 'zustand';

const usePostStore = create((set) => ({
    posts: [], // 초기 게시물 목록은 빈 배열로 설정
    createPost: (post) => set((state) => ({ posts: [post, ...state.posts] })), // 새 게시물을 추가할 때 기존 게시물 목록 앞에 추가 : 최신 게시글이 위에
    deletePost: (id) => set((state) => ({ posts: state.posts.filter((post) => post.id !== id) })), // 게시물 id로 게시물을 삭제
    setPosts: (posts) => set({ posts }), // 외부에서 게시물 목록을 설정할 때 사용
    addComment: (postId, comment) => set((state) => ({
        posts: state.posts.map((post) => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: [...(post.comments || []), comment]
                };
            }
            return post;
        }),
    })),

}));

export default usePostStore;

// 게시물 목록을 관리하는 zustand store

// state.posts.map((post) => { ... }) : posts 배열을 순회하면서 각 post를 검사
// if (post.id === postId) { ... } : 현재 post의 id가 전달된 postId와 일치하는지 확인(댓글을 추가해야 할 대상 게시물인지 확인)
// return { ...post, comments: [...(post.comments || []), comment] } : 일치하는 경우, 해당 게시물의 comments 배열에 새로운 comment를 추가하여 새로운 객체를 반환