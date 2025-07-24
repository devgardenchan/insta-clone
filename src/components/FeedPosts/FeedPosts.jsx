import { Box, Container, Flex, Skeleton, SkeletonCircle, Text, VStack } from "@chakra-ui/react";
import FeedPost from "./FeedPost";
import useGetFeedPosts from "../../hooks/useGetFeedPosts";

const FeedPosts = () => {

    const { isLoading, posts } = useGetFeedPosts(); // posts : 팔로우한 유저들의 Post들

    return (
        <Container maxW="container.sm" py={10} px={2}>
            {isLoading &&
                [0, 1, 2, 3].map((_, idx) => ( // Skeleton 컴포넌트를 3번 렌더링하고 싶음
                    <VStack key={idx} gap={4} alignItems="flex-start" mb={10}>
                        <Flex gap={2}>
                            <SkeletonCircle size={10} />
                            <VStack gap={2} alignItems="flex-start">
                                <Skeleton h="10px" w="200px" />
                                <Skeleton h="10px" w="200px" />
                            </VStack>
                        </Flex>
                        <Skeleton w="full">
                            <Box h="500px">
                                contents wrapped
                            </Box>
                        </Skeleton>
                    </VStack>
                ))}

            {!isLoading && posts.length > 0 && posts.map((post) => <FeedPost key={post.id} post={post} />)}
            {!isLoading && posts.length === 0 && (
                <>
                    <Text fontSize="md" color="red.400" >
                        Damn... Looks like you don't have any friends yet.
                    </Text>
                    <Text color="red.400" >
                        Go make some friends!
                    </Text>
                </>
            )}

        </Container>
    )
};

export default FeedPosts;


/*
const arr = [10, 20, 30, 40];

    arr.map((element, index) => {
      console.log("element:", element, "index:", index);
    });

element: 10 index: 0
element: 20 index: 1
element: 30 index: 2
element: 40 index: 3
*/

// post : posts.map()의 현재 순회 중인 하나의 item => post
// useGetFeedPosts.js 에서 doc.id는 문서 ID -> post.id 로 사용  

// [0, 1, 2] -> map을 3번 돌리기 위한 더미 배열
// .map((_, idx) => (...)) -> (첫 번째 인자)_는 무시하고 (두 번째 인자)idx를 사용

// [0, 1, 2].map((item, idx) => console.log(item, idx));
// 출력:
// 0 0
// 1 1
// 2 2

// [0, 1, 2].map((_, idx) => console.log(idx));
// 출력:
// 0
// 1
// 2