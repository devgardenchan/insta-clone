import { Avatar, Box, Button, Flex, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUser from "../../hooks/useFollowUser";
import useAuthStore from "../../store/authStore";


const SuggestedUser = ({ user }) => {

    const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(user.uid);
    const authUser = useAuthStore((state) => state.user);

    const onFollowUser = async () => {
        await handleFollowUser();
        // setUser({
        //     ...user,
        //     followers: isFollowing
        //         ? user.followers.filter((follower) => follower.uid !== authUser.uid) // 지금 팔로우중 ->나(authUser)를 followers 목록에서 제거
        //         : [...user.followers, authUser], // 지금 팔로우 중이 아님 -> 나(authUser)를 followers 목록에 추가
        // });
    };

    return (
        <Flex justifyContent={"space-between"} alignItems={"center"} w="full" >
            <Flex alignItems="center" gap={2} >
                <Link to={`/${user.username}`}>
                    <Avatar src={user.profilePicURL} size="md" />
                </Link>
                <VStack spacing={2} alignItems="flex-start" >
                    <Link to={`/${user.username}`}>
                        <Box fontSize={12} fontWeight="bold">
                            {user.fullName}
                        </Box>
                    </Link>
                    <Box fontSize={11} color="gray.500">
                        {user.followers.length} followers
                    </Box>
                </VStack>
            </Flex>
            {authUser.uid !== user.uid && ( // 자기 자신이면 팔로우 버튼 없음
                <Button
                    fontSize={13}
                    p={0}
                    h="max-content"
                    bg="transparent"
                    fontWeight="medium"
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ color: "white" }}
                    onClick={onFollowUser}
                    isLoading={isUpdating}
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </Button>
            )}
        </Flex>
    );
};

export default SuggestedUser;
