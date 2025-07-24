import { Avatar, Box, Button, Flex, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUser from "../../hooks/useFollowUser";
import { timeAgo } from "../../utils/timeAgo";

const PostHeader = ({ post, creatorProfile }) => {
    // {post, creatorProfile} = props : FeedPost에서 전달받음

    const { handleFollowUser, isFollowing, isUpdating } = useFollowUser(post.createdBy);

    return (
        <Flex justifyContent="space-between" alignItems="center" w="full" my={2}>

            <Flex gap={2} alignItems="center">
                {creatorProfile ? (
                    <Link to={`/${creatorProfile.username}`}>
                        <Avatar src={creatorProfile.profilePicURL} alt="user profile pic" size={"sm"} />
                    </Link>
                ) : (
                    <SkeletonCircle size={10} />
                )}

                <Flex fontSize={12} fontWeight="bold" direction="column" gap={0}>
                    {creatorProfile ? (
                        <Link to={`/${creatorProfile.username}`}>
                            {creatorProfile.username}
                        </Link>
                    ) : (
                        <Skeleton w="100px" h="10px" />
                    )}

                    <Box color="gray.500">
                        • {timeAgo(post.createdAt)}
                    </Box>
                </Flex>
            </ Flex>

            <Box cursor="pointer">
                <Button size="xs" bg="transparent" fontSize={12} fontWeight="bold" color="blue.500"
                    _hover={{ color: "white" }} transition="0.2s ease-in-out"
                    onClick={handleFollowUser} isLoading={isUpdating} >
                    {isFollowing ? "Unfollow" : "Follow"}
                </Button>
            </Box>
        </Flex>
    );
};

export default PostHeader;


// post : post 데이터(createdBy, createdAt, imageURL 등)
// creatorProfile : post.createdBy로부터 가져온 유저 프로필 데이터(username, profilePicURL 등)

// 비동기 로딩때문에 조건부 렌더링이 필요 (Skeleton 사용)
// 컴포넌트가 처음 렌더링될 때 creatorProfile은 undefined 또는 null일 수 있음
