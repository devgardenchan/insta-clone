import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from "../firebase/firebase";
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import useShowToast from './useShowToast';
import useAuthStore from '../store/authStore';


const useSignUpWithEmailAndPassword = () => {
    //user 를 사용하지 않고있는데 지우면 showToast Error 메시지가 보이지 않는 오류 발생 이유는?? -> 빈칸으로 두면 잘 작동됨
    const [createUserWithEmailAndPassword, , loading, error] = useCreateUserWithEmailAndPassword(auth);
    const showToast = useShowToast();

    const loginUser = useAuthStore((state) => state.login)

    const signup = async (inputs) => {
        if (!inputs.email || !inputs.password || !inputs.username || !inputs.fullName) {
            showToast("Error", "Please fill all the fields", "error");
            return;
        }
        // username 중복 체크
        const usersRef = collection(firestore, "users");

        const q = query(usersRef, where("username", "==", inputs.username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            showToast("Error", "Username already exists", "error");
            return;
        }


        try {
            const newUser = await createUserWithEmailAndPassword(inputs.email, inputs.password);
            if (!newUser && error) {
                showToast("Error", error.message, "error");
                return;
            }
            if (newUser) {
                const userDoc = {
                    uid: newUser.user.uid,
                    email: inputs.email,
                    username: inputs.username,
                    fullName: inputs.fullName,
                    bio: "",
                    profilePicURL: "",
                    followers: [],
                    following: [],
                    posts: [],
                    createdAt: Date.now(),
                };
                await setDoc(doc(firestore, "users", newUser.user.uid), userDoc); //  Firestore에 "users" 폴더(컬렉션) 안에, 고유한 ID (newUser.user.uid)를 가진 문서(document)를 만들고, 그 문서에 userDoc이라는 데이터를 저장하는 코드
                localStorage.setItem("user-info", JSON.stringify(userDoc));
                loginUser(userDoc);
            }

        } catch (error) {
            showToast("Error", error.message, "error")
        }
    };

    return { loading, error, signup }
};

export default useSignUpWithEmailAndPassword;
