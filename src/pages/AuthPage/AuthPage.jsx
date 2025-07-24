import { Box, Container, Flex, Image, VStack } from "@chakra-ui/react";
import AuthForm from "../../components/AuthForm/AuthForm"

const AuthPage = () => {
  return (
    <Flex minH={"100vh"} alignItems={"center"} justifyContent={"center"} px={4}>
      <Container maxW={"container.md"} padding={0}>
        <Flex justifyContent={"center"} alignItems={"center"} gap={10}>
          {/* Left Side */}
          <Box display={{ base: "none", md: "block" }}>
            <Image src='/auth.png' h={650} alt='Phone img' />
          </Box>

          {/* Right Side */}
          <VStack spacing={4} align={"strtch"}>
            <AuthForm />
            <Box textAlign={"center"}>
              Get the app.
            </Box>
            <Flex gap={5} justifyContent={"center"}>
              <Image src='/playstore.png' h={10} alt='Platstore logo' />
              <Image src='/microsoft.png' h={10} alt='Microsoft logo' />
            </Flex>
          </VStack>
        </Flex>
      </Container>
    </Flex>
  )
}

export default AuthPage;

// Flex
// minH = {"100vh"} : 전체 화면 높이(100%)만큼 공간 확보(min-height = 100viewport height)
// justifyContent = {"center"} : 가로방향 정렬 = 가운데 정렬
// alignItems {"center"} : 세로방향 정렬 = 가운데 정렬
// px = {4} : padding left & right = 4단위 만 여백을 줌
// gap = {5} : 요소들 사이의 간격 = 5단위로 줌 (아이템간 거리)

// Container : 화면 크기에 따라 자동으로 크기를 조정해줌(레이아웃에서 중심 잡기용)
// maxW = {container.md} : 화면이 더 넓어져도 '최대 너비 = 중간 크기'까지만 넓어짐 (max-width = medium container)
// padding = {0} : 기본 패딩을 제거해서 요소들이 바깥쪽과 더 가까워짐

// Box
// display = {{base : "none", md : "block"}} : 화면이 작으면(base) → 안 보이게 (none), 화면이 중간 이상이면(md) → 보이게 (block)
// testAlign = {"center"} : 글씨를 가운데 정렬

// Image
// stc ='/auth.png' : 이미지의 경로
// h = {650} : 이미지의 자체크기(높이)를 650px로 설정
// alt = 'Phone img' : 이미지가 로드되지 않을 때 대체 텍스트로 보여짐

// VStack : 위에서 아래로 쌓이는 수직 레이아웃 Flex의 세로 방향 버전
// spacing = {4} : 내부 요소들 사이의 세로 간격을 4단위로 줌
// align = {"stretch"} : 내부 요소들의 가로폭을 동일하게 늘려줌

