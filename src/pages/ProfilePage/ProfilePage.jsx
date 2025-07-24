import { Container, Flex, Link, Skeleton, SkeletonCircle, Text, VStack } from "@chakra-ui/react";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import ProfileTab from "../../components/Profile/ProfileTab";
import ProfilePosts from "../../components/Profile/ProfilePosts";
import { useParams } from "react-router-dom";
import useGetUserProfileByUsername from "../../hooks/useGetUserProfileByUsername";
import { Link as RouterLink } from "react-router-dom";

const ProfilePage = () => {

    const { username } = useParams(); // URL 경로에서 username을 추출
    const { isLoading, userProfile } = useGetUserProfileByUsername(username); // username에 해당하는 사용자 프로필을 가져오는 커스텀 hook

    const userNotFound = !isLoading && !userProfile;
    if (userNotFound) return <UserNotFound />;

    return (
        <Container maxW="container.lg" py={5}>
            <Flex py={10} px={4} pl={{ base: 4, md: 10 }} w="full" mx="auto" flexDirection="column">
                {!isLoading && userProfile && <ProfileHeader />}
                {isLoading && <ProfileHeaderSkeleton />}
            </Flex>

            <Flex px={{ base: 2, sm: 4 }} maxW="full" mx="auto" direction="column"
                borderTop="1px solid" borderColor="whiteAlpha.300">
                <ProfileTab />
                <ProfilePosts />
            </Flex>

        </Container>

    );
};

const ProfileHeaderSkeleton = () => {
    return (
        <Flex gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "column", sm: "row" }}
            justifyContent="center" alignItems="center">

            <SkeletonCircle size={24} />

            <VStack alignItems={{ base: "center", sm: "flex-start" }} gap={2} mx="auto" flex={1}>
                <Skeleton height='12px' width='150px' />
                <Skeleton height='12px' width='120px' />
            </VStack>
        </Flex>
    );
};

const UserNotFound = () => {
    return (
        <Flex flexDir="column" textAlign="center" mx="auto">
            <Text fontSize="2xl">
                User Not Found
            </Text>
            <Link as={RouterLink} to="/" color="blue.500" w="max-content" mx="auto" >
                Go Home
            </Link>
        </Flex>
    );
};

export default ProfilePage;
