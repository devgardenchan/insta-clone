import { Tooltip, Flex, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Textarea, Input, Image, CloseButton, ModalFooter, Button, useDisclosure } from "@chakra-ui/react";
import { CreatePostLogo } from "../../assets/constants";
import { BsFillImageFill } from "react-icons/bs";

import { useRef, useState } from "react";
import usePreviewImg from "../../hooks/usePreviewImg";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import usePostStore from "../../store/postStore";
import useUserProfileStore from "../../store/userProfileStore";
import { useLocation } from "react-router-dom";

import { addDoc, arrayUnion, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { firestore, storage } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

// 새 게시물을 작성하는 UI 및 로직을 구현하는 컴포넌트
const CreatePost = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [caption, setCaption] = useState("");
    const imageRef = useRef(null);
    const { handleImageChange, selectedFile, setSelectedFile } = usePreviewImg();
    const showToast = useShowToast();
    const { isLoading, handleCreatePost } = useCreatePost();

    const handlePostCreation = async () => { // 게시물 생성 버튼 클릭 시 handleCreatePost() 호출
        try {
            await handleCreatePost(selectedFile, caption);
            onClose();
            setCaption("");
            setSelectedFile(null);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    }; // -> 성공하면 <Modal> 닫고 상태 초기화

    return (
        <>
            <Tooltip
                hasArrow
                label="Create Post"
                placement="right"
                ml={1}
                openDelay={500}
                display={{ base: "block", md: "none" }}
            >
                <Flex
                    alignItems="center"
                    gap={4}
                    _hover={{ bg: "whiteAlpha.400" }}
                    p={2}
                    borderRadius={6}
                    w={{ base: 10, md: "full" }}
                    justifyContent={{ base: "center", md: "flex-start" }}
                    onClick={onOpen}>

                    <CreatePostLogo />  {/*클릭 시 모달 오픈 */}

                    <Box display={{ base: "none", md: "block" }}> Create</Box>
                </Flex>

            </Tooltip>

            <Modal isOpen={isOpen} onClose={onClose} size='xl'>
                <ModalOverlay />

                <ModalContent bg="black" border="1px solid gray">
                    <ModalHeader> Create Post </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Textarea
                            placeholder='Post caption...'
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />  {/* 게시물 캡션 입력창 */}

                        <Input type='file' hidden ref={imageRef} onChange={handleImageChange} />
                        {/* 선택된 파일은 handleImageChange()를 통해 base64 포맷의 미리보기용 이미지로 변환됨 */}

                        <BsFillImageFill
                            onClick={() => imageRef.current.click()} // 이미지 아이콘 클릭 시 Input type='file' 클릭
                            style={{ marginTop: "15px", marginLeft: "5px", cursor: "pointer" }}
                            size={16} />

                        {selectedFile && (
                            <Flex mt={5} w="full" position="relative" justifyContent="center" >
                                <Image src={selectedFile} alt='Selceted img' />
                                <CloseButton
                                    position="absolute"
                                    top={2}
                                    right={2}
                                    onClick={() => { setSelectedFile(null); }}
                                />
                            </Flex>
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={handlePostCreation} isLoading={isLoading}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>

    );
};

export default CreatePost;

function useCreatePost() {
    const showToast = useShowToast();
    const [isLoading, setIsLoading] = useState(false);
    const authUser = useAuthStore((state) => state.user);
    const createPost = usePostStore((state) => state.createPost);
    const addPost = useUserProfileStore((state) => state.addPost);
    const userProfile = useUserProfileStore((state) => state.userProfile);

    const { pathname } = useLocation();

    const handleCreatePost = async (selectedFile, caption) => {
        if (isLoading) return;
        if (!selectedFile) throw new Error("Please select an image");

        // 이 줄을 추가!
        if (!authUser) throw new Error("User is not logged in")

        setIsLoading(true);
        const newPost = {
            caption: caption,
            likes: [],
            comments: [],
            createdAt: Date.now(),
            createdBy: authUser.uid,
        };

        try { // firestore에 새 게시물 추가
            const postDocRef = await addDoc(collection(firestore, "posts"), newPost); // posts 컬렉션에 새 문서 추가
            const userDocRef = doc(firestore, "users", authUser.uid); // 현재 사용자 문서 참조 : firestore의 "users" 컬렉션에서 현재 사용자(authUser.uid)와 일치하는 문서 참조(포인터) 생성
            const imageRef = ref(storage, `posts/${postDocRef.id}`); // Firebase Storage의 "posts" 폴더 하위에 postDocRef.id 이름으로 이미지 파일을 저장할 위치를 참조

            await setDoc(userDocRef, { posts: arrayUnion(postDocRef.id) }, { merge: true }); // 현재 사용자 문서에 "posts" 필드가 없으면 새로 생성하고, 있으면 기존 배열에 새로운 post Id를 추가(겹치지 않게)

            await uploadString(imageRef, selectedFile, "data_url"); // selectedFile의 base64 문자열을 Firebase Storage에 imageRef 위치에 업로드

            const downloadURL = await getDownloadURL(imageRef); // 업로드한 Storage 파일의 이미지의 다운로드 URL을 가져옴

            await updateDoc(postDocRef, { imageURL: downloadURL }); // posts 컬렉션의 새 문서(postDocRef)에 imageURL 필드를 추가하고, 그 값으로 다운로드 URL을 설정

            newPost.imageURL = downloadURL; // newPost 객체에 imageURL 필드를 추가하여 이미지 URL을 추가

            if (userProfile.uid === authUser.uid)
                createPost({ ...newPost, id: postDocRef.id }); // createPost : 홈 피드에 즉시 반영. zustand store의 createPost 함수를 호출하여 새 게시물을 상태에 추가

            if (pathname !== "/" && userProfile.uid === authUser.uid)
                addPost({ ...newPost, id: postDocRef.id }); // addPost : 프로필 페이지에 즉시 반영. zustand store의 addPost 함수를 호출하여 새 게시물을 사용자 프로필 상태에 추가

            showToast("Success", "Post created successfully", "success");

        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, handleCreatePost };
}


// ref(storage, "폴더/파일명") : storage 안의 특정 경로를 가리키는 참조(포인터) 생성

// setDoc(문서참조, { 필드: 값 } { merge: true })
// { Posts: arrayUnion(postDocRef.id) } : posts 필드가 없으면 새로 생성하고, 있으면 기존 배열에 새로운 post Id를 추가(겹치지 않게)
// { merge: true } : 기존 문서에 필드가 없으면 새로 생성하고, 있으면 기존 필드에 값을 추가(겹치지 않게)

// uploadString(파일참조, 문자열, "data_url") = uploadString(업로드할 경로, base64 문자열, "data_url")

// 파일참조 : ref()로 만든 storage 경로
// 문자열 : base64로 변환된 이미지 파일
// "data_url" : 업로드 방식. base64 문자열 형식을 데이터 URL로 해석

// downloadURL : 외부에서 접근 가능한 URL (짧고 실제 URL)