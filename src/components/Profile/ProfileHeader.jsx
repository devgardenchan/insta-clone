import { Avatar, AvatarGroup, Button, Flex, Text, useDisclosure, VStack } from "@chakra-ui/react";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import EditProfile from "./EditProfile";
import useFollowUser from "../../hooks/useFollowUser";

import UserListModal from "./UserListModal";

const ProfileHeader = () => {

    const { userProfile } = useUserProfileStore();
    const authUser = useAuthStore((state) => state.user);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(userProfile?.uid);
    const visitingOwnProfileAndAuth = authUser && authUser.username === userProfile.username;
    const visitingAnotherProfile = authUser && authUser.username !== userProfile.username;

    const {
        isOpen: isFollowersOpen,
        onOpen: onFollowersOpen,
        onClose: onFollowersClose
    } = useDisclosure();
    const {
        isOpen: isFollowingOpen,
        onOpen: onFollowingOpen,
        onClose: onFollowingClose
    } = useDisclosure();


    return (
        <Flex gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "column", sm: "row" }}>
            <AvatarGroup size={{ base: "xl", md: "2xl" }} justifySelf="center" alignSelf={"flex-start"} mx={"auto"}>
                <Avatar src={userProfile.profilePicURL} alt='Profile Pic' />
            </AvatarGroup>

            <VStack alignItems="start" gap={2} mx="auto" flex={1}>
                <Flex gap={4} direction={{ base: "column", sm: "row" }}
                    justifyContent={{ base: "center", sm: "flex-start" }} alignItems="center" w="full" >
                    <Text fontSize={{ base: "sm", md: "lg" }}>
                        {userProfile.username}
                    </Text>
                    {visitingOwnProfileAndAuth && (
                        <Flex gap={4} alignItems="center" justifyContent="center">
                            <Button bg="white" color="black" _hover={{ bg: "whiteAlpha.800" }} size={{ base: "xs", md: "sm" }} onClick={onOpen} >
                                Edit Profile
                            </Button>
                        </Flex>
                    )}
                    {visitingAnotherProfile && (
                        <Flex gap={4} alignItems="center" justifyContent="center">
                            <Button bg="blue.500" color="white" _hover={{ bg: "blue.600" }} size={{ base: "xs", md: "sm" }}
                                onClick={handleFollowUser} isLoading={isUpdating}>
                                {isFollowing ? "Unfollow" : "Follow"}
                            </Button>
                        </Flex>
                    )}
                </Flex>

                <Flex alignItems="center" gap={{ base: 2, sm: 4 }} >
                    <Text fontSize={{ base: "xs", md: "sm" }}>
                        <Text as="span" fontWeight="bold" mr={4}>
                            {userProfile.posts.length}
                        </Text>
                        Posts
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} cursor="pointer" onClick={onFollowersOpen}>
                        <Text as="span" fontWeight="bold" mr={4}>
                            {userProfile.followers.length}
                        </Text>
                        Followers

                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} cursor="pointer" onClick={onFollowingOpen}>
                        <Text as="span" fontWeight="bold" mr={4}>
                            {userProfile.following.length}
                        </Text>
                        Following
                    </Text>
                </Flex>

                <Flex alignItems="center" gap={4}>
                    <Text fontSize="sm" fontWeight="bold">
                        {userProfile.fullName}
                    </Text>
                </Flex>
                <Text fontSize="sm" >
                    {userProfile.bio}
                </Text>

            </VStack>
            {isOpen && <EditProfile isOpen={isOpen} onClose={onClose} />}

            {isFollowersOpen && (
                <UserListModal
                    isOpen={isFollowersOpen}
                    title="Followers"
                    userIds={userProfile.followers}
                    onClose={onFollowersClose}
                />
            )}
            {isFollowingOpen && (
                <UserListModal
                    isOpen={isFollowingOpen}
                    title="Following"
                    userIds={userProfile.following}
                    onClose={onFollowingClose}
                />
            )}

        </Flex>

    );
};


export default ProfileHeader;
