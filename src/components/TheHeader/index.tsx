import React, { useState, memo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "./TheHeader.css";
import useLoginStore from "@/stores/useLoginStore";
import { log } from "console";

/**
 * 页头组件
 */
export default memo(function TheHeader() {
	const [searchInput, setSearchInput] = useState<string>();
	const [search, setSearch] = useSearchParams();
	const navigate = useNavigate();

	const userInfo = useLoginStore((state) => state.userInfo);
	// 打开“写文章”页面
	const openEditArticleView = () => {
		if (!userInfo) {
			navigate("/login");
		} else {
			navigate("./edit-article/new");
		}
	};
	// 获取分类激活当前分类的导航选项
	const category = search.get("category");
	const inputSearch = ({
		currentTarget,
	}: React.FormEvent<HTMLInputElement>) => {
		setSearchInput(currentTarget.value);
	};
	return (
		// TODO: 下滑收缩页头
		<header className='navbar gap-0 2xl:gap-6 bg-base-100 sticky top-0 shadow-md z-10'>
			{/* title */}
			<div className='flex-none'>
				<a className='btn btn-ghost normal-case text-3xl' href='/'>
					SAI论坛
				</a>
			</div>
			{/* navigate */}
			<div className=' flex-auto gap-0 2xl:gap-3'>
				{navList.map((nav) => (
					<Link
						key={nav}
						className={
							"header-nav rounded-md text-xl p-2 2xl:pl-4 2xl:pr-4 font-bold whitespace-nowrap" +
							`${category === nav ? " active" : ""}`
						}
						to={`/home/?category=${nav}`}
					>
						{nav}
					</Link>
				))}
			</div>
			<div className='flex-none gap-2'>
				{/* write */}
				<button
					className='btn btn-primary text-base font-black'
					onClick={openEditArticleView}
				>
					写文章
				</button>
				{/* search */}
				<div className='form-control'>
					<input
						type='text'
						placeholder='搜索'
						className='input input-bordered'
						onChange={inputSearch}
					/>
				</div>
				{/* user */}
				<UserInfo />
			</div>
		</header>
	);
});

const navList = [
	"全部",
	"人工智能",
	"大数据",
	"前端",
	"后端",
	"Android",
	"开发工具",
	"代码人生",
	"阅读",
];

/** 页头用户信息 */
function UserInfo() {
	const userInfo = useLoginStore((state) => state.userInfo);
	const logout = useLoginStore((state) => state.logout);
	const navigate = useNavigate();
	const logoutHandle = () => {
		logout();
		navigate(0);
	};
	if (!userInfo) {
		return (
			<div className='dropdown dropdown-end'>
				<label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
					游客
				</label>
				<ul
					tabIndex={0}
					className='mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52'
				>
					<li>
						<Link to={"/login"}>登录</Link>
					</li>
				</ul>
			</div>
		);
	}
	return (
		<div className='dropdown dropdown-end'>
			<label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
				<div className='w-10 rounded-full'>
					<img src={userInfo.photo} />
				</div>
			</label>
			<ul
				tabIndex={0}
				className='mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52'
			>
				{/* <li>
			<a className="justify-between">
				配置
				<span className="badge">New</span>
			</a>
		</li> */}
				<li>
					<Link to={"/user/self"}>主页</Link>
				</li>
				<li onClick={logoutHandle}>
					<a>登出</a>
				</li>
			</ul>
		</div>
	);
}
