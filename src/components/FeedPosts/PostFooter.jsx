import { Box, Button, Flex, Input, InputGroup, InputRightElement, Text, useDisclosure } from "@chakra-ui/react";
import { CommentLogo, NotificationsLogo, UnlikeLogo } from "../../assets/constants";
import usePostComment from "../../hooks/usePostComment";
import { useRef, useState } from "react";
import useAuthStore from "../../store/authStore";
import useLikePost from "../../hooks/useLikePost";
import { timeAgo } from "../../utils/timeAgo";
import CommentsModal from "../Modal/CommentsModal";

const PostFooter = ({ post, isProfilePage, creatorProfile }) => {

    const { isCommenting, handlePostComment } = usePostComment();
    const [comment, setComment] = useState("");
    const authUser = useAuthStore((state) => state.user);
    const commentRef = useRef(null);
    const { handleLikePost, isLiked, likes } = useLikePost(post)
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSubmitComment = async () => {
        await handlePostComment(post.id, comment);
        setComment(""); // 댓글 입력창 초기화
    };

    return (
        <Box mb={10} mt="auto">
            <Flex alignItems="center" gap={4} w="full" pt={0} mb={2} mt={4}>
                <Box onClick={handleLikePost} cursor="pointer" fontSize={18}>
                    {!isLiked ? <NotificationsLogo /> : <UnlikeLogo />}
                </Box>

                <Box cursor="pointer" fontSize={18} onClick={() => commentRef.current.focus()}>
                    <CommentLogo /> {/* 클릭 시 댓글 입력창 <Input>에 커서를 focus 함 */}
                </Box>
            </Flex>
            <Text fontWeight={600} fontSize="sm">
                {likes} likes
            </Text>

            {isProfilePage && (
                <Text fontSize={12} color="gray">
                    Posted {timeAgo(post.createdAt)}
                </Text>
            )}

            {!isProfilePage && (
                <>
                    <Text fontSize="sm" fontWeight={700}>
                        {creatorProfile?.username}{" "}
                        <Text fontWeight={400} as='span'>
                            {post.caption}
                        </Text>
                    </Text>
                    {post.comments.length > 0 && (
                        <Text fontSize="sm" color="gray" cursor="pointer" onClick={onOpen}>
                            View all {post.comments.length} comments
                        </Text>
                    )}
                    {/* CommentsModal only in the HomePage */}
                    {isOpen ? <CommentsModal isOpen={isOpen} onClose={onClose} post={post} /> : null}
                </>
            )}


            {authUser && (
                <Flex alignItems="center" gap={2} justifyContent="space-between" w="full">
                    <InputGroup>
                        <Input variant="flushed" placeholder="Add a comment..." fontSize={14}
                            onChange={(e) => setComment(e.target.value)} value={comment} ref={commentRef} />
                        <InputRightElement>
                            <Button fontSize={14} color="blue.500" fontWeight={600} cursor="pointer" _hover={{ color: "white" }}
                                bg="transparent" onClick={handleSubmitComment} isLoading={isCommenting} >
                                Post
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </Flex>
            )}
        </ Box>
    );
};

export default PostFooter;

// <Text as ="span"> : 한 줄로 이어지는 텍스트에서 일부만 스타일 다르게 적용할 때 사용

// ref={commentRef} : 댓글 입력창에 커서가 자동으로 focus 되도록 하기 위해 사용

// commentRef.current.focus()
// commentRef.current -> <Input> DOM 요소에 접근
// .focus() -> 해당 요소에 커서를 focus 함(커서가 깜빡임)

// (post.id, comment) -> handlePostComment의 (postId, comment) 인자로 전달
// newComment 라는 객체에 postId, comment 필드로 저장되어,
// -> firestore의 "posts" 컬렉션에서 해당 postId의 문서의 comments 필드에 추가됨

// comment 입력값을 State로 관리
