import { Box, Image } from "@chakra-ui/react";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";


const FeedPost = ({ post }) => {

    const { userProfile } = useGetUserProfileById(post.createdBy);
    // post 작성자의 UID로 userProfile을 가져옴
    // const result = useGetUserProfileById(post.createdBy); // 디버깅
    // console.log("🔥 useGetUserProfileById 결과:", result);

    return (
        <>
            <PostHeader post={post} creatorProfile={userProfile} />
            <Box my={2} borderRadius={4} overflow={"hidden"}>
                <Image src={post.imageURL} alt={"Feed Post Image"} />
            </Box>
            <PostFooter post={post} creatorProfile={userProfile} />
        </>
    )
};

export default FeedPost;

// post : FeedPosts.jsx에서 전달받음
// -> firebase에서 받아온 하나의 post 데이터 (posts 배열에서 하나의 item)

