import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user-info")),
    login: (user) => set({ user }),
    logout: () => set({ user: null }),
    setUser: (user) => set({ user }),

}));

export default useAuthStore;

// 로그인한 유저의 정보를 관리하는 zustand store