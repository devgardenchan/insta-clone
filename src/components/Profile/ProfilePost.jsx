import { Avatar, Button, Divider, Flex, GridItem, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text, useDisclosure, VStack } from "@chakra-ui/react"
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Comment from "../Comment/Comment";
import PostFooter from "../FeedPosts/PostFooter";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import useShowToast from "../../hooks/useShowToast";
import { useState } from "react";
import { deleteObject, ref } from "firebase/storage";
import { firestore, storage } from "../../firebase/firebase";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import usePostStore from "../../store/postStore";
import Caption from "../Comment/Caption";

const ProfilePost = ({ post }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const userProfile = useUserProfileStore((state) => state.userProfile);
    const authUser = useAuthStore((state) => state.user);
    const showToast = useShowToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const deletePost = usePostStore((state) => state.deletePost);
    const decrementPostsCount = useUserProfileStore((state) => state.deletePost);

    const handleDeletePost = async () => {

        if (!window.confirm("Are you sure you want to delete this post?")) return;
        // window.confirm() : 브라우저의 내장 함수
        // 사용자가 누른 버튼 : '취소(No)' -> return으로 함수 종료
        if (isDeleting) return;

        try {
            const imageRef = ref(storage, `posts/${post.id}`);
            await deleteObject(imageRef); // firebase storage에서 이미지 삭제
            // deleteObject() : storage에서 파일을 삭제하는 함수
            await deleteDoc(doc(firestore, "posts", post.id)); // firestore에서 post 삭제

            const userRef = doc(firestore, "users", authUser.uid);
            await updateDoc(userRef, { posts: arrayRemove(post.id), });
            // 사용자 문서 업데이트 - posts 배열에서 해당 post.id 제거

            deletePost(post.id); // 로컬 상태에서 post 삭제
            decrementPostsCount(post.id); // 사용자 프로필에서 Posts 수 감소

            showToast("Success", "Post deleted successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsDeleting(false);
        }
    }
    console.log("comments", post.comments); // 디버깅용


    return (
        <>
            <GridItem position="relative" cursor="pointer" borderRadius={4} border="1px solid"
                borderColor="whiteAlpha.300" overflow="hidden" aspectRatio={1 / 1} onClick={onOpen}>

                <Flex position="absolute" opacity={0} _hover={{ opacity: 1 }} transition="all 0.3s ease"
                    justifyContent={"center"} top={0} left={0} right={0} bottom={0} bg="blackAlpha.700" zIndex={1}>

                    <Flex alignItems={"center"} justifyContent="center" gap={50}>

                        <Flex>
                            <AiFillHeart size={20} />
                            <Text fontWeight="bold" ml={2}>
                                {post.likes.length}
                            </Text>
                        </Flex>

                        <Flex>
                            <FaComment size={20} />
                            <Text fontWeight="bold" ml={2}>
                                {post.comments.length}
                            </Text>
                        </Flex>

                    </Flex>

                </Flex>

                <Image src={post.imageURL} alt="profile post" w={"100%"} h={"100%"} objectFit="cover" />

            </GridItem>

            <Modal isOpen={isOpen} onClose={onClose} isCentered={true} size={{ base: "3xl", md: "5xl" }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody bg="black" pb={5}>

                        <Flex gap={4} w={{ base: "90%", sm: "70%", md: "full" }} mx="auto" maxH="90vh" minH="50vh">
                            {/* 좌측 이미지 */}
                            <Flex flex={1.5} justifyContent="center" alignItems="center" borderRadius={4} overflow="hidden" border="1px solid" borderColor={"whiteAlpha.300"}>
                                <Image src={post.imageURL} alt='profile post' />
                            </Flex>

                            {/* 우측 유저 정보와 댓글 */}
                            <Flex flex={1} flexDir="column" px={10} display={{ base: "none", md: "flex" }}>
                                <Flex alignItems="center" justifyContent="space-between" >

                                    <Flex alignItems="center" gap={4}>
                                        <Avatar src={userProfile.profilePicURL} size="sm" name='As a Programmer' />

                                        <Text fontWeight="bold" fontSize={12}>
                                            {userProfile.username}
                                        </Text>
                                    </Flex>

                                    {/* 현재 로그인된 사용자(authUser)와 프로필 소유자(userProfile)의 uid가 일치하는 경우에만 삭제 버튼 표시 */}
                                    {authUser?.uid === post.createdBy && (
                                        <Button
                                            size="sm"
                                            bg="transparent"
                                            _hover={{ bg: "whiteAlpha.300", color: "red.600" }}
                                            borderRadius={4}
                                            p={1}
                                            onClick={handleDeletePost}
                                            isLoading={isDeleting}
                                        >
                                            <MdDelete size={20} cursor="pointer" />
                                        </Button>
                                    )}

                                </Flex>

                                <Divider my={4} bg="gray.500" />

                                <VStack w="full" alignItems="start" maxH="350px" overflowY="auto">
                                    {/* CAPTION */}
                                    {post.caption && <Caption post={post} />}
                                    {/* COMMENTS */}
                                    {post.comments.map((comment) => (
                                        <Comment key={comment.createdAt} comment={comment} />
                                    ))}
                                </VStack>

                                <Divider my={4} bg="gray.800" />

                                <PostFooter isProfilePage={true} post={post} />

                            </Flex>
                        </Flex>
                    </ModalBody>
                </ModalContent>

            </Modal>
        </>
    );
};

export default ProfilePost;

// aspectRatio={16 / 9} : 가로:세로가 16:9인 직사각형
// overflow="hidden" : 넘치는 자식 콘텐츠를 안 보이게 처리
// position="relative" : 오버레이의 위치 기준 (부모)로 설정
// position="absolute" : 부모 박스 안에서 자유롭게 위치할 수 있게 함
// top/left/right/bottom=0	: 부모의 전체 영역을 덮는 레이어 생성
// opacity={0} + _hover	: hover 시 opacity를 1로 변경하여 보이게 함
// zIndex={1}	:  오버레이가 이미지 위에 보이도록 함
// objectFit="cover"	: 이미지가 비율 유지하며 박스를 꽉 채우고, 넘치는 부분은 잘림
