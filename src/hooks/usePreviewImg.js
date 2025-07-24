import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {

    const [selectedFile, setSelectedFile] = useState(null); //나중에 이미지가 선택되면 Data URL 문자열로 저장
    const maxFileSizeInBytes = 2 * 1024 * 1024; // 2MB
    const showToast = useShowToast();

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // <input type="file" />에서 선택된 파일 중 [0]
        if (file && file.type.startsWith("image/")) {
            if (file.size > maxFileSizeInBytes) {
                showToast("Error", "File size must be less than 2MB", "error");
                setSelectedFile(null);
                return;
            }
            const reader = new FileReader(); // 파일 리더기 생성 : 파일을 문자열로 읽을 준비

            reader.onloadend = () => { // onloadend : 파일 읽기가 끝났을 때 실행되는 콜백 함수 ; 파일 읽기가 끝나면 다음 함수 실행
                setSelectedFile(reader.result); // reader.result : 파일을 Data URL 문자열로 변환한 결과
            }; // 콜백 먼저 등록 -> 읽기 시작

            reader.readAsDataURL(file); // 파일을 읽어서 이미지를 base64 문자열로 변환하는 작업을 비동기적으로 시작하라. 결과는 읽기(변환)가 끝나면 reader.onloadend 콜백 함수에서 처리 

        } else {
            showToast("Error", "Please select an image file", "error");
            setSelectedFile(null);
        }

    };
    return { selectedFile, handleImageChange, setSelectedFile };
};

export default usePreviewImg;
