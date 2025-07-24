import { Tooltip, Box, Flex } from "@chakra-ui/react";
import { NotificationsLogo } from "../../assets/constants";

const Notifications = () => {
    return (
        <Tooltip
            hasArrow
            label="Notifications"
            placement="right"
            ml={1}
            openDelay={500}
            display={{ base: "block", md: "none" }}
        >
            <Flex
                alignItems="center"
                gap={4}
                _hover={{ bg: "whiteAlpha.400" }}
                p={2}
                borderRadius={6}
                w={{ base: 10, md: "full" }}
                justifyContent={{ base: "center", md: "flex-start" }}>

                <NotificationsLogo />

                <Box display={{ base: "none", md: "block" }}> Notifications</Box>
            </Flex>

        </Tooltip>

    );
};

export default Notifications;
