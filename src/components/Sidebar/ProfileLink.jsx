import { Tooltip, Link, Box, Avatar } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const ProfileLink = () => {

    const authUser = useAuthStore((state) => state.user);

    return (
        <Tooltip
            hasArrow
            label="Home"
            placement="right"
            ml={1}
            openDelay={500}
            display={{ base: "block", md: "none" }}
        >
            <Link
                display="flex"
                to={`/${authUser?.username}`}
                as={RouterLink}
                alignItems="center"
                gap={4}
                p={2}
                borderRadius={6}
                _hover={{ bg: "whiteAlpha.400" }}
                w={{ base: 10, md: "full" }}
                justifyContent={{ base: "center", md: "flex-start" }}>

                <Avatar size="sm" src={authUser?.profilePicURL || ""} />

                <Box display={{ base: "none", md: "block" }}> Profile</Box>
            </Link>

        </Tooltip>

    );
};

export default ProfileLink;
