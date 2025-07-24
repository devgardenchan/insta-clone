import { Box, Button, Flex, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { InstagramLogo, InstagramMobileLogo } from "../../assets/constants";

import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";
import SidebarItems from "./SidebarItems";


const Sidebar = () => {

    const { handleLogout, isLoggingOut } = useLogout();

    return <Box
        height={"100vh"}
        borderRight={"1px solid"}
        borderColor={"whiteAlpha.300"}
        py={8}
        position={"sticky"}
        top={0}
        left={0}
        px={{ base: 2, md: 4 }}
    >
        <Flex direction={"column"} gap={10} w="full" height="full">

            <Link to="/" as={RouterLink} pl={2} display={{ base: "none", md: "block" }} cursor="pointer" >

                <InstagramLogo />

            </Link>
            <Link to="/" as={RouterLink} p={2} display={{ base: "block", md: "none" }}
                borderRadius={6}
                _hover={{ bg: "whiteAlpha.300" }}
                w={10}
                cursor="pointer" >

                <InstagramMobileLogo />

            </Link>

            <Flex direction={"column"} gap={5} cursor="pointer">

                <SidebarItems />
            </Flex>

            {/* LOGOUT */}
            <Tooltip
                hasArrow
                label={"Logout"}
                placement='right'
                ml={1}
                openDelay={500}
                display={{ base: "block", md: "none" }}
            >
                <Flex
                    onClick={handleLogout}
                    alignItems={"center"}
                    gap={4}
                    _hover={{ bg: "whiteAlpha.400" }}
                    borderRadius={6}
                    p={2}
                    w={{ base: 10, md: "full" }}
                    mt="auto"
                    justifyContent={{ base: "center", md: "flex-start" }}
                >
                    <BiLogOut size={25} />

                    <Button display={{ base: "none", md: "block" }}
                        variant="ghost"
                        _hover={{ bg: "transparent" }}
                        isLoading={isLoggingOut}>
                        Logout
                    </Button>
                </Flex>
            </Tooltip>
        </Flex>

    </Box>;
};

export default Sidebar;



{/* <Box                                    || 1. 전체 레이아웃: Box로 Sidebar 프레임 만들기
	height={"100vh"}                        || 화면 전체 세로 높이
	borderRight={"1px solid"}               || 오른쪽 경계선
	borderColor={"whiteAlpha.300"}          || 테두리 색상 -> 투명도 30% 흰색
	py={8}                                  || 상하 패딩(padding y) 8
	position={"sticky"}                     || 스크롤해도 고정되는 사이드바
	top={0}                                 || 상단 고정
	left={0}                                || 왼쪽 고정 -> 왼쪽 상단에 붙임
	px={{ base: 2, md: 4 }}                 || 좌우 패딩(padding x) -> 모바일 : 2, PC : 4
>
	*/}
{/* <Flex                                   || 2. 내부 구조: Flex로 세로 정렬
	direction={"column"}                    || 세로 정렬
	gap={10}                                || 컴포넌트(내부요소) 간 간격 10 -> 큰 여백
	w="full"                                || 가로폭 100%
	height="full" >                         || 부모 요소에 높이 맞춤(100vh 이므로 전체 높이)
	*/}

{/*                                         || 3. 로고 영역
	<Link 
	to="/"                                  || "이 링크를 클릭하면 루트 경로(/)로 이동하라"
	as={RouterLink}                         || React Router의 페이지 이동 컴포넌트로 사용
	pl={2}                                  || 왼쪽 패딩 2
	display={{ base: "none", md: "block" }} || 모바일에서는 숨기고 PC에서만 보이게
	cursor='pointer'                        || 클릭 가능하게
	>				
		<InstagramLogo />                   || 데스크탑용 로고
	</Link>
				
	<Link				
	to={"/"}					
	as={RouterLink}					
	p={2}					
	display={{ base: "block", md: "none" }} || 모바일에서만 보이게			
	borderRadius={6}						|| 모서리 적당히 둥글게 (6*4px = 24px)
	_hover={{bg: "whiteAlpha.200",}}		|| 마우스 호버 시 배경색 변화 효과		
	w={10}					
	cursor='pointer'
	>
		<InstagramMobileLogo />             || 모바일용 로고
	</Link>
	*/}
{/*                                         || 4. 사이드바 아이템 영역
	<Flex 
	direction={"column"} 
	gap={5} 
	cursor={"pointer"}>

		<SidebarItems />
	
	</Flex>
	*/}

{/*                                             || 5. 로그아웃 영역
	<Tooltip                                    || 마우스 올리면 설명 보여주는 컴포넌트
		hasArrow                                || Tooltip에 꼬리 화살표를 보여줌
		label={"Logout"}                        || Tooltip에 표시될 text
		placement='right'                       || Tooltip이 오른쪽에 위치함
		ml={1}                                  || 왼쪽 마진 1(Tooltip이 아이콘과 너무 붙지 않게)
		openDelay={500}                         || 마우스 올리고 500ms 후에 Tooltip이 보임
	->	display={{ base: "block", md: "none" }} || 작은 화면에서만 보이게(큰 화면애서는 텍스트 있으니 필요 x)
	>
		<Flex                                   || 로그아웃 전체 버튼(아이콘 + 텍스트)
			onClick={handleLogout}              || 클릭 시 handleLogout() 함수 실행
			alignItems={"center"}               || 아이콘과 텍스트 모두 세로 중앙 정렬
			gap={4}                             || 아이콘과 텍스트 버튼 사이 간격 4
			_hover={{ bg: "whiteAlpha.400" }}   || 마우스 호버 시 배경색 : 투명도 30% 흰색
			borderRadius={6}                    || 모서리 둥글게 (6*4px = 24px)
			p={2}                              
			w={{ base: 10, md: "full" }}        || 모바일에서는 고정 폭, PC에서는 가로폭 100%
			mt={"auto"}                         || 남은 공간을 모두 차지하고 아래쪽에 붙음 (사이드바 하단 고정)
			justifyContent={{ base: "center", md: "flex-start" }} || 모바일에서는 중앙 정렬, PC에서는 왼쪽 정렬(flex 축 기준 start)
		>
			<BiLogOut size={25} />              || react-icons/bi에서 가져온 로그아웃 아이콘
			<Button 
	->			display={{ base: "none", md: "block" }} || 모바일에서는 숨기고 PC에서만 보이게
				variant={"ghost"}               || 버튼 스타일 - 배경 없음, 테두리 없음
				_hover={{ bg: "transparent" }}  || 마우스 호버 시 배경색 없음
				isLoading={isLoggingOut}        || 로그아웃 중일 때 로딩 상태로 보여줌(로딩 스피너 표시)
			>
				Logout                          || 버튼 텍스트 - Logout
			</Button>
		</Flex>
	</Tooltip>
*/}