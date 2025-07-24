import { Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import Comment from "../Comment/Comment";
import usePostComment from "../../hooks/usePostComment";
import { useEffect, useRef } from "react";

const CommentsModal = ({ isOpen, onClose, post }) => {

    const { handlePostComment, isCommenting } = usePostComment();
    const commentRef = useRef(null); // <Input>에 입력된 텍스트 값을 직접 참조
    const commentsContainerRef = useRef(null); // 댓글 목록을 스크롤할 수 있는 컨테이너를 참조

    const handleSubmitComment = async (e) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지 -> 화면에 즉시 반영
        await handlePostComment(post.id, commentRef.current.value);
        commentRef.current.value = "";
    };
    // 댓글 입력값을 state로 관리하지 않고, ref를 사용하여 직접 DOM 요소의 value에 접근

    useEffect(() => {
        const scrollToBottom = () => {
            commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
        };
        if (isOpen) { // 모달이 열렸을 때만, 100ms 후에 스크롤을 맨 아래로 이동
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    }, [isOpen, post.comments.length]);
    // 댓글 모달이 열리거나, 댓글 개수가 바뀌면 스크롤을 아래로 자동 이동시킴 -> 댓글 달릴 때마다 강제 스크롤
    // 최신 댓글이 항상 맨 아래에 보이도록 자동 스크롤

    return (
        <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInLeft" >
            <ModalOverlay />
            <ModalContent bg="black" border="1px solid gray" maxW="400px" >
                <ModalHeader>
                    Comments
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Flex mb={4} gap={4} flexDir="column" maxH="250px" overflowY="auto" ref={commentsContainerRef} >
                        {post.comments.map((comment, idx) => (
                            <Comment key={idx} comment={comment} />
                        ))}
                    </Flex>
                    <form onSubmit={handleSubmitComment} style={{ marginTop: "2rem" }}>
                        <Input placeholder="Comment" size="sm" ref={commentRef} />
                        <Flex w="full" justifyContent="flex-end">
                            <Button type="submit" ml="auto" size="sm" my={4} isLoading={isCommenting}>
                                Post
                            </Button>
                        </Flex>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
};

export default CommentsModal;


// <form> 안에서 submit 이벤트가 발생하면, 브라우저는 기본적으로 페이지를 새로고침함
// -> e.prevendDefault()를 호출하여 이 기본 동작을 막음

// DOM 요소 : 브라우저가 HTML을 구조화해서 생성한 객체들. ex. <Input>, <Button>
// DOM 요소의 value : <Input>, <Textarea> 등의 입력 필드에 사용자가 입력한 현재 값
// => commentRef.current.value : 해당 <Input> DOM 요소에 입력된 텍스트 값을 가져옴

// scrollTop : 스크롤 박스의 현재 스크롤 위치 - 스크롤이 얼마나 아래로 내려와 있는지 (픽셀 단위)
// scrollHeight : 스크롤 박스의 전체 높이 - 스크롤 가능한 전체 콘텐츠의 높이 (픽셀 단위)
// element.scrollTop = element.scrollHeight; : 현재 스크롤 위치를 전제 높이만큼 내려라
// -> 스크롤 박스를 맨 아래로 이동시킴