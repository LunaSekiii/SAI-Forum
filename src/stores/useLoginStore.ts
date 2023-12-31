import { getHomeData } from "@/apis/articles";
import { getLogout, postLogin, postUserInfo } from "@/apis/user";
import BaseUserInfoDTO from "@/models/user/BaseUserInfoDTO.model";
import { create } from "zustand";

type UseLoginStore = {
	/** 用户信息 */
	userInfo?: BaseUserInfoDTO;
	/** 获取用户信息 */
	getUserInfo: () => Promise<void>;
	/** 登陆 */
	login: (username: string, password: string) => Promise<void>;
	/** 登出 */
	logout: () => Promise<void>;
	/** 修改用户信息 */
	updateUserInfo: (userInfo: Partial<BaseUserInfoDTO>) => Promise<boolean>;
};

/** 用户登陆状态管理 */
const useLoginStore = create<UseLoginStore>((set, get) => ({
	userInfo: undefined,
	getUserInfo: async () => {
		// TODO: 获取当前用户信息，顺便处理首页登陆逻辑
		const { user } = await getHomeData();
		console.log(user, "首页用户信息");
		if (user) {
			set(() => ({ userInfo: user }));
		} else {
			// TODO: 未登录提醒
		}
	},
	login: async (username: string, password: string) => {
		let userInfo: BaseUserInfoDTO | undefined = undefined;
		try {
			userInfo = await postLogin(username, password);
			set(() => ({ userInfo }));
		} catch (e) {
			// 登录失败提醒
			alert(e);
		}
		// if (userInfo) set(() => ({ userInfo }));
	},
	logout: async () => {
		try {
			await getLogout();
			set(() => ({ userInfo: undefined }));
		} catch (e) {
			alert(e);
		}
	},
	updateUserInfo: async (userInfo: Partial<BaseUserInfoDTO>) => {
		const isSuccess = await postUserInfo(userInfo);
		get().getUserInfo();
		return isSuccess;
	},
}));

export default useLoginStore;
