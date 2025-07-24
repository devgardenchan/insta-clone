import { Box, Flex, Image, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import GoogleAuth from "./GoogleAuth";


const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);


    return (
        <>
            <Box border={"1px solid gray"} borderRadius={4} padding={5}>
                <VStack spacing={4}>
                    <Image src='/logo.png' h={24} cursor='pointer' alt='Instagram' />

                    {isLogin ? <Login /> : <Signup />}
                    
                    {/*------------------- OR -------------------*/}
                    <Flex alignItems={"center"} justifyContent={"center"} my={4} gap={1} w={"full"}>
                        <Box flex={5} h={"5px"} bg={"gray.400"} />
                        <Text mx={1} color={"white"}>
                            OR
                        </Text>
                        <Box flex={9} h={"1px"} bg={"gray.400"} />
                    </Flex>

                    <GoogleAuth prefix={isLogin ? "Log in" : "Sign Up"} />

                </VStack>
            </Box>

            <Box border={"1px solid gray"} borderRadius={4} padding={5}>
                <Flex alignItems={"center"} justifyContent={"center"}>
                    <Box mx={2} fontSize={14}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </Box>
                    <Box onClick={() => setIsLogin(!isLogin)} color={"blue.500"} cursor={"pointer"}>
                        {isLogin ? "Sign up" : "Log in"}
                    </Box>
                </Flex>
            </Box>
        </>
    )
}

export default AuthForm

// const [isLogin, setIsLogin] = useState(true)
// useState() 의 근본적인 역할 : 상태가 바뀌거나 입력창의 값이 바뀔 때 자동으로 UI가 업데이트되도록 하는 것

// const navigate = useNavigate();
// useNavigate()의 근본적인 역할 : 사용자를 다른 페이지로 이동시키는 역할

/* const [inputs, setInputs] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    }) 
        : useState({ 괄호 안에 객체를 넣는 이유와 그 역할은? })
*/

/* const handleAuth = () => {
        if (!inputs.email || !inputs.password) {
            alert("please fill in all fields");
            return;
        }

        navigate("/");
    }; 
-> return이 if문 안으로 들어간 이유 : return은 조건을 만족했을 때 그 아래 코드를 실행하지 않도록 멈추는 역할
이게 없으면 navigate("/")가 실행되어버려서, 이메일/비밀번호가 없어도 홈으로 이동해버릴 수 있음.
*/

/* <Box
border = {"1px solid gray"}
borderRadius = {4}
padding={5}
>
padding: 전체 안쪽 여백 (상하좌우)

px: 좌우 방향의 padding (padding-left + padding-right)

py: 상하 방향의 padding (padding-top + padding-bottom)

*/ 

// <Input type='email' /> : type = 'text'와 차이점은 무엇? type 설정하는 이유?
/*
type="email": 이메일 형식이 아닌 값을 입력하면 자동 검증됨. 모바일에선 이메일 키보드도 나옴.
type="text": 그냥 일반 문자열 입력
*/
// value={inputs.email}  
// -> Controlled component로 만들기 위해서 value 설정. 이렇게 하면 입력값이 항상 state와 연결되어 있어, 
// 사용자 입력 → state 변화 → UI 렌더링이 자동으로 연결됨.


//  onChange={(e) => setInputs({ ...inputs, password: e.target.value }) 
// : (e)와 (e.target)는 어떤 표기법이며 어떤 의미이지?

/* <Button
w={"full"}
colorScheme='blue'>

colorScheme: Chakra UI가 제공하는 버튼 스타일 전체 (배경, hover, focus 등) 을 지정해줘.
color: 단순히 텍스트 컬러만 바꾸는 것.
*/

//my={4} : margin top & bottom = 4단위 여백을 줌 : 왜 margin? gap과의 차이점은?

/* <Button
flex={2}
h={"1px"} : Height = 1px -> 왜 1px? h={1}와 차이점은? 
->Chakra는 숫자 단위는 rem 단위로 처리 (기본적으로 1 = 0.25rem)
h={1} → 0.25rem = 4px
h={"1px"} → 진짜 1px

bg={"white.400"} 으로 하면 선이 검은화면에 덮혀서 안보이는 이유는? 그리고 줄의 색상을 변경하는데 왜 bg으로 색을 조정하는지?
*/

// <Image src='/google.png' w={5} :  는 이미지의 넓이? 그저 가로폭? 혹은 전체적인 크기?
// w={5} -> width = {5 = 1.25rem = 20px}
// 이미지의 가로폭이 되는 값이고, 비율이 유지되므로 높이도 함께 조절됨

//<Box onClick={() => setIsLogin(!isLogin)} color={"blue.500"} cursor={"pointer"}>