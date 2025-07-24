import { Box, Grid, Skeleton, VStack, Flex, Text } from "@chakra-ui/react";
import ProfilePost from "./ProfilePost";
import useGetUserPosts from "../../hooks/useGetUserPosts";

const ProfilePosts = () => {

    const { isLoading, posts } = useGetUserPosts();

    const noPostFound = !isLoading && posts.length === 0;
    if (noPostFound) return <NoPostFound />;

    return (
        <Grid templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(3, 1fr)" }} gap={1} columnGap={1} >
            {isLoading && [0, 1, 2].map((_, idx) => (
                <VStack key={idx} alignItems="flex-start" gap={4} >
                    <Skeleton w="full">
                        <Box h="300px">
                            contents wrapped
                        </Box>
                    </Skeleton>
                </VStack>
            ))}

            {!isLoading && (
                <>
                    {posts.map((post) => (
                        <ProfilePost post={post} key={post.id} />
                    ))}
                </>
            )}
        </Grid>

    );
};

export default ProfilePosts;


const NoPostFound = () => {

    return (
        <Flex flexDir="column" textAlign="center" mx="auto" mt={10}>
            <Text fontSize="2xl"> No Post Found</Text>
        </Flex>
    );
};


// map() 함수는 posts라는 배열의 각 요소를 순회하면서, 각 post에 대해 <ProfilePost /> 컴포넌트를 생성합니다.