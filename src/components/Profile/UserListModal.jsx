import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    VStack,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import SuggestedUser from "../SuggestedUsers/SuggestedUser";
import useAuthStore from "../../store/authStore";

// Code By ChatGPT
// 추후에 Followers / Following 리스트로 분리해야할듯

// 다른 유저가 follow unfollow 하는데, 다른 유저의 프로필의 followers 숫자가 바뀌는 오류

const UserListModal = ({ isOpen, onClose, title, userIds }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const authUser = useAuthStore((state) => state.user); // ✅ 본인 정보 가져오기


    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            const fetchedUsers = [];

            for (const uid of userIds) {
                // 본인인 경우 스킵
                if (uid === authUser.uid) continue;

                const userRef = doc(firestore, "users", uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    fetchedUsers.push({ id: uid, ...userSnap.data() });
                }
            }

            setUsers(fetchedUsers);
            setIsLoading(false);
        };

        if (userIds.length > 0) fetchUsers();
        else setIsLoading(false);
    }, [userIds]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent bg="black" border="1px solid gray">
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={4}>
                    {isLoading ? (
                        <Spinner />
                    ) : users.length === 0 ? (
                        <Text>No users found</Text>
                    ) : (
                        <VStack spacing={4} align="stretch">
                            {users.map((user) => (
                                <SuggestedUser key={user.uid} user={user} setUser={() => { }} />
                            ))}
                        </VStack>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default UserListModal;
