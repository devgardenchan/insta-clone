import { useState } from "react";
import useAuthStore from "../store/authStore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { firestore, storage } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import useUserProfileStore from "../store/userProfileStore";
import useShowToast from "./useShowToast";

const useEditProfile = () => {

    const [isUpdating, setIsUpdating] = useState(false);

    const authUser = useAuthStore((state) => state.user);
    const setAuthUser = useAuthStore((state) => state.setUser);
    const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

    const showToast = useShowToast();

    const editProfile = async (inputs, selectedFile) => {

        if (isUpdating || !authUser) return;
        setIsUpdating(true);

        const storageRef = ref(storage, `profilePics/${authUser.uid}`); // Firebase Storage에 프로필 사진을 저장할 경로 : ref(storage, path)
        const userDocRef = doc(firestore, "users", authUser.uid); // Firestore의 "users" 컬렉션에서 현재 로그인한 사용자의 UID를 사용하여 문서 reference 생성

        let URL = "";
        try {
            if (selectedFile) {
                await uploadString(storageRef, selectedFile, "data_url"); // base64 문자열로 변환된 이미지를 업로드
                URL = await getDownloadURL(storageRef); // getDownloadURL(ref)는 Firebase Storage에 저장된 파일을 외부에서 접근 가능한 진짜 URL로 만들어 줌
            }

            const updatedUser = {
                ...authUser,
                fullName: inputs.fullName || authUser.fullName,
                username: inputs.username || authUser.username,
                bio: inputs.bio || authUser.bio,
                profilePicURL: URL || authUser.profilePicURL,
            };

            await updateDoc(userDocRef, updatedUser); // Firestore에서 사용자 문서 업데이트 (해당 필드만 "부분 업데이트")
            localStorage.setItem("user-info", JSON.stringify(updatedUser)); // 로컬 스토리지에 업데이트된 사용자 정보 저장
            setAuthUser(updatedUser); // Zustand 상태 업데이트
            setUserProfile(updatedUser); // 전역 사용자 프로필 상태 업데이트
            showToast("Success", "Profile updated successfully!", "success");

        } catch (error) {
            showToast("Error", error.message, "error");
        }

    };


    return { editProfile, isUpdating };
};

export default useEditProfile;
