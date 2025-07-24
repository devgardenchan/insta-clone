import React from "react";
import useUserProfileStore from "../../store/userProfileStore";
import { Avatar, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { timeAgo } from "../../utils/timeAgo";

const Caption = ({ post }) => {

    const userProfile = useUserProfileStore((state) => state.userProfile);

    return (
        <Flex gap={4}>
            <Link to={`/${userProfile.username}`}>
                <Avatar src={userProfile.profilePicURL} size="sm" />
            </Link>
            <Flex direction="column">
                <Flex gap={2} alignItems="center">
                    <Link to={`/${userProfile.username}`}>
                        <Text fontWeight="bold" fontSize={12}>
                            {userProfile.username}
                        </Text>
                    </Link>
                    <Text fontSize={14}>
                        {post.caption}
                    </Text>
                </Flex>
                <Text fontSize={12} color="gray">
                    {timeAgo(post.createdAt)}
                </Text>
            </Flex>
        </Flex>

    );
};

export default Caption;


// userProfileStore에서 현재 사용자 정보를 가져옴
// post 작성자의 정보가 아닌 현재 로그인된 user의 정보 >> 추후 수정 