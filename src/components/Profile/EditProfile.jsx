import {
    Avatar,
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import useAuthStore from "../../store/authStore";
import usePreviewImg from "../../hooks/usePreviewImg";
import useEditProfile from "../../hooks/useEditProfile";
import useShowToast from "../../hooks/useShowToast";


const EditProfile = ({ isOpen, onClose }) => {

    const [inputs, setInputs] = useState({
        fullName: "",
        username: "",
        bio: "",
    });
    const authUser = useAuthStore((state) => state.user);
    const fileRef = useRef(null); // Button 클릭 시 React가 <Input /> 을 대신 클릭하도록 
    const { handleImageChange, selectedFile, setSelectedFile } = usePreviewImg();
    const { isUpdating, editProfile } = useEditProfile();
    const showToast = useShowToast();

    const handleEditProfile = async () => {
        try {
            await editProfile(inputs, selectedFile);
            setSelectedFile(null); // 프로필 사진 변경 후 선택된 파일 초기화
            onClose(); // 프로필 수정 완료 후 모달 닫기

        } catch (error) {
            showToast("Error", error.message, "error");

        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg={"black"} boxShadow={"xl"} border={"1px solid gray"} mx={3}>
                    <ModalHeader />
                    <ModalCloseButton />
                    <ModalBody>
                        {/* Container Flex */}
                        <Flex bg={"black"}>
                            <Stack spacing={4} w={"full"} maxW={"md"} bg={"black"} p={6} my={0}>
                                <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
                                    Edit Profile
                                </Heading>
                                <FormControl>
                                    <Stack direction={["column", "row"]} spacing={6}>
                                        <Center>
                                            <Avatar size='xl'
                                                src={selectedFile || authUser.profilePicURL}
                                                border={"2px solid white "} />
                                        </Center>
                                        <Center w='full'>
                                            <Button w='full' onClick={() => fileRef.current.click()}>
                                                Edit Profile Picture
                                            </Button>
                                        </Center>
                                        <Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
                                    </Stack>
                                </FormControl>

                                <FormControl>
                                    <FormLabel fontSize={"sm"}>Full Name</FormLabel>
                                    <Input placeholder={"Full Name"} size={"sm"} type={"text"}
                                        value={inputs.fullName || authUser.fullName} // ...input : 기존의 inputs값을 모두 복사
                                        onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })} />
                                </FormControl>

                                <FormControl>
                                    <FormLabel fontSize={"sm"}>Username</FormLabel>
                                    <Input placeholder={"Username"} size={"sm"} type={"text"}
                                        value={inputs.username || authUser.username} // username: e.target.value : 그 중 username만 변경
                                        onChange={(e) => setInputs({ ...inputs, username: e.target.value })} />
                                </FormControl>

                                <FormControl>
                                    <FormLabel fontSize={"sm"}>Bio</FormLabel>
                                    <Input placeholder={"Bio"} size={"sm"} type={"text"}
                                        value={inputs.bio || authUser.bio} // e.target : 이벤트가 발생한 <input> 엘리먼트, e.targe.value : 그 엘리먼트의 현재 값
                                        onChange={(e) => setInputs({ ...inputs, bio: e.target.value })} />
                                </FormControl>

                                <Stack spacing={6} direction={["column", "row"]}>
                                    <Button
                                        bg={"red.400"}
                                        color={"white"}
                                        w='full'
                                        size='sm'
                                        _hover={{ bg: "red.500" }}
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        bg={"blue.400"}
                                        color={"white"}
                                        size='sm'
                                        w='full'
                                        _hover={{ bg: "blue.500" }}
                                        onClick={handleEditProfile}
                                        isLoading={isUpdating}
                                    >
                                        Submit
                                    </Button>
                                </Stack>
                            </Stack>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default EditProfile;


// email, password 업데이트 원할 시 -> github.com/CSFrequency/react-firebase-hooks 에서 useUpdateEmail, ... 사용