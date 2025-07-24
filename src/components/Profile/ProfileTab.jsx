import { Box, Flex, Text } from "@chakra-ui/react";
import { BsBookmark, BsGrid3X3, BsSuitHeart } from "react-icons/bs";


const ProfileTab = () => {
    return (
        <Flex w="full" justifyContent={"center"} gap={{ base: 4, sm: 10 }} fontWeight={"bold"} textTransform={"uppercase"}>
            <Flex borderTop={"1px solid white"} alignItems="center" cursor="pointer" gap={1} p={3}>
                <Box fontSize={20}>
                    <BsGrid3X3 />
                </Box>
                <Text fontSize={12} display={{ base: "none", sm: "block" }}>
                    Posts
                </Text>
            </Flex>

            <Flex alignItems="center" cursor="pointer" gap={1} p={3}>
                <Box fontSize={20}>
                    <BsBookmark />
                </Box>
                <Text fontSize={12} display={{ base: "none", sm: "block" }}>
                    Saved
                </Text>
            </Flex>

            <Flex alignItems="center" cursor="pointer" gap={1} p={3}>
                <Box fontSize={20}>
                    <BsSuitHeart />
                </Box>
                <Text fontSize={12} display={{ base: "none", sm: "block" }}>
                    Likes
                </Text>
            </Flex>
        </Flex>
    );
};

export default ProfileTab;
