export const timeAgo = (timestamp) => {
    const now = Date.now();
    const secondsAgo = Math.floor((now - timestamp) / 1000);

    if (secondsAgo < 60) {
        return `${secondsAgo}s ago`; // 60초 미만 -> 초 단위로 표시 
    } else if (secondsAgo < 3600) {
        const minutesAgo = Math.floor(secondsAgo / 60);
        return `${minutesAgo}m ago`; // 1시간 미만(3600초) -> 분 단위로 표시
    } else if (secondsAgo < 86400) {
        const hoursAgo = Math.floor(secondsAgo / 3600);
        return `${hoursAgo}h ago`; // 24시간 미만(86400초) -> 시간 단위로 표시
    } else if (secondsAgo < 604800) {
        const daysAgo = Math.floor(secondsAgo / 86400);
        return `${daysAgo}d Ago`; // 7일 미만(604800초) -> 일 단위로 표시
    } else {
        const weeksAgo = Math.floor(secondsAgo / 604800);
        return `${weeksAgo}w ago`; // 7일 이상 -> 주 단위로 표시
    }
};

// timestamp가 밀리초 단위로 가정하고 처리(Date.now()도 밀리초 단위)

// firebase의 Timestamp 객체는 .toMillis() 메서드를 사용하여 밀리초 단위로 변환할 수 있음

// comment.createdAt -> timestamp로 전달됨