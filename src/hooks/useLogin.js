import useShowToast from "./useShowToast";
import { auth, firestore } from "../firebase/firebase";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import useAuthStore from "../store/authStore";

//Login 기능을 abstraction -> Hook으로 만들기
const useLogin = () => {

    const showToast = useShowToast();
    const [signInWithEmailAndPassword, , loading, error,] = useSignInWithEmailAndPassword(auth);
    const loginUser = useAuthStore((state) => state.login);

    const login = async (inputs) => {

        if (!inputs.email || !inputs.password) {
            return showToast("Error", "Please fill all the fields", "error");
        }

        try {
            const userCred = await signInWithEmailAndPassword(inputs.email, inputs.password); // Firebase 로그인 시도

            if (userCred) { //Firestore에서 해당 유저의 프로필 정보 가져오기
                const docRef = doc(firestore, "users", userCred.user.uid);
                const docSnap = await getDoc(docRef);

                localStorage.setItem("user-info", JSON.stringify(docSnap.data())); //유저 정보를 local Storage에 저장
                loginUser(docSnap.data()); //zustand 전역 상태에도 저장 (로그인 처리)

            }

        } catch (error) {
            showToast("Error", error.message, "error");
        }
    }

    return { loading, error, login };
};

export default useLogin;
