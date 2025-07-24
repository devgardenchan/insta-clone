import { Avatar, Flex, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import useAuthStore from "../../store/authStore";

const SuggestedHeader = () => {

    const { handleLogout, isLoggingout } = useLogout();
    const authUser = useAuthStore((state) => state.user);

    if (!authUser) return null; // authUser가 없으면 null을 반환하여 렌더링하지 않음

    return (
        <Flex justifyContent={"space-between"} alignItems="center" w="full">
            <Flex alignItems="center" gap={2}>
                <Link to={`${authUser.username}`}> {/*템플릿 리터럴 (Template Literal) 문법 = 자바스크립트 문자열 안에 변수 값을 삽입하는 문법 */}
                    <Avatar size="lg" src={authUser.profilePicURL} />
                </Link>
                <Link to={`${authUser.username}`}>
                    <Text fontSize={12} fontWeight={"bold"} >
                        {authUser.username}
                    </Text>
                </Link>
            </Flex>

            <Button size="xs" background={"transparent"} _hover={{ background: "transparent" }} isLoading={isLoggingout}
                fontSize={14} fontWeight="medium" color="blue.500" cursor="pointer" onClick={handleLogout}>
                Log out
            </Button>
        </Flex>


    );
};

export default SuggestedHeader;
