import React, { Suspense, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useArticleCache from "./useArticlesCache";
import Articles from "./Articles";
import Loading from "../../components/Loading";
import { HomeData } from "@/models";
import MiddleViewVertical from "@/layouts/MiddleViewVertical";
import { Banner } from "./Banner";

const Home = () => {
	return (
		<MiddleViewVertical
			top={
				// <Link to='/article/236'>
				// 	<div className='mycard h-60 mt-2 overflow-hidden'>
				// 		<img
				// 			src='/images/20231010061938561_5.png'
				// 			alt='banner'
				// 			className='object-fill'
				// 		/>
				// 	</div>
				// </Link>
				<BannerBlock />
			}
		>
			<ArticleList />
			<div className='w-[20%] mycard h-96 !sticky top-24 text-center leading-[24rem]'>
				---推荐栏施工中---
			</div>
		</MiddleViewVertical>
	);
};

/**
 * 首页轮播图区块
 */
const BannerBlock = () => {
	const navigate = useNavigate();
	return (
		<Banner
			banners={[
				{
					img: "/images/20231018125220038_99.png",
					title: "SAI论坛测试",
					onClick: () => navigate("/article/251"),
				},
				{
					img: "/images/20231010084019073_25.png",
					title: "基地招新啦",
					onClick: () => navigate("/article/236"),
				},
				{
					img: "/images/20231010083223061_28.png",
					title: "基地网盘上线啦",
					onClick: () => window.open("https://pan.cxjd.zone/"),
				},
			]}
		/>
	);
};

/**
 * 首页文章列表
 * @type {React.FC<null>}
 * @returns {React.ReactElement} theList
 */
const ArticleList = () => {
	const [search, setSearch] = useSearchParams();
	const category = search.get("category");
	const [articles, setArticles] = useArticleCache(category || "全部");
	useEffect(() => {
		if (!category) setSearch("category=全部");
		return () => {};
	}, [category]);
	return (
		<div className='mycard w-[79%] overflow-hidden'>
			{/* 背景 */}
			<div
				onScroll={(e) => console.log(e)}
				className={`${
					category
						? categoryBg[category] || categoryBg["全部"]
						: categoryBg["全部"]
				} bg-cover bg-no-repeat bg-fixed fixed top-0 left-0 origin-left scale-x-20 md:scale-x-40 2xl:scale-x-95 z-bg min-w-bg md:min-w-screen min-h-screen `}
			/>
			<Suspense fallback={<Loading />}>
				<div className='w-full'>
					<Articles
						homeData={articles as { read: () => HomeData }}
						category={category || "全部"}
					/>
				</div>
			</Suspense>
		</div>
	);
};

type CategoryBg = {
	[categoryName: string]: string;
};
//  不同页面的背景
const categoryBg: CategoryBg = {
	全部: "bg-all-bg",
	前端: "bg-frontEnd-bg",
	后端: "bg-backEnd-bg",
	人工智能: "bg-AI-bg",
	大数据: "bg-bigData-bg",
	Android: "bg-android-bg",
	开发工具: "bg-tool-bg",
	代码人生: "bg-life-bg",
	阅读: "bg-read-bg",
};

export default Home;
