import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { HomeSelectType, getUserInfo } from "../../apis/user";
import MiddleView from "../../layouts/MiddleView";
import UserInfo from "../../components/UserInfo";
import UserArticles from "./UserArticles";
import OtherData from "./OtherData";
import Loading from "../../components/Loading";
import { Await } from "@/models";
import { useNavigate } from "react-router-dom";
import useLoginStore from "@/stores/useLoginStore";
import MiddleViewVertical from "@/layouts/MiddleViewVertical";
import MainUserInfo from "./MainUserInfo";

export default function User() {
	const { id } = useParams();
	const [curTab, setCurTab] = useState<HomeSelectType>("article");
	// 当前已登录用户信息
	const currentUser = useLoginStore((state) => state.userInfo);
	// 访问用户信息
	const [userData, setUserData] =
		useState<Await<ReturnType<typeof getUserInfo>>>();
	const navigate = useNavigate();
	const getUserInfoById = (id: string, tab: HomeSelectType) => {
		getUserInfo(id, tab).then((res) => {
			console.log(res, "userData");
			setUserData(res);
		});
	};
	useEffect(() => {
		// 访问自己主页路由跳转
		if (id === "self") {
			if (!currentUser) navigate("/", { replace: true });
			else navigate(`/user/${currentUser.id}`, { replace: true });
		} else if (isNaN(Number(id))) navigate("/", { replace: true });
		else if (id) getUserInfoById(id, curTab);
		return () => {};
	}, [id, curTab]);

	return (
		<>
			{userData ? (
				<MiddleViewVertical
					top={
						<UserInfo
							info={userData.userHome}
							refresh={() => {
								if (id) getUserInfoById(id, curTab);
							}}
						/>
					}
				>
					<MainUserInfo
						handleTabChange={setCurTab}
						articles={userData.homeSelectList}
					/>
					{/* <UserArticles articles={userData.homeSelectList} /> */}
					<OtherData info={userData.userHome} />
				</MiddleViewVertical>
			) : (
				<Loading />
			)}
		</>
	);
}
