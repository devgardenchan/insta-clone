import { Tooltip, Flex, Box, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { SearchLogo } from "../../assets/constants";
import { useRef } from "react";
import useSearchUser from "../../hooks/useSearchUser";
import SuggestedUser from "../SuggestedUsers/SuggestedUser";

const Search = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const searchRef = useRef(null);
    const { user, isLoading, getUserProfile, setUser } = useSearchUser();

    const handleSearchUser = (e) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지. html 폼은 기본적으로 제출 시 페이지를 새로고침하기 때문에 이를 방지 -> React가 대신 처리하게 함
        getUserProfile(searchRef.current.value); // 입력한 username으로 사용자 프로필을 검색하라는 명령
    };

    return (
        <>
            <Tooltip
                hasArrow
                label="Search"
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
                    justifyContent={{ base: "center", md: "flex-start" }}
                    onClick={onOpen} >

                    <SearchLogo />

                    <Box display={{ base: "none", md: "block" }}> Search</Box>
                </Flex>

            </Tooltip>

            <Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInlLeft'>
                <ModalOverlay />
                <ModalContent bg="black" border="1px solid gray" maxW="400px" >
                    <ModalHeader>Search user</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <form onSubmit={handleSearchUser}>
                            <FormControl>
                                <FormLabel> Username</FormLabel>
                                <Input placeholder='username' ref={searchRef} />
                            </FormControl>

                            <Flex w="full" justifyContent="flex-end" >
                                <Button type="submit" ml="auto" size="sm" my={4} isLoading={isLoading}>
                                    Search
                                </Button>
                            </Flex>
                        </form>
                        {user && <SuggestedUser user={user} setUser={setUser} />}
                        {/* user가 존재할 때만 <SuggestedUser ... /> 을 렌더링함. setUser는 검색 결과를 "초가화하거나 갱신"하기 위한 수단 */}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>

    );
};

export default Search;
